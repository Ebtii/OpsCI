from fastapi import FastAPI
import json
from pathlib import Path
from typing import Optional

# Création de l'objet application
app = FastAPI() # contient toutes les routes + gères les requêtes

DATA_PATH = Path(__file__).parent / "movies.json"

@app.get("/hello")
def hello():
    return {"message": "Hello World"}

@app.get("/movies")
def get_movies(limit: Optional[int] = None):
    with open(DATA_PATH, "r", encoding="utf-8") as file :
        movies = json.load(file) # lis le contenu du fichier + transforme le JSON en liste Python
    
    if limit is not None:
        return movies[:limit]
    
    return movies
