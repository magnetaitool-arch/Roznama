import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { todayKey } from "../lib/format";
import { parseTasks, elUid } from "./parse";
import type { AreaKey, DayReview, ElAbSnapshot, ElTask, Subtask } from "./types";

const LS_KEY = "elab_v1";

function seed(): ElTask[] {
  const day = todayKey();
  const mk = (title: string, area: AreaKey, priority: boolean, subs: string[] = []): ElTask => ({
    id: elUid(),
    title,
    area,
    priority,
    status: "todo",
    estimateMin: 30,
    subtasks: subs.map((t) => ({ id: elUid(), title: t, done: false })),
    lastStep: 0,
    day,
    createdAt: new Date().toISOString(),
  });
  return [
    mk("اخلّص بوست الكلاينت", "work", true, ["اكتب الفكرة", "اعمل الديزاين", "راجع وابعت"]),
    mk("رد على إيميلات Magnet", "work", false),
    mk("تمرين النهاردة", "gym", false),
    mk("اسجّل لحن جديد", "creative", false, ["جهّز البيت", "سجّل الميلودي", "ميكس سريع"]),
  ];
}

function load(): ElAbSnapshot {
  try {
    const raw = JSON.parse(localStorage.getItem(LS_KEY) || "null");
    if (raw && Array.isArray(raw.tasks)) {
      return {
        tasks: raw.tasks,
        reviews: raw.reviews ?? {},
        points: raw.points ?? 0,
        streak: raw.streak ?? 0,
        lastFullDay: raw.lastFullDay ?? null,
      };
    }
  } catch {
    /* ignore */
  }
  return { tasks: seed(), reviews: {}, points: 0, streak: 0, lastFullDay: null };
}

function streakFrom(reviews: Record<string, DayReview>): number {
  let streak = 0;
  const cur = new Date();
  const key = () => cur.toISOString().slice(0, 10);
  if (reviews[key()]?.completionPct !== 100) cur.setDate(cur.getDate() - 1);
  while (reviews[key()]?.completionPct === 100) {
    streak++;
    cur.setDate(cur.getDate() - 1);
  }
  return streak;
}

export interface ElAbStore {
  tasks: ElTask[];
  todayTasks: ElTask[];
  energy: number;
  pointsToday: number;
  streak: number;
  completion: number;
  focus: ElTask | null;
  zeroDayAsked: boolean;

  addFromText: (text: string) => number;
  addTask: (title: string, area: AreaKey) => void;
  toggleTask: (id: string) => void;
  toggleSubtask: (taskId: string, subId: string) => void;
  postpone: (id: string) => void;
  drop: (id: string) => void;
  setEnergy: (n: number) => void;
  startFocus: (id: string) => void;
  stopFocus: () => void;
  dismissZeroDay: (blocker: string) => void;
}

