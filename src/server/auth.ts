import { DrizzleAdapter } from "@auth/drizzle-adapter";
import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
} from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

import { env } from "~/env";
import { db } from "~/server/db";
import { mysqlTable } from "~/server/db/schema";
import { api } from "~/trpc/server";
import bycrpt from "bcryptjs";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      // ...other properties
      // role: UserRole;
    } & DefaultSession["user"];
  }
}

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user?.id) token.sub = user.id;
      return token;
    },
    async session({ session, token }) {
      session.user && (session.user.id = token.sub!);
      return session;
    },
  },
  adapter: DrizzleAdapter(db, mysqlTable),
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) {
          return null;
        }

        const user = await api.user.fetch.query({
          email: credentials.email,
        });

        if (!user[0]) {
          throw new Error("No user found");
        }

        if (user[0].password === null) {
          throw new Error("No password found");
        }

        const isValid = await bycrpt.compare(
          credentials.password,
          user[0].password,
        );

        if (!isValid) {
          throw new Error("Invalid password");
        }

        return user[0];
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin",
    error: "/auth/signin", // Error code passed in query string as ?error=
  },
};

export const getServerAuthSession = () => getServerSession(authOptions);
