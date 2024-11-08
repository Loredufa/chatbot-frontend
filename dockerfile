# Usa la imagen base de nginx
FROM nginx:alpine

# Establece el usuario root para ejecutar los comandos siguientes
USER root

# Copia la configuración personalizada de nginx en el directorio conf.d
COPY default.conf /etc/nginx/conf.d/default.conf

# Copia los archivos de la aplicación al directorio predeterminado de nginx
COPY . /usr/share/nginx/html

# Copia el favicon (focus.svg) al directorio raíz de nginx
COPY focus.svg /usr/share/nginx/html/favicon.svg

# Establece permisos de escritura en el directorio de caché de nginx
RUN chmod -R 755 /var/cache/nginx

# Establece el usuario no root para ejecutar nginx
USER 1001

# Expone el puerto 8080
EXPOSE 8080

# Establece el comando de inicio de nginx
CMD ["nginx", "-g", "daemon off;"]


