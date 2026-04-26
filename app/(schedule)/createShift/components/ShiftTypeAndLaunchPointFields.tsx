import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { Label } from "@/app/components/ui/label";
import { shift_type } from "@prisma/client";
import { LaunchPoint } from "../../data/launchPoint";
import { SHIFT_TYPES } from "./create-shift-form.constants";

export function ShiftTypeAndLaunchPointFields({
  shiftTypeValue,
  launchPoint,
  launchPoints,
  shiftTypes,
  onShiftTypeChange,
  onLaunchPointChange,
}: {
  shiftTypeValue: shift_type;
  launchPoint: string;
  launchPoints: LaunchPoint[];
  shiftTypes: readonly { key: shift_type; label: string }[];
  onShiftTypeChange: (value: string) => void;
  onLaunchPointChange: (value: string) => void;
}) {
  console.log("launchPoint", launchPoint);
  const overstaffedLaunchPoint = launchPoints.find((lp) => lp.name === SHIFT_TYPES.find((st) => st.key === "overstaffed")?.label)?.id;
  if (!overstaffedLaunchPoint) {
    throw new Error("Overstaffed launch point not found");
  }
  return (
    <div className="flex flex-col justify-start items-center mx-auto gap-6 w-full mb-6">
      <div className="flex flex-row items-center gap-4 w-80">
        <Label className="text-[20px] font-semibold whitespace-nowrap">סוג משמרת:</Label>
        <div className="relative flex-1">
          <Select value={shiftTypeValue} onValueChange={onShiftTypeChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="" />
            </SelectTrigger>
            <SelectContent>
              {shiftTypes.map((shiftType) => (
                <SelectItem key={shiftType.key} value={shiftType.key}>
                  {shiftType.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex flex-row items-center gap-4 w-80">
        <Label className="text-[20px] font-semibold whitespace-nowrap">נקודת הזנקה:</Label>
        <div className="relative flex-1">
          <Select value={launchPoint} onValueChange={onLaunchPointChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="" />
            </SelectTrigger>
            <SelectContent>
              {shiftTypeValue === "overstaffed" ? (
                <SelectItem value={overstaffedLaunchPoint}>מעל התקן</SelectItem>
              ) : (
                launchPoints.map((lp) => (
                  <SelectItem key={lp.id} value={lp.id}>
                    {lp.name}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
