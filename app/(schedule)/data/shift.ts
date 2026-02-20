'use server';

import { DbUser } from "@/app/(user)/data/definitions";
import { sql } from "../../lib/data";
import { DbLaunchPoint } from "./launchPoint";
import type { DbAmbulance } from "./ambulance";

export type ShiftType = "day" | "evening" | "night" | "reinforcement" | "over_the_machine" | "security";

export type DbPermanentShift = {
  id: string;
  area_id: string;
  launch_point_id: string;
  shift_type: ShiftType;
  week_day: number;
  start_time: string;
  end_time: string;
  adult_only: boolean;
  number_of_slots: number;
  ambulance_type: string;
};

export type DbShift = {
  id: string;
  launch_point_id: string;
  ambulance_type: string;
  ambulance_id: string | null;
  driver_id: string | null;
  start_date: Date;
  end_date: Date;
  start_time: string;
  end_time: string;
  shift_type: ShiftType;
  adult_only: boolean;
  number_of_slots: number;
  status: "active" | "canceled";
};

export type DbShiftSlot = {
  id: string;
  shift_id: string;
  user_id: string;
  status: "pending" | "confirmed" | "cancelled";
};

export type DisplayShift = {
  id: string;
  launch_point: DbLaunchPoint;
  ambulance_type: string;
  ambulance: DbAmbulance | null;
  driver: DbUser | null;
  start_date: Date;
  end_date: Date;
  start_time: string;
  end_time: string;
  shift_type: ShiftType;
  adult_only: boolean;
  number_of_slots: number;
};

// Permanent Shift functions
export async function getAllPermanentShifts(): Promise<DbPermanentShift[]> {
  try {
    const permanentShifts = await sql`
      SELECT * FROM permanent_shift 
      ORDER BY week_day ASC, start_time ASC
    `;
    return permanentShifts as DbPermanentShift[];
  } catch (error) {
    console.error('Failed to fetch permanent shifts:', error);
    throw new Error('Failed to fetch permanent shifts.');
  }
}

export async function getPermanentShiftByDate(date: Date): Promise<DbPermanentShift[]> {
  try {
    const permanentShifts = await sql`
      SELECT * FROM permanent_shift 
      WHERE week_day = ${date.getDay()}
    `;
    return permanentShifts as DbPermanentShift[];
  } catch (error) {
    console.error('Failed to fetch permanent shifts by date:', error);
    throw new Error('Failed to fetch permanent shifts by date.');
  }
}

export async function getPermanentShiftById(id: string): Promise<DbPermanentShift | null> {
  try {
    const permanentShift = await sql`
      SELECT * FROM permanent_shift 
      WHERE id = ${id}
    `;
    return permanentShift[0] as DbPermanentShift | null;
  } catch (error) {
    console.error('Failed to fetch permanent shift:', error);
    return null;
  }
}

export async function getPermanentShiftsByLaunchPoint(launchPointId: string): Promise<DbPermanentShift[]> {
  try {
    const permanentShifts = await sql`
      SELECT * FROM permanent_shift 
      WHERE launch_point_id = ${launchPointId}
      ORDER BY week_day ASC, start_time ASC
    `;
    return permanentShifts as DbPermanentShift[];
  } catch (error) {
    console.error('Failed to fetch permanent shifts by launch point:', error);
    throw new Error('Failed to fetch permanent shifts by launch point.');
  }
}

// Shift functions
export async function getAllShifts(): Promise<DbShift[]> {
  try {
    const shifts = await sql`
      SELECT * FROM shift 
      ORDER BY date DESC, start_time DESC
    `;
    return shifts as DbShift[];
  } catch (error) {
    console.error('Failed to fetch shifts:', error);
    throw new Error('Failed to fetch shifts.');
  }
}

export async function getShiftById(id: string): Promise<DbShift | null> {
  try {
    const shift = await sql`
      SELECT * FROM shift 
      WHERE id = ${id}
    `;
    return shift[0] as DbShift | null;
  } catch (error) {
    console.error('Failed to fetch shift:', error);
    return null;
  }
}

export async function getShiftsByDate(date: Date): Promise<DbShift[]> {
  try {
    const shifts = await sql`
      SELECT * FROM shift 
      WHERE start_date = ${date}
      ORDER BY start_time ASC
    `;
    return shifts as DbShift[];
  } catch (error) {
    console.error('Failed to fetch shifts by date:', error);
    throw new Error('Failed to fetch shifts by date.');
  }
}

export async function getShiftsByDateRange(startDate: Date, endDate: Date): Promise<DbShift[]> {
  try {
    const shifts = await sql`
      SELECT * FROM shift 
      WHERE date >= ${startDate} AND date <= ${endDate}
      ORDER BY date ASC, start_time ASC
    `;
    return shifts as DbShift[];
  } catch (error) {
    console.error('Failed to fetch shifts by date range:', error);
    throw new Error('Failed to fetch shifts by date range.');
  }
}

export async function getShiftsByPermanentShift(permanentShiftId: string): Promise<DbShift[]> {
  try {
    const shifts = await sql`
      SELECT * FROM shift 
      WHERE permanent_shift_id = ${permanentShiftId}
      ORDER BY date DESC
    `;
    return shifts as DbShift[];
  } catch (error) {
    console.error('Failed to fetch shifts by permanent shift:', error);
    throw new Error('Failed to fetch shifts by permanent shift.');
  }
}

export async function getShiftsByDriver(driverId: string): Promise<DbShift[]> {
  try {
    const shifts = await sql`
      SELECT * FROM shift 
      WHERE driver_id = ${driverId}
      ORDER BY date DESC, start_time DESC
    `;
    return shifts as DbShift[];
  } catch (error) {
    console.error('Failed to fetch shifts by driver:', error);
    throw new Error('Failed to fetch shifts by driver.');
  }
}

// Shift Slot functions
export async function getShiftSlotsByShift(shiftId: string): Promise<DbShiftSlot[]> {
  try {
    const shiftSlots = await sql`
      SELECT * FROM shift_slot 
      WHERE shift_id = ${shiftId}
      ORDER BY created_at ASC
    `;
    return shiftSlots as DbShiftSlot[];
  } catch (error) {
    console.error('Failed to fetch shift slots:', error);
    throw new Error('Failed to fetch shift slots.');
  }
}

export async function getShiftSlotsByUser(userId: string): Promise<DbShiftSlot[]> {
  try {
    const shiftSlots = await sql`
      SELECT * FROM shift_slot 
      WHERE user_id = ${userId}
      ORDER BY created_at DESC
    `;
    return shiftSlots as DbShiftSlot[];
  } catch (error) {
    console.error('Failed to fetch shift slots by user:', error);
    throw new Error('Failed to fetch shift slots by user.');
  }
}

export async function getShiftSlotById(id: string): Promise<DbShiftSlot | null> {
  try {
    const shiftSlot = await sql`
      SELECT * FROM shift_slot 
      WHERE id = ${id}
    `;
    return shiftSlot[0] as DbShiftSlot | null;
  } catch (error) {
    console.error('Failed to fetch shift slot:', error);
    return null;
  }
}