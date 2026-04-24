from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# URL de la base de données (SQLite pour test)
DATABASE_URL = "sqlite:///./test.db"

# Création du moteur de connexion
engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False}
)

# Création de la session (interaction avec la DB)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)

# Base pour les modèles (tables)
Base = declarative_base()


# Dépendance pour FastAPI (gestion de session)
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()