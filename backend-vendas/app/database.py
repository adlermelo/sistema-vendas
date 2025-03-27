# app/database.py
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from app.config import DATABASE_URL  # Importa a URL do banco de dados configurada

# Define a base para as models
Base = declarative_base()

# Criação do motor de banco de dados (engine)
engine = create_engine(DATABASE_URL)

# Sessão para interagir com o banco de dados
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
