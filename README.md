# HR-CMS (React + Node + PostgreSQL) — Monorepo

Run everything from the **root**.

## Prereqs
- Node 20+
- Docker + Docker Compose
- An external PostgreSQL database (managed service or self-hosted)

## Quick start
1. Copy the environment template and update `DATABASE_URL` to point at your PostgreSQL instance.
   ```bash
   cp .env.example .env
   ```
2. Install dependencies.
   ```bash
   npm i
   ```
3. Apply pending Prisma migrations to the external database.
   ```bash
   npm run prisma:deploy
   ```
4. Start the dev servers.
   ```bash
   npm run dev
   ```
- Web: http://localhost:5173
- API: http://localhost:4000/api

### Adding a department

Administrators can add departments from the web dashboard. Sign in with an
`ADMIN` account, open **Dashboard → Departments**, enter the department name,
and submit the form. The list updates automatically once the department is
created.

You can also create departments programmatically via the API. Sign in with an
`ADMIN` account, then send an authenticated POST request to
`/api/departments` with the new department name:

```bash
curl -X POST http://localhost:4000/api/departments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your-admin-access-token>" \
  -d '{"name": "Marketing"}'
```

The endpoint returns the newly created department record. The department
will then be available for job postings and during user registration.

## Production-ish
```bash
npm run build
docker compose up -d --build api web
```
Make sure the environment file used by Docker contains a valid `DATABASE_URL` for your external database.
