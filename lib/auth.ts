// @ts-ignore
import type { NextAuthOptions } from "next-auth";
// @ts-ignore
import type { Account, User as AuthUser } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { nanoid } from "nanoid";

export const authOptions: NextAuthOptions = {
  // Configure one or more authentication providers
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any) {
        try {
          console.log("Authorize called with email:", credentials.email);
          
          const user = await prisma.user.findFirst({
            where: {
              email: credentials.email,
            },
          });
          
          console.log("User found:", user ? "Yes" : "No");
          
          if (user) {
            const isPasswordCorrect = await bcrypt.compare(
              credentials.password,
              user.password!
            );
            console.log("Password correct:", isPasswordCorrect);
            
            if (isPasswordCorrect) {
              console.log("Returning user:", { id: user.id, email: user.email, role: user.role });
              return {
                id: user.id,
                email: user.email,
                role: user.role,
              };
            }
          }
        } catch (err: any) {
          console.error("Authorize error:", err);
          throw new Error(err);
        }
        console.log("Authorization failed");
        return null;
      },
    }),
    // Uncomment and configure these providers as needed
    // GithubProvider({
    //   clientId: process.env.GITHUB_ID!,
    //   clientSecret: process.env.GITHUB_SECRET!,
    // }),
    // GoogleProvider({
    //   clientId: process.env.GOOGLE_CLIENT_ID!,
    //   clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    // }),
  ],
  callbacks: {
    async signIn({ user, account }: { user: any; account: any }) {
      if (account?.provider === "credentials") {
        return true;
      }
      
      // Handle OAuth providers
      if (account?.provider === "github" || account?.provider === "google") {
        try {
          // Check if user exists in database
          const existingUser = await prisma.user.findFirst({
            where: {
              email: user.email!,
            },
          });

          if (!existingUser) {
            // Create new user for OAuth providers
            await prisma.user.create({
              data: {
                id: nanoid(),
                email: user.email!,
                role: "user",
                // OAuth users don't have passwords
                password: null,
              },
            });
          }
          return true;
        } catch (error) {
          console.error("Error in signIn callback:", error);
          return false;
        }
      }
      
      return true;
    },
    async jwt({ token, user }: { token: any; user: any }) {
      console.log("JWT callback called with user:", user);
      if (user) {
        token.role = user.role;
        token.id = user.id;
        token.iat = Math.floor(Date.now() / 1000); // Issued at time
        console.log("JWT token updated:", { role: token.role, id: token.id });
      }
      
      // Check if token is expired (24 hours)
      const now = Math.floor(Date.now() / 1000);
      const tokenAge = now - (token.iat as number);
      const maxAge = 24 * 60 * 60; // 24 hours
      
      if (tokenAge > maxAge) {
        // Token expired, return empty object to force re-authentication
        return {};
      }
      
      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      console.log("Session callback called with token:", token);
      if (token) {
        session.user.role = token.role as string;
        session.user.id = token.id as string;
        console.log("Session updated with role:", token.role);
      }
      console.log("Final session:", session);
      return session;
    },
  },
  pages: {
    signIn: '/login',
    error: '/login', // Redirect to login page on auth errors
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours in seconds
    updateAge: 60 * 60, // Update session every hour
  },
  jwt: {
    maxAge: 24 * 60 * 60, // 24 hours in seconds
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
};
