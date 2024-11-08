# Usa la imagen base de nginx
FROM nginx:alpine

# Copia la configuración personalizada de nginx en el directorio conf.d
COPY default.conf /etc/nginx/conf.d/default.conf

# Copia los archivos de la aplicación al directorio predeterminado de nginx
COPY . /usr/share/nginx/html

# Copia el favicon (focus.svg) al directorio raíz de nginx
COPY focus.svg /usr/share/nginx/html/favicon.svg

# Expone el puerto 8080
EXPOSE 8080


