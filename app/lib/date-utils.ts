/**
 * Normalizes to UTC midnight for the calendar year/month/day in **UTC**.
 * Use when filtering Prisma `@db.Date` / PostgreSQL `date` columns together
 * with parsed civil dates (`parseHebrewDate`, ISO date-only strings as UTC).
 * Parsing `DD.MM.YYYY` with `new Date(y, m, d)` uses local midnight, which
 * serializes to the previous UTC day and mismatches `@db.Date` comparisons.
 */
export function toPostgresCalendarDate(date: Date): Date {
  return new Date(
    Date.UTC(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate(),
    ),
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

const pad2 = (n: number) => String(n).padStart(2, "0");

/**
 * Format Prisma `@db.Date` values as `YYYY-MM-DD` using UTC calendar parts.
 * Avoids local-timezone off-by-one when the DB stores a civil date.
 */
export function prismaDateToUtcDateString(date: Date): string {
  return `${date.getUTCFullYear()}-${pad2(date.getUTCMonth() + 1)}-${pad2(date.getUTCDate())}`;
}

/**
 * Format Prisma `@db.Time` `DateTime` as `HH:mm` using UTC clock time
 * (inverse of {@link timeStringToPrismaTime}).
 */
export function prismaTimeToTimeString(time: Date): string {
  return `${pad2(time.getUTCHours())}:${pad2(time.getUTCMinutes())}`;
}

/**
 * Parse Hebrew locale date string (DD.MM.YYYY) to a Date object
 * @param dateString - Date string in Hebrew format (DD.MM.YYYY)
 * @returns Date object or undefined if parsing fails
 */
export function parseHebrewDate(dateString: string): Date | undefined {
  if (!dateString) return undefined;
  // DD.MM.YYYY or DD/MM/YYYY (he-IL locale may use either)
  const parts = dateString.trim().split(/[./]/);
  if (parts.length === 3) {
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1; // Month is 0-indexed
    const year = parseInt(parts[2], 10);
    if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
      const date = new Date(Date.UTC(year, month, day));
      if (
        date.getUTCDate() === day &&
        date.getUTCMonth() === month &&
        date.getUTCFullYear() === year
      ) {
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


export const DAYS_OF_WEEK = [
  { key: "sunday" as const, label: "א", name: "ראשון", value: 0 },
  { key: "monday" as const, label: "ב", name: "שני", value: 1 },
  { key: "tuesday" as const, label: "ג", name: "שלישי", value: 2 },
  { key: "wednesday" as const, label: "ד", name: "רביעי", value: 3 },
  { key: "thursday" as const, label: "ה", name: "חמישי", value: 4 },
  { key: "friday" as const, label: "ו", name: "שישי", value: 5 },
  { key: "saturday" as const, label: "ש", name: "שבת", value: 6 },
];
