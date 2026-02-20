'use server';

import { DbUser } from "@/app/(user)/data/definitions";
import { sql } from "../../lib/data";
import { DbLaunchPoint, getAllLaunchPoints } from "./launchPoint";
import { getAllAmbulances } from "./ambulance";
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

const SHIFT_TYPE_LABELS: Record<ShiftType, string> = {
  day: "בוקר",
  reinforcement: "תגבור",
  evening: "ערב",
  night: "לילה",
  over_the_machine: "מעל התקן",
  security: "אבטחה",
};

const AMBULANCE_TYPE_LABELS: Record<string, string> = {
  white: "אמבולנס לבן",
  intensive: "אמבולנס טיפול נמרץ",
};

function getAmbulanceTypeLabel(ambulanceType: string): string {
  const key = ambulanceType.toLowerCase().replace(/\s+/g, "_");
  return AMBULANCE_TYPE_LABELS[key] ?? AMBULANCE_TYPE_LABELS[ambulanceType] ?? ambulanceType;
}

export async function getShiftsForPickerDay(date: Date): Promise<PickerShiftType[]> {
  const shifts = await getShiftsByDate(date);
  const launchPoints = await getAllLaunchPoints();
  const ambulances = await getAllAmbulances();

  const lpMap = new Map(launchPoints.map((lp) => [lp.id, lp.name]));
  const ambMap = new Map(ambulances.map((a) => [a.id, a.number]));

  // Group by shift_type -> ambulance_type -> list of shifts (for location rows)
  type GroupKey = string;
  const byShiftType = new Map<ShiftType, Map<string, DbShift[]>>();

  for (const shift of shifts) {
    if (shift.status !== "active") continue;
    const st = shift.shift_type;
    if (!byShiftType.has(st)) byShiftType.set(st, new Map());
    const byAmb = byShiftType.get(st)!;
    const ambType = shift.ambulance_type ?? "";
    if (!byAmb.has(ambType)) byAmb.set(ambType, []);
    byAmb.get(ambType)!.push(shift);
  }

  const result: PickerShiftType[] = [];

  for (const shiftType of SHIFT_TYPE_ORDER) {
    const byAmb = byShiftType.get(shiftType);
    if (!byAmb || byAmb.size === 0) continue;

    const ambulanceTypes: PickerAmbulanceType[] = [];
    const ambTypeKeys = Array.from(byAmb.keys()).sort();

    for (const ambType of ambTypeKeys) {
      const typeShifts = byAmb.get(ambType)!;
      const locations: PickerLocationRow[] = typeShifts.map((s) => ({
        id: s.id,
        label: lpMap.get(s.launch_point_id) ?? s.launch_point_id,
        ambulanceNumber: s.ambulance_id ? ambMap.get(s.ambulance_id) ?? null : null,
        shiftId: s.id,
      }));
      // Sort locations by label (launch point name)
      locations.sort((a, b) => a.label.localeCompare(b.label, "he"));

      ambulanceTypes.push({
        id: ambType || "default",
        label: getAmbulanceTypeLabel(ambType),
        count: typeShifts.length,
        locations,
      });
    }

    const totalCount = shifts.filter((s) => s.shift_type === shiftType && s.status === "active").length;

    result.push({
      id: shiftType,
      label: SHIFT_TYPE_LABELS[shiftType],
      count: totalCount,
      ambulanceTypes,
    });
  }

  return result;
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