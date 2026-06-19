import { Router } from "express";
import type { BackupBundle } from "@roznama/shared";
import { asyncHandler, mapDaily, mapHabit, mapMonthly, mapTx } from "./helpers.js";

export const backupRouter = Router();

/** GET /api/backup — full export of the user's data as a JSON bundle. */
backupRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    const [daily, monthly, tx, habits] = await Promise.all([
      req.db.from("daily_tasks").select("*").order("sort"),
      req.db.from("monthly_goals").select("*").order("sort"),
      req.db.from("transactions").select("*").order("date", { ascending: false }),
      req.db.from("habits").select("*").order("sort"),
    ]);
    for (const r of [daily, monthly, tx, habits]) if (r.error) throw r.error;

    const bundle: BackupBundle = {
      version: 1,
      exportedAt: new Date().toISOString(),
      daily: (daily.data ?? []).map(mapDaily),
      monthly: (monthly.data ?? []).map(mapMonthly),
      tx: (tx.data ?? []).map(mapTx),
      habits: (habits.data ?? []).map(mapHabit),
    };
    res.setHeader("Content-Disposition", `attachment; filename="roznama-backup.json"`);
    res.json(bundle);
  }),
);

/**
 * POST /api/backup/restore — import a previously exported bundle.
 * Additive by default; pass `?replace=true` to wipe existing rows first.
 */
backupRouter.post(
  "/restore",
  asyncHandler(async (req, res) => {
    const bundle = req.body as Partial<BackupBundle>;
    if (!bundle || bundle.version !== 1) {
      return res.status(400).json({ error: "Unsupported or missing backup bundle (version 1 expected)" });
    }
    const uid = req.userId;

    if (req.query.replace === "true") {
      await Promise.all([
        req.db.from("daily_tasks").delete().eq("user_id", uid),
        req.db.from("monthly_goals").delete().eq("user_id", uid),
        req.db.from("transactions").delete().eq("user_id", uid),
        req.db.from("habits").delete().eq("user_id", uid),
      ]);
    }

    const inserts: PromiseLike<unknown>[] = [];
    if (bundle.daily?.length) {
      inserts.push(
        req.db.from("daily_tasks").insert(
          bundle.daily.map((d) => ({
            user_id: uid,
            text: d.text,
            done: d.done,
            day: d.day,
            sort: d.sort,
          })),
        ),
      );
    }
    if (bundle.monthly?.length) {
      inserts.push(
        req.db.from("monthly_goals").insert(
          bundle.monthly.map((g) => ({
            user_id: uid,
            text: g.text,
            target: g.target,
            progress: g.progress,
            sort: g.sort,
          })),
        ),
      );
    }
    if (bundle.tx?.length) {
      inserts.push(
        req.db.from("transactions").insert(
          bundle.tx.map((t) => ({
            user_id: uid,
            type: t.type,
            amount: t.amount,
            cat: t.cat,
            date: t.date,
          })),
        ),
      );
    }
    if (bundle.habits?.length) {
      inserts.push(
        req.db.from("habits").insert(
          bundle.habits.map((h) => ({
            user_id: uid,
            name: h.name,
            emoji: h.emoji,
            color: h.color,
            sort: h.sort,
          })),
        ),
      );
    }
    await Promise.all(inserts);
    res.json({ ok: true });
  }),
);
