"use client";
import { ReactNode, useCallback, useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { QueryClient, QueryClientProvider } from "react-query";

import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import { getSession, SessionProvider } from "next-auth/react";
import dynamic from "next/dynamic";
import { createTheme } from "@/theme";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { SettingsConsumer } from "@/context/settings-context";
import { checkIfAppIsInitializedAction } from "../actions/initialization";
import { useRouter } from "next/navigation";

const ProgressBar = dynamic(() => import("@/components/progress-bar"), {
  ssr: false,
});

export default function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => {
    return new QueryClient({
      defaultOptions: {
        queries: {
          refetchOnWindowFocus: false, // default: true
        },
      },
    });
  });

  const router = useRouter();

  const fetchSession = useCallback(async () => {
    try {
      const isInitialized = await checkIfAppIsInitializedAction();
      if (!isInitialized) {
        router.replace("/init");
      }
    } catch (error) {
      // If table doesn't exist, app is not initialized
      if (error instanceof Error && error.message.includes("does not exist")) {
        router.replace("/init");
      }
      // Re-throw other errors
      throw error;
    }
  }, []);

  useEffect(() => {
    fetchSession().finally();
  }, [fetchSession]);

  return (
    <SettingsConsumer>
      {(settings) => {
        const theme = createTheme({
          colorPreset: "dti",
          direction: settings.direction,
          paletteMode: settings.paletteMode,
          contrast: "high",
        });

        return (
          <AppRouterCacheProvider>
            <ThemeProvider theme={theme}>
              <CssBaseline />
              <SessionProvider>
                <QueryClientProvider client={queryClient as QueryClient}>
                  <Toaster position={"top-center"} />
                  {children}
                </QueryClientProvider>
                <ProgressBar />
              </SessionProvider>
            </ThemeProvider>
          </AppRouterCacheProvider>
        );
      }}
    </SettingsConsumer>
  );
}
