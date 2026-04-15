"use server";

import { User, Tag, userInfoPublicSelect } from "@/app/(user)/data/definitions";
import {
  prismaDateToUtcDateString,
  prismaTimeToTimeString,
  toPostgresCalendarDate,
} from "@/app/lib/date-utils";
import { prisma } from "../../lib/data";
import type {
  ambulance_type,
  permanent_shift,
  Prisma,
  shift,
  shift_status,
  shift_type,
  launch_point,
  ambulance,
} from "@prisma/client";

export type PermanentShiftRecord = Omit<
  Prisma.permanent_shiftUncheckedCreateInput,
  "id" | "created_at" | "updated_at" | "created_by_id" | "updated_by_id"
>;

export type ShiftRecord = Omit<
  Prisma.shiftUncheckedCreateInput,
  "id" | "created_at" | "updated_at" | "created_by_id" | "updated_by_id"
>;

/** Updatable one-time shift metadata (does not touch driver, ambulance, or slots). */
export type ShiftRecordUpdateFields = {
  launch_point_id: string;
  start_date: Date;
  end_date: Date;
  start_time: Date;
  end_time: Date;
  shift_type: shift_type;
  adult_only: boolean;
  number_of_slots: number;
  ambulance_type: ambulance_type;
};

export type ShiftSlot = Prisma.shift_slotGetPayload<{
  select: {
    id: true;
    shift_id: true;
    user_id: true;
    status: true;
  };
}>;

export type DisplayShift = {
  id: string;
  launch_point: launch_point;
  ambulance_type: ambulance_type;
  ambulance: ambulance | null;
  driver: User | null;
  start_date: Date;
  end_date: Date;
  start_time: string;
  end_time: string;
  shift_type: shift_type | null;
  adult_only: boolean;
  number_of_slots: number | null;
  confirmed_slots: (DisplayShiftSlot | null)[];
  pending_slots: (DisplayShiftSlot | null)[];
};

export type DisplayShiftSlot = {
  id: string;
  shift_id: string;
  user: User;
  status: "pending" | "confirmed" | "cancelled";
};

