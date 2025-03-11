FROM node:lts-alpine
ENV NODE_ENV=production

WORKDIR /app

# Copia primero los archivos de dependencias para aprovechar la caché
COPY package*.json ./
RUN npm install --production --silent

# Copia el resto del código
COPY . .

EXPOSE 3000

CMD ["node", "server.js"]
