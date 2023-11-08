# # Stage 1: Build the React application
# FROM node:16 as build

# # Set the working directory in the container
# WORKDIR /app

# # Copy package.json and package-lock.json to work directory
# COPY package.json package-lock.json ./

# # Install dependencies
# RUN npm ci

# # Copy the rest of the application's code
# COPY . .

# # Build the application
# RUN npm run build

# # Stage 2: Serve the app with Nginx
# FROM nginx:alpine

# # Copy the build output to replace the default nginx contents.
# COPY --from=build /app/build /usr/share/nginx/html

# # Expose port 80 to the Docker host, so we can access it from the outside.
# EXPOSE 80

# # The default command simply runs Nginx in the foreground
# CMD ["nginx", "-g", "daemon off;"]

# Use an official Node runtime as a parent image
FROM node:16

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to work directory
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application's code
COPY . .

# Build the application
RUN npm run build

# Install serve - a static server to serve the React application
RUN npm install -g serve

# Command to run the static server
CMD ["serve", "-s", "build", "-l", "3000"]

# Inform Docker that the container listens on the specified port at runtime.
EXPOSE 3000

