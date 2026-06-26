import { toAr } from "../lib/format";

/**
 * Roznama tear-off-calendar logo, recreated in CSS/SVG (red torn top, gold ring,
 * live date number, gold star). `word` adds the روزنامة wordmark below.
 */
export function RoznamaLogo({
  size = 44,
  word = false,
  date = new Date().getDate(),
}: {
  size?: number;
  word?: boolean;
  date?: number;
}) {
  const icon = (
    <div style={{ position: "relative", width: size, height: size, flex: "none" }}>
      {/* gold ring */}
      <div
        style={{
          position: "absolute",
          top: -size * 0.14,
          left: "50%",
          transform: "translateX(-50%)",
          width: size * 0.2,
          height: size * 0.2,
          borderRadius: "50%",
          border: `${Math.max(2, size * 0.055)}px solid #C99A2E`,
          background: "#E0A100",
          boxShadow: "inset 0 0 0 " + Math.max(1, size * 0.03) + "px #B8860B",
          zIndex: 2,
        }}
      />
      {/* card */}
      <div style={{ position: "absolute", inset: 0, borderRadius: size * 0.2, background: "#F4ECDB", boxShadow: "0 2px 6px rgba(60,40,15,.18)", overflow: "hidden" }}>
        {/* red torn top */}
        <div style={{ position: "relative", height: size * 0.26, background: "#C1272D" }}>
          <svg viewBox="0 0 100 8" preserveAspectRatio="none" style={{ position: "absolute", bottom: -1, left: 0, width: "100%", height: size * 0.1 }}>
            <path d="M0 0 L5 6 L10 1 L16 7 L22 1 L28 6 L34 1 L40 7 L46 1 L52 6 L58 1 L64 7 L70 1 L76 6 L82 1 L88 7 L94 1 L100 5 L100 8 L0 8 Z" fill="#F4ECDB" />
          </svg>
        </div>
        {/* date number */}
        <div style={{ position: "absolute", inset: 0, top: size * 0.12, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontFamily: "'Cairo',sans-serif", fontWeight: 900, fontSize: size * 0.46, color: "#1A1A1A", lineHeight: 1, direction: "ltr" }}>{toAr(date)}</span>
        </div>
        {/* gold star */}
        <svg width={size * 0.13} height={size * 0.13} viewBox="0 0 24 24" style={{ position: "absolute", bottom: size * 0.1, left: "50%", transform: "translateX(-50%)" }} fill="#E0A100">
          <path d="M12 1l2.6 6.2L21 8l-4.8 4.3L17.6 19 12 15.4 6.4 19l1.4-6.7L3 8l6.4-.8z" />
        </svg>
      </div>
    </div>
  );

  if (!word) return icon;
  return (
    <div style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", gap: size * 0.18 }}>
      {icon}
      <span style={{ fontFamily: "'Cairo',sans-serif", fontWeight: 900, fontSize: size * 0.42, color: "#1A1A1A", letterSpacing: ".01em" }}>روزنامة</span>
    </div>
  );
}
