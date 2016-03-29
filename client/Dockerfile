# Set nginx base image
FROM nginx

WORKDIR /home/mean
ADD . /home/mean

# Copy custom configuration file from the current directory
COPY nginx.conf /etc/nginx/nginx.conf
