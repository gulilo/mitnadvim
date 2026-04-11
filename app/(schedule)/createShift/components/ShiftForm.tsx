"use client";

import { useState } from "react";
import { LaunchPoint } from "../../data/launchPoint";
import { Button } from "@/app/components/ui/button";
import { createPermanentShift, createShift } from "../lib/actions";
import { updateShift } from "../../editShift/lib/actions";
import { DAYS_OF_WEEK, prismaDateToUtcDateString, prismaTimeToTimeString, timeStringToPrismaTime } from "@/app/lib/date-utils";
import { PermanentShiftRecord, ShiftRecord } from "../../data/shift";
import {
  ambulance_type,
  shift_status_type,
  shift_type,
  type shift as ShiftEntity,
} from "@prisma/client";
import { SHIFT_TYPES, SHIFT_TYPE_TIMES } from "./create-shift-form.constants";
import { ShiftTypeAndLaunchPointFields } from "./ShiftTypeAndLaunchPointFields";
import { ShiftFrequencyCard } from "./ShiftFrequencyCard";
import { AmbulanceTypeCard } from "./AmbulanceTypeCard";
import { ShiftDetailsCard } from "./ShiftDetailsCard";
import { ShiftRestrictionsCard } from "./ShiftRestrictionsCard";
import { redirect } from "next/navigation";

const defaultSelectedDays = {
  sunday: false,
  monday: false,
  tuesday: false,
  wednesday: false,
  thursday: false,
  friday: false,
  saturday: false,
} as const;

type SelectedDays = typeof defaultSelectedDays;

type ShiftFormState = {
  shiftTypeValue: shift_type;
  shiftFrequency: "permanent" | "one-time" | undefined;
  startDate: string;
  endDate: string;
  launchPoint: string;
  ambulanceType: "white" | "atan" | undefined;
  numEscorts: string;
  availability: string;
  startTime: string;
  endTime: string;
  selectedDays: SelectedDays;
};

function createInitialShiftFormState(
  mode: "create" | "edit",
  shift: ShiftEntity | null | undefined,
): ShiftFormState {
    const today = new Date().toISOString().split("T")[0];

  if (mode === "edit" && shift) {
    const start = new Date(shift.start_date);
    const end = shift.end_date ? new Date(shift.end_date) : start;
    return {
      shiftTypeValue: shift.shift_type,
      shiftFrequency: "one-time",
      startDate: prismaDateToUtcDateString(start),
      endDate: prismaDateToUtcDateString(end),
      startTime: shift.start_time
        ? prismaTimeToTimeString(new Date(shift.start_time))
        : "23:00",
      endTime: shift.end_time
        ? prismaTimeToTimeString(new Date(shift.end_time))
        : "07:00",
      launchPoint: shift.launch_point_id,
      ambulanceType: shift.ambulance_type,
      numEscorts: shift.number_of_slots?.toString() ?? "1",
      availability: shift.adult_only ? "adults-only" : "adults-youth",
      selectedDays: { ...defaultSelectedDays },
    };
  }

  return {
    shiftTypeValue: "night",
    shiftFrequency: undefined,
    startDate: today,
    endDate: today,
    launchPoint: "",
    ambulanceType: undefined,
    numEscorts: "3",
    availability: "adults-youth",
    startTime: "23:00",
    endTime: "07:00",
    selectedDays: { ...defaultSelectedDays },
  };
}

