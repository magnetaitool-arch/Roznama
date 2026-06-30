import { Component, StrictMode, type ReactNode } from "react";
import { createRoot } from "react-dom/client";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import App from "./App";
import "./styles/global.css";

/** Last-resort boundary: show a friendly reload screen instead of a blank page. */
class ErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  state = { error: null as Error | null };
  static getDerivedStateFromError(error: Error) {
    return { error };
  }
  componentDidCatch(error: unknown) {
    console.error("[roznama] app crashed", error);
  }
  render() {
    if (this.state.error) {
      return (
        <div dir="rtl" style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, padding: 24, fontFamily: "'Cairo',sans-serif", color: "#2A241C", textAlign: "center" }}>
          <div style={{ fontFamily: "'Aref Ruqaa',serif", fontSize: 30, fontWeight: 700 }}>روزنامة</div>
          <div style={{ fontSize: 15, color: "#5C5345" }}>حصلت مشكلة بسيطة. اضغط تحديث.</div>
          <button
            onClick={() => {
              if ("serviceWorker" in navigator) {
                navigator.serviceWorker.getRegistrations().then((rs) => rs.forEach((r) => r.unregister()));
              }
              if (window.caches) {
                caches.keys().then((ks) => ks.forEach((k) => caches.delete(k)));
              }
              setTimeout(() => window.location.reload(), 300);
            }}
            style={{ background: "#C23B2E", color: "#FBF5E6", border: "none", borderRadius: 13, padding: "13px 28px", fontSize: 15, fontWeight: 800, cursor: "pointer" }}
          >
            تحديث
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  </StrictMode>,
);
