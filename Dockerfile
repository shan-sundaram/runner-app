FROM nginx:1.9.9
ADD app/runner /usr/share/nginx/html/
EXPOSE 80