export default function ShiftForm({
  mode = "create",
  shift = null,
  launchPoints,
}: {
  mode?: "create" | "edit";
  shift?: ShiftEntity | null;
  launchPoints: LaunchPoint[];
}) {
  const [form, setForm] = useState(() => createInitialShiftFormState(mode, shift));

  const patchForm = (partial: Partial<ShiftFormState>) => {
    setForm((prev) => ({ ...prev, ...partial }));
  };

  const handleDayChange = (day: keyof SelectedDays) => {
    setForm((prev) => ({
      ...prev,
      selectedDays: {
        ...prev.selectedDays,
        [day]: !prev.selectedDays[day],
      },
    }));
  };

  const handleShiftTypeChange = (value: string) => {
    const nextType = value as shift_type;
    const times = SHIFT_TYPE_TIMES[nextType];
    setForm((prev) => ({
      ...prev,
      shiftTypeValue: nextType,
      ...(times ? { startTime: times.start, endTime: times.end } : {}),
    }));
  };

  const handleSubmit = async () => {
    const {
      shiftFrequency,
      launchPoint,
      shiftTypeValue,
      selectedDays,
      startTime,
      endTime,
      availability,
      numEscorts,
      ambulanceType,
      startDate,
      endDate,
    } = form;

    if (shiftFrequency === "permanent" && mode !== "edit") {
      if (!launchPoint) {
        alert("אנא בחר נקודת הזנקה");
        return;
      }

      const selectedLaunchPoint = launchPoints.find((lp) => lp.id === launchPoint);
      if (!selectedLaunchPoint) {
        alert("נקודת הזנקה לא נמצאה");
        return;
      }

      const hasSelectedDay = Object.values(selectedDays).some((selected) => selected);
      if (!hasSelectedDay) {
        alert("אנא בחר לפחות יום אחד בשבוע");
        return;
      }

      for (const dayObj of DAYS_OF_WEEK) {
        if (selectedDays[dayObj.key]) {
          const permanentShift: PermanentShiftRecord = {
            launch_point_id: launchPoint,
            shift_type: shiftTypeValue,
            week_day: dayObj.value,
            start_time: timeStringToPrismaTime(startTime),
            end_time: timeStringToPrismaTime(endTime),
            adult_only: availability === "adults-only",
            number_of_slots: parseInt(numEscorts),
            ambulance_type: ambulanceType as ambulance_type,
          };
          await createPermanentShift(permanentShift);
        }
      }
    }

    if (shiftFrequency === "one-time") {
      if (mode === "edit") {
        if (!shift?.id) {
          alert("משמרת לא נמצאה");
          return;
        }
        await updateShift(shift.id, {
          launch_point_id: launchPoint,
          start_date: new Date(startDate),
          end_date: new Date(endDate),
          start_time: timeStringToPrismaTime(startTime),
          end_time: timeStringToPrismaTime(endTime),
          shift_type: shiftTypeValue,
          adult_only: availability === "adults-only",
          number_of_slots: parseInt(numEscorts, 10),
          ambulance_type: ambulanceType as ambulance_type,
        });
        redirect('/shiftMenegment?date=' + endDate)
      }

      const shiftPayload: ShiftRecord = {
        launch_point_id: launchPoint,
        start_date: new Date(startDate),
        end_date: new Date(endDate),
        start_time: timeStringToPrismaTime(startTime),
        end_time: timeStringToPrismaTime(endTime),
        shift_type: shiftTypeValue,
        adult_only: availability === "adults-only",
        number_of_slots: parseInt(numEscorts),
        status: "active" as shift_status_type,
        ambulance_id: null,
        driver_id: null,
        ambulance_type: ambulanceType as ambulance_type,
      };
      await createShift(shiftPayload);
    }
  };

  const {
    shiftTypeValue,
    shiftFrequency,
    launchPoint,
    ambulanceType,
    startDate,
    endDate,
    startTime,
    endTime,
    selectedDays,
    availability,
    numEscorts,
  } = form;

  return (
    <form action={handleSubmit} className="w-full mx-auto">
      <ShiftTypeAndLaunchPointFields
        shiftTypeValue={shiftTypeValue}
        launchPoint={launchPoint}
        launchPoints={launchPoints}
        shiftTypes={SHIFT_TYPES}
        onShiftTypeChange={handleShiftTypeChange}
        onLaunchPointChange={(id) => patchForm({ launchPoint: id })}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 ">
        {shiftTypeValue && launchPoint && (
          <ShiftFrequencyCard
            editable={mode === "create"}
            value={shiftFrequency}
            onChange={(v) => patchForm({ shiftFrequency: v })}
          />
        )}

        {shiftTypeValue && launchPoint && (
          <AmbulanceTypeCard
            value={ambulanceType}
            onChange={(v) => patchForm({ ambulanceType: v })}
          />
        )}

        {shiftTypeValue && launchPoint && shiftFrequency && ambulanceType && (
          <ShiftDetailsCard
            shiftFrequency={shiftFrequency}
            selectedDays={selectedDays}
            onDayToggle={handleDayChange}
            startDate={startDate}
            endDate={endDate}
            startTime={startTime}
            endTime={endTime}
            onStartDateChange={(v) => patchForm({ startDate: v })}
            onEndDateChange={(v) => patchForm({ endDate: v })}
            onStartTimeChange={(v) => patchForm({ startTime: v })}
            onEndTimeChange={(v) => patchForm({ endTime: v })}
          />
        )}

        {shiftTypeValue && launchPoint && shiftFrequency && ambulanceType && (
          <ShiftRestrictionsCard
            availability={availability}
            onAvailabilityChange={(v) => patchForm({ availability: v })}
            ambulanceType={ambulanceType}
            numEscorts={numEscorts}
            onNumEscortsChange={(v) => patchForm({ numEscorts: v })}
          />
        )}

        {shiftTypeValue && launchPoint && shiftFrequency && ambulanceType && (
          <Button
            type="submit"
            className="bg-red-500 hover:bg-red-600 text-white px-8 py-6 rounded-lg border-red-500 w-full row-start-3"
          >
            {mode === "create" ? "צור משמרת" : "עדכן משמרת"}
          </Button>
        )}
      </div>
    </form>
  );
}
