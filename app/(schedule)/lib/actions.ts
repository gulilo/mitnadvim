"use server";

import { auth } from "@/auth";
import { sql } from "@/app/lib/data";
import { revalidatePath } from "next/cache";
import { getShiftsByDate, DisplayShift } from "../data/shift";
import { DbLaunchPoint, getAllLaunchPoints, getLaunchPointById } from "../data/launchPoint";
import { getAmbulanceById, getAmbulanceByNumber } from "../data/ambulance";
import { getUserByAccountId, getUserTags } from "@/app/(user)/data/user";
import { DbTag, DbUser } from "@/app/(user)/data/definitions";

/** Map shift_type from DB to schedule column key */
const SHIFT_TYPE_TO_COLUMN: Record<string, "night" | "morning" | "reinforcement" | "evening"> = {
  night: "night",
  day: "morning",
  morning: "morning",
  afternoon: "reinforcement",
  reinforcement: "reinforcement",
  evening: "evening",
};

export type ShiftsByType = {
  night: DisplayShift[];
  morning: DisplayShift[];
  reinforcement: DisplayShift[];
  evening: DisplayShift[];
};

export type ScheduleRow = {
  launch_point: DbLaunchPoint;
  ambulance_type: "white" | "atan";
  shiftsByType: ShiftsByType;
};

export async function createLaunchPoint(formData: FormData) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      throw new Error('Unauthorized');
    }

    const name = formData.get("name") as string;
    const areaId = formData.get("areaId") as string;

    if (!name || !areaId) {
      throw new Error('Name and area are required');
    }

    await sql`
      INSERT INTO launch_point (name, area_id, created_by)
      VALUES (${name}, ${areaId}, ${session.user.id})
      RETURNING id
    `;

    // Revalidate the page to show the new launch point
    revalidatePath('/createLP');
  } catch (error) {
    console.error('Failed to create launch point:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to create launch point');
  }
}

export async function deleteLaunchPoint(launchPointId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      throw new Error('Unauthorized');
    }

    if (!launchPointId) {
      throw new Error('Launch point ID is required');
    }

    // TODO: change to inactive instead of deleting
    await sql`
      DELETE FROM launch_point 
      WHERE id = ${launchPointId}
    `;

    // Revalidate the page to remove the deleted launch point
    revalidatePath('/createLP');
  } catch (error) {
    console.error('Failed to delete launch point:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to delete launch point');
  }
}


export async function updateShiftDriver(shiftId: string, driverAccountId: string | null) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      throw new Error("Unauthorized");
    }

    await sql`
      UPDATE shift 
      SET driver_id = ${driverAccountId}, updated_by = ${session.user.id}
      WHERE id = ${shiftId}
    `;

    revalidatePath("/shiftMenegment");
  } catch (error) {
    console.error("Failed to update shift driver:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to update shift driver"
    );
  }
}

export async function removedriverfromshift(shiftId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      throw new Error("Unauthorized");
    }
    await sql`
      UPDATE shift 
      SET driver_id = NULL, updated_by = ${session.user.id}
      WHERE id = ${shiftId}
    `;
  }
  catch (error) {
    console.error("Failed to remove driver from shift:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to remove driver from shift"
    );
  }
}

export async function updateShiftAmbulance(shiftId: string, ambulanceNumber: string | null) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      throw new Error("Unauthorized");
    }
    const ambulanceId = ambulanceNumber?.trim()
      ? (await getAmbulanceByNumber(ambulanceNumber.trim()))?.id ?? null
      : null;
    if (ambulanceNumber?.trim() && !ambulanceId) {
      throw new Error("Ambulance not found");
    }
    await sql`
      UPDATE shift 
      SET ambulance_id = ${ambulanceId}, updated_by = ${session.user.id}
      WHERE id = ${shiftId}
    `;

    // revalidatePath("/shiftMenegment");
  } catch (error) {
    console.error("Failed to update shift ambulance:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to update shift ambulance"
    );
  }
}

