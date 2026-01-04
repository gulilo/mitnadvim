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

// Combined shift type for display (actual shift or generated from permanent shift)
export type DisplayShift = {
  id: string | null;
  permanent_shift_id: string | null;
  launch_point_id: string;
  ambulance_id: string | null;
  driver_id: string | null;
  date: Date;
  start_time: string;
  end_time: string;
  adult_only: boolean;
  number_of_slots: number;
  status: "active" | "canceled" | "permanent";
  isFromPermanent: boolean;
};

// Get shifts for next week, filling in with permanent shifts where needed
export async function getNextWeekShifts(): Promise<DisplayShift[]> {
  try {
    // Calculate next week dates (7 days starting from today)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const nextWeekEnd = new Date(today);
    nextWeekEnd.setDate(today.getDate() + 6);
    nextWeekEnd.setHours(23, 59, 59, 999);

    // Get all shifts for the next week
    const shifts = await getShiftsByDateRange(today, nextWeekEnd);

    // Get all permanent shifts
    const permanentShifts = await getAllPermanentShifts();

    // Create a map of shifts by date and launch point for quick lookup
    const shiftMap = new Map<string, DbShift[]>();
    shifts.forEach(shift => {
      // Handle date - it might be a Date object or a string
      const shiftDate = shift.date instanceof Date ? shift.date : new Date(shift.date);
      const dateKey = shiftDate.toISOString().split('T')[0];
      if (!shiftMap.has(dateKey)) {
        shiftMap.set(dateKey, []);
      }
      shiftMap.get(dateKey)!.push(shift);
    });

    // Generate display shifts
    const displayShifts: DisplayShift[] = [];

    // Process each day of the next week
    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(today);
      currentDate.setDate(today.getDate() + i);
      const dayOfWeek = currentDate.getDay(); // 0 = Sunday, 6 = Saturday
      const dateKey = currentDate.toISOString().split('T')[0];

      // Get shifts for this day
      const dayShifts = shiftMap.get(dateKey) || [];

      // Get permanent shifts for this day of week
      const dayPermanentShifts = permanentShifts.filter(ps => ps.week_day === dayOfWeek);

      // Add actual shifts
      dayShifts.forEach(shift => {
        const shiftDate = shift.date instanceof Date ? shift.date : new Date(shift.date);
        displayShifts.push({
          id: shift.id,
          permanent_shift_id: shift.permanent_shift_id,
          launch_point_id: shift.launch_point_id || '',
          ambulance_id: shift.ambulance_id,
          driver_id: shift.driver_id,
          date: shiftDate,
          start_time: shift.start_time || '',
          end_time: shift.end_time || '',
          adult_only: shift.adult_only,
          number_of_slots: shift.number_of_slots,
          status: shift.status,
          isFromPermanent: false,
        });
      });

      // For each permanent shift, check if there's already a shift for that launch point on this day
      dayPermanentShifts.forEach(permanentShift => {
        const hasShiftForLaunchPoint = dayShifts.some(
          shift => shift.launch_point_id === permanentShift.launch_point_id
        );

        // If no shift exists for this launch point on this day, create one from permanent shift
        if (!hasShiftForLaunchPoint) {
          displayShifts.push({
            id: null,
            permanent_shift_id: permanentShift.id,
            launch_point_id: permanentShift.launch_point_id,
            ambulance_id: null,
            driver_id: null,
            date: new Date(currentDate),
            start_time: permanentShift.start_time,
            end_time: permanentShift.end_time,
            adult_only: permanentShift.adult_only,
            number_of_slots: permanentShift.number_of_slots,
            status: "permanent",
            isFromPermanent: true,
          });
        }
      });
    }

    // Sort by date and start time
    displayShifts.sort((a, b) => {
      const dateCompare = a.date.getTime() - b.date.getTime();
      if (dateCompare !== 0) return dateCompare;
      return a.start_time.localeCompare(b.start_time);
    });

    return displayShifts;
  } catch (error) {
    console.error('Failed to fetch next week shifts:', error);
    throw new Error('Failed to fetch next week shifts.');
  }
}

