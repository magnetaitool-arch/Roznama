import { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { RoznamaLogo } from "../RoznamaLogo";

export function AuthScreen({ onGuest }: { onGuest: () => void }) {
  const { signIn, signUp } = useAuth();
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
