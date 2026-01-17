"use server";

import { auth } from "@/auth";
import { sql } from "@/app/lib/data";
import { revalidatePath } from "next/cache";
import { getDisplayShiftByDate, getPermanentShiftByDate, getShiftsByDate } from "../data/shift";
import type { DisplayShift } from "../data/shift";

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

export async function fetchDisplayShiftsByDate(date: Date): Promise<Array<[string, DisplayShift[]]>> {
  try {
    const permanentShifts = await getPermanentShiftByDate(date);
    const displayShifts: Array<[string, DisplayShift[]]> = [];  
      permanentShifts.forEach(permanentShift => {
        const shift: DisplayShift = {
          id: null,
          permanent_shift_id: permanentShift.id,
          area_id: permanentShift.area_id,
          launch_point_id: permanentShift.launch_point_id,
          ambulance_type: permanentShift.ambulance_type,
          ambulance_id: null,
          driver_id: null,
          date: date,
          start_time: permanentShift.start_time,
          end_time: permanentShift.end_time,
          adult_only: permanentShift.adult_only,
          number_of_slots: permanentShift.number_of_slots,
          shift_type: permanentShift.shift_type,
          status: "permanent",
          isFromPermanent: true,
        }
        const existingIndex = displayShifts.findIndex(([lpId]) => lpId === permanentShift.launch_point_id);
        if (existingIndex >= 0) {
          displayShifts[existingIndex][1].push(shift);
        } else {
          displayShifts.push([permanentShift.launch_point_id, [shift]]);
        }
    });

    const shifts = await getShiftsByDate(date);

    shifts.forEach(dbShift => {
      const displayShift: DisplayShift = {
        id: dbShift.id,
        permanent_shift_id: dbShift.permanent_shift_id,
        area_id: dbShift.area_id,
        launch_point_id: shift.launch_point_id,
      }
    });
    
    const shiftsMap = await getDisplayShiftByDate(date);
    // Convert Map to array of entries for serialization
    return Array.from(shiftsMap.entries());
  } catch (error) {
    console.error('Failed to fetch display shifts by date:', error);
    throw new Error('Failed to fetch display shifts by date.');
  }
}

