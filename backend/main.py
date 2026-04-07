from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import json
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

DATA_PATH = Path(__file__).parent / "movies.json"

@app.get("/hello")
def hello():
    return {"message": "Hello World"}

# Route pour les films 
@app.get("/movies")
def get_movies(limit: Optional[int] = None):
    with open(DATA_PATH, "r", encoding="utf-8") as file :
        movies = json.load(file) # lis le contenu du fichier + transforme le JSON en liste Python
    
    if limit is not None:
        return movies[:limit]
    
    return movies
