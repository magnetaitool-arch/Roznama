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
 * GET /api/admin/overview — platform-wide aggregates. Readable only by admins;
 * the underlying selects rely on admin-scoped RLS policies (see migration 0002).
 */
adminRouter.get(
  "/overview",
  asyncHandler(async (req, res) => {
    const [users, tx] = await Promise.all([
      req.db.from("profiles").select("user_id", { count: "exact", head: true }),
      req.db.from("transactions").select("amount, type", { count: "exact" }),
    ]);
    if (users.error) throw users.error;

    res.json({
      userCount: users.count ?? 0,
      transactionCount: tx.count ?? 0,
    });
  }),
);
