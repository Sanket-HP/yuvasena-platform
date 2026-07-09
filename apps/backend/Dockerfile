# Stage 1: Build the application
FROM node:20-alpine AS builder

WORKDIR /usr/src/app

# Copy root workspace and sub-workspace packages first to cache installation layer
COPY package*.json ./
COPY packages/shared/package*.json ./packages/shared/
COPY apps/backend/package*.json ./apps/backend/

# Install all dependencies (workspaces will be linked automatically)
RUN npm install --legacy-peer-deps

# Copy TypeScript configs and source code
COPY tsconfig.json ./
COPY packages/shared/ ./packages/shared/
COPY apps/backend/ ./apps/backend/

# Build `@yuvasena/shared` package first
RUN npm run build -w packages/shared

# Generate Prisma Client
RUN npx prisma generate --schema=apps/backend/prisma/schema.prisma

# Build the backend application
RUN npm run build -w apps/backend

# Stage 2: Serve the application
FROM node:20-alpine

WORKDIR /usr/src/app

# Copy package configurations and node_modules from builder stage
COPY package*.json ./
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/packages/shared/dist ./packages/shared/dist
COPY --from=builder /usr/src/app/packages/shared/package.json ./packages/shared/package.json
COPY --from=builder /usr/src/app/apps/backend/dist ./apps/backend/dist
COPY --from=builder /usr/src/app/apps/backend/package.json ./apps/backend/package.json
COPY --from=builder /usr/src/app/apps/backend/prisma ./apps/backend/prisma

EXPOSE 4000

ENV PORT 4000
ENV NODE_ENV production

# Run NestJS prod script inside backend workspace
CMD ["npm", "run", "start:prod", "-w", "apps/backend"]