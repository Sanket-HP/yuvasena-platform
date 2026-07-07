FROM node:20-alpine AS builder

WORKDIR /usr/src/app

COPY package*.json tsconfig.json ./
COPY packages/shared/ packages/shared/
COPY apps/web/ apps/web/

RUN npm install --legacy-peer-deps
RUN npm run build -w packages/shared
RUN npm run build -w apps/web

# Production stage
FROM node:20-alpine

WORKDIR /usr/src/app

COPY package*.json ./
COPY --from=builder /usr/src/app/node_modules/ ./node_modules/
COPY --from=builder /usr/src/app/packages/shared/ ./packages/shared/
COPY --from=builder /usr/src/app/apps/web/ ./apps/web/

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["npm", "run", "start", "-w", "apps/web"]
