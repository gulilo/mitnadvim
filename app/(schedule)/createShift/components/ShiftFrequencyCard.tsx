import { RadioGroup, RadioGroupItem } from "@/app/components/ui/radio-group";
import { Label } from "@/app/components/ui/label";

export function ShiftFrequencyCard({
  editable = true,
  value,
  onChange,
}: {
  editable?: boolean;
  value: "permanent" | "one-time" | undefined;
  onChange: (value: "permanent" | "one-time") => void;
}) {
  return (
    <div className="relative border border-red-500 rounded-lg p-4 row-start-1">
      <div className="space-y-4">
        <RadioGroup
          value={value}
          disabled={!editable}
          onValueChange={(nextValue) => onChange(nextValue as "permanent" | "one-time")}
          className="space-y-3"
        >
          <div className="flex flex-row items-center justify-start gap-3">
            <RadioGroupItem value="permanent" id="permanent" />
            <Label htmlFor="permanent" className="text-[20px] font-semibold cursor-pointer">
              משמרת קבועה
            </Label>
          </div>
          <div className="flex flex-row items-center justify-start gap-3">
            <RadioGroupItem value="one-time" id="one-time" />
            <Label htmlFor="one-time" className="text-[20px] font-semibold cursor-pointer">
              משמרת חד פעמית
            </Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  );
}
