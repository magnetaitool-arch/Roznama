import type { DailyTask, MonthlyGoal, Transaction } from "@roznama/shared";
import { todayKey } from "./format";

export const uid = (): string => "id" + Date.now() + Math.floor(Math.random() * 1000);

/** Habit shape used by the local (offline) store — keeps its own completion log. */
export interface LocalHabit {
  id: string;
  name: string;
  emoji: string;
  color: string;
  sort: number;
  createdAt: string;
  /** map of YYYY-MM-DD -> true */
  log: Record<string, boolean>;
}

export function seedDaily(): DailyTask[] {
  const day = todayKey();
  const base = [
    { text: "صلاة الفجر في وقتها", done: true },
    { text: "تمرين ٣٠ دقيقة", done: false },
    { text: "أقرأ ٢٠ صفحة", done: false },
    { text: "أشرب ٨ كباية مياه", done: false },
    { text: "أراجع شغل بكرة", done: false },
  ];
  return base.map((t, i) => ({
    id: uid(),
    text: t.text,
    done: t.done,
    day,
    sort: i,
    createdAt: new Date().toISOString(),
  }));
}

export function seedMonthly(): MonthlyGoal[] {
  const base = [
    { text: "أخلّص كورس الـ React", progress: 60, target: "٣٠ يونيو" },
    { text: "أوفّر ٥٠٠٠ جنيه", progress: 35, target: "آخر الشهر" },
    { text: "أقرأ كتابين", progress: 50, target: "الشهر ده" },
  ];
  return base.map((g, i) => ({
    id: uid(),
    text: g.text,
    target: g.target,
    progress: g.progress,
    sort: i,
    createdAt: new Date().toISOString(),
  }));
}

export function seedTx(): Transaction[] {
  const d = new Date();
  const iso = (off: number) =>
    new Date(d.getFullYear(), d.getMonth(), Math.max(1, d.getDate() - off)).toISOString();
  const base: Array<Pick<Transaction, "type" | "amount" | "cat"> & { off: number }> = [
    { type: "in", amount: 18000, cat: "المرتب", off: 8 },
    { type: "out", amount: 3200, cat: "إيجار", off: 7 },
    { type: "out", amount: 1450, cat: "أكل", off: 5 },
    { type: "in", amount: 2500, cat: "شغل حر", off: 3 },
    { type: "out", amount: 600, cat: "مواصلات", off: 2 },
    { type: "out", amount: 900, cat: "فواتير", off: 1 },
  ];
  return base.map((t) => ({
    id: uid(),
    type: t.type,
    amount: t.amount,
    cat: t.cat,
    date: iso(t.off),
    createdAt: new Date().toISOString(),
  }));
}

export function seedHabits(): LocalHabit[] {
  const t = todayKey();
  const y = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  const base = [
    { name: "صلاة الفجر", emoji: "🕌", color: "#3E7C5A" },
    { name: "تمرين", emoji: "🏃", color: "#C23B2E" },
    { name: "قراءة", emoji: "📖", color: "#9A7B36" },
    { name: "مياه", emoji: "💧", color: "#3E7C5A" },
  ];
  return base.map((h, i) => ({
    id: uid(),
    name: h.name,
    emoji: h.emoji,
    color: h.color,
    sort: i,
    createdAt: new Date().toISOString(),
    log: i < 2 ? { [t]: true, [y]: true } : { [y]: true },
  }));
}
