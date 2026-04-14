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

# Path pour charger .env correctement et l'API
DIR_DATA = Path(__file__).parent
load_dotenv(dotenv_path=DIR_DATA / ".env")

# Chargement du token
TMDB_TOKEN = os.getenv("TMDB_TOKEN")

if not TMDB_TOKEN :
    raise ValueError("Erreur : Token TMDB non renseigné")


@app.get("/hello")
def hello():
    return {"message": "Hello World"}

# Route pour les films 
@app.get("/movies")
def get_movies(limit: Optional[int] = None):
    
    try:
        data = fetch_tmdb_movies()
        resultat = data["results"]

        movies = []

        for m in resultat :
            movies.append({
                "title": m.get("title"),
                "description": m.get("overview"),
                "image_url": f"https://image.tmdb.org/t/p/w500{m['poster_path']}" if m.get("poster_path") else "",
                "year": m.get("release_date", "") [:4]
            })

        if limit is not None:
            movies = movies[:limit]

        return {"results": movies}
        
    except Exception as e:
        return {"error": str(e)}


# Fonction Fetch dans TMDB
def fetch_tmdb_movies():
    url = "https://api.themoviedb.org/3/movie/popular"

    headers = {"Authorization": f"Bearer {TMDB_TOKEN}", "accept":"application/json"}

    params = {"language": "fr-FR", "page": 1}

    reponse = requests.get(url, headers=headers, params=params)
    reponse.raise_for_status()

    return reponse.json()