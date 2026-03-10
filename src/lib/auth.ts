import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) return null;

        // Call SoapBox API to authenticate developer
        const response = await fetch(
          `${process.env.SOAPBOX_API_URL}/oauth/developer/login`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(parsed.data),
          }
        );

        if (!response.ok) return null;

        const data = await response.json();
        return {
          id: data.developer.id.toString(),
          email: data.developer.email,
          name: data.developer.name,
          accessToken: data.accessToken,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.accessToken = (user as { accessToken?: string }).accessToken;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { id: string }).id = token.id as string;
        (session as { accessToken?: string }).accessToken = token.accessToken as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    newUser: "/register",
  },
  session: {
    strategy: "jwt",
  },
});

// Type augmentation for next-auth v5
interface ExtendedUser {
  id: string;
  email: string;
  name: string;
  accessToken?: string;
}

interface ExtendedSession {
  user: ExtendedUser;
  accessToken?: string;
}

export type { ExtendedUser, ExtendedSession };
