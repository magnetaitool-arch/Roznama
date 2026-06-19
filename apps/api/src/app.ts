import express, { type NextFunction, type Request, type Response } from "express";
import cors from "cors";
import { env } from "./env.js";
import { requireAuth } from "./middleware/auth.js";
import { stateRouter } from "./routes/state.js";
import { dailyRouter } from "./routes/daily.js";
import { monthlyRouter } from "./routes/monthly.js";
import { txRouter } from "./routes/transactions.js";
import { habitsRouter } from "./routes/habits.js";
import { profileRouter } from "./routes/profile.js";
import { reportsRouter } from "./routes/reports.js";
import { backupRouter } from "./routes/backup.js";
import { adminRouter } from "./routes/admin.js";

export function createApp() {
  const app = express();
  app.use(cors({ origin: env.corsOrigin === "*" ? true : env.corsOrigin.split(",") }));
  app.use(express.json({ limit: "5mb" }));

  app.get("/health", (_req, res) => res.json({ ok: true, configured: env.isConfigured() }));
  app.get("/api/health", (_req, res) => res.json({ ok: true, configured: env.isConfigured() }));

  // Everything below requires a valid Supabase access token.
  const api = express.Router();
  api.use(requireAuth);
  api.use("/state", stateRouter);
  api.use("/daily", dailyRouter);
  api.use("/monthly", monthlyRouter);
  api.use("/transactions", txRouter);
  api.use("/habits", habitsRouter);
  api.use("/profile", profileRouter);
  api.use("/reports", reportsRouter);
  api.use("/backup", backupRouter);
  api.use("/admin", adminRouter);
  app.use("/api", api);

  // Central error handler — keeps Supabase/Postgres error shapes consistent.
  app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
    const e = err as { message?: string; code?: string; status?: number };
    console.error("[roznama-api]", e?.code ?? "", e?.message ?? err);
    const status = e?.status ?? (e?.code === "PGRST301" ? 401 : 500);
    res.status(status).json({ error: e?.message ?? "Internal error", code: e?.code });
  });

  return app;
}
