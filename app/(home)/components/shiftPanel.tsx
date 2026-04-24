"use client"
import { getShiftPanelShifts, ShiftPanelShift } from "@/app/(schedule)/data/shift";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/ui/table"
import { shift_type } from "@/generated/prisma/enums";
import { useRouter } from "next/navigation";
import { DAYS_OF_WEEK } from "@/app/lib/date-utils";

const SHIFT_TYPE_LABELS: Record<shift_type, string> = {
  day: "בוקר",
  reinforcement: "תגבור",
  evening: "ערב",
  night: "לילה",
  overstaffed: "מעל התקן",
  security: "אבטחה",
};

const AMBULANCE_TYPE_LABELS: Record<string, string> = {
  white: "לבן",
  atan: "נט״ן",
};

// const shifts = [
//   {
//     date: new Date("2025-07-13"),
//     duty: "ערב",
//     location: "לבן, ת״א 1",
//   },
//   {
//     date: new Date("2025-07-15"),
//     duty: "לילה",
//     location: "נט״ן, מזא״ה",
//   },
//   {
//     date: new Date("2025-07-26"),
//     duty: "אבטחה",
//     location: "איצטדיון בלומפילד",
//   },
// ];

export default function ShiftPanel({ shifts }: { shifts: ShiftPanelShift[] }) {
  const router = useRouter();

  function handleShiftClick(date: Date) {
    const dateString = date.toLocaleDateString("he-IL");
    router.push(`/shiftPicker?date=${dateString}`);
  }

  return (
    <section className="relative mt-8">
      <div className="absolute -top-4 right-8 rounded-full bg-white px-3 py-1 text-sm font-semibold text-[#111]">
        המשמרות שלי
      </div>
      <div className="rounded-3xl border-2 border-[#fc5c5c] bg-white px-4 pb-6 pt-3 shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="text-l">
              <TableHead className="font-bold text-right">יום ותאריך</TableHead>
              <TableHead className="font-bold text-right">משמרת</TableHead>
              <TableHead className="font-bold text-right">נה״ז</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {shifts.map((shift) => (
              <TableRow onClick={() => handleShiftClick(shift.date)} key={shift.date.toISOString()}>
                <TableCell>{DAYS_OF_WEEK[shift.date.getDay()].name}, {shift.date.toLocaleDateString("he-IL")}</TableCell>
                <TableCell>{SHIFT_TYPE_LABELS[shift.shiftType]}</TableCell>
                <TableCell>{AMBULANCE_TYPE_LABELS[shift.ambulanceType]}, {shift.launchPoint.name}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </section>
  );
}
