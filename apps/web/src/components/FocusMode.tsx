import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toAr } from "../lib/format";

const fmtClock = (sec: number) => {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${toAr(String(m).padStart(2, "0"))}:${toAr(String(s).padStart(2, "0"))}`;
};

/** Single-task focus overlay: a count-up timer with the rest hidden. */
export function FocusMode({
  title,
  onDone,
  onClose,
}: {
  title: string;
  onDone: () => void;
  onClose: () => void;
}) {
  const [sec, setSec] = useState(0);
  const [running, setRunning] = useState(true);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setSec((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [running]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ position: "fixed", inset: 0, zIndex: 80, background: "var(--panel)", color: "var(--panel-ink)", display: "flex", flexDirection: "column", padding: "24px 22px calc(24px + env(safe-area-inset-bottom))" }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 12, fontWeight: 800, letterSpacing: ".18em", color: "var(--gold)" }}>وضع التركيز</span>
        <button onClick={onClose} style={{ color: "var(--panel-muted)", fontSize: 26, lineHeight: 1 }}>×</button>
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", textAlign: "center" }}>
        <div style={{ fontSize: 22, fontWeight: 700, margin: "0 0 18px", lineHeight: 1.5 }}>{title}</div>
        <div style={{ fontVariantNumeric: "tabular-nums", fontSize: 64, fontWeight: 900, direction: "ltr" }}>{fmtClock(sec)}</div>
      </div>

      <div style={{ display: "flex", gap: 10 }}>
        <motion.button whileTap={{ scale: 0.97 }} onClick={() => setRunning((r) => !r)} style={{ flex: 1, borderRadius: 14, background: "var(--panel-2)", color: "var(--panel-ink)", padding: "15px 0", fontSize: 15, fontWeight: 800 }}>
          {running ? "وقفة" : "كمّل"}
        </motion.button>
        <motion.button whileTap={{ scale: 0.97 }} onClick={() => { onDone(); onClose(); }} style={{ flex: 2, borderRadius: 14, background: "var(--green)", color: "#fff", padding: "15px 0", fontSize: 15, fontWeight: 800 }}>
          تم ✓
        </motion.button>
      </div>
    </motion.div>
  );
}
