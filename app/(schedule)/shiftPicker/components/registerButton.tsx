"use client";
import { DisplayShift } from "../../data/shift";
import { registerShiftSlot } from "../../lib/actions";
import { Tag } from "@/app/(user)/data/definitions";


const NOAR_TAG_NAME = "נוער";
function isNoar(tags: Tag[]): boolean {
    return tags.some((t) => t.name === NOAR_TAG_NAME);
}

function isPending(shift: DisplayShift, tags: Tag[]): boolean {
    return isNoar(tags) || shift.ambulance_type === "atan";
}

export default function RegisterButton({ shift, tags }: { shift: DisplayShift, tags: Tag[] }) {
    return (
        <button className="mt-4 h-12 bg-[#FF0000] text-white rounded-md px-4"
            onClick={() => registerShiftSlot(shift, tags, isPending(shift, tags))}>
            {isPending(shift, tags) ? "הוסף אותי לרשימת המתנה" : "שבץ אותי למשמרת"}
        </button>
    )
}