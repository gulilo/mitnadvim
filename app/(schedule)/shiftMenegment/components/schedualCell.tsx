import type { DbShift } from "../../data/shift";

export default function SchedualCell({ shift }: { shift: DbShift }) {
  return (
    <div>
      <p>{shift.shift_type}</p>
    </div>
  );
}