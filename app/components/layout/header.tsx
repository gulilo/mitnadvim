import Link from "next/link";
import HeaderNavigationManu from "./hederNavigationMenu";

export default async function Header() {
  return (
    <div className="flex flex-row items-center justify-between bg-gray-100">
      <Link href="/" className="relative p-4 text-blue-600 hover:text-blue-800">
        home
      </Link>
      <HeaderNavigationManu/>
    </div>
  );
}
