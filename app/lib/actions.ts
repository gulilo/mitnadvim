"use server";

import { signIn } from "@/auth";
import { AuthError } from 'next-auth';
import {sql} from "./data";
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
    const existingUser = await sql`SELECT id FROM account WHERE email = ${data.email}`;
    if (existingUser.length > 0) {
      throw new Error('User with this email already exists');
    }

    const hash = await bcrypt.hash(data.password, 12);

    const rows = await sql`
      INSERT INTO account (name, email, password_hash, user_group_id, created_by)
      VALUES (${data.displayName}, ${data.email}, ${hash}, ${data.userGroupId}, '00000000-0000-0000-0000-000000000001')
      RETURNING id
    `;

  } catch (error) {
    console.error('Registration error:', error);
    throw new Error(error instanceof Error ? error.message : 'Registration failed');
  }

  redirect('/');
}