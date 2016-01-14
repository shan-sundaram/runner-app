FROM node:0.10-onbuild
MAINTAINER wfaas-llft@centurylink.com

# Install the http-server needed to run the webapp
RUN npm install -g http-server
RUN npm install -g bower 

# Copy the application to the images
COPY ./build /wf-dashboard/

# Set the working directory
WORKDIR /wf-dashboard

# Expose our port
EXPOSE 8080

ENTRYPOINT ["http-server", "/wf-dashboard", "-p", "8080"]
