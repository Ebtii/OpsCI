from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import json
from dotenv import load_dotenv
import os
import requests
from pathlib import Path
from typing import Optional

# Création de l'objet application
app = FastAPI() # contient toutes les routes + gères les requêtes

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
TMDB_TOKEN = os.getenv("TMDB_TOKEN")

if not TMDB_TOKEN :
    raise ValueError("Erreur : Token TMDB non renseigné")

# Dictionnaire de correspondace des genres TMDB
DICO_GENRE = {
    28 : "Action", 12 : "Aventure", 16 : "Animation", 35 : "Comédie", 80 : "Crime",
    99 : "Documentaire", 18 : "Drame", 10751 : "Familial", 14 : "Fantastique",
    36 : "Histoire", 27 : "Horreur", 10402 : "Musique", 9648 : "Mystère", 10749 : "Romance",
    878 : "Science-Fiction", 10770 : "Téléfilm", 53 : "Thriller", 10752 : "Guerre", 37 : "Western"
}

@app.get("/hello")
def hello():
    return {"message": "Hello World"}

# Route principale pour récupérer les films 
@app.get("/movies")
def get_movies(limit: Optional[int] = None):
    
    try:
        data = fetch_tmdb_movies()
        resultat = data["results"]

        movies = []

        for m in resultat :

            genre_ids = m.get("genre_ids", [])
            nom_genre = DICO_GENRE.get(genre_ids[0], "Action") if genre_ids else "Action"

            movies.append({
                "title": m.get("title"),
                "description": m.get("overview"),
                "poster_path": f"https://image.tmdb.org/t/p/w500{m['poster_path']}" if m.get("poster_path") else "/images/tbc.png",
                "backdrop_path": f"https://image.tmdb.org/t/p/w500{m['backdrop_path']}" if m.get("backdrop_path") else "/images/tbc.png",
                "year": m.get("release_date", "") [:4],
                "date": m.get("release_date"),
                "genre": nom_genre,
                "note": m.get("vote_average")
            })

        if limit is not None:
            movies = movies[:limit]

        return movies
        
    except Exception as e:
        return {"error": str(e)}


# Fonction Fetch dans TMDB
def fetch_tmdb_movies():
    movies = []

    for page in range(1,4): 
        url = "https://api.themoviedb.org/3/movie/popular"
        headers = {"Authorization": f"Bearer {TMDB_TOKEN}", "accept":"application/json"}
        params = {"language": "fr-FR", "page": page}

        reponse = requests.get(url, headers=headers, params=params)
        reponse.raise_for_status()

        # Ajout de 20 nouveaux films à la liste original à chaque tour
        movies.extend(reponse.json().get("results", []))

    return {"results" : movies}