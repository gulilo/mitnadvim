'use server';

import { DbUser } from "@/app/(user)/data/definitions";
import { getUserByAccountId } from "@/app/(user)/data/user";
import { sql } from "../../lib/data";
import { DbLaunchPoint, getAllLaunchPoints } from "./launchPoint";
import { getAllAmbulances } from "./ambulance";
import type { DbAmbulance } from "./ambulance";

export type ShiftType = "day" | "evening" | "night" | "reinforcement" | "over_the_machine" | "security";
export type AmbulanceType = "white" | "intensive";


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
  ambulance_type: AmbulanceType;
  ambulance: DbAmbulance | null;
  driver: DbUser | null;
  start_date: Date;
  end_date: Date;
  start_time: string;
  end_time: string;
  shift_type: ShiftType;
  adult_only: boolean;
  number_of_slots: number;
  slots: (DisplayShiftSlot | null)[];
};

export type DisplayShiftSlot = {
  id: string;
  shift_id: string;
  user: DbUser | null;
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

/** Returns shifts for a date enriched as DisplayShift (launch_point, ambulance, driver, slots). */
export async function getDisplayShiftsByDate(date: Date): Promise<DisplayShift[]> {
  const shifts = await getShiftsByDate(date);
  const active = shifts.filter((s) => s.status === "active");
  const launchPoints = await getAllLaunchPoints();
  const ambulances = await getAllAmbulances();
  const lpMap = new Map(launchPoints.map((lp) => [lp.id, lp]));
  const ambMap = new Map(ambulances.map((a) => [a.id, a]));
  const driverIds = [...new Set(active.map((s) => s.driver_id).filter(Boolean))] as string[];
  const driverMap = new Map<string, DbUser>();
  await Promise.all(
    driverIds.map(async (id) => {
      const user = await getUserByAccountId(id);
      if (user) driverMap.set(id, user);
    })
  );
  const slotsPerShift = await Promise.all(active.map((s) => getShiftSlotsByShift(s.id)));
  const slotUserIds = [...new Set(slotsPerShift.flat().map((slot) => slot.user_id).filter(Boolean))];
  const slotUserMap = new Map<string, DbUser>();
  await Promise.all(
    slotUserIds.map(async (id) => {
      const user = await getUserByAccountId(id);
      if (user) slotUserMap.set(id, user);
    })
  );
  const displayShifts: DisplayShift[] = active.map((s, i) => {
    const launch_point = lpMap.get(s.launch_point_id);
    if (!launch_point) throw new Error(`Launch point not found: ${s.launch_point_id}`);
    const rawSlots = slotsPerShift[i];
    const slots: (DisplayShiftSlot | null)[] = Array.from(
      { length: s.number_of_slots },
      (_, j) => {
        if (j >= rawSlots.length) return null;
        const slot = rawSlots[j];
        return {
          id: slot.id,
          shift_id: slot.shift_id,
          user: slotUserMap.get(slot.user_id) ?? null,
          status: slot.status,
        };
      }
    );
    return {
      id: s.id,
      launch_point,
      ambulance_type: s.ambulance_type as AmbulanceType,
      ambulance: s.ambulance_id ? ambMap.get(s.ambulance_id) ?? null : null,
      driver: s.driver_id ? (driverMap.get(s.driver_id) ?? null) : null,
      start_date: s.start_date,
      end_date: s.end_date,
      start_time: s.start_time,
      end_time: s.end_time,
      shift_type: s.shift_type,
      adult_only: s.adult_only,
      number_of_slots: s.number_of_slots,
      slots,
    };
  });
  return displayShifts;
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

// Picker: grouped by shift_type, then ambulance_type, then location (launch point)





export type PickerLocationRow = {
  id: string;
  label: string;
  ambulanceNumber: string | null;
  shiftId: string;
};

export type PickerAmbulanceType = {
  id: string;
  label: string;
  count: number;
  locations: PickerLocationRow[];
};

export type PickerShiftType = {
  id: ShiftType;
  label: string;
  count: number;
  ambulanceTypes: PickerAmbulanceType[];
};

const SHIFT_TYPE_ORDER: ShiftType[] = [
  "day",
  "reinforcement",
  "evening",
  "night",
  "over_the_machine",
  "security",
];



export async function getShiftsForPickerDay(date: Date): Promise<Map<ShiftType, Map<AmbulanceType, DisplayShift[]>>> {
  const displayShifts = await getDisplayShiftsByDate(date);

  // Group by shift_type -> ambulance_type -> list of DisplayShift (for location rows)
  const byShiftType = new Map<ShiftType, Map<AmbulanceType, DisplayShift[]>>();

  for (const shift of displayShifts) {
    const st = shift.shift_type;
    if (!byShiftType.has(st)) byShiftType.set(st, new Map());
    const byAmb = byShiftType.get(st)!;
    const ambType = shift.ambulance_type as AmbulanceType;
    if (!byAmb.has(ambType as AmbulanceType)) byAmb.set(ambType as AmbulanceType, []);
    byAmb.get(ambType as AmbulanceType)!.push(shift);
  }

  return byShiftType;
  // const result: PickerShiftType[] = [];

  // for (const shiftType of SHIFT_TYPE_ORDER) {
  //   const byAmb = byShiftType.get(shiftType);
  //   if (!byAmb || byAmb.size === 0) continue;

  //   const ambulanceTypes: PickerAmbulanceType[] = [];
  //   const ambTypeKeys = Array.from(byAmb.keys()).sort();

  //   for (const ambType of ambTypeKeys) {
  //     const typeShifts = byAmb.get(ambType)!;
  //     const locations: PickerLocationRow[] = typeShifts.map((s) => ({
  //       id: s.id,
  //       label: s.launch_point.name,
  //       ambulanceNumber: s.ambulance?.number ?? null,
  //       shiftId: s.id,
  //     }));
  //     locations.sort((a, b) => a.label.localeCompare(b.label, "he"));

  //     ambulanceTypes.push({
  //       id: ambType || "default",
  //       label: getAmbulanceTypeLabel(ambType),
  //       count: typeShifts.length,
  //       locations,
  //     });
  //   }

  //   const totalCount = displayShifts.filter((s) => s.shift_type === shiftType).length;

  //   result.push({
  //     id: shiftType,
  //     label: SHIFT_TYPE_LABELS[shiftType],
  //     count: totalCount,
  //     ambulanceTypes,
  //   });
  // }

  // console.log("result", result);
  // return result;
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