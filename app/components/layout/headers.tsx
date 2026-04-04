import Image from "next/image";
import MainMenu from "./mainMenu";

export default function Headers() {
  return (
    <div className="flex flex-row justify-between items-center mx-auto w-full px-10 max-w-3xl">
      <Image
        src="/MDA-Dan-Logo.png"
        alt="מגן דוד אדום - מרחב דן"
        width={100}
        height={100}
        className="object-contain"
        priority
      />
      <MainMenu />
    </div>
  );
}