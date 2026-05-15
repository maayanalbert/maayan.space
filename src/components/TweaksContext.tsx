import React, { createContext, useContext, useState } from "react"

type Tweaks = Record<string, string>

const TweaksContext = createContext<{
  tweaks: Tweaks
  setTweak: (key: string, value: string) => void
}>({ tweaks: {}, setTweak: () => {} })

export function TweaksProvider({ children }: { children: React.ReactNode }) {
  const [tweaks, setTweaks] = useState<Tweaks>({})
  return (
    <TweaksContext.Provider
      value={{
        tweaks,
        setTweak: (key, value) =>
          setTweaks((prev) => ({ ...prev, [key]: value })),
      }}
    >
      {children}
    </TweaksContext.Provider>
  )
}

export const useTweaks = () => useContext(TweaksContext)
