/**
 * UTC midnight for the same calendar year/month/day as the given Date's
 * **local** components. Use when filtering Prisma `@db.Date` / PostgreSQL
 * `date` columns: a local-midnight Date (e.g. `new Date(2026, 1, 1)`) becomes
 * the previous UTC calendar day when the server compares timestamps, so
 * equality against `DATE '2026-02-01'` returns no rows.
 */
export function toPostgresCalendarDate(date: Date): Date {
  return new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()),
  );
}

/**
 * Build a Date for Prisma `@db.Time` from an HTML time value (`HH:mm` or `HH:mm:ss`).
 * `new Date("07:00")` is invalid in JS and serializes to `null` over server actions.
 */
export function timeStringToPrismaTime(time: string): Date {
  const t = time.trim();
  const match = /^(\d{1,2}):(\d{2})(?::(\d{2}))?$/.exec(t);
  if (!match) {
    throw new Error(`Invalid time string: ${time}`);
  }
  const h = parseInt(match[1], 10);
  const m = parseInt(match[2], 10);
  const s = match[3] != null ? parseInt(match[3], 10) : 0;
  if (
    h < 0 ||
    h > 23 ||
    m < 0 ||
    m > 59 ||
    s < 0 ||
    s > 59 ||
    Number.isNaN(h) ||
    Number.isNaN(m) ||
    Number.isNaN(s)
  ) {
    throw new Error(`Invalid time values: ${time}`);
  }
  return new Date(Date.UTC(1970, 0, 1, h, m, s, 0));
}

/**
 * Parse Hebrew locale date string (DD.MM.YYYY) to a Date object
 * @param dateString - Date string in Hebrew format (DD.MM.YYYY)
 * @returns Date object or undefined if parsing fails
 */
export function parseHebrewDate(dateString: string): Date | undefined {
  if (!dateString) return undefined;
  // Try parsing Hebrew format (DD.MM.YYYY)
  const parts = dateString.split('.');
  if (parts.length === 3) {
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1; // Month is 0-indexed
    const year = parseInt(parts[2], 10);

    if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
      const date = new Date(year, month, day);
      // Verify the date is valid
      if (date.getDate() === day && date.getMonth() === month && date.getFullYear() === year) {
        return date;
      }
    }
  }

  // Fallback: try standard Date parsing
  const date = new Date(dateString);
  if (!isNaN(date.getTime())) {
    return date;
  }

  console.warn("Invalid date string:", dateString);
  return undefined;
}
export const HEBREW_MONTHS = [
  "ינואר", "פברואר", "מרץ", "אפריל", "מאי", "יוני", "יולי", "אוגוסט", "ספטמבר", "אוקטובר", "נובמבר", "דצמבר",
];
