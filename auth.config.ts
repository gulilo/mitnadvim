import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  trustHost: true, // required when deployed (e.g. Azure) so the request host is trusted
  pages: {
    signIn: '/login',
  },
  providers: [],
} satisfies NextAuthConfig;