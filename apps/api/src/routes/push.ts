import { Router } from "express";
import { asyncHandler } from "./helpers.js";
import { env } from "../env.js";

export const pushRouter = Router();

/** Expose the public VAPID key so the client can subscribe. */
pushRouter.get(
  "/key",
  asyncHandler(async (_req, res) => {
    res.json({ publicKey: env.vapidPublicKey, enabled: env.pushEnabled() });
  }),
);

/** Save (or refresh) this device's push subscription for the signed-in user. */
pushRouter.post(
  "/subscribe",
  asyncHandler(async (req, res) => {
    const sub = req.body?.subscription ?? req.body;
    const endpoint = sub?.endpoint;
    const p256dh = sub?.keys?.p256dh;
    const auth = sub?.keys?.auth;
    if (!endpoint || !p256dh || !auth) {
      return res.status(400).json({ error: "invalid subscription" });
    }
    const { error } = await req.db
      .from("push_subscriptions")
      .upsert({ user_id: req.userId, endpoint, p256dh, auth }, { onConflict: "endpoint" });
    if (error) throw error;
    res.json({ ok: true });
  }),
);

pushRouter.post(
  "/unsubscribe",
  asyncHandler(async (req, res) => {
    const endpoint = req.body?.endpoint;
    if (!endpoint) return res.status(400).json({ error: "endpoint required" });
    const { error } = await req.db.from("push_subscriptions").delete().eq("endpoint", endpoint);
    if (error) throw error;
    res.json({ ok: true });
  }),
);
