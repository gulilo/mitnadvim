import { sql } from "../../lib/data";
import { ReactNode } from "react";

export type DBNotifiction = {
  id: string;
  user_id: string;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
};

export async function getNotification(userid: string) {
  console.log(userid);
  try {
    const DbNotifications =
      await sql`SELECT * FROM notification WHERE user_id = ${userid}`;
    return DbNotifications as DBNotifiction[];
  } catch (error) {
    console.error("Failed to fetch notifications:", error);
    throw new Error("Failed to fetch notifications.");
  }
}

export function formatTimestamp(date: Date): ReactNode {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");

  return (
    <div className="flex flex-row justify-center items-center">
      {day}/{month}/{year}
      <br />
      {hours}:{minutes}
    </div>
  );
}
