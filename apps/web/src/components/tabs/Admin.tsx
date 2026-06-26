import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import type { RoznamaStore } from "../../hooks/useRoznama";
import { api, type AdminOverview } from "../../lib/api";
import { fmtNum, toAr } from "../../lib/format";

const card: React.CSSProperties = {
  margin: "14px 18px 0",
  background: "var(--paper)",
  border: "1px solid var(--border)",
  borderRadius: 18,
  padding: 16,
  boxShadow: "var(--shadow-card)",
};

export function Admin({ store }: { store: RoznamaStore }) {
  const [data, setData] = useState<AdminOverview | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (store.mode !== "cloud" || store.role !== "admin") return;
    api.getAdminOverview().then(setData).catch((e) => setErr((e as Error).message));
  }, [store.mode, store.role]);

  if (store.role !== "admin") {
    return (
      <div style={{ ...card, marginTop: 8, textAlign: "center", color: "var(--muted)" }}>
        الصفحة دي للأدمن بس. لو إنت المالك، اعمل نفسك أدمن من Supabase (أمر SQL واحد).
      </div>
    );
  }

  const chart = (data?.signupsByDay ?? []).map((p) => ({ d: Number(p.day.slice(8, 10)), count: p.count }));

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: [0.2, 0.7, 0.2, 1] }}>
      <div style={{ ...card, marginTop: 8 }}>
        <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: ".14em", color: "var(--red)" }}>لوحة الأدمن</div>
        <div style={{ fontSize: 14, fontWeight: 700, color: "var(--muted)", marginTop: 3 }}>متابعة المستخدمين والتسجيلات</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginTop: 14 }}>
          {[
            { label: "كل المستخدمين", val: data ? toAr(data.userCount) : "…" },
            { label: "النهارده", val: data ? toAr(data.newToday) : "…" },
            { label: "أدمن", val: data ? toAr(data.adminCount) : "…" },
          ].map((k) => (
            <div key={k.label} style={{ background: "var(--paper-sunken)", borderRadius: 12, padding: "10px 8px", textAlign: "center" }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: "var(--muted-2)" }}>{k.label}</div>
              <div style={{ fontSize: 20, fontWeight: 900, color: "var(--ink)", marginTop: 3 }}>{k.val}</div>
            </div>
          ))}
        </div>
      </div>

      {err && <div style={{ ...card, color: "var(--red)", fontSize: 13 }}>{err}</div>}

      <div style={card}>
        <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: ".14em", color: "var(--red)", marginBottom: 10 }}>التسجيلات · آخر ١٤ يوم</div>
        <ResponsiveContainer width="100%" height={150}>
          <BarChart data={chart} margin={{ top: 4, right: 4, left: 4, bottom: 0 }}>
            <CartesianGrid vertical={false} stroke="var(--border-line)" strokeDasharray="3 3" />
            <XAxis dataKey="d" tick={{ fontSize: 10, fill: "var(--muted-2)" }} axisLine={false} tickLine={false} interval={1} />
            <Tooltip labelFormatter={(l) => `يوم ${toAr(l)}`} formatter={(v: number) => [toAr(v), "تسجيلات"]} contentStyle={{ borderRadius: 12, border: "1px solid var(--border)", background: "var(--paper)", fontSize: 12 }} cursor={{ fill: "rgba(0,0,0,.04)" }} />
            <Bar dataKey="count" radius={[5, 5, 0, 0]} fill="var(--green)" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div style={card}>
        <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: ".14em", color: "var(--red)", marginBottom: 10 }}>أحدث المسجّلين</div>
        {(data?.recentUsers ?? []).map((u, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: i < (data!.recentUsers.length - 1) ? "1px solid var(--border-soft)" : "none" }}>
            <span style={{ flex: "none", width: 32, height: 32, borderRadius: "50%", background: "var(--red)", color: "#FBF5E6", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800 }}>
              {(u.displayName || "?").slice(0, 1).toUpperCase()}
            </span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: "var(--ink)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{u.displayName}</div>
              <div style={{ fontSize: 11, color: "var(--muted-2)" }}>{fmtNum(new Date(u.createdAt), { day: "numeric", month: "short", year: "numeric" })}</div>
            </div>
            {u.role === "admin" && <span style={{ fontSize: 10, fontWeight: 800, color: "#fff", background: "var(--gold-deep)", borderRadius: 999, padding: "2px 8px" }}>أدمن</span>}
          </div>
        ))}
        {data && data.recentUsers.length === 0 && <div style={{ color: "var(--muted-2)", fontSize: 13 }}>مفيش مسجّلين لسه.</div>}
      </div>

      <div style={{ ...card, fontSize: 12, color: "var(--muted)", lineHeight: 1.7 }}>
        🔒 للخصوصية: الأدمن بيشوف الأعداد وقائمة الحسابات بس — مهام وفلوس أي مستخدم محميّة ليه لوحده ومش بتظهر هنا.
      </div>
      <div style={{ height: 6 }} />
    </motion.div>
  );
}
