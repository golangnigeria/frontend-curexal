# --- Stage 1: Build ---
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# --- Stage 2: Serve ---
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
# Default Nginx configuration handles SPA routing if configured correctly,
# but for basic React apps, copying the build is sufficient.
# To support React Router (client-side routing), we need a custom nginx.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
