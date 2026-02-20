import { HEBREW_MONTHS, parseHebrewDate } from "@/app/lib/date-utils";
import { getShiftsForPickerDay } from "../data/shift";
import ShiftPickerContent from "./ShiftPickerContent";
import CalendarComponent from "../shiftMenegment/components/Calendar-component";

function getSelectedDateLabel(date: Date): string {
    const d = date.getDate();
    const m = HEBREW_MONTHS[date.getMonth()];
    const y = date.getFullYear();
    return `${d} ${m} ${y}`;
}

export default async function ShiftPickerPage({
    searchParams,
}: {
    searchParams: Promise<{ date?: string }>;
}) {
    const { date } = await searchParams;
    const paramDate = date ?? new Date().toLocaleDateString("he-IL");
    const selectedDate = parseHebrewDate(paramDate) ?? new Date();
    const shiftsData = await getShiftsForPickerDay(selectedDate);

    return (
        <div className="flex flex-col items-center w-full">
            <h1 className="text-lg font-bold text-black px-4 py-2">
                לוח משמרות
            </h1>

            <CalendarComponent propsDate={paramDate} />
            
            {/* Selected date & holiday line */}
            <p className="mt-2 text-center text-base font-bold leading-normal text-black text-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">
                {getSelectedDateLabel(selectedDate)}
                {/* TODO: Add Hebrew date (Heb Cal API) and holiday when available */}
            </p>

            <ShiftPickerContent shiftsData={shiftsData} />
        </div>
    );
}
