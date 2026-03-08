"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";

export default function SetPasswordPage() {
  const params = useSearchParams();
  const token = params.get("token");

  const [email, setEmail] = useState("");

  async function handleSubmit() {
    await fetch("/api/emailPassword", {
      method: "POST",
      body: JSON.stringify({ email, tempPassword: "abcd1234" }),
    });

    alert("Password set successfully!");
  }

  return (
    <div>
      <h1>Set Password</h1>
      <input
        type="email"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
}