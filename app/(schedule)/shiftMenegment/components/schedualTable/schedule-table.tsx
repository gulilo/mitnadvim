"use client";

import { useState } from "react";
import { DbUser } from "@/app/(user)/data/definitions";
import { ScheduleRow, updateShiftAmbulance } from "../../../lib/actions";
import { DataTable } from "./data-table";
import { getColumns } from "./columns";

function updateShiftDriverInRows(
  rows: ScheduleRow[],
  shiftId: string,
  driver: DbUser
): ScheduleRow[] {
  return rows.map((row) => ({
    ...row,
    shiftsByType: Object.fromEntries(
      Object.entries(row.shiftsByType).map(([key, shifts]) => [
        key,
        shifts.map((s) => (s.id === shiftId ? { ...s, driver } : s)),
      ])
    ) as ScheduleRow["shiftsByType"],
  }));
}

export default function ScheduleTable({
  initialData,
}: {
  initialData: ScheduleRow[];
}) {
  const [scheduleRows, setScheduleRows] = useState(initialData);

  const onDriverAssigned = (shiftId: string, driver: DbUser) => {
    setScheduleRows((prev) => updateShiftDriverInRows(prev, shiftId, driver));
  };

  const onAmbulanceBlur = async (shiftId: string, ambulanceId: string) => {
    await updateShiftAmbulance(shiftId, ambulanceId || null);
  };

  return (
    <DataTable
      columns={getColumns(onDriverAssigned, onAmbulanceBlur)}
      data={scheduleRows}
    />
  );
}
