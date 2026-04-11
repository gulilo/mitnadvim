"use server";

import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { createPermanentShiftRecord, createShiftRecord, PermanentShiftRecord, ShiftRecord } from "../../data/shift";

export async function createPermanentShift(permanentShift: PermanentShiftRecord) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      throw new Error("Unauthorized");
    }

    if (!permanentShift.launch_point_id) {
      throw new Error("נקודת הזנקה נדרשת");
    }
    if (!permanentShift.shift_type) {
      throw new Error("סוג משמרת (יום/ערב/לילה) נדרש");
    }
    if (permanentShift.week_day === undefined || permanentShift.week_day === null) {
      throw new Error("יום בשבוע נדרש");
    }
    if (!permanentShift.start_time) {
      throw new Error("שעת התחלה נדרשת");
    }
    if (!permanentShift.end_time) {
      throw new Error("שעת סיום נדרשת");
    }
    if (permanentShift.adult_only === undefined) {
      throw new Error("זמינות לשיבוץ נדרשת");
    }
    if (!permanentShift.number_of_slots) {
      throw new Error("מספר מלווים נדרש");
    }
    if (!permanentShift.ambulance_type) {
      throw new Error("סוג אמבולנס נדרש");
    }

    await createPermanentShiftRecord(permanentShift, session.user.id);

    revalidatePath("/createShift");
  } catch (error) {
    console.error("Failed to create permanent shift:", error);
    throw new Error(error instanceof Error ? error.message : "Failed to create permanent shift");
  }
}

export async function createShift(shift: ShiftRecord) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      throw new Error("Unauthorized");
    }

    if (!shift.launch_point_id) {
      throw new Error("נקודת הזנקה נדרשת");
    }
    if (!shift.start_date) {
      throw new Error("תאריך התחלה נדרש");
    }
    if (!shift.end_date) {
      throw new Error("תאריך סיום נדרש");
    }
    if (!shift.start_time) {
      throw new Error("שעת התחלה נדרשת");
    }
    if (!shift.end_time) {
      throw new Error("שעת סיום נדרשת");
    }
    if (shift.adult_only === undefined) {
      throw new Error("זמינות לשיבוץ נדרשת");
    }
    if (!shift.number_of_slots) {
      throw new Error("מספר מלווים נדרש");
    }
    if (!shift.status) {
      throw new Error("סטטוס נדרש");
    }
    if (!shift.ambulance_type) {
      throw new Error("סוג אמבולנס נדרש");
    }

    await createShiftRecord(shift, session.user.id);

    revalidatePath("/createShift");
  } catch (error) {
    console.error("Failed to create shift:", error);
    throw new Error(error instanceof Error ? error.message : "Failed to create shift");
  }
}
