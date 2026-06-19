import { motion } from "framer-motion";
import type { RoznamaStore } from "../../hooks/useRoznama";
import type { Tab } from "../../lib/tabs";
import { deriveTotals } from "../../lib/derive";
import { CountUp } from "../CountUp";
import { ProgressRing } from "../ProgressRing";
import { SplitFlapClock } from "../SplitFlapClock";
import { egp, egpShort, fmt, fmtNum, hijri, toAr } from "../../lib/format";

const rise = (delay: number) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.2, 0.7, 0.2, 1] as const, delay },
});

const dot = {
  width: 7,
  height: 7,
  borderRadius: "50%",
  background: "var(--border-line)",
  boxShadow: "inset 0 1px 1px rgba(0,0,0,.18)",
} as const;

export function Dashboard({ store, onGo }: { store: RoznamaStore; onGo: (t: Tab) => void }) {
  const now = new Date();
  const t = deriveTotals(store.daily, store.monthly, store.tx, now);
  const dailyDone = store.daily.filter((x) => x.done).length;
  const dailyTotal = store.daily.length;
  const monthlyAvg = Math.round(t.monthlyPct);

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: [0.2, 0.7, 0.2, 1] }}>
      {/* Tear-off calendar hero */}
      <motion.div
        {...rise(0.02)}
        style={{
          position: "relative",
          margin: "6px 18px 0",
          background: "var(--paper)",
          borderRadius: 22,
          border: "1px solid var(--border)",
          boxShadow: "var(--shadow-hero)",
          overflow: "hidden",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-around", alignItems: "center", height: 18, padding: "0 18px" }}>
          {Array.from({ length: 7 }).map((_, i) => (
            <span key={i} style={dot} />
          ))}
        </div>
        <div style={{ background: "var(--red)", textAlign: "center", padding: "11px 0 13px" }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".22em", color: "#F4C9BC" }}>اليوم</div>
          <div style={{ fontFamily: "'Aref Ruqaa',serif", fontSize: 30, fontWeight: 700, color: "#FCF3E6", lineHeight: 1.1, marginTop: 2 }}>
            {fmt(now, { weekday: "long" })}
          </div>
        </div>
        <div style={{ padding: "22px 14px 10px" }}>
          <SplitFlapClock />
        </div>
        <div style={{ padding: "4px 18px 22px", textAlign: "center" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12 }}>
            <span style={{ flex: 1, height: 1, background: "var(--border-line)" }} />
            <span style={{ fontSize: 19, fontWeight: 800, color: "var(--ink)", whiteSpace: "nowrap" }}>
              {fmtNum(now, { day: "numeric", month: "long", year: "numeric" })}
            </span>
            <span style={{ flex: 1, height: 1, background: "var(--border-line)" }} />
          </div>
          <div
            style={{
              marginTop: 9,
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: "var(--red-soft-bg)",
              border: "1px solid var(--red-soft-border)",
              borderRadius: 999,
              padding: "4px 12px",
            }}
          >
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: ".1em", color: "var(--red-deep)" }}>هجري</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: "var(--red)" }}>{hijri(now)}</span>
          </div>
        </div>
      </motion.div>

      {/* Stat row */}
      <motion.div {...rise(0.12)} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, margin: "14px 18px 0" }}>
        <div style={{ background: "var(--paper)", border: "1px solid var(--border)", borderRadius: 18, padding: "16px 14px", textAlign: "center", boxShadow: "var(--shadow-card)" }}>
          <ProgressRing pct={t.dailyPct}>
            <span style={{ fontSize: 22, fontWeight: 900, color: "var(--ink)", lineHeight: 1 }}>
              <CountUp value={t.dailyPct} format={(n) => toAr(Math.round(n)) + "٪"} />
            </span>
          </ProgressRing>
          <div style={{ marginTop: 10, fontSize: 13, fontWeight: 700, color: "var(--muted)" }}>مهام النهارده</div>
          <div style={{ fontSize: 12, fontWeight: 600, color: "var(--muted-2)", marginTop: 1 }}>
            {toAr(dailyDone)} من {toAr(dailyTotal)} خلصت
          </div>
        </div>
        <div style={{ background: "var(--panel)", borderRadius: 18, padding: "16px 15px", display: "flex", flexDirection: "column", justifyContent: "space-between", boxShadow: "0 8px 18px rgba(34,29,23,.22)" }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".12em", color: "var(--panel-muted)" }}>الرصيد الحالي</div>
            <div style={{ fontSize: 26, fontWeight: 900, color: "var(--panel-ink)", lineHeight: 1.15, marginTop: 8 }}>
              <CountUp value={t.balance} format={egp} />
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
            <div style={{ flex: 1, background: "var(--panel-2)", borderRadius: 10, padding: "7px 8px" }}>
              <div style={{ fontSize: 10, color: "#7FAE96", fontWeight: 700 }}>دخل</div>
              <div style={{ fontSize: 12, color: "var(--green-bright)", fontWeight: 800, marginTop: 1 }}>{egpShort(t.income)}</div>
            </div>
            <div style={{ flex: 1, background: "var(--panel-2)", borderRadius: 10, padding: "7px 8px" }}>
              <div style={{ fontSize: 10, color: "#D38A80", fontWeight: 700 }}>صرف</div>
              <div style={{ fontSize: 12, color: "#E6A79D", fontWeight: 800, marginTop: 1 }}>{egpShort(t.expense)}</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Monthly mini */}
      <motion.button
        {...rise(0.2)}
        whileTap={{ scale: 0.99 }}
        onClick={() => onGo("monthly")}
        style={{
          display: "block",
          width: "calc(100% - 36px)",
          textAlign: "right",
          margin: "14px 18px 0",
          background: "var(--paper)",
          border: "1px solid var(--border)",
          borderRadius: 18,
          padding: 16,
          boxShadow: "var(--shadow-card)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: 14, fontWeight: 800, color: "var(--ink)" }}>أهدافك الشهر ده</span>
          <span style={{ fontSize: 13, fontWeight: 900, color: "var(--green)" }}>{toAr(monthlyAvg)}٪</span>
        </div>
        <div style={{ marginTop: 11, height: 10, background: "var(--paper-sunken)", borderRadius: 999, overflow: "hidden" }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${monthlyAvg}%` }}
            transition={{ duration: 0.9, ease: [0.2, 0.7, 0.2, 1] }}
            style={{ height: "100%", background: "linear-gradient(90deg,var(--green),var(--green-2))", borderRadius: 999 }}
          />
        </div>
        <div style={{ marginTop: 10, fontSize: 12, color: "var(--muted-2)", fontWeight: 600 }}>
          {toAr(store.monthly.length)} هدف نشط · اضغط للتفاصيل ←
        </div>
      </motion.button>

      {/* Today's tasks preview */}
      <motion.div {...rise(0.28)} style={{ margin: "18px 18px 0" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4, padding: "0 2px" }}>
          <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: ".14em", color: "var(--red)" }}>مهام النهارده</span>
          <button onClick={() => onGo("daily")} style={{ fontSize: 12, fontWeight: 700, color: "var(--muted)" }}>
            شوف الكل ←
          </button>
        </div>
        {store.daily.slice(0, 3).map((task) => (
          <div key={task.id} style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 9, background: "var(--paper)", border: "1px solid var(--border-soft)", borderRadius: 14, padding: "12px 14px", boxShadow: "var(--shadow-soft)" }}>
            <motion.button
              whileTap={{ scale: 0.86 }}
              onClick={() => store.toggleDaily(task.id)}
              style={{
                flex: "none",
                width: 26,
                height: 26,
                borderRadius: 8,
                border: "2px solid",
                borderColor: task.done ? "var(--green)" : "var(--border-line)",
                background: task.done ? "var(--green)" : "var(--paper)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {task.done && (
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#FBF5E6" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12l4 4L19 7" />
                </svg>
              )}
            </motion.button>
            <span style={{ flex: 1, fontSize: 15, fontWeight: 600, textDecoration: task.done ? "line-through" : "none", color: task.done ? "var(--muted-3)" : "var(--ink)" }}>
              {task.text}
            </span>
          </div>
        ))}
        {dailyTotal === 0 && (
          <div style={{ marginTop: 9, fontSize: 13, color: "var(--muted-2)", textAlign: "center", padding: 16 }}>
            مفيش مهام. ضيف مهمة من تبويب «يومي».
          </div>
        )}
      </motion.div>

      <div style={{ height: 6 }} />
    </motion.div>
  );
}
