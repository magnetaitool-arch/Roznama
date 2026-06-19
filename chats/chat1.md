# Roznama: Egyptian Life Tracker

_Started 2026-06-19 22:34 UTC_

---

## User

Design a personal life-tracker web app called "Roznama" (روزنامة) — a retro/vintage Egyptian tear-off-calendar concept with modern, flat, polished UI/UX. Arabic (RTL), Egyptian Arabic copy, mobile-first.

The app tracks: daily goals, monthly goals, and personal finance (income & expenses in EGP). The hero is a live retro clock showing time + day + full date, updating every second. Data persists locally and survives refresh. The app pushes notifications for unfinished daily tasks.

Make the motion exceptional — a coordinated page-load sequence, smooth tab transitions, satisfying micro-interactions, count-up numbers, animated progress rings/bars, a split-flap style clock, and a celebration moment when all daily tasks are done. Use Framer Motion. Always respect prefers-reduced-motion.

Build it as a single polished prototype with 4 tabs (Dashboard / Daily / Monthly / Finance) and a fixed bottom nav. Follow the exact design tokens, screen specs, motion specs, and notification rules below. 

dont use magnet design system

## Assistant

_[tool: list_files]_

Project's empty and the detailed spec tail got trimmed, but the brief is rich and specific — I'll build it now as a single polished Design Component (RTL Egyptian Arabic, mobile-first), and note one substitution.

Quick note on motion: inside this component framework Framer Motion's `<motion.*>` tags can't be authored directly, so I'm delivering the same choreography with a CSS/WAAPI motion system (coordinated load sequence, tab transitions, split-flap flips, count-ups, animated rings/bars, confetti celebration) — fully `prefers-reduced-motion` aware.

_[tool: update_todos]_

_[tool: dc_write]_

_[tool: set_project_title]_

_[tool: show_html]_

_[tool: show_html]_

_[tool: get_webview_logs]_

_[tool: eval_js]_

Working correctly — the blank capture was just mid-load-animation (cards start at opacity 0). DOM confirms the full dashboard renders: clock `٠١:٥٠:١٣`, day `السبت`, Gregorian + Hijri dates, `٢٠٪` ring, `١٤٬٣٥٠ ج.م` balance.

_[tool: update_todos]_

**روزنامة (Roznama)** is built — a single mobile-first RTL prototype with all 4 tabs.

- **Dashboard** — vintage نتيجة tear-off card with perforations, red day banner, a live **split-flap clock** (Arabic-Indic digits flipping every second), Gregorian + Hijri dates, animated progress ring, count-up balance.
- **Daily / Monthly / Finance** — checkable tasks with a celebration burst when all done, % goal bars with ±10 controls, EGP income/expense tracking with category breakdown.
- Data persists in localStorage (survives refresh), notifications via the bell (asks permission, reminds you of unfinished tasks), and every animation respects `prefers-reduced-motion`.

Two notes: I delivered the motion with a CSS/WAAPI system instead of Framer Motion (its `<motion.*>` tags can't be authored in this component format — same choreography, lighter weight). And browser notifications only fire over https with permission granted.

_[tool: ready_for_verification]_

The design-system warning is expected — you asked me not to use the Magnet system, so I intentionally didn't load it. Roznama is ready.

