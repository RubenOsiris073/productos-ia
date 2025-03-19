dios queda

server.js---------> servidor
sript.js-----------> backend

# Construye la imagen
docker build -t productos_ia .

# Levanta el contenedor en modo detached
docker run -d -p 3000:3000 productos_ia