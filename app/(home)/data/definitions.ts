import type { Prisma } from "@prisma/client";

export type Notification = Prisma.notificationGetPayload<{
  select: {
    id: true;
    account_id: true;
    title: true;
    message: true;
    timestamp: true;
    read: true;
  };
}>;