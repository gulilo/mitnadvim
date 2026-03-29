import { prisma } from "../../lib/data";
import type { Prisma } from "@prisma/client";
import { ambulance } from "@prisma/client";

export type Ambulance = Prisma.ambulanceGetPayload<{
  select: {
    id: true;
    number: true;
    type: true;
  };
}> & { atan: boolean };

export async function getAllAmbulances(): Promise<ambulance[]> {
  try {
    return await prisma.ambulance.findMany();
  } catch (error) {
    console.error("Failed to get all ambulances:", error);
    throw new Error("Failed to get all ambulances.");
  }
}

export async function getAmbulanceById(id: string): Promise<ambulance | null> {
  try {
    return await prisma.ambulance.findUnique({ where: { id } });
  } catch (error) {
    console.error("Failed to get ambulance by id:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to get ambulance by id",
    );
  }
}

export async function getAmbulanceByNumber(
  ambulanceNumber: string,
): Promise<ambulance | null> {
  try {
    return await prisma.ambulance.findFirst({
      where: { number: ambulanceNumber },
    });
  } catch (error) {
    console.error("Failed to get ambulance by number:", error);
    throw new Error(
      error instanceof Error
        ? error.message
        : "Failed to get ambulance by number",
    );
  }
}
