"use server";

import { auth } from "@/auth";
import { sql } from "@/app/lib/data";
import { revalidatePath } from "next/cache";
import { getShiftsByDate, getPermanentShiftByDate } from "../data/shift";

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