import { User as AppUser, UserRole } from "@prisma/client";
import NextAuth, { DefaultSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";

declare module "next-auth" {
  interface User extends AppUser{
    role: UserRole;
  }

  interface Session {
    user: User & DefaultSession["user"];
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  pages: {
    signIn: "/auth/login",
    error: "/auth/login",
  },
  // session: {
  //   strategy: "jwt",
  // },
  callbacks: {
    // async redirect({ url, baseUrl }) {
    //   // Allows relative callback URLs
    //   if (url.startsWith("/")) return `${baseUrl}${url}`
    //   // Allows callback URLs on the same origin
    //   else if (new URL(url).origin === baseUrl) return url
    //   return baseUrl
    // },
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
    async authorized({ request: {  },  }) {
      // async authorized({ request: { nextUrl }, auth }) {
      return true;
      //   const isLoggedIn = !!auth?.user;
      //   const isOnOfficer = nextUrl.pathname.startsWith("/officer");
      //   const isOnAdmin = nextUrl.pathname.startsWith("/admin");
      //   const isOnAuth = nextUrl.pathname.startsWith("/auth");
      //   const isOnLanding = nextUrl.pathname.startsWith("/landing");
      //   const isOnUser = nextUrl.pathname.startsWith("/user");
      //   const isOnOpenForm = nextUrl.pathname.startsWith("/open-form");

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
      //   return Response.redirect(new URL(_callback, nextUrl));
    },
  },
  secret: process.env.JWT_SECRET,
  providers: [
    Credentials({
      id: "credentials",
      name: "sl-sceed",
      credentials: {
        user: { type: "text", label: "user" },
        accessToken: { type: "text", label: "accessToken" },
      },
      async authorize(credentials) {
        const user = JSON.parse(credentials?.user as string);
        if (user) {
          return {
            ...(user as AppUser),

          };
        }
        return null;
      },
    }),
  ],
});
