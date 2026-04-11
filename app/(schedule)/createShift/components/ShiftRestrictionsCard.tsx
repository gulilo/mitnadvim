import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/app/components/ui/radio-group";
import { Label } from "@/app/components/ui/label";

export function ShiftRestrictionsCard({
  availability,
  onAvailabilityChange,
  ambulanceType,
  numEscorts,
  onNumEscortsChange,
}: {
  availability: string;
  onAvailabilityChange: (value: string) => void;
  ambulanceType: "white" | "atan";
  numEscorts: string;
  onNumEscortsChange: (value: string) => void;
}) {
  return (
    <div className="relative border border-red-500 rounded-lg p-4 col-span-2 row-span-2 my-auto row-start-2">
      <div className="absolute -top-3 right-4 bg-[#f5f5f5] px-2">
        <Label className="text-[20px] font-semibold">הגבלות</Label>
      </div>

      <div className="flex flex-row items-center justify-between">
        <div className="flex flex-col items-center justify-between">
          <div className="space-y-3">
            <Label className="text-[20px] font-semibold block text-right">זמינות לשיבוץ</Label>
            <RadioGroup value={availability} onValueChange={onAvailabilityChange} className="space-y-3">
              <div className="flex flex-row items-center justify-start gap-3">
                <RadioGroupItem value="adults-youth" id="adults-youth" />
                <Label htmlFor="adults-youth" className="text-[20px] font-semibold cursor-pointer">
                  בוגרים + נוער
                </Label>
              </div>
              <div className="flex flex-row items-center justify-start gap-3">
                <RadioGroupItem value="adults-only" id="adults-only" />
                <Label htmlFor="adults-only" className="text-[20px] font-semibold cursor-pointer">
                  בוגרים בלבד
                </Label>
              </div>
            </RadioGroup>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between">
          <div className="space-y-4">
            <div className="flex flex-col items-center justify-end ml-10">
              <Label className="text-[20px] font-semibold whitespace-nowrap">מספר מלווים</Label>
              <div className="relative">
                <Select value={numEscorts} onValueChange={onNumEscortsChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ambulanceType === "white" ? (
                      <>
                        <SelectItem value="3">3</SelectItem>
                        <SelectItem value="2">2</SelectItem>
                        <SelectItem value="1">1</SelectItem>
                        <SelectItem value="0">0</SelectItem>
                      </>
                    ) : (
                      <>
                        <SelectItem value="2">2</SelectItem>
                        <SelectItem value="1">1</SelectItem>
                        <SelectItem value="0">0</SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
