# CyberAware – Cyber Security Awareness Platform

This app helps people build awareness about cyber threats through guided learning and quizzes.

A full-stack cyber security learning platform with quizzes, progress tracking, admin analytics, and feedback collection.

## Tech Stack
- Frontend: React, Vite, TailwindCSS, React Router, Axios, Chart.js
- Backend: Node.js, Express, MongoDB, Mongoose
- Auth: JWT, Google OAuth, role-based access
- Security: bcrypt, helmet, rate limiting, input validation

## Project Structure
```
backend
frontend
```

## Setup

### 1) Backend
```
cd backend
npm install
copy .env.example .env
```
Update `.env` values as needed.

Run:
```
npm run dev
```

### 2) Frontend
```
cd frontend
npm install
copy .env.example .env
```

Run:
```
npm run dev
```

### Admin Login
Default admin is seeded on server start:
- Email: `admin@cyberaware.com`
- Password: `admin123`

Change these values in `backend/.env` for production.

## Features
- Secure authentication with JWT & Google OAuth
- Cyber learning resources and curated links
- Real-time quiz engine with timer
- Awareness level scoring and progress tracking
- Admin analytics dashboard & leaderboard
- Feedback collection for continuous improvement

## API Routes
- Auth: `/api/auth/register`, `/api/auth/login`, `/api/auth/google`, `/api/auth/me`
- Users: `/api/users/profile`, `/api/users/update`
- Quiz: `/api/quiz/:topic`, `/api/quiz/submit`, `/api/quiz/history/me`
- Admin: `/api/admin/users`, `/api/admin/users/:id/history`, `/api/admin/stats`
- Feedback: `/api/feedback` (POST), `/api/feedback` (GET admin)

## Notes
- MongoDB must be running (local or Atlas).
- Google login requires `GOOGLE_CLIENT_ID` and `VITE_GOOGLE_CLIENT_ID`.
