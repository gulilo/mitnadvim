"use server";

import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { createPermanentShiftRecord, createShiftRecord, PermanentShift, ShiftRecord } from "../../data/shift";

export async function createPermanentShift(permanentShift: PermanentShift) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      throw new Error('Unauthorized');
    }
    const launchPointId = permanentShift.launch_point_id;
    const shiftType = permanentShift.shift_type;
    const weekDay = permanentShift.week_day;
    const startTime = permanentShift.start_time;
    const endTime = permanentShift.end_time;
    const adultOnly = permanentShift.adult_only;
    const numberOfSlots = permanentShift.number_of_slots;
    const ambulanceType = permanentShift.ambulance_type;

    console.log(launchPointId, shiftType, weekDay, startTime, endTime, adultOnly, numberOfSlots, ambulanceType);

    if (!launchPointId) {
      throw new Error('נקודת הזנקה נדרשת');
    }
    if (!shiftType) {
      throw new Error('סוג משמרת (יום/ערב/לילה) נדרש');
    }
    if (weekDay === undefined || weekDay === null) {
      throw new Error('יום בשבוע נדרש');
    }
    if (!startTime) {
      throw new Error('שעת התחלה נדרשת');
    }
    if (!endTime) {
      throw new Error('שעת סיום נדרשת');
    }
    if (adultOnly === undefined) {
      throw new Error('זמינות לשיבוץ נדרשת');
    }
    if (!numberOfSlots) {
      throw new Error('מספר מלווים נדרש');
    }
    if (!ambulanceType) {
      throw new Error('סוג אמבולנס נדרש');
    }


    await createPermanentShiftRecord({
      launchPointId,
      shiftType: shiftType as "day" | "evening" | "night",
      weekDay,
      startTime,
      endTime,
      adultOnly,
      numberOfSlots,
      ambulanceType: ambulanceType as "white" | "atan",
      createdBy: session.user.id,
    });

    revalidatePath('/adminPanel');
  } catch (error) {
    console.error('Failed to create permanent shift:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to create permanent shift');
  }
} 

export async function createShift(shift: ShiftRecord) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      throw new Error('Unauthorized');
    }
    const launchPointId = shift.launch_point_id;
    const ambulanceId = shift.ambulance_id;
    const driverId = shift.driver_id;
    const startDate = shift.start_date;
    const endDate = shift.end_date;
    const startTime = shift.start_time;
    const endTime = shift.end_time;
    const ambulanceType = shift.ambulance_type;
    const shiftType = shift.shift_type;
    const adultOnly = shift.adult_only;
    const numberOfSlots = shift.number_of_slots;    
    const status = shift.status;

    console.log(launchPointId, ambulanceId, driverId, startDate, endDate, startTime, endTime, shiftType, adultOnly, numberOfSlots, status);

    if (!launchPointId) {
      throw new Error('נקודת הזנקה נדרשת');
    }
    if (!startDate) {
      throw new Error('תאריך התחלה נדרש');
    }
    if (!endDate) {
      throw new Error('תאריך סיום נדרש');
    }
    if (!startTime) {
      throw new Error('שעת התחלה נדרשת');
    }
    if (!endTime) {
      throw new Error('שעת סיום נדרשת');
    }
    if (adultOnly === undefined) {
      throw new Error('זמינות לשיבוץ נדרשת');
    }
    if (!numberOfSlots) {
      throw new Error('מספר מלווים נדרש');
    }
    if (!status) {
      throw new Error('סטטוס נדרש');
    }
    if (!ambulanceType) {
      throw new Error('סוג אמבולנס נדרש');
    }

    await createShiftRecord({
      launchPointId,
      ambulanceType: ambulanceType as "white" | "atan",
      ambulanceId,
      driverId,
      startDate,
      endDate,
      startTime,
      endTime,
      shiftType,
      adultOnly,
      numberOfSlots,
      status,
      createdBy: session.user.id,
    });

    revalidatePath('/adminPanel');
  } catch (error) {
    console.error('Failed to create shift:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to create shift');
  }
}