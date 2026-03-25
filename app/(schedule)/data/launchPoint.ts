import { prisma } from "../../lib/data";
import type { area, launch_point, Prisma } from "@prisma/client";

export type LaunchPoint = Prisma.launch_pointGetPayload<{
  select: {
    id: true;
    area_id: true;
    name: true;
  };
}>;

export type Area = Prisma.areaGetPayload<{
  select: {
    id: true;
    name: true;
  };
}>;

export async function getAllLaunchPoints(): Promise<launch_point[]> {
  try {
    return await prisma.launch_point.findMany();
  } catch (error) {
    console.error("Failed to fetch launch points:", error);
    throw new Error("Failed to fetch launch points.");
  }
}

export async function getAllAreas(): Promise<area[]> {
  try {
    return await prisma.area.findMany();
  } catch (error) {
    console.error("Failed to fetch areas:", error);
    throw new Error("Failed to fetch areas.");
  }
}

export async function getAreaName(areaId: string): Promise<string | null> {
  try {
    return (
      (
        await prisma.area.findUnique({
          where: { id: areaId },
          select: { name: true },
        })
      )?.name ?? null
    );
  } catch (error) {
    console.error("Failed to fetch area name:", error);
    return null;
  }
}

export async function getLaunchPointById(
  id: string,
): Promise<launch_point | null> {
  try {
    return await prisma.launch_point.findUnique({ where: { id } });
  } catch (error) {
    console.error("Failed to fetch launch point:", error);
    return null;
  }
}

export async function createLaunchPointRecord(params: {
  name: string;
  areaId: string;
  createdBy: string;
}) {
  return prisma.launch_point.create({
    data: {
      name: params.name,
      area: { connect: { id: params.areaId } },
      created_by: { connect: { id: params.createdBy } },
    },
  });
}

export async function deleteLaunchPointRecord(launchPointId: string) {
  return prisma.launch_point.delete({
    where: { id: launchPointId },
  });
}
