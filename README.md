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
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
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
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Supabase publishable key |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key (server only) |
| `NEXT_PUBLIC_APP_URL` | This app's public URL |
| `ROTAS_MAP_URL` | ROTAS Map URL for server-side uptime checks |
| `NEXT_PUBLIC_ROTAS_MAP_URL` | ROTAS Map URL for client-side location links |
| `CRON_SECRET` | Bearer token for `/api/monitor/run` (16+ random characters) |

## Scheduled monitoring

Vercel Cron calls `GET /api/monitor/run` every 15 minutes with:

```
Authorization: Bearer <CRON_SECRET>
```

The same endpoint also accepts `POST` for manual testing (for example with curl).

### Local cron test

```bash
curl -s -H "Authorization: Bearer $CRON_SECRET" http://localhost:3000/api/monitor/run
```

## Map links from the locations table

The locations table includes links to the public ROTAS Map and OpenStreetMap coordinates. The ROTAS Map does not yet support deep links to individual markers; per-location highlighting is planned as a follow-up in the [ROTAS-squares-map](https://github.com/asaltveit/ROTAS-squares-map) repo.

## Production checklist

### Supabase (one-time)

- [ ] Run [`001_locations_original_coords.sql`](supabase/migrations/001_locations_original_coords.sql) and [`002_monitor_tables.sql`](supabase/migrations/002_monitor_tables.sql) in the SQL editor
- [ ] Confirm `locations` has `original_latitude` / `original_longitude` backfilled
- [ ] Create the first Auth user and insert an admin row in `user_profiles`

### Vercel

- [ ] Set all environment variables listed above
- [ ] Deploy and confirm the cron job appears under Project → Cron Jobs
- [ ] After the first cron run, verify a row appears in `monitor_checks` and the dashboard shows the latest check

### Smoke tests (manual)

| Flow | Expected |
|------|----------|
| Login as editor | Dashboard + Locations; no Admin |
| Login as admin | Admin invite, manage users, remove user |
| Add overlapping location | Display coords offset; originals preserved |
| Delete location | Cluster recomputes; audit log row |
| Dashboard “Run check now” | New check + alerts if unhealthy |
| Cron GET with Bearer | 200 + persisted check |
| Unauthorized role / no profile | `/unauthorized` |

## Related project

- [ROTAS-squares-map](https://github.com/asaltveit/ROTAS-squares-map) — the public map application
