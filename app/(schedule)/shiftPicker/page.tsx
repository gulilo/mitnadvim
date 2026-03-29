import { HEBREW_MONTHS, parseHebrewDate } from "@/app/lib/date-utils";
import { getShiftsForPickerDay } from "../data/shift";
import ShiftPickerContent from "./components/ShiftPickerContent";
import CalendarComponent from "../shiftMenegment/components/Calendar-component";
import { getUserTags } from "@/app/(user)/data/user";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

function getSelectedDateLabel(date: Date): string {
    const d = date.getUTCDate();
    const m = HEBREW_MONTHS[date.getUTCMonth()];
    const y = date.getUTCFullYear();
    return `${d} ${m} ${y}`;
}

export default async function ShiftPickerPage({
    searchParams,
}: {
    searchParams: Promise<{ date?: string }>;
}) {
    const session = await auth();
    if (!session?.user) {
        redirect("/login");
    }

    const tags = await getUserTags(session.user.id);

    const { date } = await searchParams;
    console.log("date", date);
    const paramDate = date ?? new Date().toLocaleDateString("he-IL");
    console.log("paramDate", paramDate);
    const selectedDate = parseHebrewDate(paramDate) ?? new Date();
    console.log("selectedDate", selectedDate);
    const shiftsData = await getShiftsForPickerDay(selectedDate, tags);
    console.log("shiftsData", shiftsData);

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

            <ShiftPickerContent shiftsData={shiftsData} tags={tags} />
        </div>
    );
}
