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
      SELECT t.id 
      FROM tag t
      INNER JOIN account_tag at ON t.id = at.tag_id
      WHERE at.account_id = ${accountId}
    `;
    return tags.map((tag) => tag.id);
  } catch (error) {
    console.error('Failed to fetch user tags:', error);
    return [];
  }
}

export async function getTagName(tagId: string): Promise<string | null> {
  try {
    const tag = await sql`SELECT name FROM tag WHERE id = ${tagId}`;
    return tag[0]?.name || null;
  } catch (error) {
    console.error('Failed to fetch tag name:', error);
    return null;
  }
}

export async function getTagCategory(tagId: string): Promise<string | null> {
  try {
    const tag = await sql`SELECT category FROM tag WHERE id = ${tagId}`;
    return tag[0]?.category || null;
  } catch (error) {
    console.error('Failed to fetch tag category:', error);
    return null;
  }
}

export async function getUserPermissions(tags_id: string[]): Promise<string[]> {
  try {
    // Return empty array if no tags provided
    if (!tags_id || tags_id.length === 0) {
      return [];
    }

    // Join tag_permission with permissions table to get permission names
    // Use DISTINCT to avoid duplicate permissions if multiple tags have the same permission
    const permissions = await sql`
      SELECT DISTINCT p.name
      FROM tag_permission tp
      INNER JOIN permissions p ON tp.permission_id = p.id
      WHERE tp.tag_id = ANY(${tags_id}::uuid[])
    `;
    
    return permissions.map((permission) => permission.name);
  } catch (error) {
    console.error('Failed to fetch user permissions:', error);
    return [];
  }
}

export async function getUsersByPartialName(name: string): Promise<DbUser[]> {
  try {
    const users = await sql`SELECT * FROM user_info WHERE first_name ILIKE ${`%${name}%`} OR last_name ILIKE ${`%${name}%`} LIMIT 10`;
    return users as DbUser[];
  } catch (error) {
    console.error('Failed to fetch users by partial name:', error);
    return [];
  }
}