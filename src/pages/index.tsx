import { usePageContext } from "@/PageContext"
import { AboutInfo } from "@/components/AboutInfo"
import ContactInfo from "@/components/ContactInfo"
import { PhilosophyInfo } from "@/components/PhilosophyInfo"
import NavButtons from "@/components/NavButtons"
import DynamicShapesCanvas from "@/components/DynamicShapes"
import { InitialShapeTrigger } from "@/components/InitialShapeTrigger"
import { useEffect, useState } from "react"
import { DefaultInfo } from "@/components/DefaultInfo"
import { ShapeCombinations } from "@/components/ShapeCombinations"

/**
 * A wrapper for the main page
 */
export default function Home() {
  useEffect(() => {
    document.title = "Maayan"
  }, [])

  const { curPage, shapesActive, setShapesActive } = usePageContext()
  const [startShapes, setStartShapes] = useState<(() => void) | null>(null)

  const [windowSize, setWindowSize] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 1000,
    height: typeof window !== "undefined" ? window.innerHeight : 1000,
  })

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return (
    <>
      <div
        className={`fixed inset-0 w-screen h-screen z-40 pointer-events-none`}
        style={{ willChange: "transform" }}
      >
        <DynamicShapesCanvas
          width={windowSize.width}
          height={windowSize.height}
          onStart={() => setShapesActive(true)}
          onReset={() => setShapesActive(false)}
          onReady={({ start }) => setStartShapes(() => start)}
          className="pointer-events-none w-full h-full"
        />
      </div>
      <InitialShapeTrigger
        hidden={shapesActive || !startShapes}
        onStart={() => startShapes?.()}
      />
      <div className="h-[85%] w-full flex flex-col justify-center sm:mt-0 -mt-8 sm:px-28">
        <p
          className="font-bold sm:px-0 px-4 sm:-mt-24 -mt-60 lg:text-8xl sm:text-7xl text-4xl leading-snug"
          style={{ fontFamily: "Helvetica Neue" }}
        >
          <span className="headline-transition" aria-live="polite">
            <span
              className={`headline-pane from-bottom ${
                shapesActive ? "is-visible" : "is-hidden"
              }`}
            >
              Catch a shape!
            </span>
            <span
              className={`headline-pane from-top ${
                shapesActive ? "is-hidden" : "is-visible"
              }`}
            >
              Hi, I'm Maayan
            </span>
          </span>
        </p>
        <div className="relative w-full md:ml-[5px]  ml-[4px] flex sm:justify-start justify-center">
          <div className="absolute text-gray-900 w-full sm:text-[20px] text-[16px] sm:px-0 px-4 sm:pt-9 pt-4 leading-[1.4] sm:max-w-[900px]">
            {curPage === "ABOUT" ? (
              <AboutInfo />
            ) : curPage === "CONTACT" ? (
              <ContactInfo />
            ) : curPage === "PHILOSOPHY" ? (
              <PhilosophyInfo />
            ) : (
              <DefaultInfo />
            )}
          </div>
        </div>
      </div>
      <NavButtons />
      <ShapeCombinations />
    </>
  )
}
