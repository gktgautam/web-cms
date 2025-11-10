# syntax=docker/dockerfile:1
FROM node:20-alpine AS base
WORKDIR /usr/src/app

FROM base AS deps
COPY package.json tsconfig.base.json ./
COPY apps/api/package.json apps/api/
COPY apps/web/package.json apps/web/
RUN npm install

FROM deps AS builder
COPY . .
ARG VITE_API_URL=/api
RUN echo "VITE_API_URL=${VITE_API_URL}" > apps/web/.env.production
RUN npm run build -w @hr/web

FROM nginx:1.27-alpine AS runner
COPY apps/web/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /usr/src/app/apps/web/dist /usr/share/nginx/html

EXPOSE 80
