import { prisma } from "../../lib/data";
import { ReactNode } from "react";

export async function getNotification(userid: string) {
  try {
    const notifications = await prisma.notification.findMany({
      where: { account_id: userid, read: false },
      select: {
        id: true,
        account_id: true,
        title: true,
        message: true,
        timestamp: true,
      },
    });
    return notifications;
  } catch (error) {
    console.error("Failed to fetch notifications:", error);
    throw new Error("Failed to fetch notifications.");
  }
}

export async function updateNotificationRead(notificationId: string) {
  try {
    await prisma.notification.update({
      where: { id: notificationId },
      data: { read: true },
    });
  } catch (error) {
    console.error("Failed to read notification:", error);
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
