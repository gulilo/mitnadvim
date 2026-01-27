"use client"

import { ColumnDef } from "@tanstack/react-table"
import { DbShift } from "../../../data/shift"
import SchedualCell from "./schedualCell"

export const columns: ColumnDef<DbShift>[] = [
    {
        accessorKey: "type",
        header: "סוג",
        cell: ({ row }) => {
            return <div>אמבולנס לבן</div>
        },
    },
    {
        accessorKey: "launch_point_id",
        header: "נקודת הזנקה",
    },
    {
        accessorKey: "night",
        header: "לילה",
        cell: ({ row }) => {
            console.log(row)
            return <SchedualCell shift={row.original} />
        },
    },
    {
        accessorKey: "morning",
        header: "בוקר",
    },
    {
        accessorKey: "afternoon",
        header: "תגבור",
    },
    {
        accessorKey: "evening",
        header: "ערב",
    },
]