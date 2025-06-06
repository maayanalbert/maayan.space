import { PageContextProvider } from "@/InfoContext"
import "@/styles/globals.css"
import type { AppProps } from "next/app"
import { useMemo } from "react"
import { QueryClient, QueryClientProvider } from "react-query"

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      {/* @ts-ignore */}
      <PageContextProvider>
        {/* @ts-ignore */}
        <Component {...pageProps} />
      </PageContextProvider>
    </>
  )
}
