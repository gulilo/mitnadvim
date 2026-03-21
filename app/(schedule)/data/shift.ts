'use server';

import { User, Tag } from "@/app/(user)/data/definitions";
import { prisma } from "../../lib/data";
import { LaunchPoint } from "./launchPoint";
import type { Ambulance } from "./ambulance";

export type ShiftType = "day" | "evening" | "night" | "reinforcement" | "over_the_machine" | "security";
export type AmbulanceType = "white" | "atan";


export type PermanentShift = {
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

export type ShiftRecord = {
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

export type ShiftSlot = {
  id: string;
  shift_id: string;
  user_id: string;
  status: "pending" | "confirmed" | "cancelled";
};

export type DisplayShift = {
  id: string;
  launch_point: LaunchPoint;
  ambulance_type: AmbulanceType;
  ambulance: Ambulance | null;
  driver: User | null;
  start_date: Date;
  end_date: Date;
  start_time: string;
  end_time: string;
  shift_type: ShiftType;
  adult_only: boolean;
  number_of_slots: number;
  confirmed_slots: (DisplayShiftSlot | null)[];
  pending_slots: (DisplayShiftSlot | null)[];
};

export type DisplayShiftSlot = {
  id: string;
  shift_id: string;
  user: User | null;
  status: "pending" | "confirmed" | "cancelled";
};

function toAmbulanceType(value: string): AmbulanceType {
  return value === "atan" ? "atan" : "white";
}

function toShiftType(value: string | null): ShiftType {
  if (
    value === "day" ||
    value === "evening" ||
    value === "night" ||
    value === "reinforcement" ||
    value === "over_the_machine" ||
    value === "security"
  ) {
    return value;
  }
  return "day";
}

function toShiftSlotStatus(value: "pending" | "confirmed" | "cancelled"): ShiftSlot["status"] {
  return value;
}

function formatTimeValue(value: Date | null): string {
  if (!value) {
    return "";
  }
  return value.toTimeString().slice(0, 5);
}

function toPermanentShift(shift: {
  id: string;
  launch_point_id: string;
  shift_type: "day" | "evening" | "night";
  week_day: number;
  start_time: Date;
  end_time: Date;
  adult_only: boolean;
  number_of_slots: number;
  ambulance_type: "white" | "atan" | null;
}): PermanentShift {
  return {
    id: shift.id,
    area_id: "",
    launch_point_id: shift.launch_point_id,
    shift_type: shift.shift_type,
    week_day: shift.week_day,
    start_time: formatTimeValue(shift.start_time),
    end_time: formatTimeValue(shift.end_time),
    adult_only: shift.adult_only,
    number_of_slots: shift.number_of_slots,
    ambulance_type: shift.ambulance_type ?? "white",
  };
}

function toShiftRecord(shift: {
  id: string;
  launch_point_id: string;
  ambulance_type: "white" | "atan";
  ambulance_id: string | null;
  driver_id: string | null;
  start_date: Date;
  end_date: Date | null;
  start_time: Date | null;
  end_time: Date | null;
  shift_type: string | null;
  adult_only: boolean | null;
  number_of_slots: number | null;
  status: "active" | "canceled";
}): ShiftRecord {
  return {
    id: shift.id,
    launch_point_id: shift.launch_point_id,
    ambulance_type: shift.ambulance_type,
    ambulance_id: shift.ambulance_id,
    driver_id: shift.driver_id,
    start_date: shift.start_date,
    end_date: shift.end_date ?? shift.start_date,
    start_time: formatTimeValue(shift.start_time),
    end_time: formatTimeValue(shift.end_time),
    shift_type: toShiftType(shift.shift_type),
    adult_only: shift.adult_only ?? false,
    number_of_slots: shift.number_of_slots ?? 0,
    status: shift.status,
  };
}

function toShiftSlot(slot: {
  id: string;
  shift_id: string;
  user_id: string;
  status: "pending" | "confirmed" | "cancelled";
}): ShiftSlot {
  return {
    id: slot.id,
    shift_id: slot.shift_id,
    user_id: slot.user_id,
    status: toShiftSlotStatus(slot.status),
  };
}

function toUserModel(user: {
  id: string;
  account_id: string;
  first_name: string | null;
  last_name: string | null;
  image_url: string | null;
  address: string | null;
  area_id: string | null;
  role: string | null;
  active: boolean;
  active_date: Date | null;
}): User {
  return {
    id: user.id,
    account_id: user.account_id,
    first_name: user.first_name,
    last_name: user.last_name,
    image_url: user.image_url,
    address: user.address,
    area_id: user.area_id,
    role: user.role,
    active: user.active,
    active_date: user.active_date,
  };
}

// Permanent Shift functions
export async function getAllPermanentShifts(): Promise<PermanentShift[]> {
  try {
    const permanentShifts = await prisma.permanent_shift.findMany({
      orderBy: [{ week_day: "asc" }, { start_time: "asc" }],
      select: {
        id: true,
        launch_point_id: true,
        shift_type: true,
        week_day: true,
        start_time: true,
        end_time: true,
        adult_only: true,
        number_of_slots: true,
        ambulance_type: true,
      },
    });
    return permanentShifts.map(toPermanentShift);
  } catch (error) {
    console.error('Failed to fetch permanent shifts:', error);
    throw new Error('Failed to fetch permanent shifts.');
  }
}

export async function getPermanentShiftByDate(date: Date): Promise<PermanentShift[]> {
  try {
    const permanentShifts = await prisma.permanent_shift.findMany({
      where: { week_day: date.getDay() },
      select: {
        id: true,
        launch_point_id: true,
        shift_type: true,
        week_day: true,
        start_time: true,
        end_time: true,
        adult_only: true,
        number_of_slots: true,
        ambulance_type: true,
      },
    });
    return permanentShifts.map(toPermanentShift);
  } catch (error) {
    console.error('Failed to fetch permanent shifts by date:', error);
    throw new Error('Failed to fetch permanent shifts by date.');
  }
}

export async function getPermanentShiftById(id: string): Promise<PermanentShift | null> {
  try {
    const permanentShift = await prisma.permanent_shift.findUnique({ where: { id } });
    return permanentShift ? toPermanentShift(permanentShift) : null;
  } catch (error) {
    console.error('Failed to fetch permanent shift:', error);
    return null;
  }
}

export async function getPermanentShiftsByLaunchPoint(launchPointId: string): Promise<PermanentShift[]> {
  try {
    const permanentShifts = await prisma.permanent_shift.findMany({
      where: { launch_point_id: launchPointId },
      orderBy: [{ week_day: "asc" }, { start_time: "asc" }],
      select: {
        id: true,
        launch_point_id: true,
        shift_type: true,
        week_day: true,
        start_time: true,
        end_time: true,
        adult_only: true,
        number_of_slots: true,
        ambulance_type: true,
      },
    });
    return permanentShifts.map(toPermanentShift);
  } catch (error) {
    console.error('Failed to fetch permanent shifts by launch point:', error);
    throw new Error('Failed to fetch permanent shifts by launch point.');
  }
}

// Shift functions
export async function getAllShifts(): Promise<ShiftRecord[]> {
  try {
    const shifts = await prisma.shift.findMany({
      orderBy: [{ start_date: "desc" }, { start_time: "desc" }],
      select: {
        id: true,
        launch_point_id: true,
        ambulance_type: true,
        ambulance_id: true,
        driver_id: true,
        start_date: true,
        end_date: true,
        start_time: true,
        end_time: true,
        shift_type: true,
        adult_only: true,
        number_of_slots: true,
        status: true,
      },
    });
    return shifts.map(toShiftRecord);
  } catch (error) {
    console.error('Failed to fetch shifts:', error);
    throw new Error('Failed to fetch shifts.');
  }
}

export async function getShiftById(id: string): Promise<ShiftRecord | null> {
  try {
    const shift = await prisma.shift.findUnique({ where: { id } });
    return shift ? toShiftRecord(shift) : null;
  } catch (error) {
    console.error('Failed to fetch shift:', error);
    return null;
  }
}

export async function getShiftsByDate(date: Date): Promise<ShiftRecord[]> {
  try {
    const shifts = await prisma.shift.findMany({
      where: { start_date: date },
      orderBy: { start_time: "asc" },
      select: {
        id: true,
        launch_point_id: true,
        ambulance_type: true,
        ambulance_id: true,
        driver_id: true,
        start_date: true,
        end_date: true,
        start_time: true,
        end_time: true,
        shift_type: true,
        adult_only: true,
        number_of_slots: true,
        status: true,
      },
    });
    return shifts.map(toShiftRecord);
  } catch (error) {
    console.error('Failed to fetch shifts by date:', error);
    throw new Error('Failed to fetch shifts by date.');
  }
}

/** Returns shifts for a date enriched as DisplayShift (launch_point, ambulance, driver, slots). */
export async function getDisplayShiftsByDate(date: Date): Promise<DisplayShift[]> {
  const shifts = await getShiftsByDate(date);
  if (shifts.length === 0) {
    return [];
  }

  const launchPointIds = [...new Set(shifts.map((shift) => shift.launch_point_id))];
  const ambulanceIds = [...new Set(shifts.map((shift) => shift.ambulance_id).filter(Boolean))] as string[];
  const shiftIds = shifts.map((shift) => shift.id);
  const driverIds = [...new Set(shifts.map((shift) => shift.driver_id).filter(Boolean))] as string[];

  const [launchPoints, ambulances, rawSlots] = await Promise.all([
    prisma.launch_point.findMany({
      where: { id: { in: launchPointIds } },
      select: { id: true, area_id: true, name: true },
    }),
    prisma.ambulance.findMany({
      where: { id: { in: ambulanceIds } },
      select: { id: true, number: true, type: true },
    }),
    prisma.shift_slot.findMany({
      where: { shift_id: { in: shiftIds } },
      orderBy: { created_at: "asc" },
      select: { id: true, shift_id: true, user_id: true, status: true },
    }),
  ]);

  const slotUserIds = [...new Set(rawSlots.map((slot) => slot.user_id))];
  const userAccountIds = [...new Set([...driverIds, ...slotUserIds])];
  const users = userAccountIds.length
    ? await prisma.user_info.findMany({
        where: { account_id: { in: userAccountIds } },
        select: {
          id: true,
          account_id: true,
          first_name: true,
          last_name: true,
          image_url: true,
          address: true,
          area_id: true,
          role: true,
          active: true,
          active_date: true,
        },
      })
    : [];

  const lpMap = new Map<string, LaunchPoint>(
    launchPoints.map((launchPoint) => [
      launchPoint.id,
      { id: launchPoint.id, area_id: launchPoint.area_id, name: launchPoint.name },
    ])
  );
  const ambMap = new Map<string, Ambulance>(
    ambulances.map((ambulance) => [
      ambulance.id,
      {
        id: ambulance.id,
        number: ambulance.number,
        type: ambulance.type,
        atan: ambulance.type === "atan",
      },
    ])
  );
  const userMap = new Map<string, User>(
    users.map((user) => [user.account_id, toUserModel(user)])
  );
  const slotsByShift = Map.groupBy(rawSlots.map(toShiftSlot), (slot) => slot.shift_id);

  const displayShifts: DisplayShift[] = shifts.map((s) => {
    const launch_point = lpMap.get(s.launch_point_id);
    if (!launch_point) throw new Error(`Launch point not found: ${s.launch_point_id}`);
    const rawShiftSlots = slotsByShift.get(s.id) ?? [];
    const confirmedSlots = rawShiftSlots.filter((slot) => slot.status === "confirmed");
    const confirmed_slots: (DisplayShiftSlot | null)[] = Array.from(
      { length: s.number_of_slots },
      (_, j) => {
        if (j >= confirmedSlots.length) return null;
        const slot = confirmedSlots[j];
        if (slot.status === "confirmed") {
          return {
            id: slot.id,
            shift_id: slot.shift_id,
            user: userMap.get(slot.user_id) ?? null, 
            status: slot.status,
          };
        }
        return null;
      }
    );
    const pendingSlots = rawShiftSlots.filter((slot) => slot.status === "pending");
    const pending_slots: (DisplayShiftSlot | null)[] = Array.from(
      { length: pendingSlots.length },
       (_, j) => {
      if (j >= pendingSlots.length) return null;
      const slot = pendingSlots[j];
      return {
        id: slot.id,
        shift_id: slot.shift_id,
        user: userMap.get(slot.user_id) ?? null, 
        status: slot.status,
      };
    });
    return {
      id: s.id,
      launch_point,
      ambulance_type: toAmbulanceType(s.ambulance_type),
      ambulance: s.ambulance_id ? ambMap.get(s.ambulance_id) ?? null : null,
      driver: s.driver_id ? (userMap.get(s.driver_id) ?? null) : null,
      start_date: s.start_date,
      end_date: s.end_date,
      start_time: s.start_time,
      end_time: s.end_time,
      shift_type: s.shift_type,
      adult_only: s.adult_only,
      number_of_slots: s.number_of_slots,
      confirmed_slots,
      pending_slots,
    };
  });
  return displayShifts;
}

export async function getShiftsByDateRange(startDate: Date, endDate: Date): Promise<ShiftRecord[]> {
  try {
    const shifts = await prisma.shift.findMany({
      where: {
        start_date: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: [{ start_date: "asc" }, { start_time: "asc" }],
      select: {
        id: true,
        launch_point_id: true,
        ambulance_type: true,
        ambulance_id: true,
        driver_id: true,
        start_date: true,
        end_date: true,
        start_time: true,
        end_time: true,
        shift_type: true,
        adult_only: true,
        number_of_slots: true,
        status: true,
      },
    });
    return shifts.map(toShiftRecord);
  } catch (error) {
    console.error('Failed to fetch shifts by date range:', error);
    throw new Error('Failed to fetch shifts by date range.');
  }
}

export async function getShiftsByPermanentShift(permanentShiftId: string): Promise<ShiftRecord[]> {
  try {
    // There is no permanent_shift_id in the current Prisma schema/table.
    // Keep behavior stable for callers by returning an empty set.
    return [];
  } catch (error) {
    console.error('Failed to fetch shifts by permanent shift:', error);
    throw new Error('Failed to fetch shifts by permanent shift.');
  }
}

export async function getShiftsByDriver(driverId: string): Promise<ShiftRecord[]> {
  try {
    const shifts = await prisma.shift.findMany({
      where: { driver_id: driverId },
      orderBy: [{ start_date: "desc" }, { start_time: "desc" }],
      select: {
        id: true,
        launch_point_id: true,
        ambulance_type: true,
        ambulance_id: true,
        driver_id: true,
        start_date: true,
        end_date: true,
        start_time: true,
        end_time: true,
        shift_type: true,
        adult_only: true,
        number_of_slots: true,
        status: true,
      },
    });
    return shifts.map(toShiftRecord);
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



export async function getShiftsForPickerDay(date: Date, tags: Tag[]): Promise<Map<ShiftType, Map<AmbulanceType, DisplayShift[]>>> {
  const displayShifts = await getDisplayShiftsByDate(date);

  const NOAR_TAG_NAME = "נוער";
  function  isNoar(tags: Tag[]): boolean {
    return tags.some((t) => t.name === NOAR_TAG_NAME);
  }
  

  const filterShiftsForTag = (shifts: DisplayShift[]) =>
    isNoar(tags) ? shifts.filter((s) => !s.adult_only) : shifts;

  const filteredDisplayShifts = filterShiftsForTag(displayShifts);
  // Group by shift_type -> ambulance_type -> list of DisplayShift (for location rows)
  const byShiftType = new Map<ShiftType, Map<AmbulanceType, DisplayShift[]>>();

  for (const shift of filteredDisplayShifts) {
    const st = shift.shift_type;
    if (!byShiftType.has(st)) byShiftType.set(st, new Map());
    const byAmb = byShiftType.get(st)!;
    const ambType = toAmbulanceType(shift.ambulance_type);
    if (!byAmb.has(ambType)) byAmb.set(ambType, []);
    byAmb.get(ambType)!.push(shift);
  }

  return byShiftType;
}

// Shift Slot functions
export async function getShiftSlotsByShift(shiftId: string): Promise<ShiftSlot[]> {
  try {
    const shiftSlots = await prisma.shift_slot.findMany({
      where: { shift_id: shiftId },
      orderBy: { created_at: "asc" },
      select: {
        id: true,
        shift_id: true,
        user_id: true,
        status: true,
      },
    });
    return shiftSlots.map(toShiftSlot);
  } catch (error) {
    console.error('Failed to fetch shift slots:', error);
    throw new Error('Failed to fetch shift slots.');
  }
}

export async function getShiftSlotsByUser(userId: string): Promise<ShiftSlot[]> {
  try {
    const shiftSlots = await prisma.shift_slot.findMany({
      where: { user_id: userId },
      orderBy: { created_at: "desc" },
      select: {
        id: true,
        shift_id: true,
        user_id: true,
        status: true,
      },
    });
    return shiftSlots.map(toShiftSlot);
  } catch (error) {
    console.error('Failed to fetch shift slots by user:', error);
    throw new Error('Failed to fetch shift slots by user.');
  }
}

export async function getShiftSlotById(id: string): Promise<ShiftSlot | null> {
  try {
    const shiftSlot = await prisma.shift_slot.findUnique({ where: { id } });
    return shiftSlot ? toShiftSlot(shiftSlot) : null;
  } catch (error) {
    console.error('Failed to fetch shift slot:', error);
    return null;
  }
}

export async function updateShiftDriverRecord(params: {
  shiftId: string;
  driverAccountId: string | null;
  updatedBy: string;
}) {
  return prisma.shift.update({
    where: { id: params.shiftId },
    data: { driver_id: params.driverAccountId, updated_by: params.updatedBy },
  });
}

export async function updateShiftAmbulanceRecord(params: {
  shiftId: string;
  ambulanceId: string | null;
  updatedBy: string;
}) {
  return prisma.shift.update({
    where: { id: params.shiftId },
    data: { ambulance_id: params.ambulanceId, updated_by: params.updatedBy },
  });
}

export async function createShiftSlotRecord(params: {
  shiftId: string;
  userId: string;
  status: "pending" | "confirmed";
  createdBy: string;
}) {
  return prisma.shift_slot.create({
    data: {
      shift_id: params.shiftId,
      user_id: params.userId,
      status: params.status,
      created_by: params.createdBy,
    },
  });
}

export async function updateShiftSlotStatusRecord(params: {
  shiftSlotId: string;
  status: "confirmed" | "cancelled";
  updatedBy: string;
}) {
  return prisma.shift_slot.update({
    where: { id: params.shiftSlotId },
    data: { status: params.status, updated_by: params.updatedBy },
  });
}

export async function createPermanentShiftRecord(params: {
  launchPointId: string;
  shiftType: "day" | "evening" | "night";
  weekDay: number;
  startTime: string;
  endTime: string;
  adultOnly: boolean;
  numberOfSlots: number;
  ambulanceType: "white" | "atan";
  createdBy: string;
}) {
  return prisma.permanent_shift.create({
    data: {
      launch_point_id: params.launchPointId,
      shift_type: params.shiftType,
      week_day: params.weekDay,
      start_time: new Date(params.startTime),
      end_time: new Date(params.endTime),
      adult_only: params.adultOnly,
      number_of_slots: params.numberOfSlots,
      ambulance_type: params.ambulanceType,
      created_by: params.createdBy,
    },
  });
}

export async function createShiftRecord(params: {
  launchPointId: string;
  ambulanceType: "white" | "atan";
  ambulanceId: string | null;
  driverId: string | null;
  startDate: Date;
  endDate: Date;
  startTime: string;
  endTime: string;
  shiftType: string;
  adultOnly: boolean;
  numberOfSlots: number;
  status: "active" | "canceled";
  createdBy: string;
}) {
  return prisma.shift.create({
    data: {
      launch_point_id: params.launchPointId,
      ambulance_type: params.ambulanceType,
      ambulance_id: params.ambulanceId,
      driver_id: params.driverId,
      start_date: params.startDate,
      end_date: params.endDate,
      start_time: new Date(params.startTime),
      end_time: new Date(params.endTime),
      shift_type: params.shiftType,
      adult_only: params.adultOnly,
      number_of_slots: params.numberOfSlots,
      status: params.status,
      created_by: params.createdBy,
    },
  });
}