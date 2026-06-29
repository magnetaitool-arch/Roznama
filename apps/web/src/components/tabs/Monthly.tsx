import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { RoznamaStore } from "../../hooks/useRoznama";
import { deriveTotals } from "../../lib/derive";
import { fmt, fmtNum, toAr } from "../../lib/format";

export function Monthly({ store }: { store: RoznamaStore }) {
  const [text, setText] = useState("");
  const [target, setTarget] = useState("");
  const avg = Math.round(deriveTotals(store.daily, store.monthly, store.tx).monthlyPct);
  const now = new Date();

  // Quick date presets — fill the (still-editable) target field with an Arabic date.
  const fmtDate = (d: Date) => fmtNum(d, { day: "numeric", month: "long" });
  const presets: { label: string; make: () => Date }[] = [
    { label: "آخر الشهر", make: () => new Date(now.getFullYear(), now.getMonth() + 1, 0) },
    { label: "نص الشهر", make: () => new Date(now.getFullYear(), now.getMonth(), 15) },
    { label: "خلال أسبوع", make: () => new Date(Date.now() + 7 * 86400000) },
    { label: "آخر السنة", make: () => new Date(now.getFullYear(), 11, 31) },
  ];
  const pickDate = (iso: string) => {
    if (!iso) return;
    const [y, m, d] = iso.split("-").map(Number);
    setTarget(fmtDate(new Date(y, m - 1, d)));
  };

  const add = () => {
    store.addMonthly(text, target);
    setText("");
    setTarget("");
  };

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: [0.2, 0.7, 0.2, 1] }}>
      <div style={{ margin: "8px 18px 0", display: "flex", alignItems: "center", justifyContent: "space-between", background: "var(--paper)", border: "1px solid var(--border)", borderRadius: 18, padding: "16px 18px", boxShadow: "var(--shadow-card)" }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: ".14em", color: "var(--red)" }}>أهداف {fmt(new Date(), { month: "long" })}</div>
          <div style={{ fontSize: 14, fontWeight: 700, color: "var(--muted)", marginTop: 3 }}>متوسط الإنجاز</div>
        </div>
        <div style={{ fontSize: 32, fontWeight: 900, color: "var(--green)" }}>{toAr(avg)}٪</div>
      </div>

      <div style={{ display: "flex", gap: 8, margin: "14px 18px 0" }}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="هدف الشهر..."
          style={{ flex: 2, background: "var(--paper)", border: "1px solid var(--border-input)", borderRadius: 13, padding: "13px 15px", fontSize: 15, fontWeight: 600, color: "var(--ink)", textAlign: "right", outline: "none" }}
        />
        <input
          value={target}
          onChange={(e) => setTarget(e.target.value)}
          placeholder="الموعد"
          style={{ flex: 1, minWidth: 0, background: "var(--paper)", border: "1px solid var(--border-input)", borderRadius: 13, padding: "13px 12px", fontSize: 14, fontWeight: 600, color: "var(--ink)", textAlign: "right", outline: "none" }}
        />
        <motion.button whileTap={{ scale: 0.92 }} onClick={add} style={{ width: 50, flex: "none", borderRadius: 13, background: "var(--red)", color: "#FBF5E6", fontSize: 26, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 6px 14px rgba(194,59,46,.3)" }}>
          +
        </motion.button>
      </div>

      {/* Quick date selection — presets + calendar; manual typing above still works */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, margin: "8px 18px 0", alignItems: "center" }}>
        {presets.map((p) => (
          <button
            key={p.label}
            onClick={() => setTarget(fmtDate(p.make()))}
            style={{ background: "var(--paper-sunken)", border: "1px solid var(--border-input)", borderRadius: 999, padding: "6px 12px", fontSize: 12, fontWeight: 700, color: "var(--muted)" }}
          >
            {p.label}
          </button>
        ))}
        <label style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "var(--paper-sunken)", border: "1px solid var(--border-input)", borderRadius: 999, padding: "6px 12px", fontSize: 12, fontWeight: 700, color: "var(--red)", cursor: "pointer" }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="17" rx="2" /><path d="M3 9h18" /><path d="M8 2v4" /><path d="M16 2v4" /></svg>
          تقويم
          <input type="date" onChange={(e) => pickDate(e.target.value)} style={{ position: "absolute", width: 1, height: 1, opacity: 0, pointerEvents: "auto" }} />
        </label>
      </div>

      <AnimatePresence initial={false}>
        {store.monthly.map((g) => (
          <motion.div
            key={g.id}
            layout
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -20 }}
            style={{ margin: "12px 18px 0", background: "var(--paper)", border: "1px solid var(--border)", borderRadius: 16, padding: 16, boxShadow: "0 6px 14px rgba(60,40,15,.05)" }}
          >
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10 }}>
              <span style={{ flex: 1, fontSize: 15, fontWeight: 800, color: "var(--ink)" }}>{g.text}</span>
              <motion.button whileTap={{ scale: 0.82 }} onClick={() => store.deleteMonthly(g.id)} style={{ flex: "none", color: "var(--muted-3)", fontSize: 22, lineHeight: 1 }}>
                ×
              </motion.button>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 7 }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "var(--gold-chip-bg)", borderRadius: 999, padding: "3px 10px", fontSize: 11, fontWeight: 700, color: "var(--gold-deep)" }}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 7v5l3 2" />
                </svg>
                {g.target}
              </span>
            </div>
            <div style={{ marginTop: 13, display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ flex: 1, height: 11, background: "var(--paper-sunken)", borderRadius: 999, overflow: "hidden" }}>
                <motion.div animate={{ width: `${g.progress}%` }} transition={{ duration: 0.6, ease: [0.2, 0.7, 0.2, 1] }} style={{ height: "100%", background: "linear-gradient(90deg,#C99A3B,var(--gold-2))", borderRadius: 999 }} />
              </div>
              <span style={{ fontSize: 13, fontWeight: 900, color: "var(--gold-deep)", minWidth: 38, textAlign: "left" }}>{toAr(Math.round(g.progress))}٪</span>
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 13 }}>
              <motion.button whileTap={{ scale: 0.95 }} onClick={() => store.changeMonthly(g.id, -10)} style={{ flex: 1, border: "1px solid var(--border-input)", borderRadius: 11, padding: "9px 0", fontSize: 13, fontWeight: 800, color: "var(--muted)", background: "var(--paper-sunken-2)" }}>
                − ١٠٪
              </motion.button>
              <motion.button whileTap={{ scale: 0.95 }} onClick={() => store.changeMonthly(g.id, 10)} style={{ flex: 1, border: "1px solid #C7A766", borderRadius: 11, padding: "9px 0", fontSize: 13, fontWeight: 800, color: "#fff", background: "var(--green)" }}>
                + ١٠٪
              </motion.button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
      {store.monthly.length === 0 && (
        <div style={{ margin: "16px 18px", fontSize: 13, color: "var(--muted-2)", textAlign: "center" }}>مفيش أهداف للشهر ده. ضيف هدفك الأول!</div>
      )}
    </motion.div>
  );
}
