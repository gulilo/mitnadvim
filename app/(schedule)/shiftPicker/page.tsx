import Image from "next/image";
import ShiftPickerContent from "./ShiftPickerContent";

export default function ShiftPickerPage() {
  return (
    <div className="relative min-h-screen w-full bg-[#f5f5f5]" dir="rtl">
      {/* Header: logo (right), title center, menu is absolute left from MainMenu */}
      <header className="relative flex h-16 w-full items-center px-4 pt-2">
        <div className="h-10 w-[60px] shrink-0">
          <Image
            src="/Milkboss_Logo.svg"
            alt="לוגו"
            width={60}
            height={40}
            className="h-full w-full object-contain object-right"
          />
        </div>
        <div className="flex flex-1 justify-center">
          <h1 className="text-lg font-bold leading-none text-black">
            לוח משמרות
          </h1>
        </div>
        <div className="w-10 shrink-0" aria-hidden />
      </header>

      <ShiftPickerContent />
    </div>
  );
}
