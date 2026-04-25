from sqlalchemy.orm import Session
import models
import schemas


# Créer un nouvel utilisateur dans la base de données
def create_user(db: Session, user: schemas.UserRegister, hashed_password: str):
    db_user = models.User(
        email=user.email,
        password_hash=hashed_password
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


# Chercher un utilisateur par email
def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()


# Ajouter un film aux favoris d'un utilisateur
def add_favorite(db: Session, favorite: schemas.FavoriteCreate, user_id: int):
    db_favorite = models.Favorite(
        tmdb_id=favorite.tmdb_id,
        title=favorite.title,
        poster_path=favorite.poster_path,
        user_id=user_id
    )
    db.add(db_favorite)
    db.commit()
    db.refresh(db_favorite)
    return db_favorite


# Récupérer les favoris d'un utilisateur
def get_user_favorites(db: Session, user_id: int):
    return db.query(models.Favorite).filter(models.Favorite.user_id == user_id).all()

# Récupérer tous les favoris
def get_all_favorites(db: Session):
    return db.query(models.Favorite).all()


# Supprimer un favori d'un utilisateur
def delete_favorite(db: Session, favorite_id: int, user_id: int):
    favorite = db.query(models.Favorite).filter(
    models.Favorite.id == favorite_id
).first()

    if favorite:
        db.delete(favorite)
        db.commit()

    return favorite