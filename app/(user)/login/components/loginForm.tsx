"use client";

import { authenticate } from "@/app/lib/actions";
import { useActionState, useEffect, useState } from "react";
import Image from "next/image";
import ForgotPasswordPanel from "./forgotPasswordPanel";
import InvalidCredentials from "./InvalidCredentials";

export default function LoginForm() {

  const [state, formAction] = useActionState(authenticate, { success: false });
  const [showInvalidCredentials, setShowInvalidCredentials] = useState(false);

    const [showPassword, setShowPassword] = useState(false);
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
  
    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
    };
  
    const isFormFilled = phone.trim() !== "" && password.trim() !== "";

    useEffect(() => {
      if (!state.success && state.error && state.error === "Invalid credentials") {
        setShowInvalidCredentials(true);
      }
    }, [state]);
  
  
    return (
    <form
        action={formAction}
        className="flex flex-col w-full max-w-md gap-6 items-center justify-center pl-25 pr-25"
      >
        <div className="w-full flex flex-col items-center gap-2">
          <div className="w-full border-b-2 border-white">
            <input
              id="phone"
              className="w-full bg-transparent text-white placeholder-white/70 py-2 px-0 border-0 outline-none text-center"
              type="tel"
              placeholder=""
              name="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
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
            <input
              id="password"
              className="w-full bg-transparent text-white placeholder-white/70 py-2 px-0 border-0 outline-none text-center"
              type={showPassword ? "text" : "password"}
              placeholder=""
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
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

        <InvalidCredentials
          open={showInvalidCredentials}
          onOpenChange={setShowInvalidCredentials}
        />

        <button
          className={`w-full text-white font-bold rounded-lg py-3 px-6 mt-4 transition-colors ${
            isFormFilled
              ? "bg-yellow-400 hover:bg-yellow-500"
              : "bg-[#FF6969] hover:bg-[#FF5555]"
          }`}
          type="submit"
        >
          כניסה למערכת
        </button>
      </form>
  );
}