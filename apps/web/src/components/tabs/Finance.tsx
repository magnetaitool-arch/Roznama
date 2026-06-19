import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { RoznamaStore } from "../../hooks/useRoznama";
import { deriveTotals, topExpenses } from "../../lib/derive";
import { CountUp } from "../CountUp";
import { egp, fmtNum } from "../../lib/format";

export function Finance({ store }: { store: RoznamaStore }) {
  const [type, setType] = useState<"in" | "out">("out");
  const [amount, setAmount] = useState("");
  const [cat, setCat] = useState("");
  const t = deriveTotals(store.daily, store.monthly, store.tx);
  const cats = topExpenses(store.tx);
  const maxCat = cats.length ? cats[0].amount : 1;

  const segActive: React.CSSProperties = { background: "var(--paper-input)", color: "var(--red)", boxShadow: "0 2px 6px rgba(60,40,15,.1)" };
  const segIdle: React.CSSProperties = { background: "transparent", color: "var(--muted-2)" };

  const add = () => {
    const n = parseFloat(amount);
    if (!n || n <= 0) return;
    store.addTx(type, n, cat);
    setAmount("");
    setCat("");
  };

  const sorted = [...store.tx].sort((a, b) => +new Date(b.date) - +new Date(a.date));

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: [0.2, 0.7, 0.2, 1] }}>
      <div style={{ margin: "8px 18px 0", background: "var(--panel)", borderRadius: 22, padding: 20, boxShadow: "0 14px 30px rgba(34,29,23,.24)", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -30, left: -20, fontFamily: "'Aref Ruqaa',serif", fontSize: 120, color: "rgba(239,199,94,.06)", lineHeight: 1 }}>ج</div>
        <div style={{ position: "relative" }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".16em", color: "var(--panel-muted)" }}>الرصيد الحالي</div>
          <div style={{ fontSize: 38, fontWeight: 900, color: "var(--panel-ink)", lineHeight: 1.1, marginTop: 6 }}>
            <CountUp value={t.balance} format={egp} />
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
            <div style={{ flex: 1, background: "var(--panel-2)", borderRadius: 13, padding: "11px 12px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "#7FAE96", fontWeight: 700 }}>
                <span style={{ width: 18, height: 18, borderRadius: "50%", background: "#234034", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#9FD3BB" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14" /><path d="M5 12l7 7 7-7" /></svg>
                </span>
                دخل الشهر
              </div>
              <div style={{ fontSize: 16, color: "var(--green-bright)", fontWeight: 900, marginTop: 6 }}>{egp(t.income)}</div>
            </div>
            <div style={{ flex: 1, background: "var(--panel-2)", borderRadius: 13, padding: "11px 12px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "#D38A80", fontWeight: 700 }}>
                <span style={{ width: 18, height: 18, borderRadius: "50%", background: "#402420", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#E6A79D" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19V5" /><path d="M5 12l7-7 7 7" /></svg>
                </span>
                صرف الشهر
              </div>
              <div style={{ fontSize: 16, color: "#E6A79D", fontWeight: 900, marginTop: 6 }}>{egp(t.expense)}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Add transaction */}
      <div style={{ margin: "14px 18px 0", background: "var(--paper)", border: "1px solid var(--border)", borderRadius: 18, padding: 14, boxShadow: "var(--shadow-card)" }}>
        <div style={{ display: "flex", background: "var(--paper-sunken)", borderRadius: 12, padding: 4, gap: 4 }}>
          <motion.button whileTap={{ scale: 0.97 }} onClick={() => setType("out")} style={{ flex: 1, borderRadius: 9, padding: "9px 0", fontSize: 13, fontWeight: 800, ...(type === "out" ? segActive : segIdle) }}>مصروف</motion.button>
          <motion.button whileTap={{ scale: 0.97 }} onClick={() => setType("in")} style={{ flex: 1, borderRadius: 9, padding: "9px 0", fontSize: 13, fontWeight: 800, ...(type === "in" ? segActive : segIdle) }}>دخل</motion.button>
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
          <input value={amount} onChange={(e) => setAmount(e.target.value)} type="number" inputMode="numeric" placeholder="المبلغ (ج.م)" style={{ flex: 1, minWidth: 0, background: "var(--paper-input)", border: "1px solid var(--border-input)", borderRadius: 12, padding: "12px 14px", fontSize: 15, fontWeight: 700, color: "var(--ink)", textAlign: "right", outline: "none" }} />
          <input value={cat} onChange={(e) => setCat(e.target.value)} placeholder="البند" style={{ flex: 1, minWidth: 0, background: "var(--paper-input)", border: "1px solid var(--border-input)", borderRadius: 12, padding: "12px 14px", fontSize: 15, fontWeight: 600, color: "var(--ink)", textAlign: "right", outline: "none" }} />
        </div>
        <motion.button whileTap={{ scale: 0.98 }} onClick={add} style={{ width: "100%", marginTop: 10, borderRadius: 12, background: "var(--red)", color: "#FBF5E6", padding: "13px 0", fontSize: 15, fontWeight: 800, boxShadow: "0 6px 14px rgba(194,59,46,.28)" }}>أضف الحركة</motion.button>
      </div>

      {cats.length > 0 && (
        <div style={{ margin: "14px 18px 0", background: "var(--paper)", border: "1px solid var(--border)", borderRadius: 18, padding: 16, boxShadow: "0 6px 14px rgba(60,40,15,.05)" }}>
          <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: ".14em", color: "var(--red)", marginBottom: 12 }}>أكبر بنود الصرف</div>
          {cats.map((c) => (
            <div key={c.cat} style={{ marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, fontWeight: 700, color: "var(--ink)", marginBottom: 5 }}>
                <span>{c.cat}</span>
                <span style={{ color: "var(--muted)" }}>{egp(c.amount)}</span>
              </div>
              <div style={{ height: 9, background: "var(--paper-sunken)", borderRadius: 999, overflow: "hidden" }}>
                <motion.div animate={{ width: `${Math.round((c.amount / maxCat) * 100)}%` }} transition={{ duration: 0.6, ease: [0.2, 0.7, 0.2, 1] }} style={{ height: "100%", background: "linear-gradient(90deg,var(--red),#D9685C)", borderRadius: 999 }} />
              </div>
            </div>
          ))}
        </div>
      )}

      <div style={{ margin: "18px 18px 0" }}>
        <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: ".14em", color: "var(--red)", marginBottom: 4, padding: "0 2px" }}>آخر الحركات</div>
        <AnimatePresence initial={false}>
          {sorted.map((x) => (
            <motion.div key={x.id} layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -20 }} style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 9, background: "var(--paper)", border: "1px solid var(--border-soft)", borderRadius: 14, padding: "12px 14px", boxShadow: "var(--shadow-soft)" }}>
              <span style={{ flex: "none", width: 38, height: 38, borderRadius: 11, background: x.type === "in" ? "var(--green-chip-bg)" : "var(--red-soft-bg)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {x.type === "in" ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14" /><path d="M5 12l7 7 7-7" /></svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--red)" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19V5" /><path d="M5 12l7-7 7 7" /></svg>
                )}
              </span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 800, color: "var(--ink)" }}>{x.cat}</div>
                <div style={{ fontSize: 11, fontWeight: 600, color: "var(--muted-2)", marginTop: 1 }}>{fmtNum(new Date(x.date), { weekday: "short", day: "numeric", month: "short" })}</div>
              </div>
              <span style={{ fontSize: 14, fontWeight: 900, color: x.type === "in" ? "var(--green)" : "var(--red)", whiteSpace: "nowrap" }}>
                {(x.type === "in" ? "+ " : "− ") + egp(x.amount)}
              </span>
              <motion.button whileTap={{ scale: 0.82 }} onClick={() => store.deleteTx(x.id)} style={{ flex: "none", color: "var(--muted-3)", fontSize: 20, lineHeight: 1, width: 22 }}>×</motion.button>
            </motion.div>
          ))}
        </AnimatePresence>
        {sorted.length === 0 && <div style={{ marginTop: 9, fontSize: 13, color: "var(--muted-2)", textAlign: "center", padding: 16 }}>مفيش حركات لسه. ابدأ بإضافة دخل أو مصروف.</div>}
      </div>
    </motion.div>
  );
}
