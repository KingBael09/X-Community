import { env } from "@/env.mjs"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { nanoid } from "nanoid"
import type { AuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"

import { db } from "./db"

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(db),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    session({ token, session }) {
      if (token) {
        session.user.id = token.id
        session.user.name = token.name
        session.user.email = token.email
        session.user.image = token.picture
        session.user.username = token.username
      }

      return session
    },

    async jwt({ token, user }) {
      const dbUser = await db.user.findFirst({
        where: {
          email: token.email,
        },
      })

      if (!dbUser) {
        token.id = user.id
        return token
      }

      if (!dbUser.username) {
        await db.user.update({
          where: { id: dbUser.id },
          data: {
            username: nanoid(10),
          },
        })
      }
      return {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        picture: dbUser.image,
        username: dbUser.username,
      }
    },

    redirect() {
      return "/"
    },
  },
}
