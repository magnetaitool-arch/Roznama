import { motion } from "framer-motion";

const C = { bg: "#FAF6EE", ink: "#1A1A1A", red: "#C1272D", gold: "#E0A100", green: "#2E7D52", paper: "#FFFDF7", border: "#E7DEC9", muted: "#857C68" };

const FEATURES = [
  { icon: "🗓️", title: "تخطيط بالكلام العادي", desc: "اكتب يومك كلام عادي، والأب يقسّمه تاسكات بمجالاتها — والتاسك الكبير يتكسّر خطوات." },
  { icon: "🎯", title: "وضع التركيز", desc: "تاسك واحد قدامك + تايمر، والباقي مخفي، وبتكمّل من الخطوة اللي وقفت عندها." },
  { icon: "🔔", title: "متابعة بتلاحقك", desc: "تذكيرات متصاعدة لحد ما تعمل التاسك أو تأجّله بقرار — القرار دايمًا بإيدك." },
  { icon: "🔥", title: "نقط وسلسلة", desc: "تكسب نقط بالإنجاز، وتبني سلسلة أيام ما تكسرهاش، ومكافآت بتتفتح." },
  { icon: "💰", title: "فلوس بأربع طبقات", desc: "تسجيل سريع · ميزانية لكل بند · تنبيه قبل الصرف · تقرير الفلوس راحت فين." },
  { icon: "📊", title: "تقييم لكل مجال", desc: "مراجعة يومية وأسبوعية وشهرية — إنجاز، عادات، مزاج، وفلوس." },
];

export function About() {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: [0.2, 0.7, 0.2, 1] }} style={{ paddingBottom: 10 }}>
      {/* Hero */}
      <div style={{ textAlign: "center", marginTop: 6 }}>
        <img src="/elab-logo.png" alt="الأب" width={120} height={120} style={{ objectFit: "contain" }} />
        <div style={{ fontFamily: "'Reem Kufi','Cairo',sans-serif", fontSize: 15, fontWeight: 700, color: C.gold, marginTop: 4 }}>
          فكرة من ٢٠١٨
        </div>
      </div>

      {/* Story */}
      <div style={{ background: C.paper, border: `1px solid ${C.border}`, borderRadius: 18, padding: 18, marginTop: 16 }}>
        <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: ".14em", color: C.red, marginBottom: 8 }}>القصة</div>
        <p style={{ fontSize: 15, lineHeight: 2, color: C.ink, margin: 0, fontWeight: 500 }}>
          «الأب» مش مجرد تطبيق مهام. هو فكرة بدأت سنة <b>٢٠١٨</b> — إن يكون فيه حاجة واحدة
          تمسك حياتك كلها: تخطّط معاك بالليل، تلاحقك بالنهار، وتحاسبك وتقيّمك بالحب،
          زي الأب اللي بيهتم ومش بيسيبك.
        </p>
      </div>

      {/* Developer */}
      <div style={{ background: C.ink, borderRadius: 18, padding: 18, marginTop: 12, display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{ width: 52, height: 52, borderRadius: "50%", background: C.gold, color: C.ink, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Reem Kufi','Cairo',sans-serif", fontSize: 24, fontWeight: 800, flex: "none" }}>
          م
        </div>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#8C8270", letterSpacing: ".1em" }}>تطوير وتنفيذ</div>
          <div style={{ fontSize: 18, fontWeight: 800, color: C.bg, marginTop: 2 }}>محمد حسن</div>
          <div style={{ fontSize: 12, fontWeight: 600, color: C.gold, marginTop: 2 }}>صاحب الفكرة والمطوّر</div>
        </div>
      </div>

      {/* Idea in one line */}
      <div style={{ background: "#FBEFD6", border: `1px solid #EBD9A8`, borderRadius: 18, padding: 18, marginTop: 12, textAlign: "center" }}>
        <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: ".14em", color: C.gold, marginBottom: 6 }}>الفكرة في سطر</div>
        <div style={{ fontSize: 16, fontWeight: 700, color: C.ink, lineHeight: 1.8 }}>
          نظام تشغيل شخصي واحد بيربط: <b style={{ color: C.red }}>التخطيط ← التنفيذ ← المتابعة ← التقييم</b>،
          عبر مجالات حياتك: الشغل، الصحة، والإبداع.
        </div>
      </div>

      {/* Features */}
      <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: ".14em", color: C.red, margin: "20px 2px 8px" }}>المزايا</div>
      {FEATURES.map((f) => (
        <div key={f.title} style={{ display: "flex", gap: 12, background: C.paper, border: `1px solid ${C.border}`, borderRadius: 14, padding: 14, marginBottom: 9 }}>
          <span style={{ fontSize: 22, flex: "none" }}>{f.icon}</span>
          <div>
            <div style={{ fontSize: 15, fontWeight: 800, color: C.ink }}>{f.title}</div>
            <div style={{ fontSize: 13, fontWeight: 500, color: C.muted, marginTop: 3, lineHeight: 1.7 }}>{f.desc}</div>
          </div>
        </div>
      ))}

      {/* Vision */}
      <div style={{ background: C.red, borderRadius: 18, padding: 20, marginTop: 12, textAlign: "center" }}>
        <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: ".14em", color: "#F4C9BC", marginBottom: 8 }}>الرؤية</div>
        <div style={{ fontFamily: "'Reem Kufi','Cairo',sans-serif", fontSize: 20, fontWeight: 700, color: "#FFF", lineHeight: 1.7 }}>
          حياتك كلها جوّه «الأب» — بالأيام والتفاصيل. مفيش حاجة تتنسى.
        </div>
      </div>

      <div style={{ textAlign: "center", fontSize: 11, color: C.muted, padding: "18px 0 4px" }}>
        روزنامة · الأب — النسخة ١٫٠
      </div>
    </motion.div>
  );
}
