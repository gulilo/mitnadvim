import type { DbShift } from "../../data/shift";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/ui/table"
import SchedualCell from "./schedualCell";


export default function WhiteSchedual({ shift }: { shift: DbShift[] }) {
  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
          <TableHead>סוג</TableHead>
          <TableHead>נקודת הזנקה</TableHead>
          <TableHead>לילה</TableHead>
          <TableHead>בוקר</TableHead>
          <TableHead>תגבור</TableHead>
          <TableHead>ערב</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {shift.map((shift) => (
            <TableRow key={shift.id}>
              <TableCell><SchedualCell shift={shift} /></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
</div>
     
  );
}