"use client";

import { useState } from "react";
import { User } from "@/app/(user)/data/definitions";
import {
  cancelShift,
  ScheduleRow,
  updateShiftAmbulance,
} from "../../../lib/actions";
import { DataTable } from "./data-table";
import { getColumns } from "./columns";

function updateShiftDriverInRows(
  rows: ScheduleRow[],
  shiftId: string,
  driver: User
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

function removeShiftFromRows(rows: ScheduleRow[], shiftId: string): ScheduleRow[] {
  return rows
    .map((row) => ({
      ...row,
      shiftsByType: {
        night: row.shiftsByType.night.filter((s) => s.id !== shiftId),
        morning: row.shiftsByType.morning.filter((s) => s.id !== shiftId),
        reinforcement: row.shiftsByType.reinforcement.filter(
          (s) => s.id !== shiftId,
        ),
        evening: row.shiftsByType.evening.filter((s) => s.id !== shiftId),
      },
    }))
    .filter(
      (row) =>
        row.shiftsByType.night.length > 0 ||
        row.shiftsByType.morning.length > 0 ||
        row.shiftsByType.reinforcement.length > 0 ||
        row.shiftsByType.evening.length > 0,
    );
}

export default function ScheduleTable({
  initialData,
}: {
  initialData: ScheduleRow[];
}) {
  const [scheduleRows, setScheduleRows] = useState(initialData);

  const onDriverAssigned = (shiftId: string, driver: User) => {
    setScheduleRows((prev) => updateShiftDriverInRows(prev, shiftId, driver));
  };

  const onAmbulanceBlur = async (shiftId: string, ambulanceId: string) => {
    await updateShiftAmbulance(shiftId, ambulanceId || null);
  };

  const onDeleteShift = async (shiftId: string) => {
    await cancelShift(shiftId);
    setScheduleRows((prev) => removeShiftFromRows(prev, shiftId));
  };

  return (
    <DataTable
      columns={getColumns(onDriverAssigned, onAmbulanceBlur, onDeleteShift)}
      data={scheduleRows}
    />
  );
}
