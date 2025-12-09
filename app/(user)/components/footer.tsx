import Image from "next/image";

export default function Footer() {
  return (
    <div
      dir="ltr"
      className="mt-auto pt-8 pb-6 flex items-center justify-center gap-2 text-gray-900 text-xs"
    >
      <Image
        src={"/Milkboss_Logo.svg"}
        alt="Milkboss_Logo"
        width={20}
        height={20}
      />
      <div className="flex flex-col">
        <span>
          Design & UX by <strong>milkboss</strong>
        </span>
        <span>
          Code by <strong>GG (Git)</strong>
        </span>
      </div>
    </div>
  );
}
