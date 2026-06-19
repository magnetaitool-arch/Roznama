import { useCallback, useEffect, useRef, useState } from "react";
import type {
  DailyTask,
  HabitWithStatus,
  MonthlyGoal,
  Transaction,
  UserRole,
} from "@roznama/shared";
import { api } from "../lib/api";
import { computeStreak } from "../lib/derive";
import { todayKey } from "../lib/format";
import {
  type LocalHabit,
  seedDaily,
  seedHabits,
  seedMonthly,
  seedTx,
  uid,
} from "../lib/seed";

const LS_KEY = "roznama_v2";

type Mode = "cloud" | "local";

interface LocalSnapshot {
  daily: DailyTask[];
  monthly: MonthlyGoal[];
  tx: Transaction[];
  habits: LocalHabit[];
  notifOn: boolean;
}

export interface RoznamaStore {
  loading: boolean;
  mode: Mode;
  daily: DailyTask[];
  monthly: MonthlyGoal[];
  tx: Transaction[];
  habits: HabitWithStatus[];
  notifOn: boolean;
  displayName: string;
  role: UserRole;

  addDaily: (text: string) => void;
  toggleDaily: (id: string) => void;
  deleteDaily: (id: string) => void;

  addMonthly: (text: string, target: string) => void;
  changeMonthly: (id: string, delta: number) => void;
  deleteMonthly: (id: string) => void;

  addTx: (type: "in" | "out", amount: number, cat: string) => void;
  deleteTx: (id: string) => void;

  addHabit: (name: string, emoji: string, color: string) => void;
  toggleHabit: (id: string) => void;
  deleteHabit: (id: string) => void;

  setNotif: (on: boolean) => void;
  refresh: () => void;
}

const statusFromLocal = (h: LocalHabit): HabitWithStatus => ({
  id: h.id,
  name: h.name,
  emoji: h.emoji,
  color: h.color,
  sort: h.sort,
  createdAt: h.createdAt,
  doneToday: !!h.log[todayKey()],
  streak: computeStreak(h.log),
});

function loadLocal(): LocalSnapshot {
  try {
    const raw = JSON.parse(localStorage.getItem(LS_KEY) || "null");
    if (raw && raw.daily) {
      return {
        daily: raw.daily,
        monthly: raw.monthly ?? seedMonthly(),
        tx: raw.tx ?? seedTx(),
        habits: raw.habits ?? seedHabits(),
        notifOn: !!raw.notifOn,
      };
    }
  } catch {
    /* ignore */
  }
  return { daily: seedDaily(), monthly: seedMonthly(), tx: seedTx(), habits: seedHabits(), notifOn: false };
}

/**
 * Offline-first data store. Runs entirely on localStorage when not signed in,
 * and mirrors every mutation to the Express/Supabase API when `authed` is true.
 */
