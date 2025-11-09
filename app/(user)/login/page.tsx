import { authenticate } from "../../lib/actions";
import Image from "next/image";

export default function Login() {
  return (
    <div className="flex flex-col items-center justify-top">
        <div className="relative w-100 h-70 mb-20 rounded-lg md:w-170 md:h-120">
        <Image src={"/MDA-Dan-Logo.png"} fill alt="login "></Image>
      </div>
      <h1 className="m-2 text-xl">Login</h1>
      <form action={authenticate} className="flex flex-col w-screen gap-2 items-center">
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
        <input type="hidden" name="redirectTo" value={"/"} />
        <button
          className="center-block bg-blue-500 text-white rounded-md p-2"
          type="submit"
        >
          Login
        </button>
      </form>
    </div>
  );
}
