# Imagen base oficial de Node
FROM node:18

# Establecer el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiar los archivos necesarios para instalar dependencias
COPY package*.json ./

# Instalar dependencias (solo de producción)
RUN npm install --omit=dev

# Copiar el resto del código fuente al contenedor
COPY . .

# Exponer el puerto (ajusta si tu backend usa otro)
EXPOSE 3000

# Definir las variables de entorno si querés (opcional)
# ENV NODE_ENV=production

# Comando para iniciar el servidor
CMD ["node", "indexMongo.js"]
