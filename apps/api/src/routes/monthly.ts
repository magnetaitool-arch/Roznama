import { Router } from "express";
import { asyncHandler, mapMonthly } from "./helpers.js";

export const monthlyRouter = Router();

monthlyRouter.post(
  "/",
  asyncHandler(async (req, res) => {
    const text = String(req.body?.text ?? "").trim();
    if (!text) return res.status(400).json({ error: "text is required" });
    const target = String(req.body?.target ?? "").trim() || "الشهر ده";

    const { data, error } = await req.db
      .from("monthly_goals")
      .insert({ user_id: req.userId, text, target, progress: 0, sort: Date.now() })
      .select("*")
      .single();
    if (error) throw error;
    res.status(201).json(mapMonthly(data));
  }),
);

monthlyRouter.patch(
  "/:id",
  asyncHandler(async (req, res) => {
    const patch: Record<string, unknown> = {};
    if (typeof req.body?.text === "string") patch.text = req.body.text.trim();
    if (typeof req.body?.target === "string") patch.target = req.body.target.trim();
    if (typeof req.body?.progress === "number") {
      patch.progress = Math.max(0, Math.min(100, Math.round(req.body.progress)));
    }
    if (typeof req.body?.sort === "number") patch.sort = req.body.sort;
    if (!Object.keys(patch).length) return res.status(400).json({ error: "nothing to update" });

    const { data, error } = await req.db
      .from("monthly_goals")
      .update(patch)
      .eq("id", req.params.id)
      .select("*")
      .single();
    if (error) throw error;
    res.json(mapMonthly(data));
  }),
);

monthlyRouter.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    const { error } = await req.db.from("monthly_goals").delete().eq("id", req.params.id);
    if (error) throw error;
    res.status(204).end();
  }),
);
