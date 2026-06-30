import { Router } from "express";
import webpush from "web-push";
import { asyncHandler } from "./helpers.js";
import { env } from "../env.js";
import { serviceClient } from "../supabase.js";

export const cronRouter = Router();

/**
 * GET/POST /api/cron/reminders — sends a push reminder to users who have
 * notifications on and still have unfinished daily tasks. Intended to be hit by
 * Vercel Cron (which sends `Authorization: Bearer <CRON_SECRET>`). Dedupes to
 * once per day per subscription via `last_reminded`.
 */
const handler = asyncHandler(async (req, res) => {
  // Auth: Vercel Cron sends Authorization: Bearer <CRON_SECRET>.
  const auth = req.headers.authorization ?? "";
  const provided = auth.startsWith("Bearer ") ? auth.slice(7) : (req.headers["x-cron-secret"] as string) ?? "";
  if (!env.cronSecret || provided !== env.cronSecret) {
    return res.status(401).json({ error: "unauthorized" });
  }
  if (!env.pushEnabled()) return res.status(500).json({ error: "push not configured (VAPID keys)" });

  webpush.setVapidDetails(env.vapidSubject, env.vapidPublicKey, env.vapidPrivateKey);
  const db = serviceClient();
  const today = new Date().toISOString().slice(0, 10);

  // Users who opted into notifications.
  const prefs = await db.from("preferences").select("user_id").eq("notif_on", true);
  if (prefs.error) throw prefs.error;
  const optedIn = new Set((prefs.data ?? []).map((p) => p.user_id as string));
  if (optedIn.size === 0) return res.json({ sent: 0, reason: "no opted-in users" });

  // Users who still have an unfinished daily task.
  const open = await db.from("daily_tasks").select("user_id").eq("done", false);
  if (open.error) throw open.error;
  const needsReminder = new Set(
    (open.data ?? []).map((t) => t.user_id as string).filter((u) => optedIn.has(u)),
  );
  if (needsReminder.size === 0) return res.json({ sent: 0, reason: "nobody has open tasks" });

  // Their subscriptions not already reminded today.
  const subs = await db
    .from("push_subscriptions")
    .select("*")
    .in("user_id", [...needsReminder]);
  if (subs.error) throw subs.error;

  let sent = 0;
  let removed = 0;
  const payload = JSON.stringify({
    title: "روزنامة 🔔",
    body: "لسه عندك مهام ناقصة النهاردة — يلا نخلّصها 💪",
    url: "/",
    tag: "roznama-reminder",
  });

  for (const s of subs.data ?? []) {
    if (s.last_reminded === today) continue;
    try {
      await webpush.sendNotification(
        { endpoint: s.endpoint as string, keys: { p256dh: s.p256dh as string, auth: s.auth as string } },
        payload,
      );
      sent++;
      await db.from("push_subscriptions").update({ last_reminded: today }).eq("id", s.id);
    } catch (e) {
      const code = (e as { statusCode?: number }).statusCode;
      if (code === 404 || code === 410) {
        await db.from("push_subscriptions").delete().eq("id", s.id);
        removed++;
      }
    }
  }

  res.json({ sent, removed });
});

cronRouter.get("/reminders", handler);
cronRouter.post("/reminders", handler);
