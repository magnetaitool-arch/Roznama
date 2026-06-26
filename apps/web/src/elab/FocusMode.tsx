import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toAr } from "../lib/format";
import type { ElTask } from "./types";
import { AREAS } from "./types";

const fmtClock = (sec: number) => {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${toAr(String(m).padStart(2, "0"))}:${toAr(String(s).padStart(2, "0"))}`;
};

/** Distraction-free single-task focus: a count-up timer + resumable subtasks. */
export function FocusMode({
  task,
  onToggleSubtask,
  onDone,
  onClose,
}: {
  task: ElTask;
  onToggleSubtask: (taskId: string, subId: string) => void;
  onDone: (id: string) => void;
  onClose: () => void;
}) {
  const [sec, setSec] = useState(0);
  const [running, setRunning] = useState(true);
  const area = AREAS[task.area];

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
      style={{ position: "fixed", inset: 0, zIndex: 80, background: "#14110B", color: "#FAF6EE", display: "flex", flexDirection: "column", padding: "24px 22px calc(24px + env(safe-area-inset-bottom))" }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 12, fontWeight: 800, letterSpacing: ".18em", color: "#E0A100" }}>وضع التركيز</span>
        <button onClick={onClose} style={{ color: "#9b927e", fontSize: 26, lineHeight: 1 }}>×</button>
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", textAlign: "center" }}>
        <div style={{ display: "inline-flex", alignSelf: "center", alignItems: "center", gap: 7, background: `${area.color}22`, color: area.color, borderRadius: 999, padding: "5px 14px", fontSize: 12, fontWeight: 800 }}>
          {area.emoji} {area.name}
        </div>
        <div style={{ fontFamily: "'Reem Kufi','Cairo',sans-serif", fontSize: 26, fontWeight: 700, margin: "18px 0 6px", lineHeight: 1.4 }}>{task.title}</div>
        <div style={{ fontVariantNumeric: "tabular-nums", fontSize: 64, fontWeight: 900, letterSpacing: ".02em", color: "#FAF6EE", direction: "ltr" }}>{fmtClock(sec)}</div>

        {task.subtasks.length > 0 && (
          <div style={{ marginTop: 22, textAlign: "right", maxWidth: 360, alignSelf: "center", width: "100%" }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: "#9b927e", marginBottom: 8 }}>الخطوات — كمّل من اللي وقفت عنده</div>
            {task.subtasks.map((s, i) => (
              <button
                key={s.id}
                onClick={() => onToggleSubtask(task.id, s.id)}
                style={{ width: "100%", display: "flex", alignItems: "center", gap: 11, background: i === task.lastStep ? "#211c14" : "transparent", border: "1px solid #2e2820", borderRadius: 12, padding: "11px 13px", marginBottom: 7, textAlign: "right" }}
              >
                <span style={{ flex: "none", width: 22, height: 22, borderRadius: 7, border: "2px solid", borderColor: s.done ? "#2E7D52" : "#4a4234", background: s.done ? "#2E7D52" : "transparent", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {s.done && <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l4 4L19 7" /></svg>}
                </span>
                <span style={{ flex: 1, fontSize: 14, fontWeight: 600, color: s.done ? "#7a7264" : "#EDE6D6", textDecoration: s.done ? "line-through" : "none" }}>{s.title}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div style={{ display: "flex", gap: 10 }}>
        <motion.button whileTap={{ scale: 0.97 }} onClick={() => setRunning((r) => !r)} style={{ flex: 1, borderRadius: 14, background: "#2a2419", color: "#FAF6EE", padding: "15px 0", fontSize: 15, fontWeight: 800 }}>
          {running ? "وقفة" : "كمّل"}
        </motion.button>
        <motion.button whileTap={{ scale: 0.97 }} onClick={() => { onDone(task.id); onClose(); }} style={{ flex: 2, borderRadius: 14, background: "#2E7D52", color: "#fff", padding: "15px 0", fontSize: 15, fontWeight: 800 }}>
          خلّصت التاسك ✓
        </motion.button>
      </div>
    </motion.div>
  );
}
