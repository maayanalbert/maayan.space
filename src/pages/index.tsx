import { usePageContext } from "@/PageContext"
import { AboutInfo } from "@/components/AboutInfo"
import ContactInfo from "@/components/ContactInfo"
import { PhilosophyInfo } from "@/components/PhilosophyInfo"
import NavButtons from "@/components/NavButtons"
import DynamicShapesCanvas from "@/components/DynamicShapes"
import { InitialShapeTrigger } from "@/components/InitialShapeTrigger"
import { useEffect, useRef, useState } from "react"
import { DefaultInfo } from "@/components/DefaultInfo"

const POSITIVE_HEADLINES = [
  "Killed it 😎",
  "Maayan's impressed 👀",
  "Great job bestie 🫶",
  "👏👏👏",
  "Slay! 💅",
]

const pickPositiveHeadline = () =>
  POSITIVE_HEADLINES[Math.floor(Math.random() * POSITIVE_HEADLINES.length)]

/**
 * A wrapper for the main page
 */
export default function Home() {
  useEffect(() => {
    document.title = "Maayan"
  }, [])

  const {
    curPage,
    shapesActive,
    setShapesActive,
  } = usePageContext()
  const [startShapes, setStartShapes] = useState<(() => void) | null>(null)
  const [hasPressedTrigger, setHasPressedTrigger] = useState(false)
  const [headlinePhase, setHeadlinePhase] = useState<
    "intro" | "catch" | "positive"
  >(shapesActive ? "catch" : "intro")
  const [positiveHeadline, setPositiveHeadline] = useState<string>(
    POSITIVE_HEADLINES[0]
  )
  const prevShapesActiveRef = useRef(shapesActive)
  const positiveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

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

  useEffect(() => {
    const prevShapesActive = prevShapesActiveRef.current
    if (positiveTimeoutRef.current) {
      clearTimeout(positiveTimeoutRef.current)
      positiveTimeoutRef.current = null
    }

    if (shapesActive) {
      setHeadlinePhase("catch")
    } else if (prevShapesActive) {
      setPositiveHeadline(pickPositiveHeadline())
      setHeadlinePhase("positive")
      positiveTimeoutRef.current = setTimeout(() => {
        setHeadlinePhase("intro")
        positiveTimeoutRef.current = null
      }, 1600)
    } else {
      setHeadlinePhase("intro")
    }

    prevShapesActiveRef.current = shapesActive

    return () => {
      if (positiveTimeoutRef.current) {
        clearTimeout(positiveTimeoutRef.current)
      }
    }
  }, [shapesActive])

  const isBlackMode = hasPressedTrigger || shapesActive

  return (
    <>
      {isBlackMode ? (
        <div className="fixed inset-0 z-0 bg-black pointer-events-none" />
      ) : null}
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
        onStart={() => {
          setHasPressedTrigger(true)
          startShapes?.()
        }}
      />
      {isBlackMode ? null : (
        <>
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
                  className={`headline-pane from-bottom ${
                    headlinePhase === "positive" ? "is-visible" : "is-hidden"
                  }`}
                >
                  {positiveHeadline}
                </span>
                <span
                  className={`headline-pane from-top ${
                    headlinePhase === "intro" ? "is-visible" : "is-hidden"
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
        </>
      )}
      {isBlackMode ? (
        <div className="fixed inset-x-0 bottom-0 z-50 pointer-events-none pb-14 sm:pb-[72px]">
          <p
            className="px-4 sm:px-0 sm:ml-28 font-bold lg:text-8xl sm:text-7xl text-4xl leading-snug text-white/90"
            style={{ fontFamily: "Helvetica Neue" }}
          >
            Catch a secret!
          </p>
        </div>
      ) : null}
    </>
  )
}
