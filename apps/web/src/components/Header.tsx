import { motion } from "framer-motion";
import type { Tab } from "../lib/tabs";
import { greeting } from "../lib/format";
import { RoznamaLogo } from "./RoznamaLogo";

const iconBtn: React.CSSProperties = {
  position: "relative",
  width: 42,
  height: 42,
  borderRadius: 13,
  background: "var(--paper)",
  border: "1px solid var(--border)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  boxShadow: "0 4px 12px rgba(60,40,15,.06)",
};

export function Header({
  tab,
  bellOn,
  onToggleBell,
  onGo,
}: {
  tab: Tab;
  bellOn: boolean;
  onToggleBell: () => void;
  onGo: (t: Tab) => void;
}) {
  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 30,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "16px 20px 12px",
        background: "linear-gradient(var(--header-fade) 60%, transparent)",
      }}
    >
      <div>
        <div style={{ fontSize: 12, fontWeight: 700, color: "var(--brand)", letterSpacing: ".04em", marginBottom: 1 }}>
          {greeting(new Date())}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <RoznamaLogo size={30} />
          <span style={{ fontFamily: "'Aref Ruqaa',serif", fontSize: 28, fontWeight: 700, color: "var(--ink-strong)", lineHeight: 0.9 }}>
            روزنامة
          </span>
        </div>
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        <motion.button
          whileTap={{ scale: 0.92 }}
          onClick={() => onGo("analytics")}
          aria-label="التحليلات"
          style={{ ...iconBtn, color: tab === "analytics" ? "var(--red)" : "var(--muted-2)" }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 3v18h18" />
            <path d="M7 14l3-4 3 3 4-6" />
          </svg>
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.92 }}
          onClick={() => onGo("settings")}
          aria-label="الإعدادات"
          style={{ ...iconBtn, color: tab === "settings" ? "var(--red)" : "var(--muted-2)" }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.92 }}
          onClick={onToggleBell}
          aria-label="الإشعارات"
          style={iconBtn}
        >
          <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke={bellOn ? "var(--green)" : "var(--muted-2)"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.7 21a2 2 0 0 1-3.4 0" />
          </svg>
          {bellOn && (
            <span style={{ position: "absolute", top: 8, left: 10, width: 8, height: 8, borderRadius: "50%", background: "var(--green)", border: "2px solid var(--paper)" }} />
          )}
        </motion.button>
      </div>
    </header>
  );
}
