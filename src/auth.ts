import { User as AppUser, UserRole, Workspace } from "@prisma/client";
import NextAuth, { DefaultSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import {
  checkIfAppIsInitialized,
  checkIfAppIsInitializedAction,
} from "./lib/actions/initialization";
import { prisma } from "./db";

declare module "next-auth" {
  interface User extends AppUser {
    role: UserRole;
    currentWorkspace: string;
    workspaces: Workspace[];
  }

  interface Session {
    user: User & DefaultSession["user"];
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  pages: {
    signIn: "/auth/jwt/login",
    error: "/error",
  },
  // session: {
  //   strategy: "jwt",
  // },
  callbacks: {
    async signIn({ user, credentials }) {
      if (user && credentials) {
        return true;
      } else {
        return false;
      }
    },
    async jwt({ token, user }) {
      if (user) {
        return { ...token, user };
      }
      return token;
    },
    async session({ session, token }) {
      return { ...session, ...token };
    },
    async authorized({ request: { nextUrl }, auth }) {
      const isLoggedIn = !!auth?.user;
      
      if (!isLoggedIn) {
        const isOnInit = nextUrl.pathname.startsWith("/init");
        if(isOnInit) return true;
       return false;
      } else {
        return true;
      }

      // const isOnOfficer = nextUrl.pathname.startsWith("/officer");
      // const isOnAdmin = nextUrl.pathname.startsWith("/admin");
      // const isOnAuth = nextUrl.pathname.startsWith("/auth");
      // const isOnLanding = nextUrl.pathname.startsWith("/landing");
      // const isOnUser = nextUrl.pathname.startsWith("/user");
      // const isOnOpenForm = nextUrl.pathname.startsWith("/open-form");

      //   if (isOnOpenForm) return true;
      //   else if (isOnAuth || isOnLanding) {
      //     if (!isLoggedIn) return true;
      //     // return true;
      //   } else if (isOnAdmin) {
      //     const user = auth?.user;
      //     if (isLoggedIn && user?.role === "ADMIN") return true;
      //     // return false;
      //   } else if (isOnOfficer) {
      //     const user = auth?.user;
      //     if (isLoggedIn && user?.role === "OFFICER") return true;
      //     // return false;
      //   } else if (isOnUser) {
      //     const user = auth?.user;
      //     if (isLoggedIn && user?.role === "USER") return true;
      //     // return false;
      //   }

      //   const user = auth?.user;
      //   let _callback = switchPath(user?.role as any, "");
      // return true;
    },
  },
  secret: process.env.JWT_SECRET,
  providers: [
    Credentials({
      id: "credentials",
      name: "sl-acunting",
      credentials: {
        user: { type: "text", label: "user" },
        accessToken: { type: "text", label: "accessToken" },
      },
      async authorize(credentials) {
        const user = JSON.parse(credentials?.user as string);
        if (user) {
          return {
            ...(user as AppUser),
            currentWorkspace: user.workspaces[0].id,
            workspaces: user.workspaces,
          };
        }
        return null;
      },
    }),
  ],
});

 