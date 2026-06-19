import type { SupabaseClient } from "@supabase/supabase-js";
import type { CategoryBreakdown, MonthlyReport } from "@roznama/shared";

/** YYYY-MM for the given date (defaults to now). */
export function monthKey(d = new Date()): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function monthRange(month: string): { start: string; end: string } {
  const [y, m] = month.split("-").map(Number);
  const start = new Date(Date.UTC(y, m - 1, 1));
  const end = new Date(Date.UTC(y, m, 1));
  return { start: start.toISOString(), end: end.toISOString() };
}

/**
 * Compute a full monthly report for the user: income/expense/net, running
 * balance (all-time), category breakdown, and goal/task completion stats.
 */
export async function buildMonthlyReport(
  db: SupabaseClient,
  month: string,
): Promise<MonthlyReport> {
  const { start, end } = monthRange(month);

  const [monthTx, allTx, monthly, daily] = await Promise.all([
    db.from("transactions").select("type, amount, cat, date").gte("date", start).lt("date", end),
    db.from("transactions").select("type, amount"),
    db.from("monthly_goals").select("progress"),
    db.from("daily_tasks").select("done"),
  ]);

  for (const r of [monthTx, allTx, monthly, daily]) {
    if (r.error) throw r.error;
  }

  const txs = monthTx.data ?? [];
  let income = 0;
  let expense = 0;
  const catMap = new Map<string, number>();
  for (const t of txs) {
    const amt = Number(t.amount);
    if (t.type === "in") income += amt;
    else {
      expense += amt;
      catMap.set(t.cat || "غير مصنف", (catMap.get(t.cat || "غير مصنف") ?? 0) + amt);
    }
  }

  const balance = (allTx.data ?? []).reduce(
    (a, t) => a + (t.type === "in" ? Number(t.amount) : -Number(t.amount)),
    0,
  );

  const byCategory: CategoryBreakdown[] = [...catMap.entries()]
    .map(([cat, amount]) => ({ cat, amount }))
    .sort((a, b) => b.amount - a.amount);

  const goals = monthly.data ?? [];
  const monthlyGoalsAvg = goals.length
    ? Math.round(goals.reduce((a, g) => a + Number(g.progress), 0) / goals.length)
    : 0;

  const tasks = daily.data ?? [];
  const dailyCompletionRate = tasks.length
    ? Math.round((tasks.filter((t) => t.done).length / tasks.length) * 100)
    : 0;

  return {
    month,
    income,
    expense,
    net: income - expense,
    balance,
    topExpenses: byCategory.slice(0, 3),
    byCategory,
    txCount: txs.length,
    dailyCompletionRate,
    monthlyGoalsAvg,
  };
}
