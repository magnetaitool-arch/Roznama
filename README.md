# روزنامة · Roznama — Egyptian Life Tracker

A mobile-first, **RTL Egyptian-Arabic** personal life tracker styled as a retro tear-off
calendar (نتيجة) with a modern, flat, polished UI. Tracks **daily tasks, habits, monthly
goals, and personal finance (EGP)**, with a live split-flap clock, analytics dashboard,
monthly reports, PDF/Excel export, dark/light mode, and cloud sync.

Built from the Claude Design handoff in [`project/Roznama.dc.html`](project/Roznama.dc.html)
(see [`project/README.handoff.md`](project/README.handoff.md) and [`chats/`](chats/) for the
original design intent).

---

## ✨ Features

- **Dashboard** — vintage tear-off calendar card, live **split-flap clock** (Arabic-Indic
  digits, ticks every second), Gregorian + Hijri dates, animated progress ring, count-up balance.
- **Daily tasks** — checkable list, add/delete, progress bar, and a **confetti celebration**
  when everything's done. Auto-resets each new day.
- **Habits** — emoji + color habits with **streak tracking** (🔥) and a one-tap daily toggle.
- **Monthly goals** — progress goals with ±10% controls and target dates.
- **Finance** — income/expense tracking in EGP, balance, top-spending categories.
- **Analytics** — month switcher, income/expense trend (6-month bar chart), daily-spend area
  chart, category pie chart — all via Recharts.
- **Reports & export** — server-generated monthly **PDF** and **Excel** reports (CSV fallback offline).
- **Auth & sync** — Supabase email/password accounts; per-user data with Postgres **Row Level
  Security**. Works fully **offline (localStorage)** with no account.
- **Profile & settings** — display name, **dark / light / system** theme, notifications.
- **Notifications** — browser reminders for unfinished tasks (with permission).
- **Backup & restore** — export/import your full dataset as JSON.
- **Role-based access** — `user` / `admin` roles with an admin overview endpoint.
- **Motion** — coordinated load sequence, tab transitions, count-ups, animated rings/bars,
  split-flap flips, confetti — all via **Framer Motion**, fully `prefers-reduced-motion` aware.

## 🧱 Architecture

```
roznama/
├─ apps/
│  ├─ web/          # Vite + React + TypeScript frontend (the UI)
│  └─ api/          # Express + TypeScript REST API (Supabase-backed)
├─ packages/
│  └─ shared/       # Shared TypeScript domain types (web + api)
├─ api/             # Vercel serverless entry (wraps the Express app)
├─ supabase/
│  └─ migrations/   # Postgres schema + Row Level Security policies
├─ project/         # Original Claude Design handoff bundle
└─ vercel.json      # Deployment config
```

- **Frontend** — React 18, Vite, Framer Motion, Recharts, `@supabase/supabase-js`.
- **Backend** — Express, `@supabase/supabase-js` (per-request RLS-bound client), `pdfkit`, `exceljs`.
- **Database** — Postgres on Supabase. Every table is RLS-scoped to `auth.uid()`.
- **Offline-first** — when Supabase env vars are absent the app runs entirely on `localStorage`,
  so it's demoable with zero backend; setting the env vars enables accounts + cloud sync.

## 🚀 Quick start (local)

```bash
npm install

# 1) Run with NO backend (offline mode — instant, uses localStorage):
npm run dev          # → http://localhost:5173

# 2) Run full-stack (cloud sync) — set env vars first (see below), then:
npm run dev:api      # Express on :8787
npm run dev:web      # Vite on :5173 (proxies /api → :8787)
```

Copy [`.env.example`](.env.example) to `.env` and fill in your Supabase keys to enable
authentication and cloud sync.

## 🗄️ Database setup (Supabase)

1. Create a project at [supabase.com](https://supabase.com).
2. In **SQL Editor**, run the migrations in order:
   - `supabase/migrations/0001_init.sql`
   - `supabase/migrations/0002_habits_profiles.sql`
3. Grab **Project Settings → API**: the `URL` and `anon` key → put them in your env vars.
4. (Optional) To make yourself an admin:
   `update public.profiles set role = 'admin' where user_id = '<your-uid>';`

Row Level Security is enabled on every table, so the `anon` key is safe to expose to the client.

## 🔌 API surface

All routes are under `/api` and require a Supabase `Authorization: Bearer <token>` (except health).

| Method | Path | Purpose |
| --- | --- | --- |
| GET | `/api/health` | Liveness + config status |
| GET | `/api/state` | Full dataset (daily, monthly, tx, habits, profile) + day rollover |
| PUT | `/api/state/preferences` | Toggle notifications |
| POST/PATCH/DELETE | `/api/daily[/:id]` | Daily task CRUD |
| POST/PATCH/DELETE | `/api/monthly[/:id]` | Monthly goal CRUD |
| POST/DELETE | `/api/transactions[/:id]` | Finance CRUD |
| POST/PATCH/DELETE | `/api/habits[/:id]` | Habit CRUD |
| POST | `/api/habits/:id/toggle` | Toggle today's habit log |
| GET/PUT | `/api/profile` | Profile + theme + display name |
| GET | `/api/reports/monthly?month=YYYY-MM` | Monthly report JSON |
| GET | `/api/reports/analytics?month=&months=` | Chart series |
| GET | `/api/reports/export?month=&format=pdf\|xlsx` | Download report |
| GET / POST | `/api/backup[/restore]` | Export / import dataset |
| GET | `/api/admin/overview` | Admin-only aggregates |

## ☁️ Deployment (Vercel)

See [`DEPLOYMENT.md`](DEPLOYMENT.md) for the full walkthrough. In short:

1. Push to GitHub and import the repo into Vercel.
2. Set env vars (`SUPABASE_URL`, `SUPABASE_ANON_KEY`, `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`).
3. Deploy — `vercel.json` builds the web app to `apps/web/dist` and serves the Express API as a
   serverless function under `/api/*`.

## 🧪 Scripts

```bash
npm run dev          # web (offline) dev server
npm run dev:api      # Express API (tsx watch)
npm run build        # build web + typecheck api
npm run typecheck    # typecheck all workspaces
```

## 🎨 Design fidelity

The light theme's colors, spacing, radii, and typography (Cairo + Aref Ruqaa) are ported
verbatim from the exported prototype, so light mode is pixel-faithful to the original design.
Dark mode is layered on top via CSS custom properties. The Framer Motion choreography
re-implements the prototype's CSS/WAAPI motion (the original brief asked for Framer Motion).
