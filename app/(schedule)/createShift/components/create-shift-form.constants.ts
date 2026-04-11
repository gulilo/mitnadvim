import { shift_type } from "@prisma/client";

export const SHIFT_TYPES: readonly { key: shift_type; label: string }[] = [
  { key: "day", label: "בוקר" },
  { key: "evening", label: "ערב" },
  { key: "night", label: "לילה" },
  { key: "reinforcement", label: "תגבור" },
  { key: "overstaffed", label: "מעל התקן" },
  { key: "security", label: "אבטחה" },
];

export const SHIFT_TYPE_TIMES: Record<shift_type, { start: string; end: string }> = {
  day: { start: "07:00", end: "15:00" },
  evening: { start: "15:00", end: "23:00" },
  night: { start: "23:00", end: "07:00" },
  reinforcement: { start: "07:00", end: "15:00" },
  overstaffed: { start: "15:00", end: "23:00" },
  security: { start: "23:00", end: "07:00" },
};
