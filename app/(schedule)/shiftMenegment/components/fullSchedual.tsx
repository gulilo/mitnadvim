import { getDisplayShifts } from "../../lib/actions";
import { parseHebrewDate } from "@/app/lib/date-utils";
import ScheduleTable from "./schedualTable/schedule-table";

export default async function FullSchedual({ date }: { date: string }) {
  const dateObj = parseHebrewDate(date);
  if (!dateObj) {
    console.error("Failed to parse date:", date);
    return <div>Invalid date</div>;
  }
  dateObj.setHours(0, 0, 0, 0); // Set to start of day to ensure proper date comparison

  const scheduleRows = await getDisplayShifts(dateObj);
  return (
    <div className="px-5">
      <ScheduleTable initialData={scheduleRows} />
    </div>
  );
}
