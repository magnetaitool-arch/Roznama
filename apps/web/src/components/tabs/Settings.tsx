import { useRef, useState } from "react";
import { motion } from "framer-motion";
import type { BackupBundle, ThemePref } from "@roznama/shared";
import type { RoznamaStore } from "../../hooks/useRoznama";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../lib/api";
import { supabase } from "../../lib/supabase";
import { downloadBlob } from "../../lib/download";

async function authHeader(): Promise<Record<string, string>> {
  if (!supabase) return {};
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

const card: React.CSSProperties = {
  margin: "14px 18px 0",
  background: "var(--paper)",
  border: "1px solid var(--border)",
  borderRadius: 18,
  padding: 16,
  boxShadow: "var(--shadow-card)",
};
const label: React.CSSProperties = { fontSize: 11, fontWeight: 800, letterSpacing: ".14em", color: "var(--red)", marginBottom: 12 };

const THEMES: { key: ThemePref; label: string }[] = [
  { key: "light", label: "فاتح" },
  { key: "dark", label: "غامق" },
  { key: "system", label: "النظام" },
];

export function Settings({ store, onRequestNotif, onGo }: { store: RoznamaStore; onRequestNotif: () => void; onGo: (t: "admin") => void }) {
  const { theme, setTheme } = useTheme();
  const { authed, user, cloudEnabled, signOut } = useAuth();
  const fileRef = useRef<HTMLInputElement>(null);
  const [note, setNote] = useState<string | null>(null);

  async function exportBackup() {
    setNote(null);
    try {
      if (store.mode === "cloud") {
        const bundle = await api.getBackup();
        downloadBlob(new Blob([JSON.stringify(bundle, null, 2)], { type: "application/json" }), "roznama-backup.json");
      } else {
        const raw = localStorage.getItem("roznama_v2") ?? "{}";
        downloadBlob(new Blob([raw], { type: "application/json" }), "roznama-backup.json");
      }
      setNote("تم تنزيل نسخة احتياطية ✓");
    } catch (e) {
      setNote((e as Error).message);
    }
  }

  async function importBackup(file: File) {
    setNote(null);
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      if (store.mode === "cloud") {
        // Accept either a server BackupBundle or a local snapshot.
        const bundle: BackupBundle = data.version === 1 ? data : { version: 1, exportedAt: new Date().toISOString(), daily: data.daily ?? [], monthly: data.monthly ?? [], tx: data.tx ?? [], habits: (data.habits ?? []).map((h: Record<string, unknown>) => ({ ...h })) };
        await fetch(`/api/backup/restore?replace=true`, {
          method: "POST",
          headers: { "Content-Type": "application/json", ...(await authHeader()) },
          body: JSON.stringify(bundle),
        });
        store.refresh();
        setNote("تم استرجاع البيانات ✓");
      } else {
        if (data && (data.daily || data.tx)) {
          localStorage.setItem("roznama_v2", JSON.stringify(data));
          setNote("تم الاسترجاع. جاري إعادة التحميل...");
          setTimeout(() => window.location.reload(), 600);
        } else {
          setNote("ملف غير صالح.");
        }
      }
    } catch (e) {
      setNote((e as Error).message);
    }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: [0.2, 0.7, 0.2, 1] }}>
      {/* Profile */}
      <div style={{ ...card, marginTop: 8, display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{ width: 54, height: 54, borderRadius: "50%", background: "var(--red)", color: "#FBF5E6", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Aref Ruqaa',serif", fontSize: 26, fontWeight: 700 }}>
          {(store.displayName || user?.email || "ر").slice(0, 1).toUpperCase()}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 16, fontWeight: 800, color: "var(--ink)" }}>{store.displayName || (authed ? user?.email : "ضيف")}</div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 3 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: "var(--muted-2)" }}>{authed ? user?.email : "وضع محلي · بدون حساب"}</span>
            {store.role === "admin" && <span style={{ fontSize: 10, fontWeight: 800, color: "#fff", background: "var(--gold-deep)", borderRadius: 999, padding: "2px 8px" }}>أدمن</span>}
          </div>
        </div>
      </div>

      {/* Admin entry (admins only) */}
      {store.role === "admin" && (
        <motion.button
          whileTap={{ scale: 0.99 }}
          onClick={() => onGo("admin")}
          style={{ ...card, width: "calc(100% - 36px)", display: "flex", alignItems: "center", gap: 12, textAlign: "right" }}
        >
          <span style={{ fontSize: 24 }}>📊</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 15, fontWeight: 800, color: "var(--ink)" }}>لوحة الأدمن</div>
            <div style={{ fontSize: 12, fontWeight: 600, color: "var(--muted-2)", marginTop: 2 }}>متابعة المستخدمين والتسجيلات</div>
          </div>
          <span style={{ color: "var(--muted-2)", fontSize: 18 }}>←</span>
        </motion.button>
      )}

      {/* Appearance */}
      <div style={card}>
        <div style={label}>المظهر</div>
        <div style={{ display: "flex", background: "var(--paper-sunken)", borderRadius: 12, padding: 4, gap: 4 }}>
          {THEMES.map((th) => (
            <motion.button key={th.key} whileTap={{ scale: 0.97 }} onClick={() => setTheme(th.key)} style={{ flex: 1, borderRadius: 9, padding: "9px 0", fontSize: 13, fontWeight: 800, background: theme === th.key ? "var(--paper-input)" : "transparent", color: theme === th.key ? "var(--red)" : "var(--muted-2)", boxShadow: theme === th.key ? "0 2px 6px rgba(60,40,15,.1)" : "none" }}>
              {th.label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Notifications */}
      <div style={card}>
        <div style={label}>التنبيهات</div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: "var(--ink)" }}>تذكير بالمهام الناقصة</div>
          <motion.button whileTap={{ scale: 0.95 }} onClick={() => (store.notifOn ? store.setNotif(false) : onRequestNotif())} style={{ width: 52, height: 30, borderRadius: 999, background: store.notifOn ? "var(--green)" : "var(--paper-sunken)", position: "relative", transition: "background .2s" }}>
            <motion.span layout style={{ position: "absolute", top: 3, [store.notifOn ? "left" : "right"]: 3, width: 24, height: 24, borderRadius: "50%", background: "#fff", boxShadow: "0 1px 3px rgba(0,0,0,.3)" } as React.CSSProperties} />
          </motion.button>
        </div>
      </div>

      {/* Data / backup */}
      <div style={card}>
        <div style={label}>البيانات والنسخ الاحتياطي</div>
        <div style={{ display: "flex", gap: 8 }}>
          <motion.button whileTap={{ scale: 0.97 }} onClick={exportBackup} style={{ flex: 1, borderRadius: 12, background: "var(--panel)", color: "var(--panel-ink)", padding: "12px 0", fontSize: 14, fontWeight: 800 }}>تصدير نسخة</motion.button>
          <motion.button whileTap={{ scale: 0.97 }} onClick={() => fileRef.current?.click()} style={{ flex: 1, borderRadius: 12, background: "var(--paper-sunken-2)", color: "var(--ink)", border: "1px solid var(--border-input)", padding: "12px 0", fontSize: 14, fontWeight: 800 }}>استرجاع نسخة</motion.button>
          <input ref={fileRef} type="file" accept="application/json" style={{ display: "none" }} onChange={(e) => e.target.files?.[0] && importBackup(e.target.files[0])} />
        </div>
        {note && <div style={{ marginTop: 10, fontSize: 12, color: "var(--muted)" }}>{note}</div>}
      </div>

      {/* Account */}
      <div style={card}>
        <div style={label}>الحساب</div>
        {authed ? (
          <motion.button whileTap={{ scale: 0.98 }} onClick={() => signOut()} style={{ width: "100%", borderRadius: 12, background: "var(--red-soft-bg)", color: "var(--red)", border: "1px solid var(--red-soft-border)", padding: "12px 0", fontSize: 14, fontWeight: 800 }}>تسجيل الخروج</motion.button>
        ) : (
          <div style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.7 }}>
            {cloudEnabled
              ? "أنت في الوضع المحلي. سجّل الدخول من شاشة البداية لمزامنة بياناتك على كل أجهزتك."
              : "المزامنة السحابية غير مفعّلة في هذه النسخة — بياناتك محفوظة محليًا على الجهاز."}
          </div>
        )}
      </div>

      <div style={{ textAlign: "center", padding: "20px 0 6px", fontSize: 11, color: "var(--muted-2)" }}>
        روزنامة · النسخة ١٫٠
      </div>
    </motion.div>
  );
}
