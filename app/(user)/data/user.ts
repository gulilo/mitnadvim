import { sql } from "../../lib/data";
import { DbAccount, DbUser } from "./definitions";

export async function getUserByEmail(email: string): Promise<DbAccount | undefined> {
    try {
      const user = await sql`SELECT * FROM account WHERE email = ${email}`;
      return user[0] as DbAccount;
    } catch (error) {
      console.error('Failed to fetch user:', error);
      throw new Error('Failed to fetch user.');
    }
}

export async function getUserByAccountId(accountId: string): Promise<DbUser | undefined> {
  try {
    const user = await sql`SELECT * FROM user_info WHERE account_id = ${accountId}`;
    return user[0] as DbUser;
  } catch (error) {
    console.error('Failed to fetch user by account id:', error);
    throw new Error('Failed to fetch user by account id.');
  }
}

export async function getAccountByAccountId(accountId: string): Promise<DbAccount | undefined> {
  try {
    const account = await sql`SELECT * FROM account WHERE id = ${accountId}`;
    return account[0] as DbAccount;
  } catch (error) {
    console.error('Failed to fetch account:', error);
    throw new Error('Failed to fetch account.');
  }
}

export async function getEmergencyContactByUserId(userId: string) {
  try {
    const contact = await sql`
      SELECT * FROM emergency_contacts 
      WHERE user_id = ${userId} 
      LIMIT 1
    `;
    return contact[0] || null;
  } catch (error) {
    console.error('Failed to fetch emergency contact:', error);
    return null;
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

export async function getUserTags(accountId: string) {
  try {
    const tags = await sql`
      SELECT t.name 
      FROM tag t
      INNER JOIN account_tag at ON t.id = at.tag_id
      WHERE at.account_id = ${accountId}
    `;
    return tags.map((tag: any) => tag.name);
  } catch (error) {
    console.error('Failed to fetch user tags:', error);
    return [];
  }
}