import { sql } from "../../lib/data";

export type DbLaunchPoint = {
  id: string;
  area_id: string;
  name: string;
};

export type DbArea = {
  id: string;
  name: string;
};

export async function getAllLaunchPoints(): Promise<DbLaunchPoint[]> {
  try {
    const launchPoints = await sql`
      SELECT * FROM launch_point 
      ORDER BY name ASC
    `;
    return launchPoints as DbLaunchPoint[];
  } catch (error) {
    console.error('Failed to fetch launch points:', error);
    throw new Error('Failed to fetch launch points.');
  }
}

export async function getAllAreas(): Promise<DbArea[]> {
  try {
    const areas = await sql`
      SELECT * FROM area 
      ORDER BY name ASC
    `;
    return areas as DbArea[];
  } catch (error) {
    console.error('Failed to fetch areas:', error);
    throw new Error('Failed to fetch areas.');
  }
}

export async function getAreaName(areaId: string): Promise<string | null> {
  try {
    const area = await sql`SELECT name FROM area WHERE id = ${areaId}`;
    return area[0]?.name || null;
  } catch (error) {
    console.error('Failed to fetch area name:', error);
    return null;
  }
}

export async function getLaunchPointById(id: string): Promise<DbLaunchPoint | null> {
  try {
    const launchPoint = await sql`SELECT * FROM launch_point WHERE id = ${id}`;
    return launchPoint[0] as DbLaunchPoint | null;
  } catch (error) {
    console.error('Failed to fetch launch point:', error);
    return null;
  }
}
