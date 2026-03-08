"use client";
import { DisplayShift } from "../../data/shift";
import { registerShiftSlot } from "../../lib/actions";
import Image from "next/image";

export default function RegisterButton({ shift }: { shift: DisplayShift }) {
    return (
        <button onClick={() => registerShiftSlot(shift)}>
            <Image src="/Icon.svg" alt="slot" width={40} height={40} />
        </button>
    )
}