import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { toAr } from "../lib/format";

const cardStyle: React.CSSProperties = {
  position: "relative",
  width: 46,
  height: 62,
  borderRadius: 9,
  background: "var(--panel)",
  color: "var(--panel-ink)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontFamily: "'Cairo',sans-serif",
  fontWeight: 900,
  fontSize: 38,
  perspective: 160,
  boxShadow: "inset 0 0 0 1px rgba(251,245,230,.07), 0 7px 14px rgba(0,0,0,.2)",
  overflow: "hidden",
};

function DigitCard({ digit }: { digit: string }) {
  const reduce = useReducedMotion();
  return (
    <div style={cardStyle}>
      <AnimatePresence initial={false} mode="popLayout">
        <motion.div
          key={digit}
          initial={reduce ? false : { rotateX: -88, opacity: 0 }}
          animate={{ rotateX: 0, opacity: 1 }}
          transition={{ duration: 0.55, ease: [0.2, 0.7, 0.2, 1] }}
          style={{ transformOrigin: "center top", backfaceVisibility: "hidden" }}
        >
          {toAr(digit)}
        </motion.div>
      </AnimatePresence>
      <div
        style={{ position: "absolute", top: "50%", left: 0, right: 0, height: 1, background: "rgba(0,0,0,.4)" }}
      />
    </div>
  );
}

function Colon() {
  return (
    <div
      style={{
        color: "var(--red)",
        fontFamily: "'Cairo',sans-serif",
        fontWeight: 900,
        fontSize: 34,
        animation: "blink 1s steps(1,end) infinite",
      }}
    >
      :
    </div>
  );
}

/** Live split-flap clock — Arabic-Indic digits flipping every second. */
export function SplitFlapClock() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const h = String(now.getHours()).padStart(2, "0");
  const m = String(now.getMinutes()).padStart(2, "0");
  const s = String(now.getSeconds()).padStart(2, "0");

  return (
    <div style={{ display: "flex", gap: 6, justifyContent: "center", alignItems: "center", direction: "ltr" }}>
      <DigitCard digit={h[0]} />
      <DigitCard digit={h[1]} />
      <Colon />
      <DigitCard digit={m[0]} />
      <DigitCard digit={m[1]} />
      <Colon />
      <DigitCard digit={s[0]} />
      <DigitCard digit={s[1]} />
    </div>
  );
}
