import PDFDocument from "pdfkit";
import ExcelJS from "exceljs";
import type { MonthlyReport } from "@roznama/shared";

const egp = (n: number) => `${Math.round(n).toLocaleString("en-US")} EGP`;

/**
 * Render a monthly report to a PDF buffer.
 * Note: the bundled Helvetica core font has no Arabic glyphs, so labels here use
 * transliterated/English equivalents to keep the export portable. To render
 * native Arabic, register a font (e.g. Cairo .ttf) via `doc.registerFont`.
 */
export function reportToPdf(report: MonthlyReport): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: "A4", margin: 50 });
    const chunks: Buffer[] = [];
    doc.on("data", (c) => chunks.push(c as Buffer));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    doc.fontSize(24).fillColor("#C23B2E").text("Roznama", { continued: true });
    doc.fillColor("#2A241C").fontSize(14).text(`  —  Monthly Report ${report.month}`);
    doc.moveDown();

    doc.fontSize(11).fillColor("#5C5345");
    doc.text(`Income:  ${egp(report.income)}`);
    doc.text(`Expense: ${egp(report.expense)}`);
    doc.text(`Net:     ${egp(report.net)}`);
    doc.text(`Balance: ${egp(report.balance)}`);
    doc.text(`Transactions: ${report.txCount}`);
    doc.text(`Daily completion: ${report.dailyCompletionRate}%`);
    doc.text(`Monthly goals avg: ${report.monthlyGoalsAvg}%`);
    doc.moveDown();

    doc.fontSize(13).fillColor("#C23B2E").text("Spending by category");
    doc.moveDown(0.3);
    doc.fontSize(11).fillColor("#2A241C");
    if (report.byCategory.length === 0) {
      doc.fillColor("#9A8E78").text("No expenses this month.");
    } else {
      for (const c of report.byCategory) {
        doc.text(`${c.cat}`, { continued: true }).text(`   ${egp(c.amount)}`, { align: "right" });
      }
    }

    doc.end();
  });
}

/** Render a monthly report to an .xlsx workbook buffer. */
export async function reportToXlsx(report: MonthlyReport): Promise<Buffer> {
  const wb = new ExcelJS.Workbook();
  wb.creator = "Roznama";
  wb.created = new Date();

  const summary = wb.addWorksheet("Summary");
  summary.columns = [
    { header: "Metric", key: "k", width: 28 },
    { header: "Value", key: "v", width: 20 },
  ];
  summary.addRows([
    { k: "Month", v: report.month },
    { k: "Income (EGP)", v: report.income },
    { k: "Expense (EGP)", v: report.expense },
    { k: "Net (EGP)", v: report.net },
    { k: "Balance (EGP)", v: report.balance },
    { k: "Transactions", v: report.txCount },
    { k: "Daily completion %", v: report.dailyCompletionRate },
    { k: "Monthly goals avg %", v: report.monthlyGoalsAvg },
  ]);
  summary.getRow(1).font = { bold: true };

  const cats = wb.addWorksheet("By category");
  cats.columns = [
    { header: "Category", key: "cat", width: 28 },
    { header: "Amount (EGP)", key: "amount", width: 18 },
  ];
  cats.addRows(report.byCategory);
  cats.getRow(1).font = { bold: true };

  const out = await wb.xlsx.writeBuffer();
  return Buffer.from(out);
}
