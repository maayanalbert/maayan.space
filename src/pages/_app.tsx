import { PageContextProvider } from "@/InfoContext"
import "@/styles/globals.css"
import type { AppProps } from "next/app"
import "@/styles/moab-styles.css"
import { TweaksProvider, useTweaks } from "@/components/TweaksContext"
import TweaksPanel, { COMBOS, DEFAULT_LINE_HEIGHT } from "@/components/TweaksPanel"
import { useEffect } from "react"

function AppInner({ Component, pageProps }: AppProps) {
  const { tweaks } = useTweaks()
  const { body } = COMBOS[tweaks.fontCombo ?? "current"]
  const lineHeight = tweaks.lineHeight ? Number(tweaks.lineHeight) : DEFAULT_LINE_HEIGHT

  useEffect(() => {
    document.documentElement.style.setProperty("--lh", String(lineHeight))
  }, [lineHeight])

  return (
    <div style={{ fontFamily: body }} className="h-full">
      {/* @ts-ignore */}
      <PageContextProvider>
        {/* @ts-ignore */}
        <Component {...pageProps} />
      </PageContextProvider>
      <TweaksPanel />
    </div>
  )
}

export default function App(props: AppProps) {
  return (
    <TweaksProvider>
      <AppInner {...props} />
    </TweaksProvider>
  )
}
