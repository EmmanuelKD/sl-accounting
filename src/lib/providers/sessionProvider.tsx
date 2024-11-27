"use client";

import { Session } from "next-auth";
import {
  SessionProvider as NextSessionProvider,
  getSession,
} from "next-auth/react";
import {  usePathname, useRouter } from "next/navigation";
import { ReactNode, useCallback, useEffect, useState } from "react";
import { checkIfAppIsInitializedAction } from "../actions/initialization";

// Retrieve user session for the app's session context
export default function SessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const pathName = usePathname();
const router=useRouter()
  const fetchSession = useCallback(async () => {
    try {
      const isAuth = await checkIfAppIsInitializedAction();
      if (isAuth) {
        const sessionData = await getSession();
        setSession(sessionData);
      }else{
        router.replace("/init");
      }
    } catch (error) {
      setSession(null);

      if (process.env.NODE_ENV === "development") {
        console.error(error);
      }
    }
  }, []);

  useEffect(() => {
    fetchSession().finally();
  }, [fetchSession, pathName]);

  return (
    <NextSessionProvider session={session}>{children}</NextSessionProvider>
  );
}
