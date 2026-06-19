import type {
  Analytics,
  CategoryBreakdown,
  DailyTask,
  MonthlyGoal,
  Transaction,
} from "@roznama/shared";
import { monthKey } from "./format";

export interface Totals {
  income: number;
  expense: number;
  balance: number;
  dailyPct: number;
  monthlyPct: number;
}

const sameMonth = (iso: string, ref: Date) => {
  const x = new Date(iso);
  return x.getMonth() === ref.getMonth() && x.getFullYear() === ref.getFullYear();
};

export function deriveTotals(
  daily: DailyTask[],
  monthly: MonthlyGoal[],
  tx: Transaction[],
  ref = new Date(),
): Totals {
  const income = tx.filter((t) => t.type === "in" && sameMonth(t.date, ref)).reduce((a, t) => a + t.amount, 0);
  const expense = tx.filter((t) => t.type === "out" && sameMonth(t.date, ref)).reduce((a, t) => a + t.amount, 0);
  const balance = tx.reduce((a, t) => a + (t.type === "in" ? t.amount : -t.amount), 0);
  const dailyPct = daily.length ? (daily.filter((t) => t.done).length / daily.length) * 100 : 0;
  const monthlyPct = monthly.length ? monthly.reduce((a, g) => a + g.progress, 0) / monthly.length : 0;
  return { income, expense, balance, dailyPct, monthlyPct };
}

export function topExpenses(tx: Transaction[], ref = new Date(), n = 3): CategoryBreakdown[] {
  const map = new Map<string, number>();
  tx.filter((t) => t.type === "out" && sameMonth(t.date, ref)).forEach((t) =>
    map.set(t.cat || "غير مصنف", (map.get(t.cat || "غير مصنف") ?? 0) + t.amount),
  );
  return [...map.entries()]
    .map(([cat, amount]) => ({ cat, amount }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, n);
}

/** Build chart-ready analytics from local transactions (offline parity with API). */
export function deriveAnalytics(tx: Transaction[], ref = new Date(), monthsBack = 6): Analytics {
  const month = monthKey(ref);
  const [y, m] = month.split("-").map(Number);
  const daysInMonth = new Date(y, m, 0).getDate();

  const daily = Array.from({ length: daysInMonth }, (_, i) => ({
    date: `${month}-${String(i + 1).padStart(2, "0")}`,
    income: 0,
    expense: 0,
  }));
  const monthsArr = Array.from({ length: monthsBack }, (_, i) => {
    const d = new Date(y, m - 1 - (monthsBack - 1 - i), 1);
    return {
      month: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`,
      income: 0,
      expense: 0,
      net: 0,
    };
  });
  const monthIndex = new Map(monthsArr.map((p, i) => [p.month, i]));
  const catMap = new Map<string, number>();

  for (const t of tx) {
    const dayKey = new Date(t.date).toISOString().slice(0, 10);
    const mKey = dayKey.slice(0, 7);
    const di = Number(dayKey.slice(8, 10)) - 1;
    if (mKey === month && daily[di]) {
      if (t.type === "in") daily[di].income += t.amount;
      else daily[di].expense += t.amount;
    }
    if (monthIndex.has(mKey)) {
      const p = monthsArr[monthIndex.get(mKey)!];
      if (t.type === "in") p.income += t.amount;
      else p.expense += t.amount;
      p.net = p.income - p.expense;
    }
    if (mKey === month && t.type === "out") {
      catMap.set(t.cat || "غير مصنف", (catMap.get(t.cat || "غير مصنف") ?? 0) + t.amount);
    }
  }

  return {
    daily,
    monthly: monthsArr,
    byCategory: [...catMap.entries()]
      .map(([cat, amount]) => ({ cat, amount }))
      .sort((a, b) => b.amount - a.amount),
  };
}

export function computeStreak(log: Record<string, boolean>): number {
  let streak = 0;
  const cursor = new Date();
  const key = () => cursor.toISOString().slice(0, 10);
  if (!log[key()]) cursor.setDate(cursor.getDate() - 1);
  while (log[key()]) {
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}
