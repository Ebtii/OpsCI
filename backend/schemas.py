from pydantic import BaseModel, EmailStr
from typing import Optional


# Données reçues lors de l'inscription
class UserRegister(BaseModel):
    email: EmailStr
    password: str
    username: str

# Données reçues lors de la connexion
class UserLogin(BaseModel):
    email: EmailStr
    password: str


# Réponse envoyée après une connexion réussie
class TokenResponse(BaseModel):
    access_token: str
    token_type: str


# Données nécessaires pour ajouter un film aux favoris
class FavoriteCreate(BaseModel):
    movie_id: int
    movie_title: str
    poster_path: Optional[str] = None
   