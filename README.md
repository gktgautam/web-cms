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

## Jenkins + Docker deployments

The repo ships with Dockerfiles (`docker/api.Dockerfile` and `docker/web.Dockerfile`),
environment templates, and a Jenkins pipeline that can build, publish, and deploy
to UAT and production using Docker Compose.

### Directory layout

- `docker/` — multi-stage images for the API and web app.
- `deploy/uat` and `deploy/prod` — Compose stacks for each environment plus
  `.env` templates (`stack.env.example` and `api.env.example`).
- `Jenkinsfile` — declarative pipeline that builds both images, pushes them to a
  registry, and (optionally) deploys to one or both environments.

Copy each `*.example` file to a secret-managed location (e.g. Jenkins “Secret
file” credentials) and fill them with environment-specific values. The pipeline
expects the following credentials to exist:

| ID | Type | Notes |
| --- | --- | --- |
| `docker-registry` | Username & password | Used to log in and push/pull images. |
| `uat-stack-env` / `prod-stack-env` | Secret file | Provide the Compose stack variables (`REGISTRY_HOST`, `REGISTRY_NAMESPACE`, `API_PORT`, `WEB_PORT`, etc.). The pipeline appends the build-specific `IMAGE_TAG`. |
| `uat-api-env` / `prod-api-env` | Secret file | API runtime environment variables (e.g. `DATABASE_URL`, `JWT_SECRET`). |

Set the registry hostname/namespace and Docker context names at the top of the
`Jenkinsfile` (defaults are placeholders). When running the job, choose the
`DEPLOY_TARGET` parameter:

- `none` (default) — build and push images only.
- `uat` / `prod` — build, push, and deploy the selected environment.
- `both` — deploy UAT and production sequentially using the same image tag.

Both Compose stacks expose the API on `${API_PORT}` and the web UI on
`${WEB_PORT}`. The bundled Nginx configuration proxies `/api` requests from the
web container to the API service, so a single web image works for every
environment.
