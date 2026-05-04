"use client";
import { DisplayShift, ShiftSlot } from "../../data/shift";
import { registerShiftSlot, denyShiftSlot } from "../../lib/actions";
import { Tag } from "@/app/(user)/data/definitions";


const NOAR_TAG_NAME = "נוער";
function isNoar(tags: Tag[]): boolean {
    return tags.some((t) => t.name === NOAR_TAG_NAME);
}

function isPending(shift: DisplayShift, tags: Tag[]): boolean {
    return isNoar(tags) || shift.ambulance_type === "atan";
}

function getShiftSlot(shift: DisplayShift, userId: string): ShiftSlot | null {
    return shift.confirmed_slots.find((slot) => slot.user_id === userId) || shift.pending_slots.find((slot) => slot.user_id === userId) || null;
}

export default function RegisterButton({ userId, shift, tags }: { userId: string, shift: DisplayShift, tags: Tag[] }) {
    const slot = getShiftSlot(shift, userId);
    const buttonText = slot ?
        "ביטול שיבוץ" :
        isPending(shift, tags) ?
            "הוסף אותי לרשימת המתנה" : "שבץ אותי למשמרת";

    return (
        <button className="mt-4 h-12 bg-[#FF0000] text-white rounded-md px-4"
            onClick={() => {slot ? denyShiftSlot(slot.id) : registerShiftSlot(shift, tags, isPending(shift, tags))}}>
            {buttonText}
        </button>
    )
}