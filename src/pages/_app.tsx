import { AppProps } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { trpc } from "../utils/trpc";
import { NEXT_SEO_DEFAULT } from "../../nex-seo.config";
import { DefaultSeo } from "next-seo";
import "../styles/globals.css";
import DefaultLayout from "../layouts/default-layout/DefaultLayout";
import React from "react";
import { ThemeProvider } from "next-themes";
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

export default trpc.withTRPC(MyApp);
