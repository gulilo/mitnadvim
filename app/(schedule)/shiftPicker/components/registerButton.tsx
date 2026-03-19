"use client";
import { DisplayShift } from "../../data/shift";
import { registerShiftSlot } from "../../lib/actions";
import Image from "next/image";
import { DbTag } from "@/app/(user)/data/definitions";


const NOAR_TAG_NAME = "נוער";
function  isNoar(tags: DbTag[]): boolean {
  return tags.some((t) => t.name === NOAR_TAG_NAME);
}

export default function RegisterButton({ shift, tags }: { shift: DisplayShift, tags: DbTag[] }) {
    return (
        <button className="mt-4 h-12 bg-[#FF0000] text-white rounded-md px-4"
        onClick={() => registerShiftSlot(shift, tags, isNoar(tags))}>
            {isNoar(tags) ? "הוסף אותי לרשימת המתנה" : "שבץ אותי למשמרת"}
        </button>
    )
}