import { Router } from "express";
import { asyncHandler } from "./helpers.js";

export const adminRouter = Router();

/** Guard: 403 unless the caller's profile has role = 'admin'. RLS still applies. */
adminRouter.use(
  asyncHandler(async (req, res, next) => {
    const { data, error } = await req.db
      .from("profiles")
      .select("role")
      .eq("user_id", req.userId)
      .maybeSingle();
    if (error) throw error;
    if (data?.role !== "admin") return res.status(403).json({ error: "Admin role required" });
    next();
    return;
  }),
);

/**
 * GET /api/admin/overview — platform-wide aggregates for the admin dashboard.
 * Admin-scoped RLS (migration 0002) lets admins read all profiles; private
 * per-user content (tasks, finances) stays owner-only and is never exposed here.
 */
adminRouter.get(
  "/overview",
  asyncHandler(async (req, res) => {
    const profiles = await req.db
      .from("profiles")
      .select("display_name, role, created_at")
      .order("created_at", { ascending: false });
    if (profiles.error) throw profiles.error;

    const rows = profiles.data ?? [];

    // Recent signups (no private content — just name/role/date).
    const recentUsers = rows.slice(0, 25).map((r) => ({
      displayName: (r.display_name as string) || "—",
      role: (r.role as string) ?? "user",
      createdAt: r.created_at as string,
    }));

    // Signups per day for the last 14 days.
    const today = new Date();
    const byDay = new Map<string, number>();
    for (let i = 13; i >= 0; i--) {
      const d = new Date(today.getFullYear(), today.getMonth(), today.getDate() - i);
      byDay.set(d.toISOString().slice(0, 10), 0);
    }
    for (const r of rows) {
      const day = String(r.created_at).slice(0, 10);
      if (byDay.has(day)) byDay.set(day, (byDay.get(day) ?? 0) + 1);
    }
    const signupsByDay = [...byDay.entries()].map(([day, count]) => ({ day, count }));

    const adminCount = rows.filter((r) => r.role === "admin").length;

    res.json({
      userCount: rows.length,
      adminCount,
      newToday: signupsByDay[signupsByDay.length - 1]?.count ?? 0,
      recentUsers,
      signupsByDay,
    });
  }),
);
