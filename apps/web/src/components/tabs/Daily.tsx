import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { RoznamaStore } from "../../hooks/useRoznama";
import { toAr } from "../../lib/format";
import { FocusMode } from "../FocusMode";

export function Daily({ store }: { store: RoznamaStore }) {
  const [text, setText] = useState("");
  const [focusId, setFocusId] = useState<string | null>(null);
  const focusTask = store.daily.find((t) => t.id === focusId) ?? null;
  const done = store.daily.filter((t) => t.done).length;
  const total = store.daily.length;
  const pct = total ? Math.round((done / total) * 100) : 0;
  const allDone = total > 0 && done === total;

  const add = () => {
    store.addDaily(text);
    setText("");
  };

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: [0.2, 0.7, 0.2, 1] }}>
      <div style={{ margin: "8px 18px 0", background: "var(--panel)", borderRadius: 20, padding: 18, boxShadow: "0 12px 26px rgba(34,29,23,.2)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".14em", color: "var(--panel-muted)" }}>إنجاز النهارده</div>
            <div style={{ fontSize: 15, fontWeight: 800, color: "var(--panel-ink)", marginTop: 3 }}>
              خلّصت {toAr(done)} من {toAr(total)}
            </div>
          </div>
          <div style={{ fontSize: 30, fontWeight: 900, color: "var(--gold)" }}>{toAr(pct)}٪</div>
        </div>
        <div style={{ marginTop: 14, height: 12, background: "#39322A", borderRadius: 999, overflow: "hidden" }}>
          <motion.div
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.7, ease: [0.2, 0.7, 0.2, 1] }}
            style={{ height: "100%", background: "linear-gradient(90deg,var(--green),var(--green-3))", borderRadius: 999 }}
          />
        </div>
      </div>

      <AnimatePresence>
        {allDone && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: "auto", marginTop: 12 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            style={{ margin: "0 18px", overflow: "hidden" }}
          >
            <div style={{ background: "var(--green-chip-bg)", border: "1px solid var(--green-chip-border)", borderRadius: 16, padding: "14px 16px", display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ flex: "none", width: 34, height: 34, borderRadius: "50%", background: "var(--green)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12l4 4L19 7" />
                </svg>
              </span>
              <span style={{ fontSize: 14, fontWeight: 800, color: "var(--green)" }}>تم إنجاز كل مهام اليوم.</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ display: "flex", gap: 8, margin: "14px 18px 0" }}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && add()}
          placeholder="ضيف مهمة جديدة..."
          style={{ flex: 1, background: "var(--paper)", border: "1px solid var(--border-input)", borderRadius: 13, padding: "13px 15px", fontSize: 15, fontWeight: 600, color: "var(--ink)", textAlign: "right", outline: "none" }}
        />
        <motion.button whileTap={{ scale: 0.92 }} onClick={add} style={{ width: 50, borderRadius: 13, background: "var(--red)", color: "#FBF5E6", fontSize: 26, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 6px 14px rgba(194,59,46,.3)" }}>
          +
        </motion.button>
      </div>

      <div style={{ marginTop: 4 }}>
        <AnimatePresence initial={false}>
          {store.daily.map((task) => (
            <motion.div
              key={task.id}
              layout
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
              style={{ display: "flex", alignItems: "center", gap: 12, margin: "10px 18px 0", background: "var(--paper)", border: "1px solid var(--border-soft)", borderRadius: 14, padding: 14, boxShadow: "var(--shadow-soft)" }}
            >
              <motion.button
                whileTap={{ scale: 0.86 }}
                onClick={() => store.toggleDaily(task.id)}
                style={{ flex: "none", width: 28, height: 28, borderRadius: 8, border: "2px solid", borderColor: task.done ? "var(--green)" : "var(--border-line)", background: task.done ? "var(--green)" : "var(--paper)", display: "flex", alignItems: "center", justifyContent: "center" }}
              >
                {task.done && (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FBF5E6" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12l4 4L19 7" />
                  </svg>
                )}
              </motion.button>
              <span style={{ flex: 1, fontSize: 15, fontWeight: 600, textDecoration: task.done ? "line-through" : "none", color: task.done ? "var(--muted-3)" : "var(--ink)" }}>
                {task.text}
              </span>
              {!task.done && (
                <motion.button whileTap={{ scale: 0.88 }} onClick={() => setFocusId(task.id)} aria-label="ركّز" style={{ flex: "none", display: "flex", alignItems: "center", justifyContent: "center", width: 30, height: 30, borderRadius: 9, background: "var(--paper-sunken)", color: "var(--red)" }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
                </motion.button>
              )}
              <motion.button whileTap={{ scale: 0.82 }} onClick={() => store.deleteDaily(task.id)} style={{ flex: "none", color: "var(--muted-3)", fontSize: 22, lineHeight: 1, width: 26, height: 26 }}>
                ×
              </motion.button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {focusTask && (
          <FocusMode
            title={focusTask.text}
            onDone={() => store.toggleDaily(focusTask.id)}
            onClose={() => setFocusId(null)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
