# Zora — Learning Management System (LMS)

## Git summary
- **Front-end:** React + Vite + Tailwind CSS
- **State management:** Redux Toolkit (store + slices)
- **Routing:** React Router
- **Back-end:** Node.js + Express (ES modules)
- **Database:** MongoDB with Mongoose
- **Auth:** Cookie-based sessions (HTTP-only) with optional JWT `Authorization: Bearer <token>`
- **Core APIs:** Courses (CRUD + details/lectures), enrollment, and per-course student progress/lecture completion
- **Seed data:** Backend includes `scripts/seed.js` and demo educator/student credentials in README files
- **Deployment:** Vercel config present for both Frontend and Backend

## Quick links
- Backend health check: `GET /api/health`
- API base paths:
  - `/api/auth/*`
  - `/api/courses/*`
  - `/api/progress/*`

