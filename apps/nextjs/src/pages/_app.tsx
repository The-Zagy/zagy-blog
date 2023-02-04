import { api } from "~/utils/api";
import "../styles/globals.css";
import type { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { AppProps } from "next/app";
import { NEXT_SEO_DEFAULT } from "../../nex-seo.config";
import { DefaultSeo } from "next-seo";
import "../styles/globals.css";
import "../styles/syntax-higlighting.css";
import DefaultLayout from "../layouts/default-layout/DefaultLayout";
import React from "react";
import { ThemeProvider } from "next-themes";
import { GoogleAnalytics } from "~/scripts/GoogleAnalytics";
export type CustomAppProps = AppProps<{ session: Session | null }> & {
  Component: AppProps["Component"] & {
    PageLayout?: React.ComponentType<{ children: React.ReactNode }>;
  }
}

function MyApp({
  Component,
  pageProps: { session, ...pageProps },
}: CustomAppProps) {
  return (
    <SessionProvider session={session}>
      <ThemeProvider attribute="class" >
        <DefaultSeo {...NEXT_SEO_DEFAULT} />
        <GoogleAnalytics />
        {
          Component.PageLayout ?
            <Component.PageLayout>
              <Component {...pageProps} />
            </Component.PageLayout>
            :
            <DefaultLayout>
              <Component {...pageProps} />
            </DefaultLayout>
        }
      </ThemeProvider>
    </SessionProvider>
  );
}

export default api.withTRPC(MyApp);
