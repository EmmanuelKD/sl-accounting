"use client";
import { ReactNode, useState } from "react";
import { Toaster } from "react-hot-toast";
import { QueryClient, QueryClientProvider } from "react-query";

import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import { SessionProvider } from "next-auth/react";
import dynamic from "next/dynamic";
import { createTheme } from "@/theme";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { SettingsConsumer } from "@/context/settings-context";

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
              <CssBaseline/>
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
