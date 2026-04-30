# FilmFinder / WatchNext

## Présentation du projet

Ce projet est une application web complète permettant aux utilisateurs de :

- consulter un catalogue de films
- rechercher un film en temps réel
- filtrer les résultats (genre, note, année)
- afficher les détails d’un film
- gérer une liste de favoris après authentification

Le projet est basé sur une architecture client / serveur :

- Front-end : React + Vite  
- Back-end : FastAPI  
- Base de données : PostgreSQL  
- API externe : TMDB  

Les données sont échangées au format JSON via une API REST.

---
## Technologies utilisées

### Frontend
- React (Vite)
- JavaScript (JSX)
- CSS

### Backend
- FastAPI
- SQLAlchemy
- JWT

### Database
- PostgreSQL

### API
- TMDB

## Architecture globale

Front-end (React)      
   ↓ fetch (HTTP) 
   Back-end (FastAPI)        
    ↓ Base de données (PostgreSQL)        
     ↓ API TMDB (films)

---

## Backend (FastAPI)

### Rôle

Le backend gère :

- la récupération des films (via TMDB)
- l’authentification (JWT)
- la gestion des utilisateurs
- la gestion des favoris

---

### Lancement

bash cd backend
python -m venv venv 
source venv/bin/activate 
pip install -r requirements.txt 
uvicorn main:app --reload 

Swagger :http://127.0.0.1:8000/docs

---

### Endpoints principaux

#### Films

- GET /movies → récupérer les films  
- GET /movies/search → rechercher un film  
- GET /movies/{movie_id} → détails d’un film  

#### Authentification

- POST /auth/register → créer un compte  
- POST /auth/login → se connecter  

#### Favoris

- GET /favorites → récupérer les favoris  
- POST /favorites → ajouter un favori  
- DELETE /favorites/{favorite_id} → supprimer  

---

### Authentification

Après connexion :

- un token JWT est généré
- il est envoyé dans chaque requête protégée

Authorization: Bearer <token>

---

### Base de données

Tables principales :

- users
- favorites

ORM utilisé : SQLAlchemy

---

## Front-end (React + Vite)

### Rôle

Le front-end gère :

- l’affichage des films
- la recherche dynamique
- les filtres avancés
- l’affichage détaillé
- l’authentification utilisateur
- les favoris

---

### Lancement

bash cd front-end 
npm install 
npm run dev 
URL :http://localhost:5173

---

### Structure

src/  ├── App.jsx (logique principale)  
      ├── main.jsx (point d’entrée)  
      ├── components/ 
      │  ├── NavBar/  
      │  ├── MovieCard/ 
      │  ├── MovieList/  
      │  ├── MovieDetails/ 
      │  ├── GenreFilter/ 
      │  ├── FiltreAvR/ 
      │  ├── SearchBar/
      │  ├── Catalogue/ 
      │  └── FormAuthInscr/

---

### Fonctionnement interne

#### Gestion des états

Le composant App.jsx utilise plusieurs états :

- STmovies → liste des films  
- favoris → films favoris  
- search → texte de recherche  
- genreActuel → filtre genre  
- filtres → filtres avancés  
- selectMovie → film sélectionné  
- estLogin → état utilisateur  

---

#### Communication avec le backend

Les données sont récupérées avec fetch :

js fetch(`${import.meta.env.VITE_API_URL}/movies`) 

---

####  Gestion du token

- stocké dans localStorage
- envoyé dans les headers :

js Authorization: Bearer ${token} 

---

### Fonctionnalités principales

- affichage catalogue
- recherche dynamique (avec debounce)
- filtrage multi-critères
- tri (date / note)
- affichage détails
- bannière dynamique (films aléatoires)
- système login/register
- gestion des favoris

---

## Interaction Front / Back

1. Le front envoie une requête HTTP  
2. Le backend traite la logique  
3. Si nécessaire → appel API TMDB  
4. Réponse JSON → front  
5. Mise à jour interface  

---

## Tests

### Backend (Swagger)

- créer compte  
- login  
- récupérer token  
- tester /favorites

---

### Frontend

Vérifier :

- recherche fonctionne  
- filtres fonctionnent  
- affichage détails  
- ajout/suppression favoris  
- login/logout  

---

## Conclusion

## Conclusion

Ce projet met en œuvre une architecture full-stack claire et modulaire,
permettant une bonne séparation des responsabilités.

Il illustre l’intégration entre un front-end React et un backend FastAPI,
avec gestion d’authentification et communication via API REST.

Cette organisation facilite la maintenabilité, la scalabilité et l’évolution du projet.

## Remarque

Le backend utilise l’API TMDB pour récupérer les films, tandis que les favoris sont stockés localement dans la base de donnees

