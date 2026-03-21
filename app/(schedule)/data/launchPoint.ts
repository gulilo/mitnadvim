import { prisma } from "../../lib/data";
import type { Prisma } from "@prisma/client";

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

export async function getAllLaunchPoints(): Promise<LaunchPoint[]> {
  try {
    const launchPoints = await prisma.launch_point.findMany({
      orderBy: { name: "asc" },
      select: {
        id: true,
        area_id: true,
        name: true,
      },
    });
    return launchPoints.map((launchPoint) => ({
      id: launchPoint.id,
      area_id: launchPoint.area_id,
      name: launchPoint.name,
    }));
  } catch (error) {
    console.error('Failed to fetch launch points:', error);
    throw new Error('Failed to fetch launch points.');
  }
}

export async function getAllAreas(): Promise<Area[]> {
  try {
    const areas = await prisma.area.findMany({
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
      },
    });
    return areas.map((area) => ({
      id: area.id,
      name: area.name,
    }));
  } catch (error) {
    console.error('Failed to fetch areas:', error);
    throw new Error('Failed to fetch areas.');
  }
}

export async function getAreaName(areaId: string): Promise<string | null> {
  try {
    const area = await prisma.area.findUnique({
      where: { id: areaId },
      select: { name: true },
    });
    return area?.name ?? null;
  } catch (error) {
    console.error('Failed to fetch area name:', error);
    return null;
  }
}

export async function getLaunchPointById(id: string): Promise<LaunchPoint | null> {
  try {
    const launchPoint = await prisma.launch_point.findUnique({ where: { id } });
    if (!launchPoint) {
      return null;
    }
    return {
      id: launchPoint.id,
      area_id: launchPoint.area_id,
      name: launchPoint.name,
    };
  } catch (error) {
    console.error('Failed to fetch launch point:', error);
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
      area_id: params.areaId,
      created_by: params.createdBy,
    },
  });
}

export async function deleteLaunchPointRecord(launchPointId: string) {
  return prisma.launch_point.delete({
    where: { id: launchPointId },
  });
}
