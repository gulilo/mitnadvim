import { Checkbox } from "@/app/components/ui/checkbox";
import { Label } from "@/app/components/ui/label";
import { DAYS_OF_WEEK } from "@/app/lib/date-utils";

type SelectedDays = Record<(typeof DAYS_OF_WEEK)[number]["key"], boolean>;

function PermanentShiftDetails({
  selectedDays,
  onDayToggle,
  startTime,
  endTime,
  onStartTimeChange,
  onEndTimeChange,
}: {
  selectedDays: SelectedDays;
  onDayToggle: (day: keyof SelectedDays) => void;
  startTime: string;
  endTime: string;
  onStartTimeChange: (value: string) => void;
  onEndTimeChange: (value: string) => void;
}) {
  return (
    <div className="flex flex-row items-center mx-auto justify-between">
      <div className="flex flex-col gap-4 items-center">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-[20px] font-semibold block">ימי השיבוץ של המשמרת</Label>
            <div className="flex flex-row justify-start gap-4 items-center">
              {DAYS_OF_WEEK.map((day) => (
                <div key={day.key} className="flex flex-col items-center gap-1">
                  <Checkbox
                    checked={selectedDays[day.key]}
                    onCheckedChange={() => onDayToggle(day.key)}
                    className="h-4 w-4"
                  />
                  <Label className="text-[16px] font-bold">{day.label}</Label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 items-center">
        <div className="space-y-3">
          <div className="flex flex-row items-center justify-start gap-4">
            <Label className="text-[16px] font-bold whitespace-nowrap">תחילת משמרת:</Label>
            <div className="flex items-center gap-2">
              <input
                type="time"
                value={startTime}
                onChange={(e) => onStartTimeChange(e.target.value.trim())}
                className="border-b border-red-500 bg-transparent px-2 py-1 text-[16px] font-bold focus:outline-none"
              />
            </div>
          </div>

          <div className="flex flex-row items-center justify-end gap-4">
            <Label className="text-[16px] font-bold whitespace-nowrap">סיום משמרת:</Label>
            <div className="flex items-center gap-2">
              <input
                type="time"
                value={endTime}
                onChange={(e) => onEndTimeChange(e.target.value.trim())}
                className="border-b border-red-500 bg-transparent px-2 py-1 text-[16px] font-bold focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function OneTimeShiftDetails({
  startDate,
  endDate,
  startTime,
  endTime,
  onStartDateChange,
  onEndDateChange,
  onStartTimeChange,
  onEndTimeChange,
}: {
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  onStartDateChange: (value: string) => void;
  onEndDateChange: (value: string) => void;
  onStartTimeChange: (value: string) => void;
  onEndTimeChange: (value: string) => void;
}) {
  return (
    <div className="flex flex-col items-center justify-between gap-3">
      <div className="flex flex-row items-center justify-between gap-4 w-full">
        <Label className="text-[16px] font-bold whitespace-nowrap">תחילת משמרת:</Label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => onStartDateChange(e.target.value)}
          className="border-b border-red-500 bg-transparent px-2 py-1 text-[16px] font-bold focus:outline-none w-full"
        />
        <input
          type="time"
          value={startTime}
          onChange={(e) => onStartTimeChange(e.target.value.trim())}
          className="border-b border-red-500 bg-transparent px-2 py-1 text-[16px] font-bold focus:outline-none"
        />
      </div>
      <div className="flex flex-row items-center justify-between gap-4 w-full">
        <Label className="text-[16px] font-bold whitespace-nowrap">סיום משמרת:</Label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => onEndDateChange(e.target.value)}
          className="border-b border-red-500 bg-transparent px-2 py-1 text-[16px] font-bold focus:outline-none w-full"
        />
        <input
          type="time"
          value={endTime}
          onChange={(e) => onEndTimeChange(e.target.value.trim())}
          className="border-b border-red-500 bg-transparent px-2 py-1 text-[16px] font-bold focus:outline-none"
        />
      </div>
    </div>
  );
}

export function ShiftDetailsCard({
  shiftFrequency,
  selectedDays,
  onDayToggle,
  startDate,
  endDate,
  startTime,
  endTime,
  onStartDateChange,
  onEndDateChange,
  onStartTimeChange,
  onEndTimeChange,
}: {
  shiftFrequency: "permanent" | "one-time";
  selectedDays: SelectedDays;
  onDayToggle: (day: keyof SelectedDays) => void;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  onStartDateChange: (value: string) => void;
  onEndDateChange: (value: string) => void;
  onStartTimeChange: (value: string) => void;
  onEndTimeChange: (value: string) => void;
}) {
  return (
    <div className="relative border border-red-500 rounded-lg p-4 col-span-2 row-start-1">
      <div className="absolute -top-3 right-4 bg-[#f5f5f5] px-2">
        <Label className="text-[20px] font-semibold">פרטי המשמרת</Label>
      </div>
      {shiftFrequency === "permanent" ? (
        <PermanentShiftDetails
          selectedDays={selectedDays}
          onDayToggle={onDayToggle}
          startTime={startTime}
          endTime={endTime}
          onStartTimeChange={onStartTimeChange}
          onEndTimeChange={onEndTimeChange}
        />
      ) : (
        <OneTimeShiftDetails
          startDate={startDate}
          endDate={endDate}
          startTime={startTime}
          endTime={endTime}
          onStartDateChange={onStartDateChange}
          onEndDateChange={onEndDateChange}
          onStartTimeChange={onStartTimeChange}
          onEndTimeChange={onEndTimeChange}
        />
      )}
    </div>
  );
}
