#!/bin/bash

echo "Lancement de WatchNext"

# Etape 1 : Démarrage de minikube
minikube start

# Etape 2 : Diriger Docker vers minikube
eval $(minikube docker-env)

# Etape 3 : Build des images
echo "---------- Build des images Docker en cours ----------"
docker build -t opsci-backend:latest ./backend
docker build -t opsci-frontend:latest --build-arg VITE_API_URL=/api ./front-end

# Etape 4 : Appliquer les fichiers Kubernetes
echo "---------- Déploiement sur Kubernetes en cours ----------"
kubectl apply -f k8s/secret.yaml
kubectl apply -f k8s/configMap.yaml
kubectl apply -f k8s/db-deployment.yaml
kubectl apply -f k8s/backend-deployment.yaml
kubectl apply -f k8s/frontend-deployment.yaml
kubectl apply -f k8s/ingress.yaml

# Etape 5 : Attendre que le chargement des podss se finisse pour qu'ils soient prêts
echo "---------- Attente du chargement des pods ----------"
kubectl wait --for=condition=ready pod -l app=frontend --timeout=120s
kubectl wait --for=condition=ready pod -l app=backend --timeout=120s

# Etape 6 : Afficher l'URL
echo "---------- WatchNext vient d'être lancé ---------"
minikube service frontend-service --url