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
  CaughtShapeOverlay,
} from "@/components/CaughtShapeOverlay"

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
  const [caughtShape, setCaughtShape] = useState<CaughtShape | null>(null)

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
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
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
          spawnOrigin={spawnOrigin}
          onStart={() => setShapesActive(true)}
          onReset={() => setShapesActive(false)}
          onCatch={(shape) => {
            setSecretCatchPhase("form")
            setSecretFormError(null)
            setCaughtShape(shape)
          }}
          onReady={({ start }) => setStartShapes(() => start)}
          className="pointer-events-none w-full h-full"
        />
        <CaughtShapeOverlay shape={caughtShape} />
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
        <div
          className={`fixed inset-x-0 bottom-0 z-50 pb-14 sm:pb-[72px] ${
            secretCatchPhase === "prompt" ? "pointer-events-none" : ""
          }`}
        >
          {secretCatchPhase === "prompt" ? (
            <p
              className="px-4 sm:px-0 sm:ml-28 font-bold lg:text-8xl sm:text-7xl text-4xl leading-snug text-white/90"
              style={{ fontFamily: "Helvetica Neue" }}
            >
              Catch a secret!
            </p>
          ) : (
            <div className="pointer-events-auto px-4 sm:px-0 sm:ml-28">
              <div className="w-full max-w-[620px] text-[15px] font-normal text-white/80">
                {secretCatchPhase === "submitted" ? (
                  <div className="space-y-2">
                    <p className="text-white/80">You’re in.</p>
                    <p className="text-white/80">
                      Thanks{" "}
                      <span className="text-white/80">
                        {secretFormValues.fullName.trim() || "there"}
                      </span>
                      . Maayan will reveal one of her secrets.
                    </p>
                    <div className="pt-2">
                      <button
                        type="button"
                        className="text-white/80 underline underline-offset-4 decoration-white/30 transition-opacity duration-200 ease hover:opacity-80"
                        onClick={() => {
                          setSecretCatchPhase("prompt")
                          setSecretFormError(null)
                          setSecretFormValues({
                            fullName: "",
                            theirSecret: "",
                          })
                          setCaughtShape(null)
                          startShapes?.()
                        }}
                      >
                        Catch another secret
                      </button>
                    </div>
                  </div>
                ) : (
                  <form
                    className="space-y-3"
                    onSubmit={async (e) => {
                      e.preventDefault()
                      if (isSubmittingSecret) return
                      const fullName = secretFormValues.fullName.trim()
                      const theirSecret = secretFormValues.theirSecret.trim()
                      if (!fullName) {
                        setSecretFormError("Please enter your full name.")
                        return
                      }
                      if (!theirSecret) {
                        setSecretFormError(
                          "Please share a secret about yourself."
                        )
                        return
                      }

                      setIsSubmittingSecret(true)
                      setSecretFormError(null)
                      try {
                        const res = await fetch("/api/secret", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({
                            fullName,
                            theirSecret,
                          }),
                        })

                        const json = (await res.json().catch(() => null)) as
                          | { ok: true }
                          | { ok: false; error: string }
                          | null

                        if (!res.ok || !json?.ok) {
                          throw new Error(
                            (json && "error" in json && json.error) ||
                              "Could not submit your secret."
                          )
                        }

                        setSecretCatchPhase("submitted")
                      } catch (err) {
                        setSecretFormError(
                          err instanceof Error
                            ? err.message
                            : "Could not submit your secret."
                        )
                      } finally {
                        setIsSubmittingSecret(false)
                      }
                    }}
                  >
                    <div className="space-y-3 pb-2">
                      <p className="text-white/80 text-2xl font-bold">
                        Aha! I do have some sense of self preservation. To get
                        the secret, give me one of yours.
                      </p>
                    </div>

                    <div className="space-y-3">
                      <label className="block">
                        <span className="text-white/80">Name:</span>{" "}
                        <input
                          value={secretFormValues.fullName}
                          onChange={(e) =>
                            setSecretFormValues((prev) => ({
                              ...prev,
                              fullName: e.target.value,
                            }))
                          }
                          className="inline-block min-w-[220px] bg-transparent border-b border-white/25 px-1 py-1 text-white/80 outline-none transition-colors duration-200 ease focus:border-white/50"
                          autoComplete="name"
                        />
                      </label>

                      <label className="block">
                        <span className="text-white/80">
                          Your secret: (it better be good)
                        </span>
                        <textarea
                          value={secretFormValues.theirSecret}
                          onChange={(e) =>
                            setSecretFormValues((prev) => ({
                              ...prev,
                              theirSecret: e.target.value,
                            }))
                          }
                          className="mt-2 block w-full min-h-[120px] resize-none bg-transparent border border-white/25 px-1 py-1 text-white/80 outline-none transition-colors duration-200 ease focus:border-white/50"
                        />
                      </label>
                    </div>

                    {secretFormError ? (
                      <p className="text-[rgb(255,70,100)]">
                        {secretFormError}
                      </p>
                    ) : null}

                    <div className="pt-1 w-full flex justify-start">
                      <button
                        type="submit"
                        aria-label="Submit"
                        disabled={isSubmittingSecret}
                        className={`text-white/80 transition-opacity duration-200 ease hover:opacity-80 underline underline-offset-4 decoration-white/30 ${
                          isSubmittingSecret ? "opacity-60" : ""
                        }`}
                      >
                        {isSubmittingSecret ? "Sharing…" : "Share my secret →"}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          )}
        </div>
      ) : null}
    </>
  )
}
