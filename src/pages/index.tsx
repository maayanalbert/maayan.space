import { usePageContext } from "@/InfoContext"
import { AboutInfo } from "@/components/AboutInfo"
import ContactInfo from "@/components/ContactInfo"
import { PhilosophyInfo } from "@/components/PhilosophyInfo"
import NavButtons from "@/components/NavButtons"
import { useEffect } from "react"
import { DefaultInfo } from "@/components/DefaultInfo"
import { MoabFloatingButton, MoabProvider } from "@/MoabProvider"
import { useToggles } from "toggletation"

/**
 * A wrapper for the main page
 */
export default function Home() {
  useEffect(() => {
    document.title = "Maayan"
  }, [])

  const { curPage } = usePageContext()
  const { getValue } = useToggles()
  const heroLayout = getValue("heroLayout") as string

  const lineHeightStyle = { lineHeight: "var(--line-height)" }

  const bodyContent = (
    <>
      {curPage === "ABOUT" ? (
        <AboutInfo />
      ) : curPage === "CONTACT" ? (
        <ContactInfo />
      ) : curPage === "PHILOSOPHY" ? (
        <PhilosophyInfo />
      ) : (
        <DefaultInfo />
      )}
    </>
  )

  return (
    <>
      <MoabProvider>
        {heroLayout === "split" ? (
          <div className="h-[85%] w-full flex sm:flex-row flex-col sm:items-center justify-center sm:px-28 sm:mt-0 -mt-8">
            <p
              className="font-bold sm:px-0 px-4 lg:text-7xl sm:text-5xl text-4xl leading-snug sm:w-[42%] sm:flex-shrink-0"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Hi, I'm Maayan
            </p>
            <div
              className="text-neutral-800 sm:text-[20px] text-[16px] sm:px-0 px-4 pt-4 sm:pt-0 sm:pl-12"
              style={lineHeightStyle}
            >
              {bodyContent}
            </div>
          </div>
        ) : heroLayout === "tight" ? (
          <div className="h-[85%] w-full flex flex-col justify-center sm:mt-0 -mt-8 sm:px-28">
            <p
              className="font-bold sm:px-0 px-4 lg:text-8xl sm:text-7xl text-4xl leading-snug"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Hi, I'm Maayan
            </p>
            <div
              className="text-neutral-800 w-full sm:text-[20px] text-[16px] sm:px-0 px-4 mt-4 sm:mt-6 sm:max-w-[900px]"
              style={lineHeightStyle}
            >
              {bodyContent}
            </div>
          </div>
        ) : (
          // stacked (default)
          <div className="h-[85%] w-full flex flex-col justify-center sm:mt-0 -mt-8 sm:px-28">
            <p
              className="font-bold sm:px-0 px-4 sm:-mt-24 -mt-60 lg:text-8xl sm:text-7xl text-4xl leading-snug"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Hi, I'm Maayan
            </p>
            <div className="relative w-full md:ml-[5px] ml-[4px] flex sm:justify-start justify-center">
              <div
                className="absolute text-neutral-800 w-full sm:text-[20px] text-[16px] sm:px-0 px-4 sm:pt-9 pt-4 sm:max-w-[900px]"
                style={lineHeightStyle}
              >
                {bodyContent}
              </div>
            </div>
          </div>
        )}
        <NavButtons />
        {process.env.NODE_ENV === "development" && <MoabFloatingButton />}
      </MoabProvider>
    </>
  )
}