export async function getDisplayShifts(date: Date): Promise<ScheduleRow[]> {
  try {
    const [launchPoints, rawShifts] = await Promise.all([
      getAllLaunchPoints(),
      getShiftsByDate(date),
    ]);

    const displayShifts = await Promise.all(
      rawShifts.map(async (shift) => ({
        id: shift.id,
        launch_point: (await getLaunchPointById(shift.launch_point_id)) as DbLaunchPoint,
        ambulance_type: shift.ambulance_type,
        ambulance: shift.ambulance_id
          ? ((await getAmbulanceById(shift.ambulance_id)) ?? null)
          : null,
        driver: shift.driver_id
          ? ((await getUserByAccountId(shift.driver_id)) as DbUser | null)
          : null,
        start_date: shift.start_date,
        end_date: shift.end_date,
        start_time: shift.start_time,
        end_time: shift.end_time,
        shift_type: shift.shift_type,
        adult_only: shift.adult_only,
        number_of_slots: shift.number_of_slots,
      }))
    );

    const groupedByLaunchPointAndType = Map.groupBy(
      displayShifts as DisplayShift[],
      (s: DisplayShift) => `${s.launch_point.id}:${s.ambulance_type}`
    );

    const ambulanceTypes = ["white", "atan"] as const;
    const rows: ScheduleRow[] = [];
    for (const ambulanceType of ambulanceTypes) {
      for (const lp of launchPoints) {
        const key = `${lp.id}:${ambulanceType}`;
        const shifts = groupedByLaunchPointAndType.get(key) ?? [];
        const shiftsByType: ShiftsByType = {
          night: [],
          morning: [],
          reinforcement: [],
          evening: [],
        };
        for (const s of shifts) {
          const col = SHIFT_TYPE_TO_COLUMN[s.shift_type] ?? "morning";
          shiftsByType[col].push(s);
        }
        if (shiftsByType.night.length > 0 || shiftsByType.morning.length > 0 || shiftsByType.reinforcement.length > 0 || shiftsByType.evening.length > 0) {
          rows.push({ launch_point: lp, ambulance_type: ambulanceType, shiftsByType });
        }
      }
    }
    return rows;
  } catch (error) {
    console.error("Failed to fetch display shifts:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to fetch display shifts"
    );
  }
}

export async function registerShiftSlot(shift: DisplayShift, tags: DbTag[], isNoar: boolean) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      throw new Error("Unauthorized");
    }
    if (isNoar) {
      await sql`
        INSERT INTO shift_slot (shift_id, user_id, status, created_by)
        VALUES (${shift.id}, ${session.user.id}, 'pending', ${session.user.id})
      `;
    } else {
      await sql`
        INSERT INTO shift_slot (shift_id, user_id, status, created_by)
        VALUES (${shift.id}, ${session.user.id}, 'confirmed', ${session.user.id})
      `;
    }
  } catch (error) {
    console.error("Failed to register shift slot:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to register shift slot"
    );
  }
} 

async function assertShiftManager(userId: string) {
  const tags = await getUserTags(userId);
  const isShiftManager = tags.some((tag) => tag.name === "רכז שיבוצים");
  if (!isShiftManager) {
    throw new Error("Unauthorized");
  }
}

async function updateShiftSlotStatus(shiftSlotId: string, status: "confirmed" | "cancelled") {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }
  if (!shiftSlotId) {
    throw new Error("Shift slot ID is required");
  }

  await assertShiftManager(session.user.id);

  await sql`
    UPDATE shift_slot
    SET status = ${status}, updated_by = ${session.user.id}
    WHERE id = ${shiftSlotId}
  `;
  revalidatePath("/shiftPicker");
}

export async function approveShiftSlot(shiftSlotId: string) {
  try {
    await updateShiftSlotStatus(shiftSlotId, "confirmed");
  } catch (error) {
    console.error("Failed to approve shift slot:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to approve shift slot"
    );
  }
}

export async function denyShiftSlot(shiftSlotId: string) {
  try {
    await updateShiftSlotStatus(shiftSlotId, "cancelled");
  } catch (error) {
    console.error("Failed to deny shift slot:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to deny shift slot"
    );
  }
}