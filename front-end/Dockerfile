# Build

# Node : transformer le code React en fichiers HTML/CSS/JS
FROM node:18-alpine AS build_proc

# Récupération de l'argument envoyé par le fichier docker-compose.yaml
ARG VITE_API_URL

# Placement dans l'environnement du build pour que Vite le voit
ENV VITE_API_URL=$VITE_API_URL

WORKDIR /app

# Installation des dependances
COPY package*.json ./
RUN npm install

# Copie du code source et création du dossier /build
COPY . .
RUN npm run build

# Nginx
FROM nginx:stable-alpine

# Copie du code et utilisation de Nginx après séparation en HTML/CSS/JS
COPY --from=build_proc /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Nommage des ports : écoute sur le port 80 (Web)
EXPOSE 80

# Lancement 
CMD ["nginx", "-g", "daemon off;"]