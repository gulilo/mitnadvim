import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import Credentials from "next-auth/providers/credentials";
import { z } from 'zod';
import bcrypt from "bcrypt";
import {getUserByEmail} from "./app/(user)/data/user"

export const {auth, handlers, signIn, signOut} = NextAuth({
    ...authConfig,
    providers: [Credentials({
        async authorize(credentials) {
            const parsedCredentials = z.object({ email: z.email(), password: z.string() }).safeParse(credentials);
            if (parsedCredentials.success) {
                const { email, password } = parsedCredentials.data;
                const user = await getUserByEmail(email)
                if (!user || !user.password_hash) return null;
                const passwordsMatch = await bcrypt.compare(password, user.password_hash as string);
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
    callbacks: {
        async session({session}) {
            const user = await getUserByEmail(session.user.email)
            if(!user) return session;
            // const userGroup = await getUserGroupById(user.user_group_id)
            // if(!userGroup) return session

            return {
                ...session,
                user: {
                    ...session.user,
                    id: user.id,
                    name: user.display_name,
                    // userGroup : userGroup.name, 
                }
            }
        }
    }

});