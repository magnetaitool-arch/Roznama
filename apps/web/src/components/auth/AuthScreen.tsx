import { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { RoznamaLogo } from "../RoznamaLogo";

export function AuthScreen({ onGuest }: { onGuest: () => void }) {
  const { signIn, signUp, signInWithGoogle } = useAuth();
  const [mode, setMode] = useState<"in" | "up">("in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const submit = async () => {
    setErr(null);
    setMsg(null);
    setBusy(true);
    try {
      if (mode === "in") await signIn(email.trim(), password);
      else {
        await signUp(email.trim(), password, name.trim());
        setMsg("اتعمل الحساب! لو الإيميل محتاج تأكيد، افتح رسالة التفعيل ثم سجّل الدخول.");
      }
    } catch (e) {
      setErr((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  const input: React.CSSProperties = {
    width: "100%",
    background: "var(--paper-input)",
    border: "1px solid var(--border-input)",
    borderRadius: 13,
    padding: "13px 15px",
    fontSize: 15,
    fontWeight: 600,
    color: "var(--ink)",
    textAlign: "right",
    outline: "none",
    marginTop: 10,
  };

  return (
    <div style={{ minHeight: "100vh", background: "radial-gradient(130% 60% at 50% 0%, var(--grad-from) 0%, var(--grad-mid) 60%, var(--grad-to) 100%)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.2, 0.7, 0.2, 1] }} style={{ width: "100%", maxWidth: 380 }}>
        <div style={{ textAlign: "center", marginBottom: 22 }}>
          <RoznamaLogo size={132} />
          <div style={{ fontSize: 13, fontWeight: 700, color: "var(--brand)", marginTop: 12 }}>نظّم يومك، عاداتك، وفلوسك</div>
        </div>

        <div style={{ background: "var(--paper)", border: "1px solid var(--border)", borderRadius: 22, padding: 20, boxShadow: "var(--shadow-hero)" }}>
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => { setErr(null); signInWithGoogle().catch((e) => setErr((e as Error).message)); }}
            style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, background: "#fff", border: "1px solid #E0D3B2", borderRadius: 13, padding: "13px 0", fontSize: 15, fontWeight: 800, color: "#2A241C", marginBottom: 14 }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z"/><path fill="#FBBC05" d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.06l3.66 2.84C6.71 7.3 9.14 5.38 12 5.38z"/></svg>
            المتابعة بحساب Google
          </motion.button>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <span style={{ flex: 1, height: 1, background: "var(--border)" }} />
            <span style={{ fontSize: 11, fontWeight: 700, color: "var(--muted-2)" }}>أو</span>
            <span style={{ flex: 1, height: 1, background: "var(--border)" }} />
          </div>
          <div style={{ display: "flex", background: "var(--paper-sunken)", borderRadius: 12, padding: 4, gap: 4, marginBottom: 6 }}>
            <button onClick={() => setMode("in")} style={{ flex: 1, borderRadius: 9, padding: "9px 0", fontSize: 13, fontWeight: 800, background: mode === "in" ? "var(--paper-input)" : "transparent", color: mode === "in" ? "var(--red)" : "var(--muted-2)" }}>تسجيل دخول</button>
            <button onClick={() => setMode("up")} style={{ flex: 1, borderRadius: 9, padding: "9px 0", fontSize: 13, fontWeight: 800, background: mode === "up" ? "var(--paper-input)" : "transparent", color: mode === "up" ? "var(--red)" : "var(--muted-2)" }}>حساب جديد</button>
          </div>

          {mode === "up" && <input value={name} onChange={(e) => setName(e.target.value)} placeholder="اسمك" style={input} />}
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="الإيميل" style={input} />
          <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="كلمة السر" onKeyDown={(e) => e.key === "Enter" && submit()} style={input} />

          {err && <div style={{ marginTop: 10, fontSize: 12, color: "var(--red)", fontWeight: 700 }}>{err}</div>}
          {msg && <div style={{ marginTop: 10, fontSize: 12, color: "var(--green)", fontWeight: 700, lineHeight: 1.6 }}>{msg}</div>}

          <motion.button whileTap={{ scale: 0.98 }} onClick={submit} disabled={busy} style={{ width: "100%", marginTop: 14, borderRadius: 13, background: "var(--red)", color: "#FBF5E6", padding: "14px 0", fontSize: 15, fontWeight: 800, boxShadow: "0 6px 14px rgba(194,59,46,.28)", opacity: busy ? 0.7 : 1 }}>
            {busy ? "..." : mode === "in" ? "ادخل" : "أنشئ الحساب"}
          </motion.button>
        </div>

        <button onClick={onGuest} style={{ width: "100%", marginTop: 14, fontSize: 13, fontWeight: 700, color: "var(--muted)" }}>
          كمّل من غير حساب (وضع محلي) ←
        </button>
      </motion.div>
    </div>
  );
}
