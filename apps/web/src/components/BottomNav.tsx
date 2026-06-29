import { motion } from "framer-motion";
import { NAV_TABS, TAB_LABELS, type Tab } from "../lib/tabs";

const ICONS: Record<Tab, React.ReactNode> = {
  dashboard: (
    <>
      <path d="M3 10.5L12 3l9 7.5" />
      <path d="M5 9.5V21h14V9.5" />
    </>
  ),
  daily: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M8 12l3 3 5-6" />
    </>
  ),
  habits: (
    <>
      <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z" />
    </>
  ),
  monthly: (
    <>
      <rect x="3" y="4" width="18" height="17" rx="2" />
      <path d="M3 9h18" />
      <path d="M8 2v4" />
      <path d="M16 2v4" />
    </>
  ),
  finance: (
    <>
      <rect x="3" y="6" width="18" height="13" rx="2" />
      <path d="M3 10.5h18" />
      <circle cx="17" cy="14" r="1.3" />
    </>
  ),
  analytics: <path d="M3 3v18h18" />,
  settings: <circle cx="12" cy="12" r="3" />,
  admin: <path d="M12 2l8 4v6c0 5-3.5 8-8 10-4.5-2-8-5-8-10V6z" />,
};

export function BottomNav({ tab, onGo }: { tab: Tab; onGo: (t: Tab) => void }) {
  return (
    <nav
      style={{
        position: "fixed",
        bottom: 0,
        left: "50%",
        transform: "translateX(-50%)",
        width: "100%",
        maxWidth: 460,
        zIndex: 40,
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
        padding: "9px 8px calc(9px + env(safe-area-inset-bottom))",
        background: "var(--panel)",
        borderTop: "1px solid var(--panel-line)",
        boxShadow: "0 -8px 24px rgba(0,0,0,.2)",
      }}
    >
      {NAV_TABS.map((t) => {
        const active = tab === t;
        return (
          <motion.button
            key={t}
            whileTap={{ scale: 0.9 }}
            onClick={() => onGo(t)}
            style={{
              position: "relative",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 4,
              color: active ? "var(--gold)" : "var(--panel-muted)",
              padding: "6px 12px",
              fontSize: 11,
              fontWeight: 800,
            }}
          >
            {active && (
              <motion.span
                layoutId="nav-pill"
                style={{ position: "absolute", top: -3, width: 24, height: 3, borderRadius: 2, background: "var(--gold)" }}
              />
            )}
            <svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {ICONS[t]}
            </svg>
            <span>{TAB_LABELS[t]}</span>
          </motion.button>
        );
      })}
    </nav>
  );
}
