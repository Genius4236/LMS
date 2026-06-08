# Deployment Guide

This repository contains two separate apps:

- `Backend/` — Express API (Node.js)
- `Frontend/` — Vite React app

Recommended approach: deploy the frontend to Vercel and host the backend on a Node hosting provider (Render, Railway, Fly, DigitalOcean, etc.). Alternatively, convert the backend into Vercel Serverless Functions (more work).

## Quick Steps — Option A (Frontend on Vercel, Backend elsewhere)

1. Frontend (Vercel)
   - In Vercel, create a new project and select the `Frontend` folder as the root.
   - Build command: `npm run build`
   - Output directory: `dist`
   - Environment variables: set any client-side vars if needed.
   - Update `Frontend/vercel.json` -> replace `https://<YOUR_BACKEND_URL>` with your backend domain.

2. Backend (Render / Railway / others)
   - Create a new service using the `Backend` folder.
   - Build/start command: `npm start` (or let platform use `package.json` `start`).
   - Environment variables to set on the platform:
     - `MONGO_URI` — your MongoDB connection string
     - `JWT_SECRET` — your JWT secret
     - `CLIENT_URL` — the deployed frontend URL (e.g. `https://your-frontend.vercel.app`)
   - Make sure the platform exposes the service over HTTPS and note its domain.

3. Update frontend rewrite
   - In `Frontend/vercel.json`, set the `destination` under `/api/:match*` to `https://<YOUR_DEPLOYED_BACKEND_DOMAIN>/api/:match*`.
   - Deploy frontend; calls to `/api/...` will be proxied to the backend domain.

4. Verify CORS
   - Backend uses `cors({ origin: CLIENT_URL, credentials: true })` so ensure `CLIENT_URL` matches your frontend URL exactly (no trailing slash).

5. Test
   - Open frontend URL and exercise API flows.
   - Check backend `GET /api/health` for status.

## Option B — Convert Backend to Vercel Serverless

- Move Express routes into Vercel function handlers under `api/`.
- Each route becomes `api/auth.js`, `api/courses.js`, etc., exporting a handler.
- Use `mongoose` carefully — connection reuse is required for serverless functions.
- This approach requires refactoring and testing; I can help convert it if you want.

## Local testing commands

Backend:
```bash
cd Backend
npm install
npm run dev
```

Frontend:
```bash
cd Frontend
npm install
npm run build
npm run preview
```

## Notes
- Keep secrets out of source control; set them in the provider dashboard.
- If you want, I can convert the backend into Vercel functions and update the code accordingly.
