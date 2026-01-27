import { sql } from "@/app/lib/data";

export type DbEmergencyContact = {
  id: string;
  user_id: string;
  name: string;
  relationship: string;
  phone: string;
  email: string;
  address: string;
};

export async function getEmergencyContactByUserId(userId: string): Promise<DbEmergencyContact[] | undefined> {
  try {
    const contact = await sql`SELECT * FROM emergency_contacts WHERE user_id = ${userId}`;
    return contact as DbEmergencyContact[];
  } catch (error) {
    console.error('Failed to fetch emergency contact:', error);
    throw new Error('Failed to fetch emergency contact.');
  }
}