import type {
  Analytics,
  CreateHabitInput,
  CreateMonthlyInput,
  CreateTxInput,
  DailyTask,
  Habit,
  MonthlyGoal,
  MonthlyReport,
  Profile,
  RoznamaState,
  Transaction,
  UpdateDailyInput,
  UpdateMonthlyInput,
  UpdateProfileInput,
} from "@roznama/shared";
import { supabase } from "./supabase";

const BASE = (import.meta.env.VITE_API_BASE as string | undefined) ?? "/api";

async function authHeader(): Promise<Record<string, string>> {
  if (!supabase) return {};
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function req<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(await authHeader()),
      ...(init.headers ?? {}),
    },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? `Request failed (${res.status})`);
  }
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

/** Typed REST client for the Express API. Used only when cloud sync is on. */
export const api = {
  getState: () => req<RoznamaState>("/state"),
  setPreferences: (notifOn: boolean) =>
    req<{ notifOn: boolean }>("/state/preferences", {
      method: "PUT",
      body: JSON.stringify({ notifOn }),
    }),

  addDaily: (text: string) =>
    req<DailyTask>("/daily", { method: "POST", body: JSON.stringify({ text }) }),
  updateDaily: (id: string, patch: UpdateDailyInput) =>
    req<DailyTask>(`/daily/${id}`, { method: "PATCH", body: JSON.stringify(patch) }),
  deleteDaily: (id: string) => req<void>(`/daily/${id}`, { method: "DELETE" }),

  addMonthly: (input: CreateMonthlyInput) =>
    req<MonthlyGoal>("/monthly", { method: "POST", body: JSON.stringify(input) }),
  updateMonthly: (id: string, patch: UpdateMonthlyInput) =>
    req<MonthlyGoal>(`/monthly/${id}`, { method: "PATCH", body: JSON.stringify(patch) }),
  deleteMonthly: (id: string) => req<void>(`/monthly/${id}`, { method: "DELETE" }),

  addTx: (input: CreateTxInput) =>
    req<Transaction>("/transactions", { method: "POST", body: JSON.stringify(input) }),
  deleteTx: (id: string) => req<void>(`/transactions/${id}`, { method: "DELETE" }),

  addHabit: (input: CreateHabitInput) =>
    req<Habit>("/habits", { method: "POST", body: JSON.stringify(input) }),
  deleteHabit: (id: string) => req<void>(`/habits/${id}`, { method: "DELETE" }),
  toggleHabit: (id: string) =>
    req<{ doneToday: boolean }>(`/habits/${id}/toggle`, { method: "POST" }),

  getProfile: () => req<Profile>("/profile"),
  updateProfile: (patch: UpdateProfileInput) =>
    req<Profile>("/profile", { method: "PUT", body: JSON.stringify(patch) }),

  getReport: (month: string) => req<MonthlyReport>(`/reports/monthly?month=${month}`),
  getAnalytics: (month: string, months = 6) =>
    req<Analytics>(`/reports/analytics?month=${month}&months=${months}`),

  /** Trigger a file download of the monthly report. */
  async exportReport(month: string, format: "pdf" | "xlsx"): Promise<Blob> {
    const res = await fetch(`${BASE}/reports/export?month=${month}&format=${format}`, {
      headers: await authHeader(),
    });
    if (!res.ok) throw new Error(`Export failed (${res.status})`);
    return res.blob();
  },

  getBackup: () => req<unknown>("/backup"),

  getAdminOverview: () => req<AdminOverview>("/admin/overview"),
};

export interface AdminOverview {
  userCount: number;
  adminCount: number;
  newToday: number;
  recentUsers: { displayName: string; role: string; createdAt: string }[];
  signupsByDay: { day: string; count: number }[];
}
