import { useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";

const COLORS = ["#C23B2E", "#3E7C5A", "#E0B84D", "#FBF5E6", "#9E2A20"];

/** Full-screen confetti + medallion shown when all daily tasks are completed. */
export function Celebration() {
  const reduce = useReducedMotion();
  const pieces = useMemo(
    () =>
      Array.from({ length: 38 }, (_, i) => ({
        left: Math.random() * 100,
        color: COLORS[i % COLORS.length],
        delay: Math.random() * 0.4,
        dur: 1.6 + Math.random() * 1.3,
        size: 6 + Math.random() * 8,
        rot: Math.random() * 360,
      })),
    [],
  );

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 60, pointerEvents: "none", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, background: "rgba(33,28,22,.32)", animation: "fadeIn .3s ease both" }} />
      {!reduce &&
        pieces.map((p, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              top: -24,
              left: `${p.left}%`,
              width: p.size,
              height: p.size * 1.5,
              background: p.color,
              borderRadius: 2,
              transform: `rotate(${p.rot}deg)`,
              animation: `confetti ${p.dur}s cubic-bezier(.25,.6,.4,1) ${p.delay}s forwards`,
            }}
          />
        ))}
      <motion.div
        initial={reduce ? { opacity: 0 } : { scale: 0.4, opacity: 0, x: "-50%", y: "-50%" }}
        animate={reduce ? { opacity: 1 } : { scale: 1, opacity: 1, x: "-50%", y: "-50%" }}
        transition={{ duration: 0.6, ease: [0.2, 1.3, 0.4, 1] }}
        style={{ position: "absolute", top: "44%", left: "50%", textAlign: "center" }}
      >
        <div
          style={{
            width: 100,
            height: 100,
            margin: "0 auto 16px",
            borderRadius: "50%",
            background: "#3E7C5A",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 14px 34px rgba(62,124,90,.5)",
          }}
        >
          <svg width={50} height={50} viewBox="0 0 24 24" fill="none" stroke="#FBF5E6" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div style={{ fontFamily: "'Aref Ruqaa',serif", fontSize: 32, fontWeight: 700, color: "#FBF5E6" }}>
          مبروك يا بطل!
        </div>
        <div style={{ fontFamily: "'Cairo',sans-serif", fontSize: 16, fontWeight: 600, color: "#EADFC4", marginTop: 6 }}>
          خلّصت كل مهام النهارده
        </div>
      </motion.div>
    </div>
  );
}
