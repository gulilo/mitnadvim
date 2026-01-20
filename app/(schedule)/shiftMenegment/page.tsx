"use client";

import { Calendar } from "@/app/components/ui/calendar";
import React from "react";
import FullSchedual from "./components/fullSchedual";

export default function ShiftMenegmentPage() {
  const [date, setDate] = React.useState<Date | undefined>(new Date());

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-row justify-between items-center mx-auto w-full px-10 max-w-3xl">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          captionLayout="dropdown"
          className="rounded-lg border w-full max-w-sm"
        />

        <div className="flex flex-col gap-4">
          <h1>סידור עבודה</h1>
        </div>
      </div>
      {/* <FullSchedual date={date?.toISOString} /> */}
      {/* {date && <FullSchedual date={date.toISOString().split('T')[0]} />} */}
    </div>
  );
}
