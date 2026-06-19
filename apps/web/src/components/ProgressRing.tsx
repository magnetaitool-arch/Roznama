import type { ReactNode } from "react";
import { useCountUp } from "./CountUp";

/** Animated SVG progress ring. `pct` is 0–100. */
export function ProgressRing({
  pct,
  size = 96,
  stroke = 11,
  color = "var(--green)",
  track = "var(--paper-sunken)",
  children,
}: {
  pct: number;
  size?: number;
  stroke?: number;
  color?: string;
  track?: string;
  children?: ReactNode;
}) {
  const animated = useCountUp(pct);
  const r = 52;
  const circumference = 2 * Math.PI * r; // 326.726…
  const offset = circumference * (1 - Math.max(0, Math.min(100, animated)) / 100);

  return (
    <div style={{ position: "relative", width: size, height: size, margin: "0 auto" }}>
      <svg width={size} height={size} viewBox="0 0 120 120" style={{ transform: "rotate(-90deg)" }}>
        <circle cx="60" cy="60" r={r} fill="none" stroke={track} strokeWidth={stroke} />
        <circle
          cx="60"
          cy="60"
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          style={{ strokeDashoffset: offset }}
        />
      </svg>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {children}
      </div>
    </div>
  );
}
