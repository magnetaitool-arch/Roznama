import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { RoznamaStore } from "../../hooks/useRoznama";
import { toAr } from "../../lib/format";

const EMOJIS = ["✅", "🕌", "🏃", "📖", "💧", "🧘", "🥗", "😴", "✍️", "💪"];
const COLORS = ["#3E7C5A", "#C23B2E", "#9A7B36", "#5A9B77", "#B0532E"];

export function Habits({ store }: { store: RoznamaStore }) {
  const [name, setName] = useState("");
  const [emoji, setEmoji] = useState("✅");
  const [color, setColor] = useState(COLORS[0]);

  const doneToday = store.habits.filter((h) => h.doneToday).length;

  const add = () => {
    store.addHabit(name, emoji, color);
    setName("");
    setEmoji("✅");
    setColor(COLORS[0]);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: [0.2, 0.7, 0.2, 1] }}>
      <div style={{ margin: "8px 18px 0", display: "flex", alignItems: "center", justifyContent: "space-between", background: "var(--panel)", borderRadius: 18, padding: "16px 18px", boxShadow: "0 12px 26px rgba(34,29,23,.2)" }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".14em", color: "var(--panel-muted)" }}>عادات النهارده</div>
          <div style={{ fontSize: 15, fontWeight: 800, color: "var(--panel-ink)", marginTop: 3 }}>
            {toAr(doneToday)} من {toAr(store.habits.length)} اتعملت
          </div>
        </div>
        <div style={{ fontSize: 30 }}>🔥</div>
      </div>

      {/* Add habit */}
      <div style={{ margin: "14px 18px 0", background: "var(--paper)", border: "1px solid var(--border)", borderRadius: 18, padding: 14, boxShadow: "var(--shadow-card)" }}>
        <div style={{ display: "flex", gap: 8 }}>
          <input value={name} onChange={(e) => setName(e.target.value)} onKeyDown={(e) => e.key === "Enter" && add()} placeholder="عادة جديدة..." style={{ flex: 1, background: "var(--paper-input)", border: "1px solid var(--border-input)", borderRadius: 12, padding: "12px 14px", fontSize: 15, fontWeight: 600, color: "var(--ink)", textAlign: "right", outline: "none" }} />
          <motion.button whileTap={{ scale: 0.92 }} onClick={add} style={{ width: 50, borderRadius: 12, background: "var(--red)", color: "#FBF5E6", fontSize: 26, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 6px 14px rgba(194,59,46,.3)" }}>+</motion.button>
        </div>
        <div style={{ display: "flex", gap: 6, marginTop: 10, flexWrap: "wrap" }}>
          {EMOJIS.map((e) => (
            <button key={e} onClick={() => setEmoji(e)} style={{ width: 34, height: 34, borderRadius: 9, fontSize: 17, background: emoji === e ? "var(--paper-sunken)" : "transparent", border: emoji === e ? "1px solid var(--border-input)" : "1px solid transparent" }}>{e}</button>
          ))}
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
          {COLORS.map((c) => (
            <button key={c} onClick={() => setColor(c)} aria-label={c} style={{ width: 26, height: 26, borderRadius: "50%", background: c, border: color === c ? "3px solid var(--ink)" : "3px solid transparent" }} />
          ))}
        </div>
      </div>

      <AnimatePresence initial={false}>
        {store.habits.map((h) => (
          <motion.div key={h.id} layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -20 }} style={{ display: "flex", alignItems: "center", gap: 12, margin: "10px 18px 0", background: "var(--paper)", border: "1px solid var(--border-soft)", borderRadius: 16, padding: 14, boxShadow: "var(--shadow-soft)" }}>
            <span style={{ flex: "none", width: 44, height: 44, borderRadius: 12, background: `${h.color}1f`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>{h.emoji}</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 15, fontWeight: 800, color: "var(--ink)" }}>{h.name}</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: h.streak > 0 ? "var(--gold-deep)" : "var(--muted-2)", marginTop: 2 }}>
                {h.streak > 0 ? `🔥 ${toAr(h.streak)} يوم متواصل` : "ابدأ السلسلة النهارده"}
              </div>
            </div>
            <motion.button whileTap={{ scale: 0.85 }} onClick={() => store.toggleHabit(h.id)} aria-label="تم" style={{ flex: "none", width: 40, height: 40, borderRadius: "50%", border: "2px solid", borderColor: h.doneToday ? h.color : "var(--border-line)", background: h.doneToday ? h.color : "transparent", display: "flex", alignItems: "center", justifyContent: "center" }}>
              {h.doneToday && <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l4 4L19 7" /></svg>}
            </motion.button>
            <motion.button whileTap={{ scale: 0.82 }} onClick={() => store.deleteHabit(h.id)} style={{ flex: "none", color: "var(--muted-3)", fontSize: 20, lineHeight: 1, width: 20 }}>×</motion.button>
          </motion.div>
        ))}
      </AnimatePresence>
      {store.habits.length === 0 && <div style={{ margin: "16px 18px", fontSize: 13, color: "var(--muted-2)", textAlign: "center" }}>مفيش عادات لسه. ضيف أول عادة وابدأ سلسلتك 🔥</div>}
    </motion.div>
  );
}
