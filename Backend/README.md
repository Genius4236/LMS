# Zora Backend

Node.js + Express + MongoDB REST API for the Zora frontend.

## Setup

1. Copy `.env.example` to `.env` and set your values:

```bash
cp .env.example .env
```

2. Install dependencies and start MongoDB locally (or use Atlas).

```bash
npm install
npm run dev
```

API runs at `http://localhost:8000`.

## Optional demo data

```bash
npm run seed
```

| Account | Email | Password |
|---------|-------|----------|
| Educator | educator@demo.com | demo123 |
| Student | student@demo.com | demo123 |

## API overview

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/health` | — | Health check |
| POST | `/api/auth/signup` | — | Register |
| POST | `/api/auth/login` | — | Login |
| GET | `/api/auth/logout` | — | Clear session cookie |
| GET | `/api/auth/me` | ✓ | Current user profile |
| GET | `/api/courses` | — | List courses (`?search=&category=`) |
| GET | `/api/courses/details/:courseId` | — | Course + lectures |
| GET | `/api/courses/student/enrolled` | Student | Enrolled courses |
| GET | `/api/courses/educator/courses` | Educator | Created courses |
| POST | `/api/courses` | Educator | Create course |
| PUT | `/api/courses/:courseId` | Educator | Update course |
| DELETE | `/api/courses/:courseId` | Educator | Delete course |
| POST | `/api/courses/enroll/:courseId` | Student | Enroll |
| POST | `/api/courses/:courseId/lectures` | Educator | Add lecture |
| PUT | `/api/courses/:courseId/lectures/:lectureId` | Educator | Update lecture |
| DELETE | `/api/courses/:courseId/lectures/:lectureId` | Educator | Delete lecture |
| GET | `/api/progress/:courseId` | Student | Get progress |
| POST | `/api/progress/:courseId/toggle` | Student | Toggle lecture complete |

Auth uses HTTP-only cookies and optional `Authorization: Bearer <token>` header.
