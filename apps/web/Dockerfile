# Stage 1: Build NextJS Web Portal
FROM node:20-alpine AS builder

WORKDIR /usr/src/app

# Copy root workspace and sub-workspace packages first
COPY package*.json ./
COPY packages/shared/package*.json ./packages/shared/
COPY apps/web/package*.json ./apps/web/

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy configs and code
COPY tsconfig.json ./
COPY packages/shared/ ./packages/shared/
COPY apps/web/ ./apps/web/

# Build shared package and NextJS portal
RUN npm run build -w packages/shared
RUN npm run build -w apps/web

# Stage 2: Serve NextJS Web Portal
FROM node:20-alpine

WORKDIR /usr/src/app

# Copy package configurations and node_modules
COPY package*.json ./
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/packages/shared/dist ./packages/shared/dist
COPY --from=builder /usr/src/app/packages/shared/package.json ./packages/shared/package.json
COPY --from=builder /usr/src/app/apps/web ./apps/web

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"
ENV NODE_ENV production

# Run start script in web workspace
CMD ["npm", "run", "start", "-w", "apps/web"]
