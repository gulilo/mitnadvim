import { sql } from "../../lib/data";
import { DbUser, DbUserGroup } from "./definitions";

export async function getUserByEmail(email: string): Promise<DbUser | undefined> {
    try {
      const user = await sql`SELECT * FROM "user" WHERE email = ${email}`;
      return user[0] as DbUser;
    } catch (error) {
      console.error('Failed to fetch user:', error);
      throw new Error('Failed to fetch user.');
    }
}

export const getUserGroupById =async(gropuId:string): Promise<DbUserGroup | undefined> => {
    try {
        const group = await sql`SELECT * FROM user_group where id = ${gropuId}`;
        return group[0] as DbUserGroup
    } catch (error) {
        console.error('Failed to fetch user group:', error);
        throw new Error('Failed to fetch user group.');
    }
}

export async function getAllUserGroups(): Promise<DbUserGroup[]> {
    try {
        const groups = await sql`SELECT * FROM user_group`;
        return groups as DbUserGroup[];
    } catch (error) {
        console.error('Failed to fetch user groups:', error);
        throw new Error('Failed to fetch user groups.');
    }
}