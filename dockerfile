# Usa la imagen base de nginx
FROM nginx:alpine

# Cambia la configuración de nginx para escuchar en el puerto 8080
RUN sed -i 's/listen       80;/listen       8080;/' /etc/nginx/conf.d/default.conf

# Copia los archivos de la aplicación al directorio predeterminado de nginx
COPY . /usr/share/nginx/html

# Expone el puerto 8080
EXPOSE 8080
