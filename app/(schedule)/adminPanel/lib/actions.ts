"use server";

import { auth } from "@/auth";
import { sql } from "@/app/lib/data";
import { revalidatePath } from "next/cache";
import { DbPermanentShift, DbShift } from "../../data/shift";

export async function createPermanentShift(permanentShift: DbPermanentShift) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      throw new Error('Unauthorized');
    }
    const launchPointId = permanentShift.launch_point_id;
    const weekDay = permanentShift.week_day;
    const startTime = permanentShift.start_time;
    const endTime = permanentShift.end_time;
    const adultOnly = permanentShift.adult_only;
    const numberOfSlots = permanentShift.number_of_slots;

    console.log(launchPointId, weekDay, startTime, endTime, adultOnly, numberOfSlots);


    if (!launchPointId || !weekDay || !startTime || !endTime || adultOnly === undefined || !numberOfSlots) {
      throw new Error('All fields are required');
    }


    await sql`
      INSERT INTO permanent_shift (launch_point_id, week_day, start_time, end_time, adult_only, number_of_slots, created_by)
      VALUES (${launchPointId}, ${weekDay}, ${startTime}, ${endTime}, ${adultOnly}, ${numberOfSlots}, ${session.user.id})
      RETURNING id
    `;

    revalidatePath('/adminPanel');
  } catch (error) {
    console.error('Failed to create permanent shift:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to create permanent shift');
  }
} 

export async function createShift(shift: DbShift) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      throw new Error('Unauthorized');
    }
    const permanentShiftId = shift.permanent_shift_id;
    const launchPointId = shift.launch_point_id;
    const ambulanceId = shift.ambulance_id;
    const driverId = shift.driver_id;
    const date = shift.date;
    const startTime = shift.start_time;
    const endTime = shift.end_time;
    const adultOnly = shift.adult_only;
    const numberOfSlots = shift.number_of_slots;    
    const status = shift.status;

    console.log(permanentShiftId, launchPointId, ambulanceId, driverId, date, startTime, endTime, adultOnly, numberOfSlots, status);

    if (!launchPointId || !date || !startTime || !endTime || adultOnly === undefined || !numberOfSlots || !status) {
      throw new Error('All fields are required');
    }

    await sql`
      INSERT INTO shift (permanent_shift_id, launch_point_id, ambulance_id, driver_id, date, start_time, end_time, adult_only, number_of_slots, status, created_by)
      VALUES (${permanentShiftId}, ${launchPointId}, ${ambulanceId}, ${driverId}, ${date}, ${startTime}, ${endTime}, ${adultOnly}, ${numberOfSlots}, ${status}, ${session.user.id})
    `;

    revalidatePath('/adminPanel');
  } catch (error) {
    console.error('Failed to create shift:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to create shift');
  }
}