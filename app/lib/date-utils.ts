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
