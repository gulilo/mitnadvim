import { CalendarPlus, ChevronDown, Trash2 } from "lucide-react";
import NotificationCard from "./NotificationCard";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

const notifications = [
  {
    id: "volunteers",
    title: "הודעה למתנדבים",
    timestamp: "11/7/2025 (14:45)",
    message:
      "לורם איפסום דולור סיט אמט, קונסקטורר אדיפיסינג אלית לפרומי בלוף קינץ תתיח לרעח. לת צשחמי צש בליא, מנסוטו צמלח לביקו ננבי, צמוקו בלוקריה שיצמה ברורק.",
    icon: <ChevronDown className="size-5 text-[#222]" strokeWidth={2.5} />,
  },
  {
    id: "approved",
    title: "בקשת השיבוץ שלך אושרה 😃",
    timestamp: "8/7/2025 (11:17)",
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
    timestamp: "6/7/2025 (8:32)",
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

export default function NotificationPanel() {
  return (
    <section className="relative mt-8">
      <div className="absolute -top-4 right-8 rounded-full bg-white px-3 py-1 text-sm font-semibold text-[#111]">
        הודעות
      </div>
      <div className="rounded-3xl border-2 border-[#fc5c5c] bg-white px-4 pb-6 pt-8 shadow-sm">
        <div className="flex items-center justify-between"></div>

        <ScrollArea className="h-[355px] space-y-3">
          {notifications.map((notification, index) => (
            <div>
              <NotificationCard
                header={notification.title}
                date={notification.timestamp}
                text={notification.message}
                key={notification.id}
              >
                <p className="text-sm font-bold">{notification.title}</p>
                <p className="mt-1 text-[10px] text-[#666]">
                  {notification.timestamp}
                </p>
                <p className="mt-2 text-xs leading-relaxed">
                  {notification.message}
                </p>
              </NotificationCard>
              <Separator className="bg-red-inActive" />
            </div>
          ))}
        </ScrollArea>
      </div>
    </section>
  );
}
