import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import type { ThemePref } from "@roznama/shared";

interface ThemeCtx {
  theme: ThemePref;
  resolved: "light" | "dark";
  setTheme: (t: ThemePref) => void;
}

const Ctx = createContext<ThemeCtx | null>(null);
const LS_KEY = "roznama_theme";

function systemDark(): boolean {
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? false;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemePref>(
    () => (localStorage.getItem(LS_KEY) as ThemePref | null) ?? "system",
  );
  const [resolved, setResolved] = useState<"light" | "dark">(() =>
    theme === "system" ? (systemDark() ? "dark" : "light") : theme,
  );

  useEffect(() => {
    const apply = () => {
      const r = theme === "system" ? (systemDark() ? "dark" : "light") : theme;
      setResolved(r);
      document.documentElement.setAttribute("data-theme", r);
      const meta = document.querySelector('meta[name="theme-color"]');
      if (meta) meta.setAttribute("content", r === "dark" ? "#18140f" : "#221D17");
    };
    apply();
    if (theme === "system") {
      const mq = window.matchMedia("(prefers-color-scheme: dark)");
      mq.addEventListener("change", apply);
      return () => mq.removeEventListener("change", apply);
    }
  }, [theme]);

  const setTheme = useCallback((t: ThemePref) => {
    setThemeState(t);
    localStorage.setItem(LS_KEY, t);
  }, []);

  return <Ctx.Provider value={{ theme, resolved, setTheme }}>{children}</Ctx.Provider>;
}

export function useTheme(): ThemeCtx {
  const v = useContext(Ctx);
  if (!v) throw new Error("useTheme must be used inside ThemeProvider");
  return v;
}
