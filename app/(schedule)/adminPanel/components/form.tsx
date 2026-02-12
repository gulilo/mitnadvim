"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { useState } from "react";
import { DbLaunchPoint } from "../../data/launchPoint";
import { RadioGroup, RadioGroupItem } from "@/app/components/ui/radio-group";
import { Label } from "@/app/components/ui/label";
import { Checkbox } from "@/app/components/ui/checkbox";
import { Button } from "@/app/components/ui/button";
import { createPermanentShift, createShift } from "../lib/actions";
import { DbPermanentShift, DbShift, ShiftType } from "../../data/shift";


const SHIFT_TYPES: readonly { key: ShiftType; label: string }[] = [
  { key: "day", label: "יום" },
  { key: "evening", label: "ערב" },
  { key: "night", label: "לילה" },
  { key: "reinforcement", label: "תגבור" },
  { key: "over_the_machine", label: "מעל התקן" },
  { key: "security", label: "אבטחה" },
];

const daysOfWeek = [
  { key: "sunday" as const, label: "א", name: "ראשון", value: 0 },
  { key: "monday" as const, label: "ב", name: "שני", value: 1 },
  { key: "tuesday" as const, label: "ג", name: "שלישי", value: 2 },
  { key: "wednesday" as const, label: "ד", name: "רביעי", value: 3 },
  { key: "thursday" as const, label: "ה", name: "חמישי", value: 4 },
  { key: "friday" as const, label: "ו", name: "שישי", value: 5 },
  { key: "saturday" as const, label: "ש", name: "שבת", value: 6 },
];


