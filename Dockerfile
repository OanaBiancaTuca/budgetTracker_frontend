# Alege imaginea de bază
FROM node:latest

# Setează directorul de lucru în container
WORKDIR /app

# Copiază fișierul package.json și package-lock.json (dacă există)
COPY package*.json ./

# Instalează dependențele proiectului
RUN npm install

# Copiază restul fișierelor sursă ale proiectului în container
COPY . .

# Expune portul 8081 pentru acces din exteriorul containerului
EXPOSE 8081

# Comanda pentru a porni aplicația
CMD ["npm", "start"]
