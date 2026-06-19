export type Tab =
  | "dashboard"
  | "daily"
  | "habits"
  | "monthly"
  | "finance"
  | "analytics"
  | "settings";

/** Tabs shown in the fixed bottom nav (order matters). */
export const NAV_TABS: Tab[] = ["dashboard", "daily", "habits", "monthly", "finance"];

export const TAB_LABELS: Record<Tab, string> = {
  dashboard: "الرئيسية",
  daily: "يومي",
  habits: "عادات",
  monthly: "شهري",
  finance: "المالية",
  analytics: "تحليلات",
  settings: "الإعدادات",
};
