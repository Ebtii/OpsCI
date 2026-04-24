from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.sql import func 
from database import Base 

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, nullable=False)
    email = Column(String, unique=True, nullable=False)
    password_hash = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.nom())

class User(Base):
    __tablename__ = "favorites"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    movie_id = Column(Integer, nullable=False)
    movie_title = Column(String)
    poster_path = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.nom())

    

   


