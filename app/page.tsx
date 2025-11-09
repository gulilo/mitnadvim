import Image from "next/image";
import { auth } from "@/auth";

export default async function Home() {
  const session = await auth();
  return (
    <div className="flex flex-col items-center justify-top ">
      <div className="relative w-100 h-70 mb-20 rounded-lg md:w-170 md:h-120">
        <Image src={"/MDA-Dan-Logo.png"} fill alt="home "></Image>
      </div>
      <h1 className="text-lg md:text-2xl">welcome to mda mitnavim dan site.</h1>
      {session?.user ? (
        <h1 className="text-2xl md:text-4xl">welcome {session.user.name} 
        {session?.user?.userGroup === "Admin" ? (" admin") : (" no admin")}
        </h1>
      ) : (
        <h1 className="text-2xl md:text-4xl"> please log-in</h1>
      )}
    </div>
  );
}
