# Deploying Roznama

Two pieces ship together: the **Vite/React frontend** (static) and the **Express API**
(a single Vercel serverless function). Supabase provides auth + Postgres.

## 1. Supabase

1. Create a project at [supabase.com](https://supabase.com).
2. **SQL Editor → New query** and run, in order:
   - `supabase/migrations/0001_init.sql`
   - `supabase/migrations/0002_habits_profiles.sql`
3. **Project Settings → API** → copy:
   - **Project URL** → `SUPABASE_URL` / `VITE_SUPABASE_URL`
   - **anon public** key → `SUPABASE_ANON_KEY` / `VITE_SUPABASE_ANON_KEY`
4. **Authentication → Providers → Email**: enable it. For frictionless testing you may turn
   off "Confirm email"; leave it on for production.

> The `anon` key is meant to be public — every table is protected by Row Level Security
> (`auth.uid() = user_id`), so users can only ever touch their own rows.

## 2. Vercel

1. Push this repo to GitHub.
2. In Vercel: **Add New → Project → Import** the repo. Framework preset: **Other**
   (the included `vercel.json` already defines the build).
3. **Settings → Environment Variables** (Production + Preview):

   | Name | Value |
   | --- | --- |
   | `SUPABASE_URL` | your project URL |
   | `SUPABASE_ANON_KEY` | anon public key |
   | `VITE_SUPABASE_URL` | same project URL |
   | `VITE_SUPABASE_ANON_KEY` | same anon key |
   | `CORS_ORIGIN` | your site origin, e.g. `https://roznama.vercel.app` (or `*`) |

4. **Deploy.** `vercel.json` will:
   - build the frontend (`npm run build:web`) into `apps/web/dist`,
   - serve the Express app from `api/index.ts` as a function, and
   - rewrite `/api/*` → the function and everything else → `index.html` (SPA).

Because the frontend calls the API at the same origin (`VITE_API_BASE` defaults to `/api`),
no extra CORS setup is needed in the default single-domain deploy.

## 3. Make an admin (optional)

After signing up once, in the Supabase SQL editor:

```sql
update public.profiles set role = 'admin'
where user_id = (select id from auth.users where email = 'you@example.com');
```

## Alternative: separate API host

You can also run the API anywhere Node runs:

```bash
npm run build:api      # typecheck
npm run start --workspace @roznama/api   # tsx src/index.ts on $PORT (default 8787)
```

Then point the frontend at it by setting `VITE_API_BASE=https://your-api-host/api` and set
`CORS_ORIGIN` on the API to your frontend origin.

## Notes

- **PDF Arabic glyphs:** the bundled PDFKit core font (Helvetica) has no Arabic glyphs, so PDF
  reports use English/transliterated labels. To render native Arabic, register a TTF
  (e.g. Cairo) via `doc.registerFont(...)` in `apps/api/src/services/export.ts`. Excel exports
  are unaffected.
- **Browser notifications** require HTTPS and user permission; Vercel serves HTTPS by default.
- **Offline mode:** if the `VITE_SUPABASE_*` vars are omitted, the app still runs and stores
  everything in `localStorage` (no accounts, no sync) — handy for demos.
