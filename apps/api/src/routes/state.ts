import { Router } from "express";
import type { HabitWithStatus, RoznamaState } from "@roznama/shared";
import {
  asyncHandler,
  computeStreak,
  mapDaily,
  mapHabit,
  mapMonthly,
  mapProfile,
  mapTx,
  todayKey,
} from "./helpers.js";

export const stateRouter = Router();

/**
 * GET /api/state — the whole dataset for the signed-in user in one round-trip.
 * Also performs the "new day" rollover: daily tasks carried over from a previous
 * day are reset to not-done so each morning starts fresh.
 */
stateRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    const db = req.db;
    const today = todayKey();

    // Roll over stale daily tasks to today (reset done state).
    await db
      .from("daily_tasks")
      .update({ done: false, day: today })
      .neq("day", today)
      .eq("user_id", req.userId);

    const [daily, monthly, tx, habits, habitLogs, prefs, profile] = await Promise.all([
      db.from("daily_tasks").select("*").order("sort", { ascending: true }),
      db.from("monthly_goals").select("*").order("sort", { ascending: true }),
      db.from("transactions").select("*").order("date", { ascending: false }),
      db.from("habits").select("*").order("sort", { ascending: true }),
      db.from("habit_logs").select("habit_id, day, done"),
      db.from("preferences").select("notif_on").maybeSingle(),
      db.from("profiles").select("*").maybeSingle(),
    ]);

    // Core data must load; surface real failures instead of returning partial state.
    for (const r of [daily, monthly, tx, habits, habitLogs]) {
      if (r.error) throw r.error;
    }
    // prefs/profile are optional (a missing row is fine via maybeSingle); only a
    // genuine query error is logged, then defaulted below.
    if (prefs.error) console.warn("[roznama-api] preferences load error:", prefs.error.message);
    if (profile.error) console.warn("[roznama-api] profile load error:", profile.error.message);

    // Build per-habit done-day sets for streaks + today's status.
    const logsByHabit = new Map<string, Set<string>>();
    for (const log of habitLogs.data ?? []) {
      if (!log.done) continue;
      const set = logsByHabit.get(log.habit_id) ?? new Set<string>();
      set.add(String(log.day));
      logsByHabit.set(log.habit_id, set);
    }

    const habitsWithStatus: HabitWithStatus[] = (habits.data ?? []).map((row) => {
      const h = mapHabit(row);
      const days = logsByHabit.get(h.id) ?? new Set<string>();
      return { ...h, doneToday: days.has(today), streak: computeStreak(days) };
    });

    const state: RoznamaState = {
      daily: (daily.data ?? []).map(mapDaily),
      monthly: (monthly.data ?? []).map(mapMonthly),
      tx: (tx.data ?? []).map(mapTx),
      habits: habitsWithStatus,
      notifOn: Boolean(prefs.data?.notif_on),
      profile: profile.data ? mapProfile(profile.data) : null,
    };
    res.json(state);
  }),
);

stateRouter.put(
  "/preferences",
  asyncHandler(async (req, res) => {
    const notifOn = Boolean(req.body?.notifOn);
    const { error } = await req.db
      .from("preferences")
      .upsert({ user_id: req.userId, notif_on: notifOn, updated_at: new Date().toISOString() });
    if (error) throw error;
    res.json({ notifOn });
  }),
);
