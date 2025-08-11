# TechGist

A full‑stack blogging & knowledge sharing platform built with:

- Backend: **Node.js**, **Express**, **Sequelize (PostgreSQL)**, JWT auth, validation (express-validator), rich text sanitization (sanitize-html), Helmet security, Swagger (OpenAPI 3) docs.
- Frontend: **React (Vite)**, **TailwindCSS**, Flowbite UI, Redux Toolkit state, React Quill rich text editor, react-helmet-async for SEO.
- Testing: **Jest** + **Supertest** (API) and React Testing Library (client tests scaffolded).

## Features

- User authentication (signup / signin) with JWT (cookie storage) & roles (user, contributor, admin)
- Admin‑only post creation/update/delete (configurable)
- Rich text post editor with server‑side sanitization
- Comments with CRUD & authorization
- Topics aggregation endpoint (`/api/post/topics`) powering Explore Topics page
- Dynamic XML sitemap generation including post slugs (`/sitemap.xml`) + robots.txt
- Centralized error handling & consistent API error shape
- Input validation on all mutating endpoints (express-validator)
- Security: Helmet headers, HTML sanitization, size limiting, UUID identifiers
- SEO: Dynamic per‑post meta tags & global head tags
- Toast notifications & improved UX states (loading spinners, skeletons/fallbacks)
- Swagger UI documentation (`/api/docs`)
- Jest + Supertest API test examples (auth + posts)

## Monorepo Structure

```
TechGist/
  api/              # Express backend
  client/           # React frontend (Vite)
  package.json      # Root scripts & backend deps
  README.md
```

## Environment Variables

Create a `.env` file at repo root (never commit). Example:

```
DB_HOST=localhost
DB_NAME=techgist
DB_USER=postgres
DB_PASSWORD=postgres
JWT_SECRET=supersecretjwt
JWT_EXPIRES_IN=7d
APP_BASE_URL=http://localhost:3001
NODE_ENV=development
```

Frontend (client) may also use optional environment variables (Vite requires `VITE_` prefix) – currently minimal usage.

## Installation & Setup

1. Install root dependencies (backend) and client deps:
   ```powershell
   npm install
   npm install --prefix client
   ```
2. Create and configure PostgreSQL database matching `.env`.
3. (Optional) Seed initial data:
   ```powershell
   npm run seed
   ```
4. Start backend (port 3001 default):
   ```powershell
   npm run dev
   ```
5. In a second terminal start frontend from `client/` (if a script exists inside client package.json e.g. `dev`):
   ```powershell
   npm run dev --prefix client
   ```

Visit: `http://localhost:5173` (default Vite) and API docs at `http://localhost:3001/api/docs`.

> PowerShell Execution Policy: If you see script execution blocked for `npm.ps1` run:
> ```powershell
> Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
> ```

## Scripts (Root)

| Script | Description |
|--------|-------------|
| `npm run dev` | Start backend with nodemon |
| `npm start` | Start backend (production) |
| `npm run seed` | Seed database with demo data |
| `npm run build` | Install all deps & build frontend dist |
| `npm run lint` | ESLint (no warnings allowed) |
| `npm run format` | Prettier write |
| `npm run test:api` | Run Jest + Supertest API tests |

Client side has its own scripts (see `client/package.json`).

## API Overview

Swagger UI: `GET /api/docs`

Important endpoints (all described in Swagger):

- `POST /api/auth/signup` – create user
- `POST /api/auth/signin` – authenticate
- `POST /api/post/create` – create post (admin)
- `GET /api/post/getposts` – list posts (filters via query params)
- `GET /api/post/topics` – aggregated topics
- `PUT /api/post/updatepost/:postId/:userId` – update post (owner/admin)
- `DELETE /api/post/deletepost/:postId/:userId` – delete post (owner/admin)
- `POST /api/comment` – create comment
- `GET /api/comment/post/:postId` – list comments for post
- `PUT /api/comment/:commentId` – update comment
- `DELETE /api/comment/:commentId` – delete comment
- `GET /api/user/:userId` – get profile (protected)
- `PUT /api/user/:userId` – update profile
- `POST /api/user/follow/:userIdToFollow` – follow
- `POST /api/user/unfollow/:userIdToUnfollow` – unfollow

Auxiliary:
- `GET /sitemap.xml` – dynamic sitemap
- `GET /robots.txt`

## Authentication

The API uses JWT tokens stored in an httpOnly cookie (`access_token`). Middleware extracts & verifies token (`verifyToken` / `protect`). Role-based checks restrict certain endpoints (e.g. admin for post creation).

## Validation & Error Handling

All inputs validated with **express-validator**; first error returned as JSON:
```json
{
  "success": false,
  "statusCode": 400,
  "message": "Title must be at least 5 chars"
}
```

## Rich Text Sanitization

Incoming `content` (posts) and `bio` fields sanitized via `sanitize-html` allowing a curated tag & attribute whitelist to prevent XSS.

## Testing

API Tests (Supertest):
```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
npm run test:api
```
Current coverage: basic signup/signin + create/list posts examples (expand as needed).

Client tests (React Testing Library) scaffolding present; run inside `client` folder if configured.

## Deployment Notes

1. Set `APP_BASE_URL` to public domain (e.g. `https://techgist.example.com`) for correct sitemap generation.
2. Use a reverse proxy (NGINX) to serve client build and proxy `/api/*` to backend.
3. Enable HTTPS (Let's Encrypt or managed cert) – important for secure cookies.
4. Configure DATABASE_URL (or keep discrete vars) in production environment.
5. Consider running migrations explicitly instead of `sync({ alter: true })`.

## Future Improvements

- Add pagination metadata to `getposts` (page, pageSize, totalPages)
- Add rate limiting (express-rate-limit) & request ID tracing
- Expand test suite (comments, auth failure paths, RBAC)
- Add OpenAPI schema for error responses & security definitions for bearer token (alternative to cookie)
- Image upload/optimization (S3 or Cloudinary) instead of external URLs

## License

ISC (adapt as necessary). All third‑party packages retain their own licenses.

---
Generated & maintained with automated assistance – keep this README updated as endpoints or architecture evolve.
