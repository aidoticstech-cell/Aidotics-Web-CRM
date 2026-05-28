# Deploy on Vercel

The Next.js app lives in **`web/`**. The Express API lives in **`server/`** and must be hosted separately (Railway, Render, Fly.io, etc.).

## Fix “404: NOT_FOUND” on `*.vercel.app`

That error usually means Vercel is **not** building the Next app (wrong root folder).

1. Open [Vercel Dashboard](https://vercel.com) → your **Aidotics-Web-CRM** project.
2. **Settings** → **General** → **Root Directory**.
3. Click **Edit** → set to **`web`** → **Save**.
4. **Settings** → **Environment Variables** (Production + Preview):
   - `API_URL` = your deployed CRM API base URL, e.g. `https://your-api.example.com`  
     (no trailing slash; must be reachable from the internet, not `localhost:4100`)
5. **Deployments** → open the latest deployment → **⋯** → **Redeploy** (use “Redeploy with existing Build Cache” or clear cache if needed).

After a successful deploy, these routes should work:

- `/` → redirects to `/login`
- `/register`, `/login`, `/onboarding`, `/dashboard`

## Build settings (if you configure manually)

| Setting | Value |
|--------|--------|
| Framework | Next.js |
| Root Directory | `web` |
| Build Command | `npm run build` |
| Install Command | `npm install` |
| Output Directory | *(leave default — Vercel manages Next.js output)* |

## API on production

`web/next.config.ts` proxies `/api/v1/*` to `API_URL`. On Vercel, `API_URL` **must** point to your live CRM API (`server/`), not `http://localhost:4100`.

Example:

```bash
# Vercel → Environment Variables
API_URL=https://aidotics-crm-api.onrender.com
```

Deploy `server/` with `DATABASE_URL`, `JWT_SECRET`, and run `npx prisma migrate deploy`.
