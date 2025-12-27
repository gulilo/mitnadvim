"use client";

import { useMediaQuery } from "@/app/hooks/use-media-query";
import {
  Drawer,
  DrawerTrigger,
  DrawerClose,
  DrawerContent,
} from "../ui/MenuDrawer";
import Image from "next/image";
import MenuProfile from "./MenuProfile";
import Link from "next/link";
import { Separator } from "../ui/separator";
import { handleSignOut } from "@/app/lib/actions";

export default function MainMenu() {
  const isMobile = useMediaQuery("(max-width: 768px)");
  return isMobile ? (
    <Drawer direction="left">
      <DrawerTrigger>
        <Image
          src="/icon_menu.svg"
          alt="Menu"
          width={24}
          height={24}
          className="absolute z-50 top-8 left-5"
        />
      </DrawerTrigger>

      <DrawerContent className="flex flex-col items-center gap-4 pt-5 bg-red-inActive">
        <DrawerClose>
          <Image
            src="/icon_close.svg"
            alt="Close"
            width={24}
            height={24}
            className="absolute top-8 left-5"
          />
        </DrawerClose>
        {/* profile */}
        <MenuProfile />
        <div className="flex flex-col w-60 mx-auto items-start justify-center gap-2">
          <Separator className="bg-white mx-auto" />

          <DrawerClose asChild>
            <Link href="/">
              <h2 className="text-white">מסך הבית</h2>
            </Link>
          </DrawerClose>
          <Separator className="bg-white  mx-auto" />
          <DrawerClose asChild>
            <Link href="/">
              <h2 className="text-white">לוח שיבוצים</h2>
            </Link>
          </DrawerClose>
          <Separator className="bg-white  mx-auto" />
          <DrawerClose asChild>
            <Link href="/profile">
              <h2 className="text-white">פרופיל אישי</h2>
            </Link>
          </DrawerClose>
          <Separator className="bg-white  mx-auto" />
          <DrawerClose asChild>
            <form action={handleSignOut} className="w-full">
              <button
                type="submit"
                className="text-white bg-transparent border-0 p-0 cursor-pointer"
              >
                <h2 className="text-white">יציאה מהמערכת</h2>
              </button>
            </form>
          </DrawerClose>
          <Separator className="bg-white  mx-auto" />
        </div>
      </DrawerContent>
    </Drawer>
  ) : (
    <div>Main Menu</div>
  );
}
