import Image from "next/image";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

import NotificationPanel from "./components/home/notificationPanel";
import ShiftPanel from "./components/home/shiftPanel";
import Greeting from "./components/home/greetings";

export default async function Home() {
  const session = await auth();
  const userName = session?.user?.name;
  if (!userName) {
    redirect("./login");
  }

  return (
    <main
      className="flex flex-col justify-center mx-auto
    w-full max-w-[430px] border border-[#d2d2d2] bg-white px-4 py-6 shadow-md"
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

      <Greeting userName={userName} />

      <NotificationPanel />
      {/* <ShiftPanel /> */}
    </main>
  );
}
