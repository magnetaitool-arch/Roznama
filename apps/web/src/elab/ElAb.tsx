import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "../lib/router";
import { fmt, fmtNum, toAr } from "../lib/format";
import { Celebration } from "../components/Celebration";
import { ElAbLogo } from "./ElAbLogo";
import { FocusMode } from "./FocusMode";
import { useElAb } from "./store";
import { AREA_ORDER, AREAS, type ElTask } from "./types";

const C = { bg: "#FAF6EE", ink: "#1A1A1A", red: "#C1272D", gold: "#E0A100", green: "#2E7D52", paper: "#FFFDF7", border: "#E7DEC9", muted: "#857C68" };
type Screen = "home" | "plan" | "review";

function EnergyPicker({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  return (
    <div style={{ display: "flex", gap: 4, direction: "ltr" }}>
      {Array.from({ length: 10 }).map((_, i) => {
        const on = i < value;
        return (
          <button
            key={i}
            onClick={() => onChange(i + 1)}
            aria-label={`${i + 1}`}
            style={{ flex: 1, height: 12, borderRadius: 4, background: on ? (value >= 7 ? C.green : value >= 4 ? C.gold : C.red) : "#E7DEC9", transition: "background .15s" }}
          />
        );
      })}
    </div>
  );
}

function TaskRow({ task, onToggle, onStart }: { task: ElTask; onToggle: () => void; onStart: () => void }) {
  const done = task.status === "done";
  const subDone = task.subtasks.filter((s) => s.done).length;
  return (
    <motion.div layout initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} style={{ display: "flex", alignItems: "center", gap: 11, background: C.paper, border: `1px solid ${C.border}`, borderRadius: 14, padding: "12px 13px", marginTop: 8 }}>
      <button onClick={onToggle} style={{ flex: "none", width: 26, height: 26, borderRadius: 8, border: "2px solid", borderColor: done ? C.green : "#CFC4AB", background: done ? C.green : "transparent", display: "flex", alignItems: "center", justifyContent: "center" }}>
        {done && <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l4 4L19 7" /></svg>}
      </button>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {task.priority && <span style={{ color: C.gold, fontSize: 13 }}>★</span>}
          <span style={{ fontSize: 15, fontWeight: 700, color: done ? "#A89E88" : C.ink, textDecoration: done ? "line-through" : "none", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{task.title}</span>
        </div>
        <div style={{ fontSize: 11, fontWeight: 600, color: C.muted, marginTop: 2 }}>
          {toAr(task.estimateMin)} د{task.subtasks.length > 0 ? ` · ${toAr(subDone)}/${toAr(task.subtasks.length)} خطوات` : ""}
        </div>
      </div>
      {!done && (
        <motion.button whileTap={{ scale: 0.93 }} onClick={onStart} style={{ flex: "none", display: "flex", alignItems: "center", gap: 4, background: C.ink, color: C.bg, borderRadius: 10, padding: "8px 12px", fontSize: 13, fontWeight: 800 }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
          ابدأ
        </motion.button>
      )}
    </motion.div>
  );
}

export function ElAb() {
  const { navigate } = useRouter();
  const s = useElAb();
  const [screen, setScreen] = useState<Screen>("home");
  const [text, setText] = useState("");
  const [added, setAdded] = useState<number | null>(null);
  const [celebrate, setCelebrate] = useState(false);
  const prevFull = useRef(false);
  const now = new Date();

  useEffect(() => {
    const full = s.todayTasks.length > 0 && s.completion === 100;
    if (full && !prevFull.current) {
      setCelebrate(true);
      const id = setTimeout(() => setCelebrate(false), 3200);
      return () => clearTimeout(id);
    }
    prevFull.current = full;
  }, [s.completion, s.todayTasks.length]);

  const grouped = AREA_ORDER.map((k) => ({ area: AREAS[k], items: s.todayTasks.filter((t) => t.area === k) })).filter((g) => g.items.length);
  const topTask = [...s.todayTasks].filter((t) => t.status !== "done").sort((a, b) => Number(b.priority) - Number(a.priority))[0];

  const submitPlan = () => {
    const n = s.addFromText(text);
    setAdded(n);
    if (n > 0) setText("");
    setTimeout(() => setAdded(null), 2500);
  };

  return (
    <div dir="rtl" style={{ minHeight: "100vh", background: C.bg, color: C.ink, fontFamily: "'Cairo',sans-serif", maxWidth: 460, margin: "0 auto", position: "relative", paddingBottom: 96 }}>
      {/* Header */}
      <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 20px 8px" }}>
        <ElAbLogo size={56} />
        <button onClick={() => navigate("/")} style={{ display: "flex", alignItems: "center", gap: 5, background: C.paper, border: `1px solid ${C.border}`, borderRadius: 12, padding: "8px 12px", fontSize: 12, fontWeight: 800, color: C.muted }}>
          روزنامة ←
        </button>
      </header>

      <main style={{ padding: "0 18px" }}>
        <AnimatePresence mode="wait">
          <motion.div key={screen} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.28 }}>
            {screen === "home" && (
              <>
                {/* Big date */}
                <div style={{ textAlign: "center", margin: "6px 0 4px" }}>
                  <div style={{ fontFamily: "'Reem Kufi','Cairo',sans-serif", fontSize: 15, fontWeight: 700, color: C.red }}>{fmt(now, { weekday: "long" })}</div>
                  <div style={{ fontFamily: "'Reem Kufi','Cairo',sans-serif", fontSize: 56, fontWeight: 800, color: C.ink, lineHeight: 1 }}>{fmtNum(now, { day: "numeric" })}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: C.muted }}>{fmtNum(now, { month: "long", year: "numeric" })}</div>
                </div>

                {/* Energy */}
                <div style={{ background: C.paper, border: `1px solid ${C.border}`, borderRadius: 16, padding: 14, marginTop: 12 }}>
                  <div style={{ fontSize: 13, fontWeight: 800, color: C.ink, marginBottom: 10 }}>طاقتك النهاردة؟ {s.energy > 0 && <span style={{ color: C.gold }}>{toAr(s.energy)}/١٠</span>}</div>
                  <EnergyPicker value={s.energy} onChange={s.setEnergy} />
                </div>

                {/* Tasks by area */}
                {grouped.map((g) => (
                  <div key={g.area.key} style={{ marginTop: 16 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 7, padding: "0 2px" }}>
                      <span style={{ width: 10, height: 10, borderRadius: 3, background: g.area.color }} />
                      <span style={{ fontSize: 13, fontWeight: 800, color: C.ink }}>{g.area.name}</span>
                    </div>
                    {g.items.map((t) => (
                      <TaskRow key={t.id} task={t} onToggle={() => s.toggleTask(t.id)} onStart={() => s.startFocus(t.id)} />
                    ))}
                  </div>
                ))}
                {s.todayTasks.length === 0 && (
                  <div style={{ textAlign: "center", color: C.muted, fontSize: 14, padding: "30px 10px" }}>مفيش تاسكات النهاردة. روح «التخطيط» واكتب يومك.</div>
                )}

                {/* Streak + points + CTA */}
                <div style={{ display: "flex", gap: 10, margin: "18px 0 0" }}>
                  <div style={{ flex: 1, background: C.ink, color: C.bg, borderRadius: 14, padding: "12px 14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 13, fontWeight: 700 }}>🔥 سلسلة</span>
                    <span style={{ fontSize: 18, fontWeight: 900, color: C.gold }}>{toAr(s.streak)}</span>
                  </div>
                  <div style={{ flex: 1, background: C.ink, color: C.bg, borderRadius: 14, padding: "12px 14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 13, fontWeight: 700 }}>⭐ النقط</span>
                    <span style={{ fontSize: 18, fontWeight: 900, color: C.gold }}>{toAr(s.pointsToday)}</span>
                  </div>
                </div>
                {topTask && (
                  <motion.button whileTap={{ scale: 0.98 }} onClick={() => s.startFocus(topTask.id)} style={{ width: "100%", marginTop: 12, background: C.red, color: "#fff", borderRadius: 14, padding: "15px 0", fontSize: 16, fontWeight: 800, boxShadow: "0 8px 18px rgba(193,39,45,.25)" }}>
                    ابدأ بأهم تاسك ▶
                  </motion.button>
                )}
              </>
            )}

            {screen === "plan" && (
              <div style={{ marginTop: 8 }}>
                <div style={{ fontSize: 18, fontWeight: 800, color: C.ink }}>خطّط ليومك</div>
                <div style={{ fontSize: 13, color: C.muted, marginTop: 4, lineHeight: 1.6 }}>اكتب كلام عادي زي ما بتفكّر، والأب هيقسّمه تاسكات بمجالاتها — والتاسك الكبير هيتكسّر خطوات.</div>
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder={"مثال: بكرة لازم أخلّص بوست الكلاينت وأروح الجيم وأسجّل لحن جديد"}
                  rows={4}
                  style={{ width: "100%", marginTop: 12, background: C.paper, border: `1px solid ${C.border}`, borderRadius: 14, padding: "14px 15px", fontSize: 15, fontWeight: 600, color: C.ink, textAlign: "right", outline: "none", resize: "vertical", fontFamily: "inherit" }}
                />
                <motion.button whileTap={{ scale: 0.98 }} onClick={submitPlan} style={{ width: "100%", marginTop: 10, background: C.ink, color: C.bg, borderRadius: 13, padding: "14px 0", fontSize: 15, fontWeight: 800 }}>
                  نظّمها بالأب ✦
                </motion.button>
                {added !== null && (
                  <div style={{ marginTop: 10, fontSize: 13, fontWeight: 700, color: added > 0 ? C.green : C.red, textAlign: "center" }}>
                    {added > 0 ? `اتضاف ${toAr(added)} تاسك ليومك ✓` : "اكتب حاجة الأول"}
                  </div>
                )}

                <div style={{ marginTop: 20, fontSize: 12, fontWeight: 800, letterSpacing: ".1em", color: C.red }}>تاسكات النهاردة</div>
                {s.todayTasks.map((t) => (
                  <TaskRow key={t.id} task={t} onToggle={() => s.toggleTask(t.id)} onStart={() => s.startFocus(t.id)} />
                ))}
                {s.todayTasks.length === 0 && <div style={{ color: C.muted, fontSize: 13, marginTop: 10 }}>لسه فاضي.</div>}
              </div>
            )}

            {screen === "review" && (
              <Review store={s} />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom nav */}
      <nav style={{ position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 460, display: "flex", justifyContent: "space-around", background: C.ink, padding: "10px 8px calc(10px + env(safe-area-inset-bottom))", zIndex: 40 }}>
        {([["home", "الهوم"], ["plan", "التخطيط"], ["review", "المراجعة"]] as [Screen, string][]).map(([k, label]) => (
          <button key={k} onClick={() => setScreen(k)} style={{ flex: 1, color: screen === k ? C.gold : "#8C8270", fontSize: 13, fontWeight: 800, padding: "6px 0" }}>
            {label}
          </button>
        ))}
      </nav>

      <AnimatePresence>
        {s.focus && (
          <FocusMode task={s.focus} onToggleSubtask={s.toggleSubtask} onDone={s.toggleTask} onClose={s.stopFocus} />
        )}
      </AnimatePresence>
      <AnimatePresence>{celebrate && <Celebration />}</AnimatePresence>
    </div>
  );
}

function Review({ store }: { store: ReturnType<typeof useElAb> }) {
  const blockers = ["مزاج", "مشغول", "التاسك صعب"];
  const zero = store.todayTasks.length > 0 && store.completion === 0;
  const full = store.todayTasks.length > 0 && store.completion === 100;

  return (
    <div style={{ marginTop: 8 }}>
      <div style={{ fontSize: 18, fontWeight: 800, color: C.ink }}>مراجعة النهاردة</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 14 }}>
        {[
          { label: "الإنجاز", val: `${toAr(store.completion)}٪`, color: C.green },
          { label: "النقط", val: toAr(store.pointsToday), color: C.gold },
          { label: "السلسلة 🔥", val: toAr(store.streak), color: C.red },
          { label: "الطاقة", val: store.energy ? `${toAr(store.energy)}/١٠` : "—", color: C.ink },
        ].map((k) => (
          <div key={k.label} style={{ background: C.paper, border: `1px solid ${C.border}`, borderRadius: 14, padding: "14px 16px" }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: C.muted }}>{k.label}</div>
            <div style={{ fontSize: 24, fontWeight: 900, color: k.color, marginTop: 4 }}>{k.val}</div>
          </div>
        ))}
      </div>

      {full && (
        <div style={{ marginTop: 16, background: "#E8F2EA", border: "1px solid #BEDCC8", borderRadius: 16, padding: 16, textAlign: "center", color: C.green, fontWeight: 800 }}>
          يوم كامل ١٠٠٪ 🎉 — كمّل السلسلة بكرة!
        </div>
      )}

      {zero && !store.zeroDayAsked && (
        <div style={{ marginTop: 16, background: C.paper, border: `1px solid ${C.border}`, borderRadius: 16, padding: 16 }}>
          <div style={{ fontSize: 15, fontWeight: 800, color: C.ink }}>إيه اللي وقف النهاردة؟</div>
          <div style={{ fontSize: 12, color: C.muted, marginTop: 4 }}>مفيش جلد للنفس — نفهم بس ونرحّل بكرة.</div>
          <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
            {blockers.map((b) => (
              <button key={b} onClick={() => store.dismissZeroDay(b)} style={{ flex: 1, background: "#F1E9D6", border: `1px solid ${C.border}`, borderRadius: 11, padding: "11px 0", fontSize: 13, fontWeight: 800, color: C.ink }}>{b}</button>
            ))}
          </div>
        </div>
      )}
      {zero && store.zeroDayAsked && (
        <div style={{ marginTop: 16, background: C.paper, border: `1px solid ${C.border}`, borderRadius: 16, padding: 16, textAlign: "center", color: C.ink, fontWeight: 700, fontSize: 14, lineHeight: 1.7 }}>
          تمام. يوم وعدّى 🤍 بكرة نرجع أقوى — التاسكات هتستنّاك.
        </div>
      )}
    </div>
  );
}
