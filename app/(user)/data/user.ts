import { sql } from "../../lib/data";

export type DbUser = {
  id: string;
  account_id: string;
  first_name: string;
  last_name: string;
  image_url: string | null;
  address: string;
  area_id: string;
  role: string;
};

export async function getUserByAccountId(accountId: string): Promise<DbUser | undefined> {
  try {
    const user = await sql`SELECT * FROM user_info WHERE account_id = ${accountId}`;
    return user[0] as DbUser;
  } catch (error) {
    console.error('Failed to fetch user by account id:', error);
    throw new Error('Failed to fetch user by account id.');
  }
}

export async function getAreaName(areaId: string): Promise<string | null> {
  try {
    const area = await sql`SELECT name FROM area WHERE id = ${areaId}`;
    return area[0]?.name || null;
  } catch (error) {
    console.error('Failed to fetch area:', error);
    return null;
  }
}