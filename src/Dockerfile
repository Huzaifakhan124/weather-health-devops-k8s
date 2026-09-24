# base image
FROM nginx:alpine


RUN rm -rf /usr/share/nginx/html/*

# Copy
COPY . /usr/share/nginx/html

# Expose port 80
EXPOSE 80


CMD ["nginx", "-g", "daemon off;"]