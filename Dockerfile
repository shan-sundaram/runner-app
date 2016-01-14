FROM nginx:1.9.9
MAINTAINER wfaas-llft@centurylink.com
ADD ./app/runner /usr/share/nginx/html/
EXPOSE 80
