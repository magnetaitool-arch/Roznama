import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";
import type { RoznamaStore } from "../../hooks/useRoznama";
import { deriveAnalytics } from "../../lib/derive";
import { api } from "../../lib/api";
import { downloadBlob, transactionsToCsv } from "../../lib/download";
import { egp, fmt, monthKey, toAr } from "../../lib/format";

const PIE_COLORS = ["#C23B2E", "#3E7C5A", "#E0B84D", "#B0532E", "#5A9B77", "#9A7B36"];

function shiftMonth(month: string, delta: number): string {
  const [y, m] = month.split("-").map(Number);
  return monthKey(new Date(y, m - 1 + delta, 1));
}

const card: React.CSSProperties = {
  margin: "14px 18px 0",
  background: "var(--paper)",
  border: "1px solid var(--border)",
  borderRadius: 18,
  padding: 16,
  boxShadow: "var(--shadow-card)",
};

export function Analytics({ store }: { store: RoznamaStore }) {
  const [month, setMonth] = useState(monthKey());
  const [busy, setBusy] = useState<string | null>(null);
  const [note, setNote] = useState<string | null>(null);

  const ref = useMemo(() => {
    const [y, m] = month.split("-").map(Number);
    return new Date(y, m - 1, 1);
  }, [month]);

  const a = useMemo(() => deriveAnalytics(store.tx, ref, 6), [store.tx, ref]);
  const income = a.daily.reduce((s, d) => s + d.income, 0);
  const expense = a.daily.reduce((s, d) => s + d.expense, 0);
  const net = income - expense;

  const monthLabel = fmt(ref, { month: "long", year: "numeric" });
  const dailyChart = a.daily.map((d) => ({ d: Number(d.date.slice(8, 10)), expense: d.expense, income: d.income }));
  const monthChart = a.monthly.map((p) => ({
    label: fmt(new Date(Number(p.month.slice(0, 4)), Number(p.month.slice(5, 7)) - 1, 1), { month: "short" }),
    income: p.income,
    expense: p.expense,
  }));

  async function exportReport(format: "pdf" | "xlsx") {
    setNote(null);
    if (store.mode !== "cloud") {
      if (format === "xlsx") {
        downloadBlob(new Blob([transactionsToCsv(store.tx, month)], { type: "text/csv;charset=utf-8" }), `roznama-${month}.csv`);
        setNote("تم تصدير CSV (يفتح في Excel). سجّل الدخول لتصدير Excel/PDF كامل.");
      } else {
        setNote("تصدير PDF متاح بعد تسجيل الدخول والمزامنة السحابية.");
      }
      return;
    }
    try {
      setBusy(format);
      const blob = await api.exportReport(month, format);
      downloadBlob(blob, `roznama-${month}.${format}`);
    } catch (e) {
      setNote((e as Error).message);
    } finally {
      setBusy(null);
    }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: [0.2, 0.7, 0.2, 1] }}>
      {/* Month switcher + KPIs */}
      <div style={{ ...card, marginTop: 8 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <button onClick={() => setMonth(shiftMonth(month, -1))} style={{ width: 34, height: 34, borderRadius: 10, background: "var(--paper-sunken)", color: "var(--ink)", fontSize: 18 }}>›</button>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: ".14em", color: "var(--red)" }}>تقرير</div>
            <div style={{ fontSize: 16, fontWeight: 900, color: "var(--ink)" }}>{monthLabel}</div>
          </div>
          <button onClick={() => setMonth(shiftMonth(month, 1))} disabled={month >= monthKey()} style={{ width: 34, height: 34, borderRadius: 10, background: "var(--paper-sunken)", color: "var(--ink)", fontSize: 18, opacity: month >= monthKey() ? 0.4 : 1 }}>‹</button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginTop: 14 }}>
          {[
            { label: "دخل", val: income, color: "var(--green)" },
            { label: "صرف", val: expense, color: "var(--red)" },
            { label: "الصافي", val: net, color: net >= 0 ? "var(--green)" : "var(--red)" },
          ].map((k) => (
            <div key={k.label} style={{ background: "var(--paper-sunken)", borderRadius: 12, padding: "10px 8px", textAlign: "center" }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: "var(--muted-2)" }}>{k.label}</div>
              <div style={{ fontSize: 13, fontWeight: 900, color: k.color, marginTop: 3 }}>{egp(k.val)}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Monthly trend */}
      <div style={card}>
        <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: ".14em", color: "var(--red)", marginBottom: 10 }}>الدخل والصرف · آخر ٦ شهور</div>
        <ResponsiveContainer width="100%" height={170}>
          <BarChart data={monthChart} margin={{ top: 4, right: 4, left: 4, bottom: 0 }}>
            <CartesianGrid vertical={false} stroke="var(--border-line)" strokeDasharray="3 3" />
            <XAxis dataKey="label" tick={{ fontSize: 11, fill: "var(--muted-2)" }} axisLine={false} tickLine={false} />
            <Tooltip formatter={(v: number) => egp(v)} contentStyle={{ borderRadius: 12, border: "1px solid var(--border)", background: "var(--paper)", fontSize: 12 }} cursor={{ fill: "rgba(0,0,0,.04)" }} />
            <Bar dataKey="income" radius={[5, 5, 0, 0]} fill="var(--green)" />
            <Bar dataKey="expense" radius={[5, 5, 0, 0]} fill="var(--red)" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Daily expense area */}
      <div style={card}>
        <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: ".14em", color: "var(--red)", marginBottom: 10 }}>الصرف اليومي · {monthLabel}</div>
        <ResponsiveContainer width="100%" height={150}>
          <AreaChart data={dailyChart} margin={{ top: 4, right: 4, left: 4, bottom: 0 }}>
            <defs>
              <linearGradient id="exp" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--red)" stopOpacity={0.35} />
                <stop offset="100%" stopColor="var(--red)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke="var(--border-line)" strokeDasharray="3 3" />
            <XAxis dataKey="d" tick={{ fontSize: 10, fill: "var(--muted-2)" }} axisLine={false} tickLine={false} interval={4} />
            <Tooltip formatter={(v: number) => egp(v)} labelFormatter={(l) => `يوم ${toAr(l)}`} contentStyle={{ borderRadius: 12, border: "1px solid var(--border)", background: "var(--paper)", fontSize: 12 }} />
            <Area type="monotone" dataKey="expense" stroke="var(--red)" strokeWidth={2} fill="url(#exp)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Category breakdown */}
      {a.byCategory.length > 0 && (
        <div style={card}>
          <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: ".14em", color: "var(--red)", marginBottom: 10 }}>توزيع الصرف بالبنود</div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <ResponsiveContainer width="50%" height={150}>
              <PieChart>
                <Pie data={a.byCategory} dataKey="amount" nameKey="cat" innerRadius={38} outerRadius={62} paddingAngle={2} stroke="none">
                  {a.byCategory.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v: number) => egp(v)} contentStyle={{ borderRadius: 12, border: "1px solid var(--border)", background: "var(--paper)", fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
              {a.byCategory.slice(0, 6).map((c, i) => (
                <div key={c.cat} style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 12 }}>
                  <span style={{ width: 10, height: 10, borderRadius: 3, background: PIE_COLORS[i % PIE_COLORS.length], flex: "none" }} />
                  <span style={{ flex: 1, color: "var(--ink)", fontWeight: 700, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.cat}</span>
                  <span style={{ color: "var(--muted)", fontWeight: 700 }}>{egp(c.amount)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Export */}
      <div style={card}>
        <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: ".14em", color: "var(--red)", marginBottom: 10 }}>تصدير التقرير</div>
        <div style={{ display: "flex", gap: 8 }}>
          <motion.button whileTap={{ scale: 0.97 }} onClick={() => exportReport("pdf")} disabled={busy !== null} style={{ flex: 1, borderRadius: 12, background: "var(--panel)", color: "var(--panel-ink)", padding: "12px 0", fontSize: 14, fontWeight: 800 }}>
            {busy === "pdf" ? "..." : "PDF تنزيل"}
          </motion.button>
          <motion.button whileTap={{ scale: 0.97 }} onClick={() => exportReport("xlsx")} disabled={busy !== null} style={{ flex: 1, borderRadius: 12, background: "var(--green)", color: "#fff", padding: "12px 0", fontSize: 14, fontWeight: 800 }}>
            {busy === "xlsx" ? "..." : "Excel تنزيل"}
          </motion.button>
        </div>
        {note && <div style={{ marginTop: 10, fontSize: 12, color: "var(--muted)", lineHeight: 1.6 }}>{note}</div>}
      </div>
      <div style={{ height: 6 }} />
    </motion.div>
  );
}
