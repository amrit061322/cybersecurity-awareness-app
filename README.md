# CyberAware — Cyber Security Awareness Platform

CyberAware is a full-stack web application for building everyday cybersecurity awareness. It combines guided learning, timed quizzes, a multi-input phishing detection lab, community discussion, and progress tracking in one place.

## What it does

- **Learning Hub** — Topic cards with practical tips and links to trusted guidance (NCSC, CISA, OWASP). Content can be supplemented from the backend resources API when configured.
- **Quizzes** — Timed assessments on themes such as phishing, password safety, malware, and online privacy, with scores stored for history and charts.
- **Phishing Detection Lab** — Heuristic analysis for pasted e‑mail or message text, a URL, or an uploaded screenshot. Outputs include a confidence score and short explanations for learning; this is **not** a replacement for enterprise anti-phishing or Safe Browsing–class services.
- **Community** — Share tips, like posts, and comment. A leaderboard highlights active contributors.
- **Dashboard & profile** — Quiz performance over time, awareness and badge tiers, optional avatar upload, and your own posts.
- **Notifications** — Alerts for completed scans and badge changes.
- **Admin** — Role-based admin area for analytics and user management (seeded admin account in development; change credentials for production).
- **Feedback** — Users can submit feedback for continuous improvement.

## Tech stack

| Layer | Technologies |
|-------|----------------|
| Frontend | React, Vite, Tailwind CSS, React Router, Axios, Chart.js |
| Backend | Node.js, Express, MongoDB, Mongoose |
| Auth | JWT (Bearer token in `localStorage`), optional Google OAuth |
| Security | bcrypt password hashing, helmet, rate limiting, input validation |

## Repository layout

```
backend/     # Express API, models, phishing scanner service, seed data
frontend/    # Vite + React SPA
tools/       # Optional helper scripts (e.g. dissertation → Word conversion)
```

## Prerequisites

- **Node.js** (v18 LTS or newer recommended)
- **MongoDB** — local instance or MongoDB Atlas cluster
- **Google Cloud project** (optional) — only if you enable Google sign-in

## Quick start

### 1. Backend

```bash
cd backend
npm install
```

Create `backend/.env` from `.env.example` and set at least:

| Variable | Purpose |
|----------|---------|
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | Strong random secret for signing tokens |
| `PORT` | Server port (default often `5000`) |
| `FRONTEND_URL` | Frontend origin for CORS (e.g. `http://localhost:5173`) |

Optional (Google login):

| Variable | Purpose |
|----------|---------|
| `GOOGLE_CLIENT_ID` | Server-side OAuth client ID |

Admin seed (adjust in `.env` before production):

| Variable | Purpose |
|----------|---------|
| `ADMIN_EMAIL` | Initial admin email |
| `ADMIN_PASSWORD` | Initial admin password |

Start the API:

```bash
npm run dev
```

### 2. Frontend

```bash
cd frontend
npm install
```

Create `frontend/.env` from `.env.example`. Typical variables:

| Variable | Purpose |
|----------|---------|
| `VITE_API_URL` | Backend API base (e.g. `http://localhost:5000/api`) |
| `VITE_GOOGLE_CLIENT_ID` | Same Google client ID as the backend (if using OAuth) |

Start the dev server:

```bash
npm run dev
```

Open the URL shown in the terminal (commonly `http://localhost:5173`).

## Production notes

- Never commit real `.env` files; use platform-specific secret storage.
- Rotate any credentials that were ever exposed in old commits or chat logs.
- Set strict CORS, strong `JWT_SECRET`, HTTPS, and correct OAuth redirect URIs.
- Review rate limits and upload size limits for phishing image uploads.

## API overview

| Area | Example routes |
|------|----------------|
| Auth | `POST /api/auth/register`, `POST /api/auth/login`, `POST /api/auth/google`, `GET /api/auth/me` |
| Users | `GET /api/users/profile`, `PUT /api/users/update`, upload routes as implemented |
| Quiz | `GET /api/quiz/:topic`, `POST /api/quiz/submit`, history endpoints |
| Phishing | Detection scan and history endpoints under `/api/phishing` (see `backend/routes/phishingRoutes.js`) |
| Community | Feed, posts, comments (see `backend/routes/communityRoutes.js`) |
| Admin | User and stats routes under `/api/admin` |
| Feedback | `POST` and admin `GET` under `/api/feedback` |

Exact paths may vary slightly by version; inspect `backend/server.js` and the `routes/` folder for the authoritative list.

## Dissertation / report

The final-year dissertation draft (Word) for module CN6000 is included in the repository root as:

- `CN6000_Dissertation_Draft_AmritTamang_2546484.docx`

A small script under `tools/` can regenerate a `.docx` from a plain-text dissertation if you maintain one alongside the project.

## Contributing and licensing

Issues and pull requests are welcome. This project is intended for education and demonstration. It is released under the [MIT License](LICENSE).

## Author

**Amrit Tamang** — BSc (Hons) Computer Science, CN6000 Final Year Project.  
Public repository: [github.com/amrit061322/cybersecurity-awareness-app](https://github.com/amrit061322/cybersecurity-awareness-app)
