import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

/** Animate a number toward `value` with an ease-out cubic, honoring reduced motion. */
export function useCountUp(value: number, duration = 850): number {
  const reduce = useReducedMotion();
  const [n, setN] = useState(value);
  const fromRef = useRef(value);
  const rafRef = useRef<number>();

  useEffect(() => {
    if (reduce) {
      setN(value);
      fromRef.current = value;
      return;
    }
    const from = fromRef.current;
    const t0 = performance.now();
    const ease = (p: number) => 1 - Math.pow(1 - p, 3);
    const step = (t: number) => {
      const p = Math.min(1, (t - t0) / duration);
      const v = from + (value - from) * ease(p);
      setN(v);
      if (p < 1) rafRef.current = requestAnimationFrame(step);
      else fromRef.current = value;
    };
    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      fromRef.current = value;
    };
  }, [value, duration, reduce]);

  return n;
}

export function CountUp({
  value,
  format,
  duration,
}: {
  value: number;
  format: (n: number) => string;
  duration?: number;
}) {
  const n = useCountUp(value, duration);
  return <>{format(n)}</>;
}
