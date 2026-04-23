from fastapi import FastAPI, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import json
from dotenv import load_dotenv
import os
import requests
from pathlib import Path
from typing import Optional
from datetime import datetime
import urllib3
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

# Création de l'objet application
app = FastAPI(title="WatchNext API") # contient toutes les routes + gères les requêtes

# ------------ Gestion CORS -------------
# Liste des origines autorisées à appeler le backend
origines = [ 
    "http://localhost:5173", # dev
    "http://watchnext.example.com", # prod
]

# Middleware CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=origines,
    allow_credentials=True,
    allow_methods=["*"],    # GET, POST...
    allow_headers=["*"],
)

# Path du dossier actuel 
DIR_BACKEND = Path(__file__).parent

# Chargement du .env
load_dotenv(dotenv_path=DIR_BACKEND / ".env")

# Chargement du token
TMDB_TOKEN = os.getenv("TMDB_TOKEN", "").strip()
TMDB_BASE = "https://api.themoviedb.org/3"
TMDB_IMG_BASE = "https://image.tmdb.org/t/p/w500"  # posters en taille raisonnable

if not TMDB_TOKEN :
    raise ValueError("Erreur : Token TMDB non renseigné")

# Dictionnaire de correspondace des genres TMDB
DICO_GENRE = {
    28 : "Action", 12 : "Aventure", 16 : "Animation", 35 : "Comédie", 80 : "Crime",
    99 : "Documentaire", 18 : "Drame", 10751 : "Familial", 14 : "Fantastique",
    36 : "Histoire", 27 : "Horreur", 10402 : "Musique", 9648 : "Mystère", 10749 : "Romance",
    878 : "Science-Fiction", 10770 : "Téléfilm", 53 : "Thriller", 10752 : "Guerre", 37 : "Western"
}

# ------------ Outils de navigation ------------ 

# Fetch dans TMDB
def tmdb_get_movies(path: str, page: int = 1, params: dict = None):
    """Fonction utilitaire pour échanger avec l'API externe TMDB"""
    
    url = f"{TMDB_BASE}{path}"
    headers = {"Authorization": f"Bearer {TMDB_TOKEN}", "accept":"application/json"}
    params_query = {"language": "fr-FR", "page": page}
    
    if params:
        params_query.update(params)

    reponse = requests.get(url, headers=headers, params=params_query)
    reponse.raise_for_status()
    
    return reponse.json()

# Normalisation
def normalize_tmdb_movie(m: dict, details: dict = None, credits: dict = None, videos: dict = None) :
    """
    Normalisation : on filtre seulement les informations que l'on veut récupérer
    de TMDB.
    - title
    - director (pas dispo dans /movie/popular => "N/A")
    - description
    - image_url (ici : URL ABSOLUE)
    """

   # Gestion des genres
    if details and "genres" in details:
        nom_genres = [genre["name"] for genre in details["genres"]]
    else: 
        genre_ids = m.get("genre_ids", [])
        nom_genres = [DICO_GENRE.get(g_id, "Action") for g_id in genre_ids[:5]]

    # Bande-annonce Youtube
    trailer_key = ""
    
    if videos and isinstance(videos, dict): 
        res = videos.get("results", [])
        for v in res :
            if v.get("type") == "Trailer" and v.get("site") == "YouTube":
                trailer_key = v["key"]
                break

    pays = "N/A"
    if details and details.get("production_countries"):
        pays = details.get("production_countries")[0].get("name", "N/A")
   
    dist = ["N/A"]
    if details and details.get("production_companies"):
        dist = [comp.get("name") for comp in details.get("production_companies")[:3]]

    liste_acteurs = ["N/A"]
    if credits and credits.get("cast"):
        liste_acteurs = [actor.get("name") for actor in credits.get("cast")[:5]]
    
    return {
        "id": m.get("id"),
        "title": m.get("title"),
        "description": m.get("overview"),
        "poster_path": f"https://image.tmdb.org/t/p/w500{m['poster_path']}" if m.get("poster_path") else "/images/tbc.png",
        "backdrop_path": f"https://image.tmdb.org/t/p/w500{m['backdrop_path']}" if m.get("backdrop_path") else "/images/tbc.png",
        "duree": details.get("runtime") if details else None,   # durée en minutes
        "date": m.get("release_date", "N/A"),
        "genre": nom_genres,
        "note": m.get("vote_average", 0),
        "langue_og": m.get("original_language", "fr"),
        "pays_og": pays,
        "distributeur": dist,
        "acteurs": liste_acteurs, # 5 premiers acteurs
        "trailer_url": f"https://www.youtube.com/watch?v={trailer_key}" if trailer_key else None,
        "year": (m.get("release_date") or "")[:4]
    }


@app.get("/hello")
def hello():
    return {"message": "Hello World"}


# Route principale pour récupérer les films pour l'accueil et les cartes
@app.get("/movies")
def get_movies(limit: Optional[int] = None):
    """Route 'Liste/Catalogue' permettant de récupérer les films populaires"""
    
    movies = []
    
    try: 
        for page in range(1,6) :
            results = tmdb_get_movies("/movie/popular", page=page)
            liste = results.get("results", [])
            for m in liste :
                movies.append(normalize_tmdb_movie(m))
        return movies[:limit]

    except Exception as e :
        return {"error": str(e)}


# Route pour ouvrir la fiche d'un film
@app.get("/movies/{movie_id}")
def get_movie_detail(movie_id: int):
    """Route 'Fiche spécifique' permettant de récupérer toues les infos sur un film spécifique."""
    
    try:
        # Lancement des appels vers les 3 endpoints de TMDB
        details = tmdb_get_movies(f"/movie/{movie_id}", params={"language": "fr-FR"})
        credits = tmdb_get_movies(f"/movie/{movie_id}/credits", params={"language": "fr-FR"})
        videos = tmdb_get_movies(f"/movie/{movie_id}/videos", params={"language": "fr-FR"})
        
        # On passe un dictionnaire vide pour le premier argument car on a déjà les détails
        return normalize_tmdb_movie(details, details, credits, videos)
    
    except Exception as e:
        print(f"Crash Serveur: {e}")
        raise HTTPException(status_code=500, detail=f"Film non trouvé : {str(e)}")
    

# Route pour chercher des films par leurs noms
@app.get("/movies/search")
def get_movies(query: str):
    """Route 'Recherche'permettant de chercher des films par leurs noms"""
    
    if not query: 
        return []

    try :
        # Appel de la recherche TMDB avec mot-clé query
        results = tmdb_get_movies("search/movie", params={"language": "fr-FR", "query": query}, page=1)
        liste = results.get("results", [])
        return [normalize_tmdb_movie(m) for m in liste]
    
    except Exception as e :
        return {"error": str(e)}