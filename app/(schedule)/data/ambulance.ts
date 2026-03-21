import { prisma } from "../../lib/data";
import type { Prisma } from "@prisma/client";

export type Ambulance = Prisma.ambulanceGetPayload<{
  select: {
    id: true;
    number: true;
    type: true;
  };
}> & { atan: boolean };

export async function getAllAmbulances(): Promise<Ambulance[]> {
  try {
    const ambulances = await prisma.ambulance.findMany({
      orderBy: { number: "asc" },
      select: {
        id: true,
        number: true,
        type: true,
      },
    });
    return ambulances.map((ambulance) => ({
      id: ambulance.id,
      number: ambulance.number,
      type: ambulance.type,
      atan: ambulance.type === "atan",
    }));
  } catch (error) {
    console.error("Failed to get all ambulances:", error);
    throw new Error("Failed to get all ambulances.");
  }
}

export async function getAmbulanceById(id: string): Promise<Ambulance | null> {
  try {
    const ambulance = await prisma.ambulance.findUnique({ where: { id } });
    if (!ambulance) {
      return null;
    }
    return {
      id: ambulance.id,
      number: ambulance.number,
      type: ambulance.type,
      atan: ambulance.type === "atan",
    };
  } catch (error) {
    console.error("Failed to get ambulance by id:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to get ambulance by id"
    );
  }
}

export async function getAmbulanceByNumber(
  ambulanceNumber: string
): Promise<Ambulance | null> {
  try {
    const ambulance = await prisma.ambulance.findFirst({
      where: { number: ambulanceNumber },
    });
    if (!ambulance) {
      return null;
    }
    return {
      id: ambulance.id,
      number: ambulance.number,
      type: ambulance.type,
      atan: ambulance.type === "atan",
    };
  } catch (error) {
    console.error("Failed to get ambulance by number:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to get ambulance by number"
    );
  }
}
