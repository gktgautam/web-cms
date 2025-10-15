FROM node:20-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev || npm i --omit=dev
COPY prisma ./prisma
RUN npx prisma generate
COPY dist ./dist
CMD ["node", "dist/server.js"]