#Import des modules principaux du projet
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
from fastapi import Depends, HTTPException
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from jose import jwt, JWTError
from datetime import datetime, timedelta, timezone
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm

from database import Base, engine, get_db
import models
import schemas
import repository

# Création de l'objet application
app = FastAPI(title="WatchNext API") # contient toutes les routes + gères les requêtes
# # Chargement des variables d'environnement depuis le fichier .env
load_dotenv()

# Création des tables dans la base de données
Base.metadata.create_all(bind=engine)

# Configuration du hachage des mots de passe
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Configuration JWT
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60
# Definition du schema OAth2 pour l'authentification
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")


# Hachage du mot de passe
def hash_password(password: str):
    return pwd_context.hash(password)


# Vérification du mot de passe
def verify_password(plain_password: str, hashed_password: str):
    return pwd_context.verify(plain_password, hashed_password)


# fonction pour créer un token JWT
def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


# Récupération de l'utilisateur connecté à partir du token
def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
   # décodage du token JWT
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload.get("sub")
    # gestion des erreurs si le token est invalide
    except JWTError:
        raise HTTPException(status_code=401, detail="Token invalide")

    user = repository.get_user_by_email(db, email)
    # vérification de l'existance de l'utilisateur
    if not user:
        raise HTTPException(status_code=401, detail="Utilisateur introuvable")

    return user

# ------------ Gestion CORS -------------

# Configuration CORS pour permettre au frontend d'acceder au backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],    # GET, POST...
    allow_headers=["*"],
)

# Chargement du token TMDB depuis les variable d'environnement
TMDB_TOKEN = os.getenv("TMDB_TOKEN", "").strip()

# URL de base de l'API TMDB
TMDB_BASE = "https://api.themoviedb.org/3"

#URL pour recuperer les image des films
TMDB_IMG_BASE = "https://image.tmdb.org/t/p/w500"  # posters en taille raisonnable

# Verification que le token TMDB est bien defini
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

# Fonction utilitaire pour interagir avec l'API TMDB
def tmdb_get_movies(path: str, page: int = 1, params: dict = None):
    """Fonction utilitaire pour échanger avec l'API externe TMDB"""
    # Construction de l'URL complete
    url = f"{TMDB_BASE}{path}"

    # Headers contenant le token d'authentification
    headers = {"Authorization": f"Bearer {TMDB_TOKEN}", "accept":"application/json"}
    params_query = {"language": "fr-FR", "page": page}
    
    if params:
        params_query.update(params)
    # Envoi de la requete HTTP
    reponse = requests.get(url, headers=headers, params=params_query)
    reponse.raise_for_status()
    
    return reponse.json()

# Foction de normalisation des donnees des films
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
        "duree": details.get("runtime") if details and details.get("runtime") else None,   # durée en minutes
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

# Route de test pour verifier que l'API fonctionne
@app.get("/hello")
def hello():
    return {"message": "Hello World"}


# Route n°1 : principale pour récupérer les films pour l'accueil et les cartes
@app.get("/movies")
def get_movies(limit: Optional[int] = None):
    """Route 'Liste/Catalogue' permettant de récupérer les films populaires"""
    
    movies = [] # List qui contiendra tous les films
    
    try: 
        # Parcours des 5 parametres pages de TMDB
        for page in range(1,6) :
            results = tmdb_get_movies("/movie/popular", page=page)
            #Extration de la listes des films
            liste = results.get("results", [])
            # Normalisation et ajout des films
            for m in liste :
                movies.append(normalize_tmdb_movie(m))
        # Si une limite est fournie, retoutner seulement une partie        
        if limit:
            return movies[:limit]        
        return movies
    # Gestion des erreures serveur
    except Exception as e :
        raise HTTPException(status_code=500,detail=str(e))


# Route n°2 : pour chercher des films par leurs noms
@app.get("/movies/search")
def search_movies(query: str):
    """Route 'Recherche'permettant de chercher des films par leurs noms"""
    
    if not query: 
        return []

    try :
        # Appel de la recherche TMDB avec mot-clé query
        results = tmdb_get_movies("/search/movie", params={"language": "fr-FR", "query": query}, page=1)
        liste = results.get("results", [])
        return [normalize_tmdb_movie(m) for m in liste]
    
    except Exception as e :
        raise HTTPException(status_code=500, detail=f"Film non trouvé : {str(e)}")


# Route n°3 : pour ouvrir la fiche d'un film
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
    
    
# Route n°4 : pour creer un nouvel utilisateur
@app.post("/auth/register")
def register(user: schemas.UserRegister, db: Session = Depends(get_db)):
    existing_user = repository.get_user_by_email(db, user.email)

    if existing_user:
        raise HTTPException(status_code=400, detail="Email déjà utilisé")

    hashed_password = hash_password(user.password)
    repository.create_user(db, user, hashed_password)

    return {"message": "Utilisateur créé avec succès"}


# Route n°5 : d'authentification utilisateur
@app.post("/auth/login",response_model=schemas.TokenResponse)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)): 
    #Recureperation de l'utilisateur par email
    db_user = repository.get_user_by_email(db, form_data.username)
     # Verification si l'utilisateur existe
    if not db_user:
        raise HTTPException(status_code=400, detail="Identifiants invalides")
    # Verification du mot de passe 
    if not verify_password(form_data.password, db_user.password_hash):
        raise HTTPException(status_code=400, detail="Identifiants invalides")
    
    access_token = create_access_token(data={"sub": db_user.email})

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }

# Route n°6 : pour ajouter un film aux favoris
@app.post("/favorites")
def add_favorite(favorite: schemas.FavoriteCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    return repository.add_favorite(db, favorite, user_id= current_user.id)


# Route n°7: pour recuperer tous les favoris de l'utilisateur
@app.get("/favorites")
def get_favorites(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    return repository.get_user_favorites(db, user_id = current_user.id)


# Route n°8 : pour supprimer un favori
@app.delete("/favorites/{favorite_id}")
def delete_favorite(favorite_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    deleted = repository.delete_favorite(db, favorite_id, user_id = current_user.id)

    if not deleted:
        raise HTTPException(status_code=404, detail="Favori introuvable")

    return {"message": "Favori supprimé"}


# Route n°9 :
@app.get("/secure-test")
def secure_test(token: str = Depends(oauth2_scheme)):
    return {"msg": "secure"}
