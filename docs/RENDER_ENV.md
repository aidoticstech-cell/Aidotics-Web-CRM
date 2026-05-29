# Render environment variables (CRM API)

## Quick update (recommended)

From repo root, with your [Render API key](https://dashboard.render.com/u/settings#api-keys):

```bash
export RENDER_API_KEY="rnd_xxxxxxxx"
export SUPABASE_SERVICE_ROLE_KEY="eyJ..."   # Supabase → Settings → API → service_role

node scripts/render-update-crm-env.mjs
```

The script will:

- Find your CRM web service on Render
- Set `DIRECT_URL` to the Supabase **direct** host (password taken from existing `DATABASE_URL`)
- Set `SUPABASE_URL`, `CRM_WEB_URL`, `JWT_SECRET`, `JWT_REFRESH_SECRET`, `NODE_ENV`, `OTP_IN_RESPONSE`
- Leave `DATABASE_URL` unchanged

Then **Manual Deploy** the service on Render.

## Manual values (if script cannot run)

| Key | Value |
|-----|--------|
| `CRM_WEB_URL` | `https://aidotics-web-crm.vercel.app` |
| `SUPABASE_URL` | `https://lsveivwgzevtoyqhqvyi.supabase.co` |
| `SUPABASE_SERVICE_ROLE_KEY` | service_role key from Supabase dashboard |
| `DIRECT_URL` | `postgresql://postgres.lsveivwgzevtoyqhqvyi:[PASSWORD]@db.lsveivwgzevtoyqhqvyi.supabase.co:5432/postgres?schema=crm` |
| `DATABASE_URL` | Keep pooler URI from Supabase (pooling **on**), `?schema=crm` |
| `JWT_SECRET` | `openssl rand -base64 48` |
| `JWT_REFRESH_SECRET` | `openssl rand -base64 48` |
| `NODE_ENV` | `production` |
| `OTP_IN_RESPONSE` | `false` |

Use the **same password** in `DATABASE_URL` and `DIRECT_URL` (URL-encode special characters in the URI).

## Cursor Render MCP

If MCP returns `unauthorized` or `no workspace set`:

1. Cursor **Settings → MCP → Render** — sign in / reconnect
2. Run **Render: Select workspace** (or approve workspace when prompted)
3. Ask the agent again to update env vars
