"use server";

import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import {
  type ShiftRecordUpdateFields,
  updateShiftRecord,
} from "../../data/shift";

export async function updateShift(
  shiftId: string,
  data: ShiftRecordUpdateFields,
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      throw new Error("Unauthorized");
    }

    if (!data.launch_point_id) {
      throw new Error("נקודת הזנקה נדרשת");
    }
    if (!data.start_date) {
      throw new Error("תאריך התחלה נדרש");
    }
    if (!data.end_date) {
      throw new Error("תאריך סיום נדרש");
    }
    if (!data.start_time) {
      throw new Error("שעת התחלה נדרשת");
    }
    if (!data.end_time) {
      throw new Error("שעת סיום נדרשת");
    }
    if (data.adult_only === undefined) {
      throw new Error("זמינות לשיבוץ נדרשת");
    }
    if (!data.number_of_slots) {
      throw new Error("מספר מלווים נדרש");
    }
    if (!data.ambulance_type) {
      throw new Error("סוג אמבולנס נדרש");
    }
    if (!data.shift_type) {
      throw new Error("סוג משמרת (יום/ערב/לילה) נדרש");
    }

    await updateShiftRecord({
      shiftId,
      updatedById: session.user.id,
      data,
    });

    revalidatePath(`/editShift/${shiftId}`);
    revalidatePath("/createShift");
    revalidatePath("/shiftMenegment");
    revalidatePath("/shiftPicker");
  } catch (error) {
    console.error("Failed to update shift:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to update shift",
    );
  }
}
