import NotificationCard from "./NotificationCard";
import { Separator } from "@/app/components/ui/separator";
import { ScrollArea } from "@/app/components/ui/scroll-area";
import {
  getNotification,
  DBNotifiction,
  formatTimestamp,
} from "@/app/(home)/data/notification";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function NotificationPanel() {
  const session = await auth();
  if (!session?.user) {
    redirect("./login");
  }
  const notifications = (await getNotification(
    session.user.id
  )) as DBNotifiction[];

  return (
    <section className="relative mt-8">
      <div className="absolute -top-4 right-8 rounded-full bg-white px-3 py-1 text-sm font-semibold text-[#111]">
        הודעות
      </div>
      <div className="rounded-3xl border-2 border-[#fc5c5c] bg-white px-4 pb-6 shadow-sm">
        <div className="flex items-center justify-between"></div>

        <ScrollArea className="h-[355px] space-y-3">
          {notifications.map((notification) => {
            const formattedDate = formatTimestamp(notification.timestamp);
            return (
              <div key={notification.id}>
                <NotificationCard
                  header={notification.title}
                  date={formattedDate}
                  text={notification.message}
                >
                  <p className="text-sm font-bold">{notification.title}</p>
                  <p className="mt-1 text-[10px] text-[#666]">
                    {formattedDate}
                  </p>
                  <p className="mt-2 text-xs leading-relaxed">
                    {notification.message}
                  </p>
                </NotificationCard>
                <Separator className="bg-red-inActive" />
              </div>
            );
          })}
        </ScrollArea>
      </div>
    </section>
  );
}
