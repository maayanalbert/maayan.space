import { usePageContext } from "@/PageContext"
import { AboutInfo } from "@/components/AboutInfo"
import ContactInfo from "@/components/ContactInfo"
import { PhilosophyInfo } from "@/components/PhilosophyInfo"
import NavButtons from "@/components/NavButtons"
import DynamicShapesCanvas from "@/components/DynamicShapes"
import { InitialShapeTrigger } from "@/components/InitialShapeTrigger"
import { useEffect, useRef, useState } from "react"
import { DefaultInfo } from "@/components/DefaultInfo"
import {
  type CaughtShape,
  type CollectedShape,
  CollectedShapesShelf,
} from "@/components/CaughtShapeOverlay"
import { SHAPE_COLORS, type ShapeCombo } from "@/components/DynamicShapes"
import { getSecretForShape } from "@/components/ShapeModal"
import { Agentation } from "agentation"

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

  const { curPage, shapesActive, setShapesActive } = usePageContext()
  const [startShapes, setStartShapes] = useState<(() => void) | null>(null)
  const [spawnOrigin, setSpawnOrigin] = useState<
    { x: number; y: number } | undefined
  >(undefined)
  const [hasPressedTrigger, setHasPressedTrigger] = useState(false)
  const [secretCatchPhase, setSecretCatchPhase] = useState<
    "prompt" | "form" | "submitted"
  >("prompt")
  const [isSubmittingSecret, setIsSubmittingSecret] = useState(false)
  const [secretFormError, setSecretFormError] = useState<string | null>(null)
  const [secretFormValues, setSecretFormValues] = useState({
    fullName: "",
    theirSecret: "",
  })
  const [headlinePhase, setHeadlinePhase] = useState<
    "intro" | "catch" | "positive"
  >(shapesActive ? "catch" : "intro")
  const [positiveHeadline, setPositiveHeadline] = useState<string>(
    POSITIVE_HEADLINES[0]
  )
  const prevShapesActiveRef = useRef(shapesActive)
  const positiveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [collectedShapes, setCollectedShapes] = useState<CollectedShape[]>([])
  const [lastCaughtShape, setLastCaughtShape] = useState<CaughtShape | null>(
    null
  )
  const nextShapeId = useRef(0)

  // Debug mode: populate all shape combos at once via ?debug query param
  const hasCheckedDebug = useRef(false)
  useEffect(() => {
    if (hasCheckedDebug.current) return
    hasCheckedDebug.current = true
    const params = new URLSearchParams(window.location.search)
    if (params.has("debug")) {
      const all: CollectedShape[] = []
      let id = 0
      for (let st = 0; st < 4; st++) {
        for (const clr of SHAPE_COLORS) {
          all.push({ x: 0, y: 0, size: 0, shapeType: st, clr, id: id++ })
        }
      }
      // Shuffle for variety
      for (let i = all.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[all[i], all[j]] = [all[j], all[i]]
      }
      setCollectedShapes(all)
      nextShapeId.current = all.length
    }
  }, [])

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
    // Keep the spawn origin pinned to the trigger's on-screen position
    // (but don't change it mid-animation, since that would recreate the canvas).
    if (shapesActive) return

    let raf = 0
    const measure = () => {
      const el = document.getElementById("initial-shape-trigger")
      if (!el) return
      const rect = el.getBoundingClientRect()
      setSpawnOrigin({
        x: window.innerWidth - 112,
        y: 72,
      })
    }
    const scheduleMeasure = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(measure)
    }

    scheduleMeasure()
    window.addEventListener("resize", scheduleMeasure)
    window.addEventListener("scroll", scheduleMeasure, { passive: true })

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("resize", scheduleMeasure)
      window.removeEventListener("scroll", scheduleMeasure)
    }
  }, [shapesActive])

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

  // Derive excluded combos from already-collected shapes
  const excludedCombos: ShapeCombo[] = collectedShapes.map((s) => ({
    shapeType: s.shapeType,
    clr: s.clr,
  }))

  const handleCatch = (shape: CaughtShape) => {
    // Only collect if this combo isn't already collected
    const alreadyCollected = collectedShapes.some(
      (s) => s.shapeType === shape.shapeType && s.clr === shape.clr
    )
    if (!alreadyCollected) {
      const id = nextShapeId.current++
      setCollectedShapes((prev) => [...prev, { ...shape, id }])
    }
    setLastCaughtShape(shape)
    setSecretCatchPhase("form")
  }

  const isBlackMode = hasPressedTrigger || shapesActive

  return (
    <>
      <Agentation />
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
          spawnOrigin={spawnOrigin}
          onStart={() => setShapesActive(true)}
          onReset={() => setShapesActive(false)}
          onCatch={handleCatch}
          onReady={({ start }) => setStartShapes(() => start)}
          excludedCombos={excludedCombos}
          className="pointer-events-none w-full h-full"
        />
      </div>
      <InitialShapeTrigger
        isBlackMode={isBlackMode}
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
      <CollectedShapesShelf shapes={collectedShapes} />
      {isBlackMode ? (
        <div
          className={`fixed inset-x-0 bottom-0 z-50 pb-14 sm:pb-[72px] ${
            secretCatchPhase === "prompt" ? "pointer-events-none" : ""
          }`}
        >
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
