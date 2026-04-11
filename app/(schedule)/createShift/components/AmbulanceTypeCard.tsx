import { RadioGroup, RadioGroupItem } from "@/app/components/ui/radio-group";
import { Label } from "@/app/components/ui/label";

export function AmbulanceTypeCard({
  value,
  onChange,
}: {
  value: "white" | "atan" | undefined;
  onChange: (value: "white" | "atan") => void;
}) {
  return (
    <div className="relative border border-red-500 rounded-lg p-4 row-start-2">
      <div className="space-y-4">
        <RadioGroup
          value={value}
          onValueChange={(nextValue) => onChange(nextValue as "white" | "atan")}
          className="space-y-3"
        >
          <div className="flex flex-row items-center justify-start gap-3">
            <RadioGroupItem value="white" id="white" />
            <Label htmlFor="white" className="text-[20px] font-semibold cursor-pointer">
              אמבולנס לבן
            </Label>
          </div>
          <div className="flex flex-row items-center justify-start gap-3">
            <RadioGroupItem value="atan" id="atan" />
            <Label htmlFor="atan" className="text-[20px] font-semibold cursor-pointer">
              אמבולנס טיפול נמרץ
            </Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  );
}
