import type { NextFunction, Request, Response } from "express";
import type { DailyTask, Habit, MonthlyGoal, Profile, Transaction } from "@roznama/shared";

/** Wrap an async route so thrown errors flow to the error middleware. */
export const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>) =>
  (req: Request, res: Response, next: NextFunction) =>
    Promise.resolve(fn(req, res, next)).catch(next);

/* DB row → API shape mappers (snake_case → camelCase). */

export function mapDaily(r: Record<string, unknown>): DailyTask {
  return {
    id: r.id as string,
    text: r.text as string,
    done: r.done as boolean,
    day: String(r.day),
    sort: (r.sort as number) ?? 0,
    createdAt: r.created_at as string,
  };
}

export function mapMonthly(r: Record<string, unknown>): MonthlyGoal {
  return {
    id: r.id as string,
    text: r.text as string,
    target: (r.target as string) ?? "",
    progress: Number(r.progress) ?? 0,
    sort: (r.sort as number) ?? 0,
    createdAt: r.created_at as string,
  };
}

export function mapTx(r: Record<string, unknown>): Transaction {
  return {
    id: r.id as string,
    type: r.type as "in" | "out",
    amount: Number(r.amount),
    cat: (r.cat as string) ?? "",
    date: r.date as string,
    createdAt: r.created_at as string,
  };
}

export function mapHabit(r: Record<string, unknown>): Habit {
  return {
    id: r.id as string,
    name: r.name as string,
    emoji: (r.emoji as string) ?? "✅",
    color: (r.color as string) ?? "#3E7C5A",
    sort: (r.sort as number) ?? 0,
    createdAt: r.created_at as string,
  };
}

export function mapProfile(r: Record<string, unknown>): Profile {
  return {
    userId: r.user_id as string,
    displayName: (r.display_name as string) ?? "",
    role: (r.role as "user" | "admin") ?? "user",
    theme: (r.theme as "light" | "dark" | "system") ?? "system",
    createdAt: r.created_at as string,
  };
}

export const todayKey = () => new Date().toISOString().slice(0, 10);

/** Current consecutive-day streak ending today (or yesterday) from log days. */
export function computeStreak(doneDays: Set<string>): number {
  let streak = 0;
  const cursor = new Date();
  // Allow the streak to "hold" if today isn't logged yet but yesterday was.
  if (!doneDays.has(cursor.toISOString().slice(0, 10))) {
    cursor.setDate(cursor.getDate() - 1);
  }
  while (doneDays.has(cursor.toISOString().slice(0, 10))) {
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}
