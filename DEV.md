# Local Development

## Prereqs
PostgreSQL, Java 17 + Maven, Node 20+

## Start everything

**1. Database**
```bash
sudo service postgresql start
```

**2. Backend** — port 8080
```bash
cd backend && ./mvnw spring-boot:run
```
Wait for `Started JobsApplication`.

**3. Frontend** — port 3000
```bash
cd frontend && npm run dev
```

## Before every push

```bash
cd frontend && npm run build
```

`next dev` skips full type-checking; `next build` doesn't. Catching errors here takes seconds. Catching them on Vercel takes a lot longer.

## Codespaces

Forward ports 3000 and 8080, set both to **Public** (PORTS tab → right-click → Port Visibility) so frontend server-side fetches and external API testing can reach the backend.

## Common issues

- `./mvnw: Permission denied` → `chmod +x mvnw`
- Backend won't start, `Access denied` → check `application.properties` datasource credentials match your local Postgres user
- Frontend `fetch failed` / `ECONNREFUSED` → backend isn't running yet

## Test accounts (local only)

| Role | Username | Password | Email |
|---|---|---|---|
| Company | `testcompany` | `TestPass123!` | testcompany@example.com |
| Admin | `admin` | `12345678` | admin@alchematch.local |