function toShiftSlotStatus(value: shift_status): shift_status {
  return value;
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

// Permanent Shift functions
export async function getAllPermanentShifts(): Promise<permanent_shift[]> {
  try {
    return await prisma.permanent_shift.findMany();
  } catch (error) {
    console.error("Failed to fetch permanent shifts:", error);
    throw new Error("Failed to fetch permanent shifts.");
  }
}

export async function getPermanentShiftByDate(
  date: Date,
): Promise<permanent_shift[]> {
  try {
    return await prisma.permanent_shift.findMany({
      where: { week_day: date.getDay() },
    });
  } catch (error) {
    console.error("Failed to fetch permanent shifts by date:", error);
    throw new Error("Failed to fetch permanent shifts by date.");
  }
}

export async function getPermanentShiftById(
  id: string,
): Promise<permanent_shift | null> {
  try {
    return await prisma.permanent_shift.findUnique({
      where: { id },
    });
  } catch (error) {
    console.error("Failed to fetch permanent shift:", error);
    throw new Error("Failed to fetch permanent shift.");
  }
}

export async function getPermanentShiftsByLaunchPoint(
  launchPointId: string,
): Promise<permanent_shift[]> {
  try {
    return await prisma.permanent_shift.findMany({
      where: { launch_point_id: launchPointId },
    });
  } catch (error) {
    console.error("Failed to fetch permanent shifts by launch point:", error);
    throw new Error("Failed to fetch permanent shifts by launch point.");
  }
}

// Shift functions
export async function getAllShifts(): Promise<shift[]> {
  try {
    return await prisma.shift.findMany();
  } catch (error) {
    console.error("Failed to fetch shifts:", error);
    throw new Error("Failed to fetch shifts.");
  }
}

export async function getShiftById(id: string): Promise<shift | null> {
  try {
    return await prisma.shift.findUnique({ where: { id } });
  } catch (error) {
    console.error("Failed to fetch shift:", error);
    throw new Error("Failed to fetch shift.");
  }
}

export async function getShiftsByDate(date: Date): Promise<shift[]> {
  try {
    return await prisma.shift.findMany({
      where: { start_date: toPostgresCalendarDate(date) },
    });
  } catch (error) {
    console.error("Failed to fetch shifts by date:", error);
    throw new Error("Failed to fetch shifts by date.");
  }
}

/** Returns shifts for a date enriched as DisplayShift (launch_point, ambulance, driver, slots). */
export async function getDisplayShiftsByDate(
  date: Date,
): Promise<DisplayShift[]> {
  const shifts = await prisma.shift.findMany({
    where: { start_date: toPostgresCalendarDate(date) },
    include: {
      launch_point: true,
      ambulance: true,
      driver: { select: userInfoPublicSelect },
      shiftSlots: {
        include: {
          user: { select: userInfoPublicSelect },
        },
      },
    },
  });

  const displayShifts: DisplayShift[] = shifts.map((s) => {
    return {
      id: s.id,
      launch_point: s.launch_point,
      ambulance_type: s.ambulance_type,
      ambulance: s.ambulance,
      driver: s.driver,
      start_date: s.start_date ?? new Date(),
      end_date: s.end_date ?? new Date(),
      start_time: s.start_time ? s.start_time.toISOString() : "",
      end_time: s.end_time ? s.end_time.toISOString() : "",
      shift_type: s.shift_type as shift_type,
      adult_only: s.adult_only ?? false,
      number_of_slots: s.number_of_slots,
      confirmed_slots: s.shiftSlots.filter(
        (slot) => slot.status === "confirmed",
      ),
      pending_slots: s.shiftSlots.filter((slot) => slot.status === "pending"),
    };
  });
  return displayShifts;
}

export async function getShiftsByDateRange(
  startDate: Date,
  endDate: Date,
): Promise<shift[]> {
  try {
    return await prisma.shift.findMany({
      where: {
        start_date: {
          gte: toPostgresCalendarDate(startDate),
          lte: toPostgresCalendarDate(endDate),
        },
      },
    });
  } catch (error) {
    console.error("Failed to fetch shifts by date range:", error);
    throw new Error("Failed to fetch shifts by date range.");
  }
}

/** `driverId` is a `user_info.id` (profile row), not an `account.id`. */
export async function getShiftsByDriver(driverId: string): Promise<shift[]> {
  try {
    return await prisma.shift.findMany({
      where: { driver_id: driverId },
    });
  } catch (error) {
    console.error("Failed to fetch shifts by driver:", error);
    throw new Error("Failed to fetch shifts by driver.");
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
  id: shift_type;
  label: string;
  count: number;
  ambulanceTypes: PickerAmbulanceType[];
};

export async function getShiftsForPickerDay(
  date: Date,
  tags: Tag[],
): Promise<Map<shift_type, Map<ambulance_type, DisplayShift[]>>> {
  const displayShifts = await getDisplayShiftsByDate(date);

  const NOAR_TAG_NAME = "נוער";
  function isNoar(tags: Tag[]): boolean {
    return tags.some((t) => t.name === NOAR_TAG_NAME);
  }

  const filterShiftsForTag = (shifts: DisplayShift[]) =>
    isNoar(tags) ? shifts.filter((s) => !s.adult_only) : shifts;

  const filteredDisplayShifts = filterShiftsForTag(displayShifts);
  // Group by shift_type -> ambulance_type -> list of DisplayShift (for location rows)
  const byShiftType = new Map<
    shift_type,
    Map<ambulance_type, DisplayShift[]>
  >();

  for (const shift of filteredDisplayShifts) {
    const st = shift.shift_type;
    if (st == null) continue;
    if (!byShiftType.has(st)) byShiftType.set(st, new Map());
    const byAmb = byShiftType.get(st)!;
    const ambType = shift.ambulance_type;
    if (!byAmb.has(ambType)) byAmb.set(ambType, []);
    byAmb.get(ambType)!.push(shift);
  }

  return byShiftType;
}

// Shift Slot functions
export async function getShiftSlotsByShift(
  shiftId: string,
): Promise<ShiftSlot[]> {
  try {
    const shiftSlots = await prisma.shift_slot.findMany({
      where: { shift_id: shiftId },
      select: {
        id: true,
        shift_id: true,
        user_id: true,
        status: true,
      },
    });
    return shiftSlots.map(toShiftSlot);
  } catch (error) {
    console.error("Failed to fetch shift slots:", error);
    throw new Error("Failed to fetch shift slots.");
  }
}

/** `userId` is `user_info.id` (profile row), not `account.id`. */
export async function getShiftSlotsByUser(
  userId: string,
): Promise<ShiftSlot[]> {
  try {
    const shiftSlots = await prisma.shift_slot.findMany({
      where: { user_id: userId },
      select: {
        id: true,
        shift_id: true,
        user_id: true,
        status: true,
      },
    });
    return shiftSlots.map(toShiftSlot);
  } catch (error) {
    console.error("Failed to fetch shift slots by user:", error);
    throw new Error("Failed to fetch shift slots by user.");
  }
}

export async function getShiftSlotById(id: string): Promise<ShiftSlot | null> {
  try {
    const shiftSlot = await prisma.shift_slot.findUnique({ where: { id } });
    return shiftSlot ? toShiftSlot(shiftSlot) : null;
  } catch (error) {
    console.error("Failed to fetch shift slot:", error);
    return null;
  }
}

export async function updateShiftDriverRecord(params: {
  shiftId: string;
  driverUserInfoId: string | null;
  updatedBy: string;
}) {
  return prisma.shift.update({
    where: { id: params.shiftId },
    data: {
      driver: params.driverUserInfoId
        ? { connect: { id: params.driverUserInfoId } }
        : { disconnect: true },
      updated_by: { connect: { id: params.updatedBy } },
    },
  });
}

export async function updateShiftAmbulanceRecord(params: {
  shiftId: string;
  ambulanceId: string | null;
  updatedBy: string;
}) {
  return prisma.shift.update({
    where: { id: params.shiftId },
    data: {
      ambulance: params.ambulanceId
        ? { connect: { id: params.ambulanceId } }
        : { disconnect: true },
      updated_by: { connect: { id: params.updatedBy } },
    },
  });
}

export async function createShiftSlotRecord(params: {
  shiftId: string;
  /** `user_info.id` of the volunteer. */
  userInfoId: string;
  status: "pending" | "confirmed";
  createdBy: string;
}) {
  return prisma.shift_slot.create({
    data: {
      shift: { connect: { id: params.shiftId } },
      user: { connect: { id: params.userInfoId } },
      status: params.status,
      created_by: { connect: { id: params.createdBy } },
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
    data: {
      status: params.status,
      updated_by: { connect: { id: params.updatedBy } },
    },
  });
}

export async function createPermanentShiftRecord(
  params: PermanentShiftRecord,
  created_by_id: string,
) {
  return prisma.permanent_shift.create({
    data: {
      created_by: { connect: { id: created_by_id } },
      launch_point: { connect: { id: params.launch_point_id } },
      shift_type: params.shift_type,
      week_day: params.week_day,
      start_time: params.start_time,
      end_time: params.end_time,
      adult_only: params.adult_only,
      number_of_slots: params.number_of_slots,
      ambulance_type: params.ambulance_type,
      start_date: params.start_date,
      end_date: params.end_date,
      overnight: params.overnight,
    },
  });
}

export async function createShiftRecord(
  params: ShiftRecord,
  created_by_id: string,
) {
  return prisma.shift.create({
    data: {
      created_by: { connect: { id: created_by_id } },
      launch_point: { connect: { id: params.launch_point_id } },
      shift_type: params.shift_type,
      start_time: params.start_time,
      end_time: params.end_time,
      adult_only: params.adult_only,
      number_of_slots: params.number_of_slots,
      ambulance: params.ambulance_id
        ? { connect: { id: params.ambulance_id } }
        : undefined,
      driver: params.driver_id
        ? { connect: { id: params.driver_id } }
        : undefined,
      start_date: params.start_date,
      end_date: params.end_date,
      ambulance_type: params.ambulance_type,
      status: params.status,
    },
  });
}

export async function updateShiftRecord(params: {
  shiftId: string;
  data: ShiftRecordUpdateFields;
  updatedById: string;
}) {
  return prisma.shift.update({
    where: { id: params.shiftId },
    data: {
      launch_point: { connect: { id: params.data.launch_point_id } },
      start_date: params.data.start_date,
      end_date: params.data.end_date,
      start_time: params.data.start_time,
      end_time: params.data.end_time,
      shift_type: params.data.shift_type,
      adult_only: params.data.adult_only,
      number_of_slots: params.data.number_of_slots,
      ambulance_type: params.data.ambulance_type,
      generated: false,
      updated_by: { connect: { id: params.updatedById } },
    },
  });
}

export async function cancelShiftRecord(params: {
  shiftId: string;
  updatedBy: string;
}) {
  return prisma.shift.update({
    where: { id: params.shiftId },
    data: {
      status: "canceled",
      updated_by: { connect: { id: params.updatedBy } },
    },
  });
}

export async function cancelPermanentShiftById(permanentShiftId: string) {
  return prisma.$executeRaw`
    SELECT cancel_permanent_shift(CAST(${permanentShiftId} AS uuid))
  `;
}
