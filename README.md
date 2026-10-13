# Dhairya Tiwari — Portfolio

A responsive, dark-first portfolio for a CSE student, with a light theme, searchable skills, project details, a safe frontend developer console, keyboard command palette, and a contact API that stores submissions in MySQL.

## Stack

- React, TypeScript, Vite, and custom CSS design tokens
- Express, Zod, Helmet, CORS allowlist, and rate limiting
- MySQL 8 with Prisma ORM
- Docker Compose for local MySQL

## Project layout

```text
src/                  React app, styles, and centralized profile/project/skill data
src/config/profile.ts Edit your profile, links, project details, and skill status here
server/src/index.ts   Express API
prisma/schema.prisma  MySQL contact submission model
public/resume/        Add your own PDF resume here
docker-compose.yml    Local MySQL service
```

## Requirements

- Node.js 20 or newer and npm
- Docker Desktop (for the simplest MySQL setup), or a separate MySQL 8 database

## Local setup

1. Install packages: `npm install`
2. Copy `.env.example` to `.env`.
3. Start local MySQL: `docker compose up -d mysql`.
4. Create/apply the database migration: `npx prisma migrate dev --name initial_contact_submissions`.
5. Start the API: `npm run server:dev` (port 4000).
6. In another terminal, start the site: `npm run dev` (Vite on port 5173, `/api` proxied to 4000).
7. Open the local URL shown by Vite. Check `http://localhost:4000/api/health` for API and database status.

If MySQL is hosted separately, set `DATABASE_URL` to its connection string. Keep `.env` private. `CLIENT_ORIGIN` accepts a comma-separated allowlist of browser origins. For deployment, set the production origin and database URL in the server environment, and configure the frontend host to proxy `/api` to the API service (or set up a same-origin reverse proxy).

## Build and run

- Frontend production build: `npm run build`
- Frontend preview: `npm run preview`
- API: `npm run server:start` (the API uses `tsx`; for a compiled deployment, add a TypeScript build step and run the emitted JavaScript)
- API schema generation: `npx prisma generate`
- Production migrations: `npx prisma migrate deploy`
- MySQL stop: `docker compose down` (data persists in the named volume)
- Remove local MySQL data: `docker compose down -v`

The repository does not currently include an automated test suite or format configuration. Add tests as you add and stabilize features. Do not report a Lighthouse score until you run an actual audit against the deployed or locally served production build.

## Personalize before publishing

Edit `src/config/profile.ts` to update your intro, location, GitHub, LinkedIn, email, LeetCode, skills and project content. Current repository and demo URLs are intentionally blank; add only real public URLs. Confirm each feature and contribution description against the implementation before publishing. Skill labels are editable and should reflect your current experience.

Add a real PDF at `public/resume/Dhairya-Tiwari-Resume.pdf`, or change `resumePath` in the config. The current download link points to the documented location and will not create a substitute resume.

Project previews are CSS illustrations, not screenshots of completed products. Replace them with local images when available and provide accurate alt text. Education dates, coursework, experience, achievements, testimonials, and usage statistics are omitted until verified information is available.

## Contact API

- `GET /api/health`: confirms API and Prisma database connectivity.
- `POST /api/contact`: validates the name, email, subject, and message; rejects malformed submissions; applies a five-request-per-15-minute IP limit; silently handles a filled honeypot; and stores valid entries in `ContactSubmission`.

The API never returns contact records publicly. Form submissions need a reachable API and MySQL database; the frontend reports a real request failure instead of showing a fake success state. No email provider is configured. Secure the production database with a non-development account/password and TLS as appropriate to your provider.

## Deployment notes

Deploy the static frontend to any Vite-compatible static host and the Express API to a Node host. Provision MySQL separately or use a managed MySQL service. Configure `DATABASE_URL`, `PORT`, and `CLIENT_ORIGIN` on the API host, run `npx prisma migrate deploy` during release, and route `/api` to the API. Do not commit secrets or use the development database credentials from Compose in production.
