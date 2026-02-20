import { Popover, PopoverContent, PopoverTrigger } from "@/app/components/ui/popover";
import type { DisplayShift } from "../../../data/shift";
import type { DbUser } from "@/app/(user)/data/definitions";
import Image from "next/image";
import Assinment from "../assinment";

export default function SchedualCell({
  shifts,
  onDriverAssigned,
  onAmbulanceBlur,
}: {
  shifts: DisplayShift[];
  onDriverAssigned: (shiftId: string, driver: DbUser) => void;
  onAmbulanceBlur: (shiftId: string, ambulanceNumber: string) => void;
}) {
  if (shifts.length === 0) return null;
  return (
    <div className="flex flex-col gap-2">
      {shifts.map((shift) => (
        <div
          key={shift.id}
          className="flex flex-col items-center justify-center "
        >
          <div className="flex flex-row items-center justify-between">
            <div className="flex flex-row items-center justify-between gap-1">
              {shift.driver ? (
                <Image
                  src={"/icon_avatar-driver dafault (no assignment).svg"}
                  alt="driver"
                  width={20}
                  height={20}
                />
              ) : (
                <Image
                  src={"/driver icon.svg"}
                  alt="driver"
                  width={20}
                  height={20}
                />
              )}
              <Popover>
                <PopoverTrigger>
                  {shift.driver ? <p>{shift.driver.first_name} {shift.driver.last_name}</p> : <p className="border-b border-black w-20 h-4"></p>}
                </PopoverTrigger>
                <PopoverContent>
                  <Assinment shift={shift} onDriverAssigned={onDriverAssigned} />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          {
            shift.ambulance_type === "atan" && (
              <div className="flex flex-row items-center justify-between">
                <Image
                  src={"/Paramedic Icon.svg"}
                  alt="paramedic"
                  width={20}
                  height={20}
                />
                <Popover>
                  <PopoverTrigger>
                    {shift.driver ? <p>{shift.driver.first_name} {shift.driver.last_name}</p> : <p className="border-b border-black w-20 h-4"></p>}
                  </PopoverTrigger>
                  <PopoverContent>
                    <Assinment shift={shift} onDriverAssigned={onDriverAssigned} />
                  </PopoverContent>
                </Popover>
              </div>
            )
          }
          < div className="flex flex-row items-center justify-between gap-2" >
            <Image
              src={"/ambulance icon.svg"}
              alt="ambulance"
              width={20}
              height={20}
            />
            <input
              key={`${shift.id}-${shift.ambulance?.number ?? ""}`}
              type="text"
              defaultValue={shift.ambulance?.number ?? ""}
              onBlur={(e) => onAmbulanceBlur(shift.id, e.target.value)}
              className="border-b border-black px-2 py-1 w-10 text-center"
            />
            <p>
              {shift.start_time} - {shift.end_time}
            </p>
          </div >
        </div >
      ))
      }
    </div >
  );
}