/**
 * Calendar-date helpers that never go through UTC: all math is done on the visitor's local
 * calendar (year, month, day), so "today + 7" can't shift a day around midnight or DST.
 */

export interface LocalDate {
  y: number;
  m: number; // 1..12
  d: number;
}

const MONTHS = [
  "janeiro",
  "fevereiro",
  "março",
  "abril",
  "maio",
  "junho",
  "julho",
  "agosto",
  "setembro",
  "outubro",
  "novembro",
  "dezembro",
];

export function localToday(now: Date = new Date()): LocalDate {
  return { y: now.getFullYear(), m: now.getMonth() + 1, d: now.getDate() };
}

export function addDays(date: LocalDate, days: number): LocalDate {
  // Date(y, m, d) works in local time and normalises month/year overflow; noon avoids DST edges.
  const dt = new Date(date.y, date.m - 1, date.d + days, 12);
  return { y: dt.getFullYear(), m: dt.getMonth() + 1, d: dt.getDate() };
}

export function toISO(date: LocalDate): string {
  return `${date.y}-${String(date.m).padStart(2, "0")}-${String(date.d).padStart(2, "0")}`;
}

export function fromISO(iso: string): LocalDate | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!m) return null;
  return { y: Number(m[1]), m: Number(m[2]), d: Number(m[3]) };
}

export function compare(a: LocalDate, b: LocalDate): number {
  return a.y - b.y || a.m - b.m || a.d - b.d;
}

/** "19 de outubro" / "19 de outubro de 2026" */
export function formatPtBR(date: LocalDate, withYear = false): string {
  const base = `${date.d} de ${MONTHS[date.m - 1]}`;
  return withYear ? `${base} de ${date.y}` : base;
}

/** "19/10/2026" */
export function formatShort(date: LocalDate): string {
  return `${String(date.d).padStart(2, "0")}/${String(date.m).padStart(2, "0")}/${date.y}`;
}
