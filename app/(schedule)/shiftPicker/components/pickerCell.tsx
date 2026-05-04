"use client";

import type { DisplayShift } from "../../data/shift";
import Image from "next/image";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/app/components/ui/accordion";
import { HEBREW_MONTHS } from "@/app/lib/date-utils";
import RegisterButton from "./registerButton";
import { Tag } from "@/app/(user)/data/definitions";
import { useState } from "react";
import { approveShiftSlot, denyShiftSlot, removedriverfromshift } from "../../lib/actions";
import { ButtonGroup } from "@/app/components/ui/button-group";
import { Button } from "@/app/components/ui/button";
import UserRoleIcon from "@/app/(user)/profile/components/userRoleIcon";
import { tag } from "@prisma/client";

function formatShiftDateTime(date: Date | string, time: string): string {
    const d = typeof date === "string" ? new Date(date) : date;
    const day = d.getDate();
    const month = HEBREW_MONTHS[d.getMonth()];
    const year = d.getFullYear();
    return `${day} ב${month} ${year} בשעה ${time}`;
}

export default function PickerCell({ userId, shift, tags }: { userId: string, shift: DisplayShift, tags: tag[] }) {
    const [open, setOpen] = useState<string[]>([]);

    const paddedConfirmedSlots = [...shift.confirmed_slots].concat(Array(shift.number_of_slots - shift.confirmed_slots.length).fill(null));
    return (
        <Accordion type="multiple" className="w-full" value={open} onValueChange={setOpen}>
            <AccordionItem value={shift.id}>

                <AccordionTrigger className="flex flex-row h-20 w-full px-2 items-center justify-between gap-4 text-lg font-bold border border-red-500 data-[state=open]:hidden">
                    <p>{shift.launch_point.name}</p>
                    <div className="flex flex-row items-center gap-4 justify-between">
                        <div className="flex flex-col">
                            <Image src={"/ambulance.svg"} alt="ambulance" width={20} height={20} />
                            <p>{shift.ambulance?.number}</p>
                        </div>
                        {shift.driver ?
                            (<Image src={"/avatar_driver_dafault.svg"} alt="driver" width={20} height={20} />)
                            : (<Image src={"/driver.svg"} alt="driver" width={20} height={20} />)}
                    </div>
                    <div className="flex flex-row items-center gap-10">
                        {paddedConfirmedSlots.map((slot, index) => (
                            slot ? (
                                <UserRoleIcon key={slot.id} user={slot.user} tags={tags} />
                            ) : (
                                <Image key={`empty-${index}`} src="/picker_empty.svg" alt="slot" width={20} height={20} />
                            )
                        ))}
                    </div>
                </AccordionTrigger>

                <AccordionContent className="flex flex-col w-full px-4 py-6 text-lg font-bold border border-red-500">

                    <div className="flex flex-col gap-4" onClick={() => setOpen([])}>
                        <div className="flex flex-row justify-center items-center gap-4">
                            <p>{shift.launch_point.name}</p>
                            <div className="flex flex-col items-center">
                                <Image src={"/ambulance.svg"} alt="ambulance" width={20} height={20} />
                                <p>{shift.ambulance?.number}</p>
                            </div>

                        </div>
                        <div className="py-4">
                            <p>תחילת משמרת: {formatShiftDateTime(shift.start_date, shift.start_time)}</p>
                            <p>סיום משמרת: {formatShiftDateTime(shift.end_date, shift.end_time)}</p>
                        </div>
                    </div>
                    {shift.driver ?
                        <div className="flex flex-col items-center justify-center">
                            <div className="flex flex-row items-center gap-4">
                                <Image src={"/avatar_driver_dafault.svg"} alt="driver" width={20} height={20} />
                                <p>{shift.driver?.first_name} {shift.driver?.last_name}</p>
                            </div>
                            {tags.some((tag) => tag.name === "רכז שיבוצים") ?
                                (<button onClick={() => removedriverfromshift(shift.id)} className="border-3 border-red-500 px-4 text-red-500 py-2 rounded-md">ביטול שיבוץ</button>)
                                : null
                            }
                        </div>
                        : (<Image src={"/driver.svg"} alt="driver" width={20} height={20} />)
                    }
                    {shift.ambulance_type === "atan" ? (
                        <Image src={"/paramedic.svg"} alt="paramedic" width={20} height={20} />
                    ) : null}

                    <div className="flex flex-col gap-4 pt-5">
                        {paddedConfirmedSlots.map((slot, index) => (
                            slot ? (
                                <div key={slot.id}>
                                    <div className="flex flex-row items-center gap-4">
                                        <UserRoleIcon key={slot.id} user={slot.user} tags={tags} />
                                        <p>{slot.user.first_name} {slot.user.last_name}</p>
                                    </div>
                                    {tags.some((tag) => tag.name === "רכז שיבוצים") ? (
                                        <button onClick={() => denyShiftSlot(slot.id)} className="border-3 border-red-500 px-4 text-red-500 py-2 rounded-md">ביטול שיבוץ</button>
                                    ) : null}
                                </div>
                            ) : (
                                <Image key={`empty-${index}`} src="/picker_empty.svg" alt="slot" width={40} height={40} />
                            )
                        ))}
                        <p>מתנה:</p>
                        {tags.some((tag) => tag.name === "רכז שיבוצים") ?
                            shift.pending_slots.map((slot, index) => (
                                slot ? (
                                    <div key={slot.id}>
                                        <UserRoleIcon key={slot.id} user={slot.user} tags={tags} />
                                        <ButtonGroup dir="ltr">
                                            <Button variant="destructive" className="bg-red-500 text-white" onClick={() => approveShiftSlot(slot.id)}>אישור</Button>
                                            <Button variant="outline" className=" bg-transparent" onClick={() => denyShiftSlot(slot.id)}>ביטול</Button>
                                        </ButtonGroup>
                                    </div>
                                ) : (
                                    <Image key={`empty-${index}`} src="/picker_empty.svg" alt="slot" width={40} height={40} />
                                )
                            )) : null}
                    </div>

                    <div className="flex flex-row justify-center items-center">
                        <RegisterButton userId={userId} shift={shift} tags={tags} />
                    </div>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    )
};