import NotificationCard from "./NotificationCard";
import { Separator } from "@/app/components/ui/separator";
import { ScrollArea } from "@/app/components/ui/scroll-area";
import { Notification } from "@/app/(home)/data/definitions";
import {
  getNotification,
  formatTimestamp,
} from "@/app/(home)/data/notification";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { Trash2 } from "lucide-react";

const notifications = [
  {
    id: "volunteers",
    title: "הודעה למתנדבים",
    timestamp: new Date("2025-07-11T14:45:00"),
    message:
      "לורם איפסום דולור סיט אמט, קונסקטורר אדיפיסינג אלית לפרומי בלוף קינץ תתיח לרעח. לת צשחמי צש בליא, מנסוטו צמלח לביקו ננבי, צמוקו בלוקריה שיצמה ברורק.",
    icon: <ChevronDown className="size-5 text-[#222]" strokeWidth={2.5} />,
  },
  {
    id: "approved",
    title: "בקשת השיבוץ שלך אושרה 😃",
    timestamp: new Date("2025-07-08T11:17:00"),
    message: (
      <>
        <span>שובצת למשמרת </span>
        <strong>ערב</strong>
        <span> ביום </span>
        <strong>רביעי</strong>
        <span> (</span>
        <strong>16/7/2025</strong>
        <span>) בנה״ז </span>
        <strong>ת״א 2</strong>.
      </>
    ),
    icon: <Trash2 className="size-5 text-[#222]" />,
  },
  {
    id: "rejected",
    title: "בקשת השיבוץ שלך נדחתה ☹️",
    timestamp: new Date("2025-07-06T08:32:00"),
    message: (
      <>
        <span>לצערנו לא ניתן לשבץ אותך למשמרת </span>
        <strong>בוקר</strong>
        <span> ביום </span>
        <strong>שישי</strong>
        <span> (</span>
        <strong>18/7/2025</strong>
        <span>) בנה״ז </span>
        <strong>נט״ן ת״א 1</strong>.{" "}
        <span>
          בכל שאלה או הבהרה אנא{" "}
          <span className="underline decoration-black decoration-solid">
            פני לרכז שלך
          </span>
          .
        </span>
      </>
    ),
    icon: <Trash2 className="size-5 text-[#222]" />,
  },
];

export default async function NotificationPanel() {
  const session = await auth();
  if (!session?.user) {
    redirect("./login");
  }
  // const notifications = (await getNotification(
  //   session.user.id
  // )) as Notification[];

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
