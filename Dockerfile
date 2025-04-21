# Utiliser une image de base officielle Node.js
FROM node:latest

# Définir le répertoire de travail dans le conteneur
WORKDIR /app

# Copier le fichier package.json et package-lock.json (si disponible)
COPY package*.json ./

# Installer les dépendances et serve globalement
RUN npm install

# Copier le reste du code source
COPY . .

# Exposer le port sur lequel l'application va tourner
EXPOSE 5173

# Commande par défaut pour démarrer le serveur avec la configuration
CMD ["npm", "run", "dev"]
