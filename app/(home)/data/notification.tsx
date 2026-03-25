import { prisma } from "../../lib/data";
import { Notification } from "./definitions";
import { ReactNode } from "react";

export async function getNotification(userid: string) {
  console.log(userid);
  try {
    const notifications = await prisma.notification.findMany({
      where: { account_id: userid },
      select: {
        id: true,
        account_id: true,
        title: true,
        message: true,
        timestamp: true,
        read: true,
      },
    });
    return notifications.map((notification): Notification => ({
      id: notification.id,
      account_id: notification.account_id,
      title: notification.title,
      message: notification.message,
      timestamp: notification.timestamp,
      read: notification.read,
    }));
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
