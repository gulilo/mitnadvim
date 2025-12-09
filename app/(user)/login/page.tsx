"use client";

import { authenticate } from "../../lib/actions";
import Image from "next/image";
import { useState } from "react";
import ForgotPasswordPanel from "../components/forgotPasswordPanel";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="fixed inset-0 flex flex-col items-center pt-8 pb-6 px-4 overflow-y-auto">
      <div className="relative w-72 h-48 mb-12 md:w-96 md:h-64">
        <Image
          src={"/MDA-Dan-Logo.png"}
          fill
          alt="MDA Logo"
          className="object-contain"
        />
      </div>

      <form
        action={authenticate}
        className="flex flex-col w-full max-w-md gap-6 items-center justify-center pl-25 pr-25"
      >
        <div className="w-full flex flex-col items-center gap-2">
          <div className="w-full border-b-2 border-white">
            <input
              id="phone"
              className="w-full bg-transparent text-white placeholder-white/70 py-2 px-0 border-0 outline-none text-center"
              type="tel"
              placeholder=""
              name="email"
              required
            />
          </div>
          <label
            htmlFor="phone"
            className="text-white text-sm font-sans text-center"
          >
            מספר טלפון רשום במערכת
          </label>
        </div>

        <div className="w-full flex flex-col items-center gap-2">
          <div className="w-full border-b-2 border-white flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="cursor-pointer"
            >
              <Image
                src={showPassword ? "/show_password.svg" : "/hide_password.svg"}
                alt={showPassword ? "Hide password" : "Show password"}
                width={20}
                height={15}
              />
            </button>
            <input
              id="password"
              className="w-full bg-transparent text-white placeholder-white/70 py-2 px-0 border-0 outline-none text-center"
              type={showPassword ? "text" : "password"}
              placeholder=""
              name="password"
              required
            />
            <Image
              src={"/icon_fingerprint.svg"}
              alt="Password"
              width={20}
              height={20}
            />
          </div>
          <label
            htmlFor="password"
            className="text-white text-sm font-sans text-center"
          >
            סיסמא
          </label>
        </div>

        <ForgotPasswordPanel />

        <input type="hidden" name="redirectTo" value={"/"} />

        <button
          className="w-full bg-[#FF6969] text-white font-bold rounded-lg py-3 px-6 mt-4 hover:bg-[#FF5555] transition-colors"
          type="submit"
        >
          כניסה למערכת
        </button>
      </form>
    </div>
  );
}
