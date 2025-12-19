import { NextAuthOptions } from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { prisma } from "./prisma"

export const authOptions: NextAuthOptions = {
  // Note: PrismaAdapter is for database sessions, but we use JWT
  // We'll handle OAuth user creation manually in callbacks
  providers: [
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            authorization: {
              params: {
                prompt: "consent",
                access_type: "offline",
                response_type: "code"
              }
            },
            profile(profile) {
              return {
                id: profile.sub,
                name: profile.name || `${profile.given_name || ''} ${profile.family_name || ''}`.trim() || profile.email?.split('@')[0] || 'User',
                email: profile.email,
                image: profile.picture,
              }
            }
          }),
        ]
      : []),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email
          }
        })

        if (!user) {
          return null
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password || ""
        )

        if (!isPasswordValid) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
        }
      }
    })
  ],
  session: {
    strategy: "jwt"
  },
  pages: {
    signIn: "/auth/signin",
  },
  debug: process.env.NODE_ENV === "development",
  callbacks: {
    async signIn({ user, account, profile }) {
      // Handle Google OAuth sign in
      if (account?.provider === "google") {
        try {
          if (!user.email) {
            console.error("Google OAuth: No email provided")
            return false
          }

          // Get name from profile (Google provides more accurate name here)
          // profile?.name or profile?.given_name + profile?.family_name
          const profileAny = profile as any // Google profile has additional fields
          const googleName = profileAny?.name || 
                            (profileAny?.given_name && profileAny?.family_name 
                              ? `${profileAny.given_name} ${profileAny.family_name}` 
                              : null) ||
                            user.name || 
                            "User"

          // Check if user exists
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email }
          })

          if (!existingUser) {
            // Create new user for Google OAuth
            // Generate a random password since Google users don't have passwords
            const randomPassword = await bcrypt.hash(Math.random().toString(36) + Date.now().toString(), 12)
            const newUser = await prisma.user.create({
              data: {
                email: user.email,
                name: googleName,
                password: randomPassword, // Random password for OAuth users
              }
            })
            user.id = newUser.id
            user.name = googleName // Update user object with correct name
            console.log("Created new user via Google OAuth:", newUser.id, "Name:", googleName)
          } else {
            // Update name if it has changed in Google account
            if (existingUser.name !== googleName) {
              await prisma.user.update({
                where: { id: existingUser.id },
                data: { name: googleName }
              })
              console.log("Updated user name from Google:", existingUser.id, "New name:", googleName)
            }
            user.id = existingUser.id
            user.name = googleName // Update user object with correct name
            console.log("Existing user signed in via Google OAuth:", existingUser.id)
          }
        } catch (error) {
          console.error("Error in Google sign in:", error)
          if (error instanceof Error) {
            console.error("Error details:", error.message, error.stack)
          }
          return false
        }
      }
      return true
    },
    async jwt({ token, user, account }) {
      // When user signs in, store their ID and name in the token
      if (user) {
        token.id = user.id
        if (user.name) {
          token.name = user.name
        }
      }
      // For Google OAuth, ensure we have the user ID from database
      if (account?.provider === "google" && user?.email && !token.id) {
        try {
          const dbUser = await prisma.user.findUnique({
            where: { email: user.email }
          })
          if (dbUser) {
            token.id = dbUser.id
            token.name = dbUser.name
          }
        } catch (error) {
          console.error("Error fetching user in JWT callback:", error)
        }
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
        // Update name from token if available (for Google OAuth users)
        if (token.name) {
          session.user.name = token.name as string
        }
      }
      return session
    },
  },
}
