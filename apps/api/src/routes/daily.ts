import { Router } from "express";
import { asyncHandler, mapDaily, todayKey } from "./helpers.js";

export const dailyRouter = Router();

dailyRouter.post(
  "/",
  asyncHandler(async (req, res) => {
    const text = String(req.body?.text ?? "").trim();
    if (!text) return res.status(400).json({ error: "text is required" });

    const { data, error } = await req.db
      .from("daily_tasks")
      .insert({ user_id: req.userId, text, day: todayKey(), sort: Date.now() })
      .select("*")
      .single();
    if (error) throw error;
    res.status(201).json(mapDaily(data));
  }),
);

dailyRouter.patch(
  "/:id",
  asyncHandler(async (req, res) => {
    const patch: Record<string, unknown> = {};
    if (typeof req.body?.done === "boolean") patch.done = req.body.done;
    if (typeof req.body?.text === "string") patch.text = req.body.text.trim();
    if (typeof req.body?.sort === "number") patch.sort = req.body.sort;
    if (!Object.keys(patch).length) return res.status(400).json({ error: "nothing to update" });

    const { data, error } = await req.db
      .from("daily_tasks")
      .update(patch)
      .eq("id", req.params.id)
      .select("*")
      .single();
    if (error) throw error;
    res.json(mapDaily(data));
  }),
);

dailyRouter.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    const { error } = await req.db.from("daily_tasks").delete().eq("id", req.params.id);
    if (error) throw error;
    res.status(204).end();
  }),
);
