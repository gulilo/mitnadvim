"use server";
import  {auth} from "@/auth";
import { redirect } from "next/navigation";

export default async function UserInfo() {

  const session = await auth();
  if(!session?.user) {
    console.log("unauthenticated")
    redirect("./login")
  }
  console.log(session)
  return (
    <div>
      <h1>Hello {session.user.name}</h1>
    </div>
  );
}
