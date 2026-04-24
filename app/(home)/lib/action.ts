"use server";
import {updateNotificationRead} from "../data/notification";

export async function readNotification(notificationId: string) {
    await updateNotificationRead(notificationId);
}