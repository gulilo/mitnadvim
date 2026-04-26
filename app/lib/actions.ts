"use server";

import { signIn, signOut } from "@/auth";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { AuthError } from "next-auth";

type authState = { success: boolean, error?: string };

export async function authenticate(prevState: authState, formData: FormData): Promise<authState> {
    try {
        const redirectTo = formData.get("redirectTo") as string || "/";
        await signIn("credentials", {
            phone: formData.get("phone"),
            password: formData.get("password"),
            redirectTo: redirectTo
        });
        return { success: true };
    }
    catch(error) {
        if (isRedirectError(error)) {
          throw error;
        }

        if (error instanceof AuthError) {
            switch (error.type) {
              case 'CredentialsSignin':
                return { success: false, error: 'Invalid credentials' };
              default:
                return { success: false, error: 'Something went wrong.' };
            }
          }
          return { success: false, error: 'Something went wrong.' };
    }
}

export async function handleSignOut() {
  await signOut({ redirectTo: "/" });
}
