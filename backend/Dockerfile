# BUILD

# Image de base 
FROM python:3.10-slim

# Variable d'environnement
ENV PYTHONUNBUFFERED 1

# Répertoire pincipal (celui du travail réel)
WORKDIR /app

# Installation des dépendances
RUN apt-get update && apt-get install -y libpq-dev gcc && rm -rf /var/lib/apt/lists/*

# Organisation des dépendances
# Copie de requirements.txt en 1er
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copie du code source
COPY . .

# Nommage des ports : écoute sur le port 8000
EXPOSE 8000

# Lancement : démarrage du serv uvicorn
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
