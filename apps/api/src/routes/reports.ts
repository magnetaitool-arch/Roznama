import { Router } from "express";
import type { Analytics, DailyPoint, MonthPoint } from "@roznama/shared";
import { asyncHandler } from "./helpers.js";
import { buildMonthlyReport, monthKey } from "../services/reports.js";
import { reportToPdf, reportToXlsx } from "../services/export.js";

export const reportsRouter = Router();

const validMonth = (m: unknown): m is string => typeof m === "string" && /^\d{4}-\d{2}$/.test(m);

/** GET /api/reports/monthly?month=YYYY-MM — JSON summary. */
reportsRouter.get(
  "/monthly",
  asyncHandler(async (req, res) => {
    const month = validMonth(req.query.month) ? req.query.month : monthKey();
    res.json(await buildMonthlyReport(req.db, month));
  }),
);

/** GET /api/reports/export?month=YYYY-MM&format=pdf|xlsx — downloadable file. */
reportsRouter.get(
  "/export",
  asyncHandler(async (req, res) => {
    const month = validMonth(req.query.month) ? req.query.month : monthKey();
    const format = req.query.format === "xlsx" ? "xlsx" : "pdf";
    const report = await buildMonthlyReport(req.db, month);

    if (format === "xlsx") {
      const buf = await reportToXlsx(report);
      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      );
      res.setHeader("Content-Disposition", `attachment; filename="roznama-${month}.xlsx"`);
      return res.send(buf);
    }
    const buf = await reportToPdf(report);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="roznama-${month}.pdf"`);
    res.send(buf);
  }),
);

/** GET /api/reports/analytics?month=YYYY-MM&months=6 — chart-ready series. */
reportsRouter.get(
  "/analytics",
  asyncHandler(async (req, res) => {
    const month = validMonth(req.query.month) ? req.query.month : monthKey();
    const monthsBack = Math.min(24, Math.max(1, Number(req.query.months) || 6));

    const { data: txRows, error } = await req.db
      .from("transactions")
      .select("type, amount, cat, date");
    if (error) throw error;
    const txs = txRows ?? [];

    // Per-day series for the selected month.
    const [y, m] = month.split("-").map(Number);
    const daysInMonth = new Date(y, m, 0).getDate();
    const dailyMap = new Map<string, DailyPoint>();
    for (let d = 1; d <= daysInMonth; d++) {
      const key = `${month}-${String(d).padStart(2, "0")}`;
      dailyMap.set(key, { date: key, income: 0, expense: 0 });
    }
    // Per-month series for the trailing window.
    const monthMap = new Map<string, MonthPoint>();
    const now = new Date(y, m - 1, 1);
    for (let i = monthsBack - 1; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      monthMap.set(key, { month: key, income: 0, expense: 0, net: 0 });
    }

    const catMap = new Map<string, number>();
    for (const t of txs) {
      const dt = new Date(t.date as string);
      const dayKey = dt.toISOString().slice(0, 10);
      const mKey = dayKey.slice(0, 7);
      const amt = Number(t.amount);
      if (dailyMap.has(dayKey)) {
        const p = dailyMap.get(dayKey)!;
        if (t.type === "in") p.income += amt;
        else p.expense += amt;
      }
      if (monthMap.has(mKey)) {
        const p = monthMap.get(mKey)!;
        if (t.type === "in") p.income += amt;
        else p.expense += amt;
        p.net = p.income - p.expense;
      }
      if (mKey === month && t.type === "out") {
        const c = (t.cat as string) || "غير مصنف";
        catMap.set(c, (catMap.get(c) ?? 0) + amt);
      }
    }

    const analytics: Analytics = {
      daily: [...dailyMap.values()],
      monthly: [...monthMap.values()],
      byCategory: [...catMap.entries()]
        .map(([cat, amount]) => ({ cat, amount }))
        .sort((a, b) => b.amount - a.amount),
    };
    res.json(analytics);
  }),
);
