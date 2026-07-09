# Stage 1: Build Vite React Admin Assets
FROM node:20-alpine AS builder

WORKDIR /usr/src/app

# Copy root workspace and sub-workspace packages first
COPY package*.json ./
COPY packages/shared/package*.json ./packages/shared/
COPY apps/admin/package*.json ./apps/admin/

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy configs and code
COPY tsconfig.json ./
COPY packages/shared/ ./packages/shared/
COPY apps/admin/ ./apps/admin/

# Build shared package and Vite admin SPA
RUN npm run build -w packages/shared
RUN npm run build -w apps/admin

# Stage 2: Serve Vite Static Assets with Nginx
FROM nginx:alpine

# Copy built bundle assets to Nginx html directory
COPY --from=builder /usr/src/app/apps/admin/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
