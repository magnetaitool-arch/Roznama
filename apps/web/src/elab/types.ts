/** Domain types for the الأب (El-Ab) module — a personal operating system. */

export type AreaKey = "work" | "gym" | "creative";

export interface Area {
  key: AreaKey;
  name: string;
  emoji: string;
  color: string;
}

export type TaskStatus = "todo" | "doing" | "done" | "postponed" | "dropped";

export interface Subtask {
  id: string;
  title: string;
  done: boolean;
}

export interface ElTask {
  id: string;
  title: string;
  area: AreaKey;
  priority: boolean;
  status: TaskStatus;
  estimateMin: number;
  subtasks: Subtask[];
  /** Index of the next subtask to resume from. */
  lastStep: number;
  day: string; // YYYY-MM-DD this task is scheduled for
  createdAt: string;
}

export interface DayReview {
  day: string;
  energy: number; // 1–10
  completionPct: number;
  points: number;
  blocker?: string;
  note?: string;
}

export interface ElAbSnapshot {
  tasks: ElTask[];
  reviews: Record<string, DayReview>; // keyed by day
  points: number;
  streak: number;
  lastFullDay: string | null; // last day reached 100%
}

/** Points rules (from the spec). */
export const POINTS = {
  task: 10,
  priorityTask: 20,
  habit: 5,
  dropped: -10,
  postponed: 0,
} as const;

export const AREAS: Record<AreaKey, Area> = {
  work: { key: "work", name: "شغل / Magnet", emoji: "🟥", color: "#C1272D" },
  gym: { key: "gym", name: "جيم / صحة", emoji: "🟩", color: "#2E7D52" },
  creative: { key: "creative", name: "إبداع / مزاج", emoji: "🟨", color: "#E0A100" },
};

export const AREA_ORDER: AreaKey[] = ["work", "gym", "creative"];
