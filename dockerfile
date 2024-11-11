# Usa la imagen base de nginx
FROM nginx:alpine

# Crea los subdirectorios de caché accesibles
RUN mkdir -p /tmp/nginx_cache/client_body \
             /tmp/nginx_cache/proxy \
             /tmp/nginx_cache/fastcgi \
             /tmp/nginx_cache/uwsgi \
             /tmp/nginx_cache/scgi \
    && chmod -R 777 /tmp/nginx_cache

# Copia la configuración principal de nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Copia la configuración del servidor (default.conf) y los archivos de la aplicación
COPY default.conf /etc/nginx/conf.d/default.conf
COPY . /usr/share/nginx/html

# Establece el usuario no root para ejecutar nginx
USER 1001

# Expone el puerto 8080
EXPOSE 8080

# Establece el comando de inicio de nginx
CMD ["nginx", "-g", "daemon off;"]


