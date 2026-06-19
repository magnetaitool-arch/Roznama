import { Router } from "express";
import { asyncHandler, mapHabit, todayKey } from "./helpers.js";

export const habitsRouter = Router();

habitsRouter.post(
  "/",
  asyncHandler(async (req, res) => {
    const name = String(req.body?.name ?? "").trim();
    if (!name) return res.status(400).json({ error: "name is required" });
    const emoji = String(req.body?.emoji ?? "✅").slice(0, 8) || "✅";
    const color = String(req.body?.color ?? "#3E7C5A");

    const { data, error } = await req.db
      .from("habits")
      .insert({ user_id: req.userId, name, emoji, color, sort: Date.now() })
      .select("*")
      .single();
    if (error) throw error;
    res.status(201).json(mapHabit(data));
  }),
);

habitsRouter.patch(
  "/:id",
  asyncHandler(async (req, res) => {
    const patch: Record<string, unknown> = {};
    for (const k of ["name", "emoji", "color"] as const) {
      if (typeof req.body?.[k] === "string") patch[k] = req.body[k].trim();
    }
    if (typeof req.body?.sort === "number") patch.sort = req.body.sort;
    if (!Object.keys(patch).length) return res.status(400).json({ error: "nothing to update" });

    const { data, error } = await req.db
      .from("habits")
      .update(patch)
      .eq("id", req.params.id)
      .select("*")
      .single();
    if (error) throw error;
    res.json(mapHabit(data));
  }),
);

habitsRouter.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    const { error } = await req.db.from("habits").delete().eq("id", req.params.id);
    if (error) throw error;
    res.status(204).end();
  }),
);

/** Toggle today's completion for a habit (idempotent upsert/delete). */
habitsRouter.post(
  "/:id/toggle",
  asyncHandler(async (req, res) => {
    const day = todayKey();
    const habitId = req.params.id;
    const existing = await req.db
      .from("habit_logs")
      .select("id")
      .eq("habit_id", habitId)
      .eq("day", day)
      .maybeSingle();

    if (existing.data) {
      const { error } = await req.db.from("habit_logs").delete().eq("id", existing.data.id);
      if (error) throw error;
      return res.json({ doneToday: false });
    }
    const { error } = await req.db
      .from("habit_logs")
      .insert({ user_id: req.userId, habit_id: habitId, day, done: true });
    if (error) throw error;
    res.json({ doneToday: true });
  }),
);
