import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import Credentials from "next-auth/providers/credentials";
import { z } from 'zod';
import { sql } from "./app/lib/data";
import bcrypt from "bcrypt";
import { DbUser } from "./app/lib/definitions";
import NeonAdapter from "@auth/neon-adapter";
import { Pool } from "@neondatabase/serverless";

async function getUser(email: string): Promise<DbUser | undefined> {
    try {
      const user = await sql`SELECT * FROM "user" WHERE email = ${email}`;
      return user[0] as DbUser;
    } catch (error) {
      console.error('Failed to fetch user:', error);
      throw new Error('Failed to fetch user.');
    }
}

export const {auth, handlers, signIn, signOut} = NextAuth({
    ...authConfig,
    providers: [Credentials({
        async authorize(credentials) {
            const parsedCredentials = z.object({ email: z.email(), password: z.string() }).safeParse(credentials);
            if (parsedCredentials.success) {
                const { email, password } = parsedCredentials.data;
                const user = await getUser(email)
                if (!user) return null;
                const passwordsMatch = await bcrypt.compare(password, user.password_hash);
                console.log('Authenticated user:', user);
                if (passwordsMatch) return user;
            }
            else 
            {
                console.error(parsedCredentials.error)
            }
            return null;
        }
    })], 

});