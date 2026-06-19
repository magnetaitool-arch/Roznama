/**
 * Shared domain types for Roznama (روزنامة).
 * Consumed by both the web client and the Express API so request/response
 * shapes stay in sync.
 */

export type TxType = "in" | "out";

export interface DailyTask {
  id: string;
  text: string;
  done: boolean;
  /** ISO date (YYYY-MM-DD) this task's `done` state belongs to. */
  day: string;
  sort: number;
  createdAt: string;
}

export interface MonthlyGoal {
  id: string;
  text: string;
  target: string;
  /** 0–100 */
  progress: number;
  sort: number;
  createdAt: string;
}

export interface Transaction {
  id: string;
  type: TxType;
  /** Positive amount in EGP (piastres are not tracked). */
  amount: number;
  cat: string;
  /** ISO datetime. */
  date: string;
  createdAt: string;
}

/** The full per-user dataset returned by `GET /api/state`. */
export interface RoznamaState {
  daily: DailyTask[];
  monthly: MonthlyGoal[];
  tx: Transaction[];
  habits: HabitWithStatus[];
  notifOn: boolean;
  profile: Profile | null;
}

/* ---------- create / update payloads ---------- */

export interface CreateDailyInput {
  text: string;
}
export interface UpdateDailyInput {
  text?: string;
  done?: boolean;
  sort?: number;
}

export interface CreateMonthlyInput {
  text: string;
  target?: string;
}
export interface UpdateMonthlyInput {
  text?: string;
  target?: string;
  progress?: number;
  sort?: number;
}

export interface CreateTxInput {
  type: TxType;
  amount: number;
  cat?: string;
}

/* ---------- reports / analytics ---------- */

export interface CategoryBreakdown {
  cat: string;
  amount: number;
}

export interface MonthlyReport {
  /** YYYY-MM */
  month: string;
  income: number;
  expense: number;
  net: number;
  balance: number;
  topExpenses: CategoryBreakdown[];
  byCategory: CategoryBreakdown[];
  txCount: number;
  dailyCompletionRate: number;
  monthlyGoalsAvg: number;
}

export type ExportFormat = "pdf" | "xlsx";

/* ---------- habits ---------- */

export interface Habit {
  id: string;
  name: string;
  emoji: string;
  color: string;
  sort: number;
  createdAt: string;
}

/** A habit decorated with today's completion + current streak length. */
export interface HabitWithStatus extends Habit {
  doneToday: boolean;
  streak: number;
}

export interface CreateHabitInput {
  name: string;
  emoji?: string;
  color?: string;
}
export interface UpdateHabitInput {
  name?: string;
  emoji?: string;
  color?: string;
  sort?: number;
}

/* ---------- profile / roles / theme ---------- */

export type UserRole = "user" | "admin";
export type ThemePref = "light" | "dark" | "system";

export interface Profile {
  userId: string;
  displayName: string;
  role: UserRole;
  theme: ThemePref;
  createdAt: string;
}

export interface UpdateProfileInput {
  displayName?: string;
  theme?: ThemePref;
}

/* ---------- analytics / charts ---------- */

export interface DailyPoint {
  /** YYYY-MM-DD */
  date: string;
  income: number;
  expense: number;
}

export interface MonthPoint {
  /** YYYY-MM */
  month: string;
  income: number;
  expense: number;
  net: number;
}

export interface Analytics {
  /** Per-day income/expense for the requested month. */
  daily: DailyPoint[];
  /** Last N months income/expense/net for trend charts. */
  monthly: MonthPoint[];
  byCategory: CategoryBreakdown[];
}

/* ---------- backup ---------- */

export interface BackupBundle {
  version: 1;
  exportedAt: string;
  daily: DailyTask[];
  monthly: MonthlyGoal[];
  tx: Transaction[];
  habits: Habit[];
}
