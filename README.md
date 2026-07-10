# AlcheMatch

A full-stack job portal platform — real role separation, real verification workflows, real deployed infrastructure. Candidates apply, companies hire, admins moderate, and every layer enforces what it claims to enforce.

**🔗 Live: [alchematch.com](https://alchematch.com)**

---

## Overview

AlcheMatch is an Indeed-style job portal built as a monorepo, with a Spring Boot API and a Next.js frontend, deployed and running in production. It isn't a CRUD demo — company accounts go through a real verification pipeline before they can post a job, application status transitions are enforced server-side against a fixed state machine, and every authorization check lives in a dedicated guard layer rather than scattered inline conditionals.

## Tech Stack

**Backend**
| Layer | Technology |
|---|---|
| Runtime | Java 17, Spring Boot 4.0.1 |
| Security | Spring Security, JWT (JJWT 0.12.5) |
| Persistence | Spring Data JPA, PostgreSQL, Flyway |
| File storage | Cloudflare R2 (S3-compatible), AWS SDK v2 |
| Validation | Jakarta Bean Validation |
| Build | Maven (wrapper included) |
| Testing | JUnit 5, Spring Boot Test, H2 (test scope) |

**Frontend**
| Layer | Technology |
|---|---|
| Framework | Next.js (App Router), TypeScript |
| Styling | Tailwind CSS v4, shadcn/ui (Radix primitives) |
| Forms | react-hook-form + zod |
| Documents | `@react-pdf/renderer` (server-side PDF generation) |

**Infrastructure**
| Component | Provider |
|---|---|
| Backend hosting | Render (Docker web service) |
| Database | Render (managed PostgreSQL) |
| Frontend hosting | Vercel |
| File storage | Cloudflare R2 |
| DNS | Cloudflare |

## Key Features

**Candidates** (`ROLE_USER`)
- Register, log in, manage a profile — including real resume upload via presigned R2 URLs
- Browse and search jobs with dynamic, multi-field filtering
- Save jobs, apply to jobs, track application status
- Apply to become a company: a structured verification form is rendered server-side into a real PDF and uploaded — not a free-text URL field
- Manage account settings (username, email, password) from a shared settings panel

**Companies** (`ROLE_COMPANY`)
- Company profile management
- Create and manage job listings, with degree-field eligibility rules per listing
- Review applicants with rich filtering (keyword, status, years of experience, degree field, education level)
- Advance or reject candidates through a hiring pipeline with server-enforced valid-transition rules — no illegal status jumps
- Same shared account settings panel as every other role

**Admin / Super Admin**
- Review, approve, or reject company verification applications — rejections carry structured, admin-selected reasons that are persisted and shown to the applicant
- Moderate user accounts: enable/disable, lock/unlock — enforced live, on every request, not just at login
- Admins cannot lock themselves out or moderate other admin accounts (dedicated guard, not a UI-only restriction)
- Manage the degree-field taxonomy used in job eligibility rules

## Architecture Highlights

**Backend**
```
controllers/       HTTP layer — request/response only
├── admin/
├── company/
├── user/
└── open/          Public endpoints (no auth required)
services/          Business logic
guards/            Ownership and authorization checks
repositories/      Spring Data JPA
specifications/    JPA Criteria API for dynamic filtering
mappers/           Entity → DTO conversion
dto/               API input/output types (never raw entities)
exceptions/        Global error handling via @ControllerAdvice
```
- Controllers contain no business logic.
- Authorization and ownership checks are centralized in guards — including an `AdminModerationGuard` that prevents privilege self-harm (an admin disabling their own account, or another admin's).
- JPA entities are never exposed in API responses; every response goes through a DTO.
- Dynamic search (jobs, applications, users) is implemented with JPA Specifications — composable, type-safe, no branching query methods.

**Frontend**
- Every backend call goes through a typed Server Action — no client-side fetch to the API directly.
- File uploads (resumes, generated verification PDFs) go straight from the server action to R2 using short-lived, role- and content-type-gated presigned URLs. Files never pass through the Spring backend.
- A single `DashboardShell` component drives navigation for all three authenticated roles, so candidate, company, and admin dashboards share one layout instead of three divergent ones.

## Infrastructure & Deployment

- **Backend** runs as a Docker container on Render, built via a multi-stage Dockerfile (Maven build stage → slim JRE runtime stage).
- **Database** is Render's managed PostgreSQL, connected over Render's private network.
- **Frontend** deploys to Vercel directly from the `frontend/` subdirectory of the monorepo — no Docker involved on that side, Vercel builds Next.js natively.
- **File storage** is a dedicated Cloudflare R2 bucket, reached via a custom subdomain (`docs.alchematch.com`) rather than the default `r2.dev` domain.
- **DNS** for the apex domain, `www`, and the R2 subdomain all live in Cloudflare, pointed at Vercel and Render respectively.

## Database & Migrations

Schema is entirely owned by Flyway. Hibernate runs in `validate` mode — it checks entity mappings against the live schema but never emits DDL.

```
backend/src/main/resources/db/migration/
├── V1__init_schema.sql
└── V2__add_company_application_rejection_reason.sql
```

Starting fresh: create an empty PostgreSQL database, start the application, Flyway applies all migrations in order automatically. `ddl-auto=create` / `update` is never used outside isolated tests.

## Security & Auth

- JWT issued at login, validated on every request via a custom filter.
- The filter loads the user fresh from the database on **every** authenticated request — a valid token is not sufficient if the account has since been disabled or locked. This is enforced live, not just at login time.
- Four roles: `ROLE_USER`, `ROLE_COMPANY`, `ROLE_ADMIN`, `ROLE_SUPER_ADMIN`. Endpoints are role-gated; resource ownership is enforced separately by guards.
- Password reset via time-limited, single-use email tokens.
- Bootstrap admin can be seeded on first startup via environment variable, disabled by default — never committed as a static credential.

## File Storage

Uploads (resumes, company verification PDFs) use presigned URLs, not backend proxying:

1. Client (or server action, for generated content) requests a presigned upload URL from `POST /api/uploads/presign`, specifying a purpose (`RESUME`, `COMPANY_APPLICATION_DOCUMENT`, etc.)
2. Backend validates the caller's role against that purpose, validates the content type, and returns a short-lived, scoped presigned PUT URL
3. The file uploads directly to Cloudflare R2 — the backend never touches the file bytes

## Testing

Integration tests run against an H2 in-memory database with Flyway migrations applied:

| Test class | Coverage |
|---|---|
| `AuthValidationIT` | Registration and login validation |
| `CompanyIsolationIT` | Cross-company data isolation |
| `DisabledUserJwtIT` | JWT enforcement for disabled accounts |
| `PasswordResetIT` | Full password reset flow |
| `ProfileAndCompanyAppValidationIT` | DTO validation on profile and company endpoints |
| `SavedJobMapperTest` | Saved-job DTO correctness |
| `JobsApplicationTests` | Spring context smoke test |

```bash
./mvnw clean verify
```

## Local Development

See [DEV.md](./DEV.md) for full setup. Short version: PostgreSQL running locally, backend on port 8080 (`./mvnw spring-boot:run`), frontend on port 3000 (`npm run dev`). Run `npm run build` in `frontend/` before every push — `next dev` skips the full type-check that `next build` (and every deploy) enforces.

## API Overview

All backend endpoints are prefixed with `/api`.

| Group | Base path | Access |
|---|---|---|
| Auth | `/api/auth/**` | Public |
| Public jobs & degree fields | `/api/public/**` | Public |
| Users (profile, account settings) | `/api/users/**` | Authenticated |
| Company applications | `/api/company-applications/**` | `ROLE_USER` |
| Company management | `/api/company/**` | `ROLE_COMPANY` |
| File uploads | `/api/uploads/presign` | Authenticated (role- and purpose-gated) |
| Admin | `/api/admin/**` | `ROLE_SUPER_ADMIN` / `ROLE_ADMIN` |

## Roadmap

Deliberately deferred rather than half-shipped:
- Candidate certificates & work experience (needs a full backend build — no repository/service/controller exists yet)
- Company logo and profile picture upload (presign infrastructure already supports both purposes; just needs the endpoint and UI)
- Admin role hierarchy — super admins create admins; admins get full access except role/degree-field management