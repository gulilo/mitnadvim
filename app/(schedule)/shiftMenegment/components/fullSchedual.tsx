"use client";

import { fetchDisplayShiftsByDate } from "../../lib/actions";
import { Card, CardHeader, CardTitle } from "@/app/components/ui/card";
import { useEffect, useState } from "react";

export default function FullSchedual({ date }: { date: Date }) {
  const [displayShifts, setDisplayShifts] = useState<Array<[string, any[]]>>(
    []
  );

  useEffect(() => {
    async function loadShifts() {
      try {
        const shifts = await fetchDisplayShiftsByDate(date);
        setDisplayShifts(shifts);
      } catch (err) {
        console.error("Error loading shifts:", err);
      } 
    }
    loadShifts();
  }, [date]);

  return (
    <div>
      <h1>Full Schedual</h1>
      {displayShifts.map(([launchPointId, shifts]) => (
        <Card className="bg-accent" key={launchPointId}>
          <CardHeader>
            <CardTitle>{launchPointId}</CardTitle>
          </CardHeader>
          {shifts.map((shift) => (
            <Card key={shift.id}>
              <CardHeader>
                <CardTitle>{shift.start_time} - {shift.end_time}</CardTitle>
              </CardHeader>
            </Card>
          ))}
        </Card>
      ))}
    </div>
  );
}