export function useRoznama(authed: boolean): RoznamaStore {
  const mode: Mode = authed ? "cloud" : "local";
  const [loading, setLoading] = useState(authed);
  const [daily, setDaily] = useState<DailyTask[]>([]);
  const [monthly, setMonthly] = useState<MonthlyGoal[]>([]);
  const [tx, setTx] = useState<Transaction[]>([]);
  const [localHabits, setLocalHabits] = useState<LocalHabit[]>([]);
  const [cloudHabits, setCloudHabits] = useState<HabitWithStatus[]>([]);
  const [notifOn, setNotifOn] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [role, setRole] = useState<UserRole>("user");

  const habits = mode === "cloud" ? cloudHabits : localHabits.map(statusFromLocal);

  // Persist local snapshot whenever it changes (local mode only).
  const saveLocal = useCallback(
    (snap: Partial<LocalSnapshot>) => {
      if (mode !== "local") return;
      const current: LocalSnapshot = {
        daily,
        monthly,
        tx,
        habits: localHabits,
        notifOn,
        ...snap,
      };
      try {
        localStorage.setItem(LS_KEY, JSON.stringify(current));
      } catch {
        /* ignore quota */
      }
    },
    [mode, daily, monthly, tx, localHabits, notifOn],
  );

  const refresh = useCallback(async () => {
    if (mode !== "cloud") return;
    setLoading(true);
    try {
      const s = await api.getState();
      setDaily(s.daily);
      setMonthly(s.monthly);
      setTx(s.tx);
      setCloudHabits(s.habits);
      setNotifOn(s.notifOn);
      setDisplayName(s.profile?.displayName ?? "");
      setRole(s.profile?.role ?? "user");
    } catch (e) {
      console.error("[roznama] failed to load cloud state", e);
    } finally {
      setLoading(false);
    }
  }, [mode]);

  // Initial hydration.
  const booted = useRef(false);
  useEffect(() => {
    booted.current = false;
    if (mode === "cloud") {
      void refresh();
    } else {
      const snap = loadLocal();
      const today = todayKey();
      const rolled = snap.daily.map((t) => (t.day !== today ? { ...t, done: false, day: today } : t));
      setDaily(rolled);
      setMonthly(snap.monthly);
      setTx(snap.tx);
      setLocalHabits(snap.habits);
      setNotifOn(snap.notifOn);
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  /* ---------------- daily ---------------- */
  const addDaily = (text: string) => {
    const t = text.trim();
    if (!t) return;
    if (mode === "cloud") {
      const tmp: DailyTask = { id: uid(), text: t, done: false, day: todayKey(), sort: Date.now(), createdAt: "" };
      setDaily((d) => [...d, tmp]);
      api.addDaily(t).then((real) => setDaily((d) => d.map((x) => (x.id === tmp.id ? real : x)))).catch(console.error);
    } else {
      const next = [...daily, { id: uid(), text: t, done: false, day: todayKey(), sort: daily.length, createdAt: new Date().toISOString() }];
      setDaily(next);
      saveLocal({ daily: next });
    }
  };
  const toggleDaily = (id: string) => {
    const next = daily.map((t) => (t.id === id ? { ...t, done: !t.done } : t));
    setDaily(next);
    if (mode === "cloud") {
      const target = next.find((t) => t.id === id);
      if (target) api.updateDaily(id, { done: target.done }).catch(console.error);
    } else saveLocal({ daily: next });
  };
  const deleteDaily = (id: string) => {
    const next = daily.filter((t) => t.id !== id);
    setDaily(next);
    if (mode === "cloud") api.deleteDaily(id).catch(console.error);
    else saveLocal({ daily: next });
  };

  /* ---------------- monthly ---------------- */
  const addMonthly = (text: string, target: string) => {
    const t = text.trim();
    if (!t) return;
    const tg = target.trim() || "الشهر ده";
    if (mode === "cloud") {
      api.addMonthly({ text: t, target: tg }).then((g) => setMonthly((m) => [...m, g])).catch(console.error);
    } else {
      const next = [...monthly, { id: uid(), text: t, target: tg, progress: 0, sort: monthly.length, createdAt: new Date().toISOString() }];
      setMonthly(next);
      saveLocal({ monthly: next });
    }
  };
  const changeMonthly = (id: string, delta: number) => {
    const next = monthly.map((g) =>
      g.id === id ? { ...g, progress: Math.max(0, Math.min(100, g.progress + delta)) } : g,
    );
    setMonthly(next);
    if (mode === "cloud") {
      const target = next.find((g) => g.id === id);
      if (target) api.updateMonthly(id, { progress: target.progress }).catch(console.error);
    } else saveLocal({ monthly: next });
  };
  const deleteMonthly = (id: string) => {
    const next = monthly.filter((g) => g.id !== id);
    setMonthly(next);
    if (mode === "cloud") api.deleteMonthly(id).catch(console.error);
    else saveLocal({ monthly: next });
  };

  /* ---------------- finance ---------------- */
  const addTx = (type: "in" | "out", amount: number, cat: string) => {
    if (!amount || amount <= 0) return;
    const c = cat.trim() || (type === "in" ? "دخل" : "مصروف");
    if (mode === "cloud") {
      api.addTx({ type, amount, cat: c }).then((t) => setTx((all) => [t, ...all])).catch(console.error);
    } else {
      const t: Transaction = { id: uid(), type, amount, cat: c, date: new Date().toISOString(), createdAt: new Date().toISOString() };
      const next = [t, ...tx];
      setTx(next);
      saveLocal({ tx: next });
    }
  };
  const deleteTx = (id: string) => {
    const next = tx.filter((t) => t.id !== id);
    setTx(next);
    if (mode === "cloud") api.deleteTx(id).catch(console.error);
    else saveLocal({ tx: next });
  };

  /* ---------------- habits ---------------- */
  const addHabit = (name: string, emoji: string, color: string) => {
    const n = name.trim();
    if (!n) return;
    if (mode === "cloud") {
      api.addHabit({ name: n, emoji, color })
        .then((h) => setCloudHabits((all) => [...all, { ...h, doneToday: false, streak: 0 }]))
        .catch(console.error);
    } else {
      const next = [...localHabits, { id: uid(), name: n, emoji, color, sort: localHabits.length, createdAt: new Date().toISOString(), log: {} }];
      setLocalHabits(next);
      saveLocal({ habits: next });
    }
  };
  const toggleHabit = (id: string) => {
    if (mode === "cloud") {
      // optimistic flip, then reconcile streak from server
      setCloudHabits((all) => all.map((h) => (h.id === id ? { ...h, doneToday: !h.doneToday } : h)));
      api.toggleHabit(id).then(() => refresh()).catch(console.error);
    } else {
      const t = todayKey();
      const next = localHabits.map((h) => {
        if (h.id !== id) return h;
        const log = { ...h.log };
        if (log[t]) delete log[t];
        else log[t] = true;
        return { ...h, log };
      });
      setLocalHabits(next);
      saveLocal({ habits: next });
    }
  };
  const deleteHabit = (id: string) => {
    if (mode === "cloud") {
      setCloudHabits((all) => all.filter((h) => h.id !== id));
      api.deleteHabit(id).catch(console.error);
    } else {
      const next = localHabits.filter((h) => h.id !== id);
      setLocalHabits(next);
      saveLocal({ habits: next });
    }
  };

  const setNotif = (on: boolean) => {
    setNotifOn(on);
    if (mode === "cloud") api.setPreferences(on).catch(console.error);
    else saveLocal({ notifOn: on });
  };

  return {
    loading,
    mode,
    daily,
    monthly,
    tx,
    habits,
    notifOn,
    displayName,
    role,
    addDaily,
    toggleDaily,
    deleteDaily,
    addMonthly,
    changeMonthly,
    deleteMonthly,
    addTx,
    deleteTx,
    addHabit,
    toggleHabit,
    deleteHabit,
    setNotif,
    refresh,
  };
}
