import WhiteSchedual from "./whiteSchedual";
import { getShiftsByDate } from "../../data/shift";

export default async function FullSchedual({ date }: { date: string }) {
  // Parse the date string (YYYY-MM-DD) to a Date object
  const dateObj = new Date(date);
  dateObj.setHours(0, 0, 0, 0); // Set to start of day to ensure proper date comparison
  
  const shifts = await getShiftsByDate(dateObj);
  console.log(shifts);
  
  return (
    <div>
      <WhiteSchedual />
    </div>
  );
}
