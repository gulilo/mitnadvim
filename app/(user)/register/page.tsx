"use server";

import { registerUser } from "../../lib/actions";
import  {auth} from "@/auth";
import { redirect } from "next/navigation";

export default async function Register() {

  const session = await auth();
    if(!session?.user) {
      console.log("unauthenticated")
      redirect("./login")
    }
    

  
  return (
    <div className="flex flex-col justify-center items-center">
      <h1 className="m-2">Register</h1>
      <form action={registerUser} className="flex flex-col gap-2 items-center">
        <input 
          className="center-block border-2 border-gray-300 rounded-md p-2" 
          type="text" 
          placeholder="Display Name" 
          name="displayName"
          required
        />
        <input 
          className="center-block border-2 border-gray-300 rounded-md p-2" 
          type="email" 
          placeholder="Email" 
          name="email"
          required
        />
        <input 
          className="center-block border-2 border-gray-300 rounded-md p-2" 
          type="password" 
          placeholder="Password" 
          name="password"
          required
        />
        <button 
          className="center-block bg-blue-500 text-white rounded-md p-2" 
          type="submit"
        >
          Register
        </button>
      </form>
      <p className="mt-4 text-sm text-gray-600">
        Already have an account? <a href="/login" className="text-blue-500 hover:underline">Login here</a>
      </p>
    </div>
  );
}
