import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

interface RouterCtx {
  path: string;
  navigate: (to: string) => void;
}

const Ctx = createContext<RouterCtx | null>(null);

/** Minimal history-based router — avoids pulling in react-router for two routes. */
export function RouterProvider({ children }: { children: ReactNode }) {
  const [path, setPath] = useState(() => window.location.pathname);

  useEffect(() => {
    const onPop = () => setPath(window.location.pathname);
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  const navigate = useCallback((to: string) => {
    if (to === window.location.pathname) return;
    window.history.pushState({}, "", to);
    setPath(to);
  }, []);

  return <Ctx.Provider value={{ path, navigate }}>{children}</Ctx.Provider>;
}

export function useRouter(): RouterCtx {
  const v = useContext(Ctx);
  if (!v) throw new Error("useRouter must be used inside RouterProvider");
  return v;
}
