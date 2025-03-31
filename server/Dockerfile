# Use a lightweight Node base image
FROM node:20-alpine

# Create and set the working directory
WORKDIR /usr/src/app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the server code
COPY . .

# Expose the port your server listens on (e.g., 3000)
EXPOSE 3000

# Start the server
CMD ["npm", "start"]