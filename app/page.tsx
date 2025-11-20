import Image from "next/image";
import { auth } from "@/auth";
import { Menu } from "lucide-react";
import NotificationPanel from "./(home)/components/notificationPanel";
import ShiftPanel from "./(home)/components/shiftPanel";

export default async function Home() {
  const session = await auth();
  const userName = session?.user?.name ?? "אבישג";

  return (
    <main
      className="flex flex-col min-h-screen justify-center
    w-full max-w-[430px] rounded-2xl border border-[#d2d2d2] bg-white px-4 py-6 shadow-md"
    >
      <div className="mx-auto relative h-[120px] w-[200px]">
        <Image
          src="/MDA-Dan-Logo.png"
          alt="מגן דוד אדום - מרחב דן"
          fill
          className="object-contain"
          priority
        />
      </div>

      <div className="mt-2 text-center">
        <p className="text-xl font-bold text-[#111]">{`בוקר טוב, ${userName}`}</p>
      </div>

      <NotificationPanel />
      {/* <ShiftPanel /> */}
    </main>
  );
}
