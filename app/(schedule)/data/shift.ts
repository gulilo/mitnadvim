import { sql } from "../../lib/data";

export type DbPermanentShift = {
  id: string;
  launch_point_id: string;
  week_day: number;
  start_time: string;
  end_time: string;
  adult_only: boolean;
  number_of_slots: number;
};

export type DbShift = {
  id: string;
  permanent_shift_id: string | null;
  launch_point_id: string | null;
  ambulance_id: string | null;
  driver_id: string | null;
  date: Date;
  start_time: string | null;
  end_time: string | null;
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
      WHERE date = ${date}
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


