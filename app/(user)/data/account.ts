import { sql } from "@/app/lib/data";

export type DbAccount = {
  id: string;
  display_name: string;
  email: string;
  phone: string | null;
  password_hash: string | null;
};

export async function getAccountByAccountId(accountId: string): Promise<DbAccount | undefined> {
  try {
    const account = await sql`SELECT * FROM account WHERE id = ${accountId}`;
    return account[0] as DbAccount;
  } catch (error) {
    console.error('Failed to fetch account:', error);
    throw new Error('Failed to fetch account.');
  }
}

export async function getUserByEmail(email: string): Promise<DbAccount | undefined> {
  try {
    const user = await sql`SELECT * FROM account WHERE email = ${email}`;
    return user[0] as DbAccount;
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw new Error('Failed to fetch user.');
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