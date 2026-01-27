import { getShiftsByDate } from "../../data/shift";
import { parseHebrewDate } from "@/app/lib/date-utils";
import { columns } from "./schedualTable/columns";
import { DataTable } from "./schedualTable/data-table";

export default async function FullSchedual({ date }: { date: string }) {
  console.log("date", date)
  // Parse the Hebrew locale date string (DD/MM/YYYY) to a Date object
  const dateObj = parseHebrewDate(date);
  console.log("dateObj", dateObj)
  if (!dateObj) {
    console.error("Failed to parse date:", date);
    return <div>Invalid date</div>;
  }
  dateObj.setHours(0, 0, 0, 0); // Set to start of day to ensure proper date comparison
  
  const shifts = await getShiftsByDate(dateObj);
  console.log("shifts", shifts)
  return (
    <div>
       {/* <WhiteSchedual shift={shifts.filter(shift => shift.ambulance_type === "white" || shift.ambulance_type === "atan")}/> */}
       <DataTable columns={columns} data={shifts} />
    </div>
  );
}
