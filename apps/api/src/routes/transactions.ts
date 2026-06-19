import { Router } from "express";
import { asyncHandler, mapTx } from "./helpers.js";

export const txRouter = Router();

txRouter.post(
  "/",
  asyncHandler(async (req, res) => {
    const type = req.body?.type === "in" ? "in" : "out";
    const amount = Number(req.body?.amount);
    if (!Number.isFinite(amount) || amount <= 0) {
      return res.status(400).json({ error: "amount must be a positive number" });
    }
    const cat = String(req.body?.cat ?? "").trim() || (type === "in" ? "دخل" : "مصروف");

    const { data, error } = await req.db
      .from("transactions")
      .insert({ user_id: req.userId, type, amount, cat, date: new Date().toISOString() })
      .select("*")
      .single();
    if (error) throw error;
    res.status(201).json(mapTx(data));
  }),
);

txRouter.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    const { error } = await req.db.from("transactions").delete().eq("id", req.params.id);
    if (error) throw error;
    res.status(204).end();
  }),
);
