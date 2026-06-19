import { Router } from "express";
import { asyncHandler, mapProfile } from "./helpers.js";

export const profileRouter = Router();

profileRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    const { data, error } = await req.db.from("profiles").select("*").maybeSingle();
    if (error) throw error;
    // Profile is normally created by a DB trigger on signup; upsert as a fallback.
    if (!data) {
      const created = await req.db
        .from("profiles")
        .upsert({ user_id: req.userId })
        .select("*")
        .single();
      if (created.error) throw created.error;
      return res.json(mapProfile(created.data));
    }
    res.json(mapProfile(data));
  }),
);

profileRouter.put(
  "/",
  asyncHandler(async (req, res) => {
    const patch: Record<string, unknown> = { user_id: req.userId };
    if (typeof req.body?.displayName === "string") patch.display_name = req.body.displayName.trim();
    if (["light", "dark", "system"].includes(req.body?.theme)) patch.theme = req.body.theme;

    const { data, error } = await req.db
      .from("profiles")
      .upsert(patch)
      .select("*")
      .single();
    if (error) throw error;
    res.json(mapProfile(data));
  }),
);
