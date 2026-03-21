"use server";

import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import {
  createShiftSlotRecord,
  getDisplayShiftsByDate,
  DisplayShift,
  updateShiftAmbulanceRecord,
  updateShiftDriverRecord,
  updateShiftSlotStatusRecord,
} from "../data/shift";
import {
  createLaunchPointRecord,
  LaunchPoint,
  deleteLaunchPointRecord,
  getAllLaunchPoints,
} from "../data/launchPoint";
import { getAmbulanceByNumber } from "../data/ambulance";
import { getUserTags } from "@/app/(user)/data/user";
import { Tag } from "@/app/(user)/data/definitions";

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
  launch_point: LaunchPoint;
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

    await createLaunchPointRecord({
      name,
      areaId,
      createdBy: session.user.id,
    });

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
    await deleteLaunchPointRecord(launchPointId);

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

    await updateShiftDriverRecord({
      shiftId,
      driverAccountId,
      updatedBy: session.user.id,
    });

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
    await updateShiftDriverRecord({
      shiftId,
      driverAccountId: null,
      updatedBy: session.user.id,
    });
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
    await updateShiftAmbulanceRecord({
      shiftId,
      ambulanceId,
      updatedBy: session.user.id,
    });

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
    const [launchPoints, displayShifts] = await Promise.all([
      getAllLaunchPoints(),
      getDisplayShiftsByDate(date),
    ]);

    const groupedByLaunchPointAndType = Map.groupBy(
      displayShifts,
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

export async function registerShiftSlot(shift: DisplayShift, tags: Tag[], isNoar: boolean) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      throw new Error("Unauthorized");
    }
    if (isNoar) {
      await createShiftSlotRecord({
        shiftId: shift.id,
        userId: session.user.id,
        status: "pending",
        createdBy: session.user.id,
      });
    } else {
      await createShiftSlotRecord({
        shiftId: shift.id,
        userId: session.user.id,
        status: "confirmed",
        createdBy: session.user.id,
      });
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

  await updateShiftSlotStatusRecord({
    shiftSlotId,
    status,
    updatedBy: session.user.id,
  });
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