export default function Form({
  launchPoints,
}: {
  launchPoints: DbLaunchPoint[];
}) {
  const [shiftTypeValue, setShiftTypeValue] = useState<ShiftType>("night");
  const [shiftFrequency, setShiftFrequency] = useState<"permanent" | "one-time">();
  const [startDate, setStartDate] = useState(new Date().toISOString().split("T")[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split("T")[0]);
  const [launchPoint, setLaunchPoint] = useState("");
  const [ambulanceType, setAmbulanceType] = useState<"white" | "atan">();
  const [numEscorts, setNumEscorts] = useState("3");
  const [availability, setAvailability] = useState("adults-youth");
  const [startTime, setStartTime] = useState("23:00");
  const [endTime, setEndTime] = useState("07:00");
  const [selectedDays, setSelectedDays] = useState({
    sunday: false,
    monday: false,
    tuesday: false,
    wednesday: false,
    thursday: false,
    friday: false,
    saturday: false,
  });

  const handleDayChange = (day: keyof typeof selectedDays) => {
    setSelectedDays((prev) => ({
      ...prev,
      [day]: !prev[day],
    }));
  };

  const SHIFT_TYPE_TIMES: Record<ShiftType, { start: string; end: string }> = {
    day: { start: "07:00", end: "15:00" },
    evening: { start: "15:00", end: "23:00" },
    night: { start: "23:00", end: "07:00" },
    reinforcement: { start: "07:00", end: "15:00" },
    over_the_machine: { start: "15:00", end: "23:00" },
    security: { start: "23:00", end: "07:00" },
  };

  const handleShiftTypeChange = (value: string) => {
    setShiftTypeValue(value as ShiftType);
    const times = SHIFT_TYPE_TIMES[value as ShiftType];
    if (times) {
      setStartTime(times.start);
      setEndTime(times.end);
    }
  };

  const handleSabmit = async (formData: FormData) => {
    if (shiftFrequency === "permanent") {
      if (!launchPoint) {
        alert("אנא בחר נקודת הזנקה");
        return;
      }
      // Get area_id from the selected launch point
      const selectedLaunchPoint = launchPoints.find(
        (lp) => lp.id === launchPoint
      );
      if (!selectedLaunchPoint) {
        alert("נקודת הזנקה לא נמצאה");
        return;
      }

      // Check if at least one day is selected
      const hasSelectedDay = Object.values(selectedDays).some(
        (selected) => selected
      );
      if (!hasSelectedDay) {
        alert("אנא בחר לפחות יום אחד בשבוע");
        return;
      }

      for (const dayObj of daysOfWeek) {
        if (selectedDays[dayObj.key]) {
          const permanentShift: DbPermanentShift = {
            id: "",
            area_id: selectedLaunchPoint.area_id,
            launch_point_id: launchPoint,
            shift_type: shiftTypeValue,
            week_day: dayObj.value,
            start_time: startTime,
            end_time: endTime,
            adult_only: availability === "adults-only",
            number_of_slots: parseInt(numEscorts),
            ambulance_type: ambulanceType as "white" | "atan",
          };
          await createPermanentShift(permanentShift);
        }
      }
    }
    if (shiftFrequency === "one-time") {
      const shift: DbShift = {
        id: "",
        launch_point_id: launchPoint,
        start_date: new Date(startDate),
        end_date: new Date(endDate),
        start_time: startTime,
        end_time: endTime,
        shift_type: shiftTypeValue as "day" | "evening" | "night",
        adult_only: availability === "adults-only",
        number_of_slots: parseInt(numEscorts),
        status: "active",
        ambulance_id: null,
        driver_id: null,
        ambulance_type: ambulanceType as "white" | "atan",
      };
      await createShift(shift);
    }
  };

  return (
    <form action={handleSabmit} className="w-full mx-auto">
      {/* Shift Type and Launch Point */}
      <div className="flex flex-col justify-start items-center mx-auto gap-6 w-full mb-6">
        <div className="flex flex-row items-center gap-4 w-80">
          <Label className="text-[20px] font-semibold whitespace-nowrap">
            סוג משמרת:
          </Label>
          <div className="relative flex-1">
            <Select value={shiftTypeValue} onValueChange={handleShiftTypeChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="" />
              </SelectTrigger>
              <SelectContent>
                {SHIFT_TYPES.map((shiftType) => (
                  <SelectItem key={shiftType.key} value={shiftType.key}>
                    {shiftType.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex flex-row items-center gap-4 w-80">
          <Label className="text-[20px] font-semibold whitespace-nowrap">
            נקודת הזנקה:
          </Label>
          <div className="relative flex-1">
            <Select value={launchPoint} onValueChange={setLaunchPoint}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="" />
              </SelectTrigger>
              <SelectContent>
                {launchPoints.map((lp) => (
                  <SelectItem key={lp.id} value={lp.id}>
                    {lp.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 ">
        {/* Shift type */}
        {shiftTypeValue && launchPoint && <div className="relative border border-red-500 rounded-lg p-4 row-start-1">
          <div className="space-y-4">
            <RadioGroup
              value={shiftFrequency}
              onValueChange={(value) => setShiftFrequency(value as "permanent" | "one-time")}
              className="space-y-3"
            >
              <div className="flex flex-row items-center justify-start gap-3">
                <RadioGroupItem value="permanent" id="permanent" />
                <Label
                  htmlFor="permanent"
                  className="text-[20px] font-semibold cursor-pointer"
                >
                  משמרת קבועה
                </Label>
              </div>
              <div className="flex flex-row items-center justify-start gap-3">
                <RadioGroupItem value="one-time" id="one-time" />
                <Label
                  htmlFor="one-time"
                  className="text-[20px] font-semibold cursor-pointer"
                >
                  משמרת חד פעמית
                </Label>
              </div>
            </RadioGroup>
          </div>
        </div>}

        {/* Ambulance Type */}
        {shiftTypeValue && launchPoint && <div className="relative border border-red-500 rounded-lg p-4 row-start-2">
          <div className="space-y-4">
            <RadioGroup
              value={ambulanceType}
              onValueChange={(value) => setAmbulanceType(value as "white" | "atan")}
              className="space-y-3"
            >
              <div className="flex flex-row items-center justify-start gap-3">
                <RadioGroupItem value="white" id="white" />
                <Label
                  htmlFor="white"
                  className="text-[20px] font-semibold cursor-pointer"
                >
                  אמבולנס לבן
                </Label>
              </div>
              <div className="flex flex-row items-center justify-start gap-3">
                <RadioGroupItem value="atan" id="atan" />
                <Label
                  htmlFor="atan"
                  className="text-[20px] font-semibold cursor-pointer"
                >
                  אמבולנס טיפול נמרץ
                </Label>
              </div>
            </RadioGroup>
          </div>
        </div>}

        {/* shift details */}
        {shiftTypeValue && launchPoint && shiftFrequency && ambulanceType && <div className="relative border border-red-500 rounded-lg p-4 col-span-2 row-start-1">
          <div className="absolute -top-3 right-4 bg-[#f5f5f5] px-2">
            <Label className="text-[20px] font-semibold">פרטי המשמרת</Label>
          </div>
          {(shiftFrequency === "permanent" && (
            <div className="flex flex-row items-center mx-auto justify-between">
              <div className="flex flex-col  gap-4 items-center">
                <div className="space-y-4">
                  {/* Days of Week */}
                  <div className="space-y-2">
                    <Label className="text-[20px] font-semibold block">
                      ימי השיבוץ של המשמרת
                    </Label>
                    <div className="flex flex-row justify-start gap-4 items-center">
                      {daysOfWeek.map((day) => (
                        <div
                          key={day.key}
                          className="flex flex-col items-center gap-1"
                        >
                          <Checkbox
                            checked={selectedDays[day.key]}
                            onCheckedChange={() => handleDayChange(day.key)}
                            className="h-4 w-4"
                          />
                          <Label className="text-[16px] font-bold">
                            {day.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-4 items-center">
                {/* Time Inputs */}
                <div className="space-y-3">
                  <div className="flex flex-row items-center justify-start gap-4">
                    <Label className="text-[16px] font-bold whitespace-nowrap">
                      תחילת משמרת:
                    </Label>
                    <div className="flex items-center gap-2">
                      <input
                        type="time"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        className="border-b border-red-500 bg-transparent px-2 py-1 text-[16px] font-bold focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex flex-row items-center justify-end gap-4">
                    <Label className="text-[16px] font-bold whitespace-nowrap">
                      סיום משמרת:
                    </Label>
                    <div className="flex items-center gap-2">
                      <input
                        type="time"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                        className="border-b border-red-500 bg-transparent px-2 py-1 text-[16px] font-bold focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )) || (
              <div className="flex flex-col items-center justify-between gap-3">
                <div className="flex flex-row items-center justify-between gap-4 w-full">
                  <Label className="text-[16px] font-bold whitespace-nowrap">
                    תחילת משמרת:
                  </Label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="border-b border-red-500 bg-transparent px-2 py-1 text-[16px] font-bold focus:outline-none w-full"
                  />
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="border-b border-red-500 bg-transparent px-2 py-1 text-[16px] font-bold focus:outline-none"
                  />
                </div>
                <div className="flex flex-row items-center justify-between gap-4 w-full">
                  <Label className="text-[16px] font-bold whitespace-nowrap">
                    סיום משמרת:
                  </Label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="border-b border-red-500 bg-transparent px-2 py-1 text-[16px] font-bold focus:outline-none w-full"
                  />
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="border-b border-red-500 bg-transparent px-2 py-1 text-[16px] font-bold focus:outline-none"
                  />
                </div>
              </div>
            )}
        </div>}

        {/* restrictions */}
        {shiftTypeValue && launchPoint && shiftFrequency && ambulanceType && <div className="relative border border-red-500 rounded-lg p-4  col-span-2 row-span-2 my-auto row-start-2">
          <div className="absolute -top-3 right-4 bg-[#f5f5f5] px-2">
            <Label className="text-[20px] font-semibold">הגבלות</Label>
          </div>

          <div className="flex flex-row items-center justify-between">
            {/* Availability Options */}
            <div className="flex flex-col items-center justify-between">
              <div className="space-y-3">
                <Label className="text-[20px] font-semibold block text-right">
                  זמינות לשיבוץ
                </Label>
                <RadioGroup
                  value={availability}
                  onValueChange={setAvailability}
                  className="space-y-3"
                >
                  <div className="flex flex-row items-center justify-start gap-3">
                    <RadioGroupItem value="adults-youth" id="adults-youth" />
                    <Label
                      htmlFor="adults-youth"
                      className="text-[20px] font-semibold cursor-pointer"
                    >
                      בוגרים + נוער
                    </Label>
                  </div>
                  <div className="flex flex-row items-center justify-start gap-3">
                    <RadioGroupItem value="adults-only" id="adults-only" />
                    <Label
                      htmlFor="adults-only"
                      className="text-[20px] font-semibold cursor-pointer"
                    >
                      בוגרים בלבד
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            </div>

            <div className="flex flex-col items-center justify-between">
              <div className="space-y-4">
                {/* Number of Escorts */}
                <div className="flex flex-col items-center justify-end ml-10">
                  <Label className="text-[20px] font-semibold whitespace-nowrap">
                    מספר מלווים
                  </Label>
                  <div className="relative">
                    <Select value={numEscorts} onValueChange={setNumEscorts}>
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
        </div>}

        {shiftTypeValue && launchPoint && shiftFrequency && ambulanceType && <Button
          type="submit"
          className="bg-red-500 hover:bg-red-600 text-white px-8 py-6 rounded-lg border-red-500 w-full row-start-3"
        >
          צור משמרת
        </Button>}
      </div>
    </form>
  );
}
