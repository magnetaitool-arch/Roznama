import type { Transaction } from "@roznama/shared";

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/** Offline fallback: export transactions for a month as CSV (opens in Excel). */
export function transactionsToCsv(tx: Transaction[], month: string): string {
  const rows = tx
    .filter((t) => t.date.slice(0, 7) === month)
    .sort((a, b) => +new Date(a.date) - +new Date(b.date));
  const header = "date,type,category,amount";
  const body = rows
    .map((t) => `${t.date.slice(0, 10)},${t.type},"${(t.cat ?? "").replace(/"/g, '""')}",${t.amount}`)
    .join("\n");
  return `${header}\n${body}\n`;
}
