"use server";

import { signIn, signOut } from "@/auth";
import { AuthError } from 'next-auth';
import { createAccountRecord, getUserByEmail } from "@/app/(user)/data/user";
import bcrypt from "bcrypt";
import { redirect } from 'next/navigation';

export async function authenticate(formData: FormData) {
    try {
        const redirectTo = formData.get("redirectTo") as string || "/user";
        await signIn("credentials", {
            email: formData.get("email"),
            password: formData.get("password"),
            redirectTo: redirectTo
        });
    }
    catch(error) {
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

export async function registerUser(formData: FormData) {
  try {
    const data = {
      displayName: formData.get("displayName"),
      email: formData.get("email"),
      password: formData.get("password"),
      userGroupId: formData.get("userGroupId")
    }

    if (typeof data.displayName !== 'string' || typeof data.email !== 'string' || typeof data.password !== 'string' || typeof data.userGroupId !== 'string') {
      throw new Error('Invalid form data');
    }

    // Check if user already exists
    const existingUser = await getUserByEmail(data.email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    const hash = await bcrypt.hash(data.password, 12);

    await createAccountRecord({
      displayName: data.displayName,
      email: data.email,
      passwordHash: hash,
      createdBy: "00000000-0000-0000-0000-000000000001",
    });

  } catch (error) {
    console.error('Registration error:', error);
    throw new Error(error instanceof Error ? error.message : 'Registration failed');
  }

  redirect('/');
}

export async function handleSignOut() {
  await signOut({ redirectTo: '/' });
}

