/** CSS recreation of the الأب tear-off-calendar logo (red torn top + gold ring). */
export function ElAbLogo({ size = 46 }: { size?: number }) {
  return (
    <div style={{ position: "relative", width: size, height: size, flex: "none" }}>
      {/* gold ring */}
      <div
        style={{
          position: "absolute",
          top: -size * 0.16,
          left: "50%",
          transform: "translateX(-50%)",
          width: size * 0.22,
          height: size * 0.22,
          borderRadius: "50%",
          border: `${Math.max(2, size * 0.05)}px solid #E0A100`,
          background: "transparent",
          zIndex: 2,
        }}
      />
      {/* card */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: size * 0.22,
          background: "#F4ECDB",
          boxShadow: "0 3px 8px rgba(60,40,15,.18)",
          overflow: "hidden",
        }}
      >
        {/* red torn top */}
        <div style={{ position: "relative", height: size * 0.3, background: "#C1272D" }}>
          <svg viewBox="0 0 100 8" preserveAspectRatio="none" style={{ position: "absolute", bottom: -1, left: 0, width: "100%", height: size * 0.12 }}>
            <path d="M0 0 L6 6 L12 1 L19 7 L26 1 L33 6 L40 1 L47 7 L54 1 L61 6 L68 1 L75 7 L82 1 L89 6 L96 1 L100 5 L100 8 L0 8 Z" fill="#F4ECDB" />
          </svg>
        </div>
        {/* الأب */}
        <div style={{ position: "absolute", inset: 0, top: size * 0.18, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontFamily: "'Reem Kufi','Cairo',sans-serif", fontWeight: 800, fontSize: size * 0.42, color: "#1A1A1A", lineHeight: 1 }}>الأب</span>
        </div>
      </div>
    </div>
  );
}
