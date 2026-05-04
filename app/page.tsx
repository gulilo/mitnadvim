import Image from "next/image";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import NotificationPanel from "./(home)/components/notificationPanel";
import ShiftPanel from "./(home)/components/shiftPanel";
import Greeting from "./(home)/components/greetings";
import Link from "next/link";
import { getShiftPanelShifts } from "./(schedule)/data/shift";
import { getUserByAccountId } from "./(user)/data/user";

export default async function Home() {
  const session = await auth();
  const userName = session?.user?.name;
  if (!userName) {
    redirect("./login");
  }

  const user = await getUserByAccountId(session?.user?.id);
  if (!user) {
    redirect("./login");
  }
  const shifts = await getShiftPanelShifts(user.id);
  return (
    <main
      className="flex flex-col justify-center mx-auto
    w-full max-w-[430px] border border-[#d2d2d2] bg-white px-4 py-6 shadow-md"
    >
      <div className="mx-auto relative h-[120px] w-[200px]">
        <Image
          src="/MDA_Dan_logo.png"
          alt="מגן דוד אדום - מרחב דן"
          fill
          className="object-contain"
          priority
        />
      </div>

      <Greeting userName={userName} />
      <Link  href="/profile">Profile</Link>
      <NotificationPanel />
      <ShiftPanel shifts={shifts} />
    </main>
  );
}
