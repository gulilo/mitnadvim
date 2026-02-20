import React from "react";
import FullSchedual from "./components/fullSchedual";
import CalendarComponent from "./components/Calendar-component";

export default async function ShiftMenegmentPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>
}) {
  const { date } = await searchParams
  // Use Hebrew locale format (DD/MM/YYYY)
  const paramDate = date ? date : new Date().toLocaleDateString("he-IL");
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-row justify-between items-center mx-auto w-full px-10 max-w-3xl">
      
      
      <CalendarComponent propsDate={paramDate}/>

        <div className="flex flex-col gap-4">
          <h1>סידור עבודה</h1>
        </div>
      </div>
      {/* <FullSchedual date={date?.toISOString() || ''} /> */}
      {paramDate && <FullSchedual date={paramDate} />}
    </div>
  );
}
