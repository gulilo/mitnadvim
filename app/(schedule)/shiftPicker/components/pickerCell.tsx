import type { DisplayShift } from "../../data/shift";
import Image from "next/image";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/app/components/ui/accordion";
import { HEBREW_MONTHS } from "@/app/lib/date-utils";

function formatShiftDateTime(date: Date | string, time: string): string {
    const d = typeof date === "string" ? new Date(date) : date;
    const day = d.getDate();
    const month = HEBREW_MONTHS[d.getMonth()];
    const year = d.getFullYear();
    return `${day} ב${month} ${year} בשעה ${time}`;
}

export default function PickerCell({ shift }: { shift: DisplayShift }) {
    return (
        <Accordion type="multiple" className="w-full">
            <AccordionItem value={shift.id}>
                <AccordionTrigger className="flex flex-row h-20 w-full px-2 items-center justify-between gap-4 text-lg font-bold border border-red-500">
                    <p>{shift.launch_point.name}</p>
                    <div className="flex flex-col">
                        <Image src={"/ambulance icon.svg"} alt="ambulance" width={20} height={20} />
                        <p>{shift.ambulance?.number}</p>
                    </div>
                    {shift.driver ?
                        (<Image src={"/icon_avatar-driver dafault (no assignment).svg"} alt="driver" width={20} height={20} />)
                        : (<Image src={"/Driver icon.svg"} alt="driver" width={20} height={20} />)}

                    {shift.slots.map((slot, index) => (
                        slot ? (
                            <div key={slot.id}>{slot.user?.first_name ?? "—"}</div>
                        ) : (
                            <Image key={`empty-${index}`} src="/Icon.svg" alt="slot" width={20} height={20} />
                        )
                    ))}
                </AccordionTrigger>
                <AccordionContent className="flex flex-col w-full px-4 py-6 text-lg font-bold border border-red-500">

                    <div className="flex flex-row justify-center items-center gap-4">
                        <p>{shift.launch_point.name}</p>
                        <div className="flex flex-col items-center">
                            <Image src={"/ambulance icon.svg"} alt="ambulance" width={20} height={20} />
                            <p>{shift.ambulance?.number}</p>
                        </div>

                    </div>
                    <div className="py-4">
                        <p>תחילת משמרת: {formatShiftDateTime(shift.start_date, shift.start_time)}</p>
                        <p>סיום משמרת: {formatShiftDateTime(shift.end_date, shift.end_time)}</p>
                    </div>
                    {shift.driver ?
                        <div className="flex flex-row items-center gap-4">
                            <Image src={"/icon_avatar-driver dafault (no assignment).svg"} alt="driver" width={20} height={20} />
                            <p>{shift.driver?.first_name} {shift.driver?.last_name}</p>
                        </div>
                        : (<Image src={"/Driver icon.svg"} alt="driver" width={20} height={20} />)
                    }
                    {shift.ambulance_type === "intensive" ? (
                        <Image src={"/Paramedic Icon.svg"} alt="paramedic" width={20} height={20} />
                    ) : null}

                    <div className="flex flex-col gap-4">
                        {shift.slots.map((slot, index) => (
                            slot ? (
                                <div key={slot.id}>{slot.user?.first_name ?? "—"}</div>
                            ) : (
                                <Image key={`empty-${index}`} src="/Icon.svg" alt="slot" width={40} height={40} />
                            )
                        ))}
                    </div>

                    <div className="flex flex-row justify-center items-center">
                        <button className="mt-4 h-12 bg-[#FF0000] text-white rounded-md px-4">
                            שבץ אותי למשמרת
                        </button>
                    </div>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    )
};