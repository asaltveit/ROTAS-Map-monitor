# ROTAS Map Monitor

A secured Next.js dashboard for managing and monitoring the [ROTAS Map](https://rotas-squares-map.vercel.app/) — an interactive map of ancient palindromic inscription locations.

## Features

- **Authentication** — Supabase Auth for editor/admin users only
- **Location management** — Add and delete locations on the shared ROTAS Map database
- **Overlap handling** — Original coordinates are preserved; display coordinates are offset when multiple inscriptions share a site
- **Monitoring** — Scheduled health checks for map uptime, Supabase connectivity, RPC smoke tests, and data quality
- **Alerts** — Dashboard alerts with acknowledge flow

## Setup

1. Copy environment variables:

```bash
cp .env.example .env.local
```

2. Fill in Supabase credentials (same project as ROTAS Map):

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

3. Run SQL migrations in the Supabase SQL editor:

- [`supabase/migrations/001_locations_original_coords.sql`](supabase/migrations/001_locations_original_coords.sql)
- [`supabase/migrations/002_monitor_tables.sql`](supabase/migrations/002_monitor_tables.sql)

4. Create the first admin user in Supabase Auth, then insert a profile row:

```sql
INSERT INTO user_profiles (user_id, role)
VALUES ('<auth-user-uuid>', 'admin');
```

5. Install and run:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment variables

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key (server only) |
| `NEXT_PUBLIC_APP_URL` | This app's public URL |
| `ROTAS_MAP_URL` | ROTAS Map URL to monitor |
| `CRON_SECRET` | Bearer token for `/api/monitor/run` |

## Scheduled monitoring

Vercel Cron calls `POST /api/monitor/run` every 15 minutes with:

```
Authorization: Bearer <CRON_SECRET>
```

## Related project

- [ROTAS-squares-map](https://github.com/asaltveit/ROTAS-squares-map) — the public map application