export function useElAb(): ElAbStore {
  const [snap, setSnap] = useState<ElAbSnapshot>(() => load());
  const [focusId, setFocusId] = useState<string | null>(null);
  const [zeroDayAsked, setZeroDayAsked] = useState(false);
  const today = todayKey();

  // Roll forward unfinished tasks from previous days to today.
  const booted = useRef(false);
  useEffect(() => {
    if (booted.current) return;
    booted.current = true;
    setSnap((s) => {
      const tasks = s.tasks.map((t) =>
        t.day !== today && (t.status === "todo" || t.status === "doing" || t.status === "postponed")
          ? { ...t, day: today, status: "todo" as const }
          : t,
      );
      return { ...s, tasks };
    });
  }, [today]);

  const persist = useCallback((s: ElAbSnapshot) => {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(s));
    } catch {
      /* ignore */
    }
  }, []);

  const todayTasks = useMemo(
    () => snap.tasks.filter((t) => t.day === today && t.status !== "dropped"),
    [snap.tasks, today],
  );

  const doneCount = todayTasks.filter((t) => t.status === "done").length;
  const completion = todayTasks.length ? Math.round((doneCount / todayTasks.length) * 100) : 0;
  const pointsToday = todayTasks.reduce(
    (a, t) => a + (t.status === "done" ? (t.priority ? 20 : 10) : 0),
    0,
  );
  const energy = snap.reviews[today]?.energy ?? 0;

  // Keep today's review + streak in sync whenever the day's stats change.
  useEffect(() => {
    setSnap((s) => {
      const prev = s.reviews[today];
      const review: DayReview = {
        day: today,
        energy: prev?.energy ?? 0,
        completionPct: completion,
        points: pointsToday,
        blocker: prev?.blocker,
      };
      const reviews = { ...s.reviews, [today]: review };
      const next = { ...s, reviews, streak: streakFrom(reviews) };
      persist(next);
      return next;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [completion, pointsToday, today]);

  const update = useCallback(
    (fn: (s: ElAbSnapshot) => ElAbSnapshot) => setSnap((s) => {
      const next = fn(s);
      persist(next);
      return next;
    }),
    [persist],
  );

  const addFromText = (text: string): number => {
    const parsed = parseTasks(text);
    if (!parsed.length) return 0;
    const newTasks: ElTask[] = parsed.map((p) => ({
      id: elUid(),
      title: p.title,
      area: p.area,
      priority: p.priority,
      status: "todo",
      estimateMin: p.estimateMin,
      subtasks: p.subtasks,
      lastStep: 0,
      day: today,
      createdAt: new Date().toISOString(),
    }));
    update((s) => ({ ...s, tasks: [...s.tasks, ...newTasks] }));
    return newTasks.length;
  };

  const addTask = (title: string, area: AreaKey) => {
    const t = title.trim();
    if (!t) return;
    update((s) => ({
      ...s,
      tasks: [
        ...s.tasks,
        { id: elUid(), title: t, area, priority: false, status: "todo", estimateMin: 30, subtasks: [], lastStep: 0, day: today, createdAt: new Date().toISOString() },
      ],
    }));
  };

  const toggleTask = (id: string) =>
    update((s) => ({
      ...s,
      tasks: s.tasks.map((t) => (t.id === id ? { ...t, status: t.status === "done" ? "todo" : "done" } : t)),
    }));

  const toggleSubtask = (taskId: string, subId: string) =>
    update((s) => ({
      ...s,
      tasks: s.tasks.map((t) => {
        if (t.id !== taskId) return t;
        const subtasks: Subtask[] = t.subtasks.map((x) => (x.id === subId ? { ...x, done: !x.done } : x));
        const lastStep = subtasks.findIndex((x) => !x.done);
        const allDone = subtasks.length > 0 && subtasks.every((x) => x.done);
        return { ...t, subtasks, lastStep: lastStep === -1 ? subtasks.length : lastStep, status: allDone ? "done" : t.status };
      }),
    }));

  const postpone = (id: string) =>
    update((s) => ({ ...s, tasks: s.tasks.map((t) => (t.id === id ? { ...t, status: "postponed" } : t)) }));

  const drop = (id: string) =>
    update((s) => ({ ...s, tasks: s.tasks.map((t) => (t.id === id ? { ...t, status: "dropped" } : t)) }));

  const setEnergy = (n: number) =>
    update((s) => {
      const prev = s.reviews[today];
      const reviews = { ...s.reviews, [today]: { day: today, energy: n, completionPct: prev?.completionPct ?? completion, points: prev?.points ?? pointsToday, blocker: prev?.blocker } };
      return { ...s, reviews };
    });

  const dismissZeroDay = (blocker: string) => {
    setZeroDayAsked(true);
    update((s) => {
      const prev = s.reviews[today];
      const reviews = { ...s.reviews, [today]: { day: today, energy: prev?.energy ?? 0, completionPct: prev?.completionPct ?? 0, points: prev?.points ?? 0, blocker } };
      return { ...s, reviews };
    });
  };

  const focus = focusId ? snap.tasks.find((t) => t.id === focusId) ?? null : null;

  return {
    tasks: snap.tasks,
    todayTasks,
    energy,
    pointsToday,
    streak: snap.streak,
    completion,
    focus,
    zeroDayAsked,
    addFromText,
    addTask,
    toggleTask,
    toggleSubtask,
    postpone,
    drop,
    setEnergy,
    startFocus: setFocusId,
    stopFocus: () => setFocusId(null),
    dismissZeroDay,
  };
}
