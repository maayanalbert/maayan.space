"use client"

import dynamic from "next/dynamic"
import type { ReactNode } from "react"

const DevAutoIdProvider = dynamic(
  () => import("moab-design").then((mod) => ({ default: mod.AutoIdProvider })),
  { ssr: false }
)

const DevFloatingButton = dynamic(
  () => import("moab-design").then((mod) => ({ default: mod.FloatingButton })),
  { ssr: false }
)

const isDev = process.env.NODE_ENV === "development"

export function MoabProvider({ children }: { children: ReactNode }) {
  if (!isDev) return <>{children}</>
  return <DevAutoIdProvider>{children}</DevAutoIdProvider>
}

export function MoabFloatingButton() {
  if (!isDev) return null
  return <DevFloatingButton />
}
