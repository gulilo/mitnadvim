"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { cn } from "@/app/lib/utils";

const HEBREW_DAY_LETTERS = ["א", "ב", "ג", "ד", "ה", "ו", "ש"]; // Sun–Sat
const HEBREW_MONTHS = [
  "ינואר", "פברואר", "מרץ", "אפריל", "מאי", "יוני", "יולי", "אוגוסט", "ספטמבר", "אוקטובר", "נובמבר", "דצמבר",
];

const SHIFT_TYPES = [
  { id: "morning", label: "בוקר", count: 7, bg: "#5bd5fa", textDark: true },
  { id: "reinforcement", label: "תגבור", count: 3, bg: "#c3adf3", textDark: true },
  { id: "evening", label: "ערב", count: 0, bg: "#2b6678", textDark: false },
  { id: "night", label: "לילה", count: 4, bg: "#0b2831", textDark: false },
  { id: "security", label: "אבטחה", count: 2, bg: "#14ae5c", textDark: true },
] as const;

function getSelectedDateLabel(date: Date): string {
  const d = date.getDate();
  const m = HEBREW_MONTHS[date.getMonth()];
  const y = date.getFullYear();
  // Placeholder for Hebrew date and holiday - integrate Heb Cal API
  return `${d} ${m} ${y} - `;
}

export default function ShiftPickerContent() {
  const today = useMemo(() => {
    const t = new Date();
    t.setHours(0, 0, 0, 0);
    return t;
  }, []);

  const [viewDate, setViewDate] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedDate, setSelectedDate] = useState<Date>(() => new Date(today));

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const monthName = HEBREW_MONTHS[month];

  const firstDayOfWeek = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const calendarDays: (number | null)[] = [];
  for (let i = 0; i < firstDayOfWeek; i++) calendarDays.push(null);
  for (let d = 1; d <= daysInMonth; d++) calendarDays.push(d);

  const goPrevMonth = () => setViewDate(new Date(year, month - 1, 1));
  const goNextMonth = () => setViewDate(new Date(year, month + 1, 1));

  const isToday = (day: number | null) =>
    day !== null && today.getDate() === day && today.getMonth() === month && today.getFullYear() === year;
  const isSelected = (day: number | null) =>
    day !== null &&
    selectedDate.getDate() === day &&
    selectedDate.getMonth() === month &&
    selectedDate.getFullYear() === year;

  const handleSelectDate = (day: number | null) => {
    if (day === null) return;
    setSelectedDate(new Date(year, month, day));
  };

  return (
    <div className="w-full min-h-screen bg-[#f5f5f5] pb-4" dir="rtl">
      {/* Calendar card */}
      <div className="mx-auto mt-4 w-[calc(100%-24px)] max-w-[348px] rounded-lg bg-[#f5f5f5] p-3 shadow-[0px_5.31px_5.31px_0px_rgba(0,0,0,0.25)]">
        {/* Month header */}
        <div className="mb-3 flex items-center justify-between">
          <button
            type="button"
            onClick={goPrevMonth}
            className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-black/5"
            aria-label="חודש קודם"
          >
            <Image src="/icon_dropdown.svg" alt="" width={24} height={24} className="rotate-90 scale-y-[-1]" />
          </button>
          <span className="text-base font-bold text-black">{monthName} {year}</span>
          <button
            type="button"
            onClick={goNextMonth}
            className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-black/5"
            aria-label="חודש הבא"
          >
            <Image src="/icon_dropdown.svg" alt="" width={24} height={24} className="-rotate-90 scale-y-[-1]" />
          </button>
        </div>

        {/* Day letters */}
        <div className="grid grid-cols-7 gap-0 text-center">
          {HEBREW_DAY_LETTERS.map((letter, i) => (
            <div key={i} className="py-1 text-base font-bold text-black">
              {letter}
            </div>
          ))}
        </div>

        {/* Date grid */}
        <div className="grid grid-cols-7 gap-0">
          {calendarDays.map((day, idx) => {
            const todayCell = isToday(day);
            const selectedCell = isSelected(day);
            return (
              <div key={idx} className="flex aspect-square items-center justify-center">
                {day === null ? (
                  <span />
                ) : (
                  <button
                    type="button"
                    onClick={() => handleSelectDate(day)}
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-full text-base font-normal transition-colors",
                      todayCell || selectedCell
                        ? "bg-[var(--red-active,#ff4447)] text-white font-semibold"
                        : "text-black hover:bg-black/5"
                    )}
                  >
                    {day}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected date & holiday line */}
      <p className="mt-2 text-center text-base font-bold leading-normal text-black text-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">
        {getSelectedDateLabel(selectedDate)}
        {/* TODO: Add Hebrew date (Heb Cal API) and holiday when available */}
      </p>

      {/* Shift list */}
      <div className="mt-6 w-full">
        {SHIFT_TYPES.map((shift) => (
          <div
            key={shift.id}
            className="flex h-20 w-full items-center justify-between px-6"
            style={{ backgroundColor: shift.bg }}
          >
            <span
              className={cn(
                "text-lg font-bold",
                shift.textDark ? "text-black" : "text-white"
              )}
            >
              ({shift.count})
            </span>
            <span
              className={cn(
                "text-lg font-bold",
                shift.textDark ? "text-black" : "text-white"
              )}
            >
              {shift.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
