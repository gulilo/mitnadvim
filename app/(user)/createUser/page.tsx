import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Image from "next/image";
import MainMenu from "@/app/components/layout/mainMenu";
import { getAllAreas } from "@/app/(schedule)/data/launchPoint";
import CreateUserForm from "./CreateUserForm";

export default async function CreateUserPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const areas = await getAllAreas();

  return (
    <div
      dir="rtl"
      className="relative bg-[#f5f5f5] min-h-screen w-full max-w-[430px] mx-auto"
    >

      {/* Title */}
      <h1 className="text-center text-[28px] font-bold leading-[34px] text-black px-4 pt-2 pb-4">
        יצירת משתמש חדש
      </h1>

      <CreateUserForm areas={areas} />
    </div>
  );
}
