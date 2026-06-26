import type { AreaKey, Subtask } from "./types";

const AREA_KEYWORDS: Record<AreaKey, string[]> = {
  work: ["شغل", "كلاينت", "عميل", "بوست", "magnet", "ماجنت", "إيميل", "ايميل", "اجتماع", "ميتنج", "تقرير", "عرض", "بروبوزال", "فاتورة", "كونتنت", "تسليم"],
  gym: ["جيم", "تمرين", "تمارين", "مشي", "جري", "رياضة", "صحة", "بروتين", "كارديو"],
  creative: ["لحن", "ميكس", "أغنية", "اغنية", "أغاني", "موسيقى", "إبداع", "ابداع", "تصميم", "فيديو", "مونتاج", "رسم", "بيت", "كتابة"],
};

function detectArea(title: string): AreaKey {
  const t = title.toLowerCase();
  for (const area of ["work", "gym", "creative"] as AreaKey[]) {
    if (AREA_KEYWORDS[area].some((k) => t.includes(k.toLowerCase()))) return area;
  }
  return "work";
}

function estimate(title: string): number {
  const t = title.toLowerCase();
  if (t.includes("ساعتين")) return 120;
  if (t.includes("ساعة")) return 60;
  if (t.includes("نص ساعة") || t.includes("نص ساعه")) return 30;
  if (t.includes("سريع") || t.includes("بسرعة")) return 15;
  return 30;
}

const PRIORITY_HINTS = ["مهم", "ضروري", "أولوية", "اولوية", "لازم", "deadline", "النهاردة لازم"];
const isPriority = (t: string) => PRIORITY_HINTS.some((k) => t.toLowerCase().includes(k));

/** Strip leading filler so "بكرة لازم أخلّص البوست" → "أخلّص البوست". */
function clean(s: string): string {
  return s
    .replace(/^[\s\-•*–]+/, "")
    .replace(/^(بكرة|النهاردة|النهارده|لازم|عايز|محتاج|نفسي|هـ|ه)\s+/g, "")
    .trim();
}

/** A task is "big" if it's long or clearly bundles multiple actions. */
function isBig(title: string): boolean {
  return title.length > 45 || (title.match(/\sو\s/g)?.length ?? 0) >= 1 || title.split(/\s+/).length > 8;
}

function uid(): string {
  return "el" + Date.now().toString(36) + Math.floor(Math.random() * 1e4).toString(36);
}

/** Break a big task into 3–5 concrete-ish steps (heuristic; AI parsing comes later). */
function makeSubtasks(_title: string): Subtask[] {
  const steps = ["حدّد المطلوب بالظبط", "ابدأ بأول جزء", "كمّل الجزء الأساسي", "راجع واللمسات الأخيرة"];
  return steps.map((s) => ({ id: uid(), title: s, done: false }));
}

export interface ParsedTask {
  title: string;
  area: AreaKey;
  priority: boolean;
  estimateMin: number;
  subtasks: Subtask[];
}

/**
 * Parse free Egyptian-Arabic text into structured tasks. Splits on newlines,
 * Arabic "و", commas, and "ثم"; assigns an area; auto-splits big tasks.
 */
export function parseTasks(text: string): ParsedTask[] {
  const chunks = text
    .split(/\n|،|,|\sو\s|\sثم\s|\.(?:\s|$)/g)
    .map(clean)
    .filter((s) => s.length >= 2);

  // De-dup while preserving order.
  const seen = new Set<string>();
  const out: ParsedTask[] = [];
  for (const raw of chunks) {
    const title = raw.replace(/\s+/g, " ").trim();
    if (seen.has(title)) continue;
    seen.add(title);
    out.push({
      title,
      area: detectArea(title),
      priority: isPriority(title),
      estimateMin: estimate(title),
      subtasks: isBig(title) ? makeSubtasks(title) : [],
    });
  }
  return out;
}

export { uid as elUid };
