import { lazy, Suspense, useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { useAuth } from "./context/AuthContext";
import { useRoznama } from "./hooks/useRoznama";
import { Header } from "./components/Header";
import { BottomNav } from "./components/BottomNav";
import { Celebration } from "./components/Celebration";
import { AuthScreen } from "./components/auth/AuthScreen";
import { Dashboard } from "./components/tabs/Dashboard";
import { Daily } from "./components/tabs/Daily";
import { Habits } from "./components/tabs/Habits";
import { Monthly } from "./components/tabs/Monthly";
import { Finance } from "./components/tabs/Finance";
import { toAr } from "./lib/format";
import type { Tab } from "./lib/tabs";

// Heavy tabs (Recharts, backup tooling) are split into their own chunks.
const Analytics = lazy(() => import("./components/tabs/Analytics").then((m) => ({ default: m.Analytics })));
const Settings = lazy(() => import("./components/tabs/Settings").then((m) => ({ default: m.Settings })));
const Admin = lazy(() => import("./components/tabs/Admin").then((m) => ({ default: m.Admin })));

const GUEST_KEY = "roznama_guest";

function MainApp() {
  const { authed } = useAuth();
  const store = useRoznama(authed);
  const [tab, setTab] = useState<Tab>("dashboard");
  const [celebrate, setCelebrate] = useState(false);
  const prevAllDone = useRef(false);
  const remTimer = useRef<number>();
  const celTimer = useRef<number>();

  const notify = useCallback((title: string, body: string) => {
    try {
      if ("Notification" in window && Notification.permission === "granted") {
        new Notification(title, { body });
      }
    } catch {
      /* ignore */
    }
  }, []);

  // Celebrate when the last open daily task gets completed.
  useEffect(() => {
    const all = store.daily.length > 0 && store.daily.every((t) => t.done);
    if (all && !prevAllDone.current) {
      setCelebrate(true);
      notify("تمّ إنجاز اليوم", "خلّصت كل مهام النهاردة.");
      window.clearTimeout(celTimer.current);
      celTimer.current = window.setTimeout(() => setCelebrate(false), 3200);
    }
    prevAllDone.current = all;
  }, [store.daily, notify]);

  // Reminder for unfinished tasks (mirrors prototype: fires ~12s after enabling).
  useEffect(() => {
    window.clearTimeout(remTimer.current);
    if (!store.notifOn) return;
    const left = store.daily.filter((t) => !t.done).length;
    if (left === 0) return;
    remTimer.current = window.setTimeout(() => {
      notify("فاكر مهامك؟ 🔔", `لسه عندك ${toAr(left)} مهمة النهارده، يلا نخلّصها 💪`);
    }, 12000);
    return () => window.clearTimeout(remTimer.current);
  }, [store.notifOn, store.daily, notify]);

  const requestNotif = useCallback(() => {
    if (!("Notification" in window)) {
      store.setNotif(true);
      return;
    }
    Notification.requestPermission().then((p) => {
      if (p === "granted") {
        store.setNotif(true);
        notify("روزنامة 🔔", "هنفكّرك بمهامك اللي ناقصة.");
      }
    });
  }, [store, notify]);

  const toggleBell = () => (store.notifOn ? store.setNotif(false) : requestNotif());

  if (store.loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 34, height: 34, borderRadius: "50%", border: "3px solid var(--border)", borderTopColor: "var(--red)", animation: "spin 0.8s linear infinite" }} />
      </div>
    );
  }

  return (
    <div
      dir="rtl"
      style={{
        minHeight: "100vh",
        background: "radial-gradient(130% 60% at 50% 0%, var(--grad-from) 0%, var(--grad-mid) 60%, var(--grad-to) 100%)",
        fontFamily: "'Cairo',sans-serif",
        color: "var(--ink)",
        maxWidth: 460,
        margin: "0 auto",
        position: "relative",
      }}
    >
      <Header tab={tab} bellOn={store.notifOn} onToggleBell={toggleBell} onGo={setTab} />

      {store.error && (
        <div style={{ margin: "0 18px 6px", background: "var(--red-soft-bg)", border: "1px solid var(--red-soft-border)", borderRadius: 14, padding: "12px 14px", display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ flex: 1, fontSize: 13, fontWeight: 700, color: "var(--red)" }}>تعذّر تحميل بياناتك. تأكد من اتصالك وحاول تاني.</span>
          <button onClick={() => store.refresh()} style={{ flex: "none", background: "var(--red)", color: "#fff", borderRadius: 10, padding: "8px 14px", fontSize: 13, fontWeight: 800 }}>إعادة المحاولة</button>
        </div>
      )}

      <main style={{ padding: "0 0 116px" }}>
        <AnimatePresence mode="wait">
          <div key={tab}>
            <Suspense fallback={<div style={{ padding: 40, textAlign: "center", color: "var(--muted-2)" }}>...</div>}>
              {tab === "dashboard" && <Dashboard store={store} onGo={setTab} />}
              {tab === "daily" && <Daily store={store} />}
              {tab === "habits" && <Habits store={store} />}
              {tab === "monthly" && <Monthly store={store} />}
              {tab === "finance" && <Finance store={store} />}
              {tab === "analytics" && <Analytics store={store} />}
              {tab === "settings" && <Settings store={store} onRequestNotif={requestNotif} onGo={setTab} />}
              {tab === "admin" && <Admin store={store} />}
            </Suspense>
          </div>
        </AnimatePresence>
      </main>

      <BottomNav tab={tab} onGo={setTab} />
      <AnimatePresence>{celebrate && <Celebration />}</AnimatePresence>
    </div>
  );
}

export default function App() {
  const { cloudEnabled, authed, loading } = useAuth();
  const [guest, setGuest] = useState(() => localStorage.getItem(GUEST_KEY) === "1");

  const becomeGuest = () => {
    localStorage.setItem(GUEST_KEY, "1");
    setGuest(true);
  };

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 34, height: 34, borderRadius: "50%", border: "3px solid var(--border)", borderTopColor: "var(--red)", animation: "spin 0.8s linear infinite" }} />
      </div>
    );
  }

  // Show auth only when cloud is configured and the user hasn't signed in or opted into guest mode.
  if (cloudEnabled && !authed && !guest) {
    return <AuthScreen onGuest={becomeGuest} />;
  }

  return <MainApp />;
}
