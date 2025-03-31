# Stage 1: Build the Angular app
FROM node:20-alpine as build

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .

# If your Angular CLI config uses "build --prod" or "build --configuration production":
RUN npm run build --prod

# Stage 2: Use Nginx to serve the compiled Angular app
FROM nginx:alpine
# Copy the built app from the build stage into Nginx's public folder
COPY --from=build /usr/src/app/dist/client/ /usr/share/nginx/html

# Expose port 80 for the Nginx container
EXPOSE 80

# Start Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]