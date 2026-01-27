import type { DbShift } from "../../../data/shift";
import Image from "next/image";

export default function SchedualCell({ shift }: { shift: DbShift }) {
  return (
    <div className="flex flex-col items-center justify-center border-2 border-red-500">
      <div className="flex flex-row items-center justify-between">
        {shift.driver_id ?
          <div className="flex flex-row items-center justify-between">
            <Image
              src={"/icon_avatar-driver dafault (no assignment).svg"}
              alt="driver"
              width={20}
              height={20} />
            <p>{shift.driver_id}</p>
          </div>
          : <Image
            src={"/driver icon.svg"}
            alt="driver"
            width={20}
            height={20} />}
      </div>
      {shift.ambulance_type === "atan" &&
        <div className="flex flex-row items-center justify-between">
          <Image
            src={"/Paramedic Icon.svg"}
            alt="paramedic"
            width={20}
            height={20} />
          <p>name</p>
        </div>}
      <div className="flex flex-row items-center justify-between">
        <Image
          src={"/ambulance icon.svg"}
          alt="ambulance"
          width={20}
          height={20} />
        <p>{shift.ambulance_id}</p>
        <p>{shift.start_time} - {shift.end_time}</p>
      </div>

      <p>{shift.shift_type}</p>
    </div>
  );
}