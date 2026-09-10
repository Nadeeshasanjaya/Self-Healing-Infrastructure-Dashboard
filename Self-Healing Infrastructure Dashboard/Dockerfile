# Stage 1: Build the React application
FROM node:22-alpine AS builder

WORKDIR /app

# Copy dependency files first for better Docker caching
# package.json and package-lock.json live in the subfolder with spaces
COPY ["Self-Healing Infrastructure Dashboard/package.json", "Self-Healing Infrastructure Dashboard/package-lock.json", "./"]

# Install dependencies
RUN npm ci

# Copy the application source (copy the project directory into the image)
COPY ["Self-Healing Infrastructure Dashboard", "."]

# Build the production application
RUN npm run build


# Stage 2: Serve the application with Nginx
FROM nginx:alpine

# Remove default Nginx website
RUN rm -rf /usr/share/nginx/html/*

# Copy React/Vite production build
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom Nginx configuration (use explicit relative path)
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

# Expose HTTP port
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]