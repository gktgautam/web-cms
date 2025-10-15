# HR-CMS (React + Node + PostgreSQL) — Monorepo

Run everything from the **root**.

## Prereqs
- Node 20+
- Docker + Docker Compose

## Quick start
```bash
cp .env.example .env
npm i
npm run db:up
npm run prisma:deploy
npm run dev
```
- Web: http://localhost:5173
- API: http://localhost:4000/api
- pgAdmin: http://localhost:5050

## Production-ish
```bash
npm run build
docker compose up -d --build api web
```