"use server";

import { signIn, signOut } from "@/auth";
import { AuthError } from "next-auth";

export async function authenticate(formData: FormData) {
    try {
        const redirectTo = formData.get("redirectTo") as string || "/";
        await signIn("credentials", {
            phone: formData.get("phone"),
            password: formData.get("password"),
            redirectTo: redirectTo
        });
    }
    catch(error) {
        console.error('Authentication error:', error);
        if (error instanceof AuthError) {
            switch (error.type) {
              case 'CredentialsSignin':
                throw new Error('Invalid credentials.');
              default:
                throw new Error('Something went wrong.');
            }
          }
          throw error;
    }
}

export async function handleSignOut() {
  await signOut({ redirectTo: "/" });
}
