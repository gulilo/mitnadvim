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
import { DbPermanentShift, DbShift } from "../../data/shift";

export default function Form({
  launchPoints,
}: {
  launchPoints: DbLaunchPoint[];
}) {
  const [shiftType, setShiftType] = useState("");
  const [shiftFrequency, setShiftFrequency] = useState("permanent");
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [date2, setDate2] = useState(new Date().toISOString().split('T')[0]);
  const [launchPoint, setLaunchPoint] = useState("");
  const [ambulanceType, setAmbulanceType] = useState("white");
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

  const daysOfWeek = [
    { key: "sunday" as const, label: "א", name: "ראשון", value: 0 },
    { key: "monday" as const, label: "ב", name: "שני", value: 1 },
    { key: "tuesday" as const, label: "ג", name: "שלישי", value: 2 },
    { key: "wednesday" as const, label: "ד", name: "רביעי", value: 3 },
    { key: "thursday" as const, label: "ה", name: "חמישי", value: 4 },
    { key: "friday" as const, label: "ו", name: "שישי", value: 5 },
    { key: "saturday" as const, label: "ש", name: "שבת", value: 6 },
  ];

  const handleSabmit = async (formData: FormData) => {
    if (shiftFrequency === "permanent") {
      for (const dayObj of daysOfWeek) {
        if (selectedDays[dayObj.key]) {
          const permanentShift: DbPermanentShift = {
            id: "",
            launch_point_id: launchPoint,
            week_day: dayObj.value,
            start_time: startTime,
            end_time: endTime,
            adult_only: availability === "adults-only",
            number_of_slots: parseInt(numEscorts),
          };
          await createPermanentShift(permanentShift);
        }
      }
    }
    if (shiftFrequency === "one-time") {
      const shift: DbShift = {
        id: "",
        permanent_shift_id: null,
        launch_point_id: launchPoint,
        date: new Date(date),
        start_time: startTime,
        end_time: endTime,
        adult_only: availability === "adults-only",
        number_of_slots: parseInt(numEscorts),
        status: "active",
        ambulance_id: null,
        driver_id: null,
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
            <Select value={shiftType} onValueChange={setShiftType}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="night">לילה</SelectItem>
                <SelectItem value="morning">בוקר</SelectItem>
                <SelectItem value="pre_shift">תגבור</SelectItem>
                <SelectItem value="evening">ערב</SelectItem>
                <SelectItem value="over_the_machine">מעל התקן</SelectItem>
                <SelectItem value="security">אבטחה</SelectItem>
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
        <div className="relative border border-red-500 rounded-lg p-4 ">
          <div className="space-y-4">
            <RadioGroup
              value={shiftFrequency}
              onValueChange={setShiftFrequency}
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
        </div>

        {/* shift details */}
        <div className="relative border border-red-500 rounded-lg p-4 col-span-2">
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
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
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
                  value={date2}
                  onChange={(e) => setDate2(e.target.value)}
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
        </div>

        {/* Ambulance Type */}
        <div className="relative border border-red-500 rounded-lg p-4 ">
          <div className="space-y-4">
            <RadioGroup
              value={ambulanceType}
              onValueChange={setAmbulanceType}
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
                <RadioGroupItem value="intensive" id="intensive" />
                <Label
                  htmlFor="intensive"
                  className="text-[20px] font-semibold cursor-pointer"
                >
                  אמבולנס טיפול נמרץ
                </Label>
              </div>
            </RadioGroup>
          </div>
        </div>

        {/* restrictions */}
        <div className="relative border border-red-500 rounded-lg p-4  col-span-2 row-span-2 my-auto">
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
        </div>

        <Button
          type="submit"
          className="bg-red-500 hover:bg-red-600 text-white px-8 py-6 rounded-lg border-red-500 w-full"
        >
          צור משמרת
        </Button>
      </div>
    </form>
  );
}
