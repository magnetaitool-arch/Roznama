/** Arabic / EGP formatting helpers — ported verbatim from the prototype logic. */

export const toAr = (s: string | number): string =>
  String(s).replace(/[0-9]/g, (d) => "٠١٢٣٤٥٦٧٨٩"[Number(d)]);

export function arNum(n: number): string {
  try {
    return new Intl.NumberFormat("ar-EG").format(Math.round(n));
  } catch {
    return toAr(Math.round(n));
  }
}

export const egp = (n: number): string => `${arNum(n)} ج.م`;

export function egpShort(n: number): string {
  const a = Math.abs(n);
  if (a >= 1000) {
    return toAr((n / 1000).toFixed(a >= 10000 ? 0 : 1).replace(/\.0$/, "")) + " ألف";
  }
  return arNum(n);
}

export function fmt(d: Date, o: Intl.DateTimeFormatOptions): string {
  try {
    return new Intl.DateTimeFormat("ar-EG", o).format(d);
  } catch {
    return "";
  }
}

export function fmtNum(d: Date, o: Intl.DateTimeFormatOptions): string {
  try {
    return new Intl.DateTimeFormat("ar-EG-u-nu-arab", o).format(d);
  } catch {
    return toAr(d.toLocaleDateString());
  }
}

export function hijri(d: Date): string {
  try {
    return new Intl.DateTimeFormat("ar-SA-u-ca-islamic-umalqura-nu-arab", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(d);
  } catch {
    return "";
  }
}

export function greeting(d: Date): string {
  const h = d.getHours();
  if (h < 12) return "صباح الفل";
  if (h < 17) return "نهارك سعيد";
  if (h < 21) return "مساء الخير";
  return "تصبح على خير";
}

export const todayKey = (): string => new Date().toISOString().slice(0, 10);

export const monthKey = (d = new Date()): string =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
