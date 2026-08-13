# Forgely — Frontend

React (Vite) + Tailwind. Landing page, auth, role-based dashboard, Kanban board, real-time chat,
notifications, file uploads, GitHub activity, contribution scoring.

## Setup
1. `cp .env.example .env` and set:
   - `VITE_API_URL` to your backend's URL + `/api` (e.g. `http://localhost:5000/api` locally, or
     `https://your-backend.vercel.app/api` in production)
   - `VITE_PUSHER_KEY` and `VITE_PUSHER_CLUSTER` to match the Pusher app you set up on the backend
     (leave blank to run without real-time chat/notifications — everything else still works)
2. `npm install`
3. `npm run dev`

## Deploying
Static build — works on Vercel, Netlify, Cloudflare Pages, etc. Set `VITE_API_URL`,
`VITE_PUSHER_KEY`, and `VITE_PUSHER_CLUSTER` as environment variables in your host's dashboard
(Vite bakes these in at build time, so set them before building — updating them later needs a
rebuild), then `npm run build` (output in `dist/`). `vercel.json` and `netlify.toml` are both
included for SPA routing.

## Login
Use "Try demo account" on the login page once the backend has been seeded (`npm run seed` in the backend repo),
or register a new account.
