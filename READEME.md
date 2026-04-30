# FilmFinder Backend

## Présentation

Ce backend a été développé avec FastAPI afin de gérer la logique de l’application et assurer la communication avec le front-end.

Il permet de gérer les films (via l’API TMDB), les utilisateurs (inscription et connexion) ainsi que les favoris. Les données sont échangées au format JSON.

Swagger : http://127.0.0.1:8000/docs

---

## Lancement du projet

Créer et activer l’environnement virtuel :

python -m venv venv  
source venv/bin/activate  

Installer les dépendances :

pip install -r requirements.txt  

Lancer le serveur :

uvicorn main:app --reload  

---

## Endpoints

### Films

GET /movies → récupérer les films  
GET /movies/search → rechercher un film  
GET /movies/{movie_id} → détails d’un film  

### Authentification

POST /auth/register → créer un compte  
POST /auth/login → se connecter  

### Favoris

GET /favorites → récupérer les favoris de l’utilisateur connecté  
POST /favorites → ajouter un favori  
DELETE /favorites/{favorite_id} → supprimer un favori  

---

## Authentification

Après login, un token JWT est généré.

Ce token doit être envoyé dans les requêtes protégées :

Authorization: Bearer <token>

Sinon, une erreur 401 (non autorisé) est retournée.

---

## Base de données

Nous utilisons PostgreSQL pour stocker les utilisateurs et leurs favoris.  
L’accès à la base est géré avec SQLAlchemy.

Tables principales :
- users  
- favorites  

---

## Codes HTTP

400 → requête invalide  
401 → non autorisé  
404 → non trouvé  
500 → erreur serveur  

---

## Tests

Les endpoints peuvent être testés avec Swagger.

Étapes :
- créer un compte  
- se connecter  
- copier le token  
- cliquer sur "Authorize"  
- tester les routes (ex: /favorites)

---

## Remarque

Le backend utilise l’API TMDB pour récupérer les films.

Le projet suit une organisation simple (routes, modèles, repository) afin de garder un code clair et maintenable
