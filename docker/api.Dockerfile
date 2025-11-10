# syntax=docker/dockerfile:1
FROM node:20-alpine AS base
WORKDIR /usr/src/app

FROM base AS deps
# Copy workspace manifests first for dependency installation
COPY package.json tsconfig.base.json ./
COPY apps/api/package.json apps/api/
COPY apps/web/package.json apps/web/
RUN npm install

FROM deps AS builder
COPY . .
RUN npm run build -w @hr/api

FROM builder AS pruner
RUN npm prune --omit=dev

FROM node:20-alpine AS runner
WORKDIR /usr/src/app
ENV NODE_ENV=production

# Copy only the files the API needs at runtime
COPY --from=pruner /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/apps/api/dist ./apps/api/dist
COPY apps/api/prisma ./apps/api/prisma
COPY package.json ./
COPY apps/api/package.json ./apps/api/
COPY tsconfig.base.json ./

EXPOSE 4000
CMD ["node", "apps/api/dist/server.js"]
