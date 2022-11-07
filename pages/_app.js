import { useMemo } from "react";
import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import "../styles/index.css";

const queryClient = new QueryClient();

export default function MyApp({ Component, pageProps }) {
  const supabaseClient = useMemo(() => createBrowserSupabaseClient({
    cookieOptions: {
      name: process.env.NEXT_PUBLIC_COOKIE_NAME,
      secure: true,
      path: "/",
      sameSite: "lax",
      maxAge: 24 * 60 * 60,
    }
  }), []);

  return (
    <SessionContextProvider
      supabaseClient={supabaseClient}
      initialSession={pageProps.initialSession}
    >
      <QueryClientProvider client={queryClient}>
        <Component {...pageProps} />
      </QueryClientProvider>
    </SessionContextProvider>
  );
}
