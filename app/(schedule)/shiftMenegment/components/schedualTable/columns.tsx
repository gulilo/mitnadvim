"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ScheduleRow } from "../../../lib/actions"
import type { DbUser } from "@/app/(user)/data/definitions"
import SchedualCell from "./schedualCell"

export function getColumns(
  onDriverAssigned: (shiftId: string, driver: DbUser) => void,
  onAmbulanceBlur: (shiftId: string, ambulanceNumber: string) => void
): ColumnDef<ScheduleRow>[] {
  return [
    {
      accessorKey: "ambulance_type",
      header: "סוג",
      cell: ({ row }) =>
        row.original.ambulance_type === "white" ? (
          <div className="p-5">אמבולנס לבן</div>
        ) : (
          <div className="p-5">אמבולנס טיפול נמרץ</div>
        ),
    },
    {
      accessorKey: "launch_point",
      header: "נקודת הזנקה",
      cell: ({ row }) => row.original.launch_point.name,
    },
    {
      accessorKey: "night",
      header: "לילה",
      cell: ({ row }) => (
        <SchedualCell
          shifts={row.original.shiftsByType.night}
          onDriverAssigned={onDriverAssigned}
          onAmbulanceBlur={onAmbulanceBlur}
        />
      ),
    },
    {
      accessorKey: "morning",
      header: "בוקר",
      cell: ({ row }) => (
        <SchedualCell
          shifts={row.original.shiftsByType.morning}
          onDriverAssigned={onDriverAssigned}
          onAmbulanceBlur={onAmbulanceBlur}
        />
      ),
    },
    {
      accessorKey: "reinforcement",
      header: "תגבור",
      cell: ({ row }) => (
        <SchedualCell
          shifts={row.original.shiftsByType.reinforcement}
          onDriverAssigned={onDriverAssigned}
          onAmbulanceBlur={onAmbulanceBlur}
        />
      ),
    },
    {
      accessorKey: "evening",
      header: "ערב",
      cell: ({ row }) => (
        <SchedualCell
          shifts={row.original.shiftsByType.evening}
          onDriverAssigned={onDriverAssigned}
          onAmbulanceBlur={onAmbulanceBlur}
        />
      ),
    },
  ];
}