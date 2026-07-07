FROM node:20-alpine AS builder

WORKDIR /usr/src/app

COPY package*.json tsconfig.json ./
COPY packages/shared/ packages/shared/
COPY apps/admin/ apps/admin/

RUN npm install --legacy-peer-deps
RUN npm run build -w packages/shared
RUN npm run build -w apps/admin

# Production Stage: serve with Nginx
FROM nginx:alpine

COPY --from=builder /usr/src/app/apps/admin/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
