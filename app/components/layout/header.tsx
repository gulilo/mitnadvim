import Link from "next/link";
import { auth, signOut } from "@/auth";

export default async function Header() {
  const session = await auth();
  return (
    <div className="flex flex-row items-center justify-between bg-gray-100">
      <Link href="/" className="relative p-4 text-blue-600 hover:text-blue-800">
        home
      </Link>
      <nav className="flex justify-center items-center p-4 ">
        {session?.user ? (
          <ul className="flex space-x-5 list-none">
            <li className="mr-3">{session?.user?.name}</li>
            <li>
              <form
                action={async () => {
                  "use server";
                  await signOut();
                }}
              >
                <button className="text-red-400 underline hover:text-red-600 transition">logout</button>
              </form>
            </li>
          </ul>
        ) : (
          <ul className="flex space-x-8 list-none">
            <li>
              <Link
                href="/login"
                className="mr-3 text-blue-600 hover:text-blue-800"
              >
                login
              </Link>
            </li>
          </ul>
        )}
      </nav>
    </div>
  );
}
