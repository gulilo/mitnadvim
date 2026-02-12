import { sql } from "../../lib/data";

export type DbAmbulance = {
  id: string;
  number: string;
  atan: boolean;
};

export async function getAmbulanceById(id: string): Promise<DbAmbulance | null> {
  try {
    const ambulance = await sql`
      SELECT * FROM ambulance WHERE id = ${id}
    `;
    return ambulance[0] as DbAmbulance | null;
  } catch (error) {
    console.error("Failed to get ambulance by id:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to get ambulance by id"
    );
  }
}

export async function getAmbulanceByNumber(
  ambulanceNumber: string
): Promise<DbAmbulance | null> {
  try {
    const ambulance = await sql`
      SELECT * FROM ambulance WHERE number = ${ambulanceNumber}
    `;
    return ambulance[0] as DbAmbulance | null;
  } catch (error) {
    console.error("Failed to get ambulance by number:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to get ambulance by number"
    );
  }
}
