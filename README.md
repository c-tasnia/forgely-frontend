# ProjectForge — Frontend

React (Vite) + Tailwind. Landing page, auth, role-based dashboard, Kanban board, real-time chat,
notifications, file uploads, GitHub activity, contribution scoring.

## Setup
1. `cp .env.example .env` and set `VITE_API_URL` to your backend's URL + `/api`
   (e.g. `http://localhost:5000/api` locally, or `https://your-backend.example.com/api` in production).
2. `npm install`
3. `npm run dev`

The chat/notifications socket connection is derived automatically from `VITE_API_URL` (it strips
the trailing `/api`) — no separate env var needed.

## Deploying
Static build — works on Vercel, Netlify, Cloudflare Pages, etc. Set `VITE_API_URL` as an environment
variable in your host's dashboard, then `npm run build` (output in `dist/`).

## Login
Use "Try demo account" on the login page once the backend has been seeded (`npm run seed` in the backend repo),
or register a new account.
