import { usePageContext } from "@/InfoContext"
import { AboutInfo } from "@/components/AboutInfo"
import ContactInfo from "@/components/ContactInfo"
import { PhilosophyInfo } from "@/components/PhilosophyInfo"
import NavButtons from "@/components/NavButtons"
import DynamicShapesCanvas from "@/components/DynamicShapes"
import { useCallback, useEffect, useMemo, useState } from "react"
import { DefaultInfo } from "@/components/DefaultInfo"

/**
 * A wrapper for the main page
 */
export default function Home() {
  useEffect(() => {
    document.title = "Maayan"
  }, [])

  const { curPage } = usePageContext()
  const [isShapesActive, setIsShapesActive] = useState(false)
  const [shapesControls, setShapesControls] = useState<{
    start: () => void
  } | null>(null)
  const miniCanvasSize = 220

  const initialCornerShape = useMemo(
    () => ({
      x: miniCanvasSize - 20,
      y: 20,
      size: 32,
      color: "rgb(255,70,100)",
      skipIntro: true,
      shapeType: 0,
    }),
    [miniCanvasSize]
  )

  const handleShapesReady = useCallback((controls: { start: () => void }) => {
    setShapesControls(controls)
  }, [])

  const handleActivateShapes = useCallback(() => {
    if (isShapesActive || !shapesControls) return
    shapesControls.start()
    setIsShapesActive(true)
  }, [isShapesActive, shapesControls])

  return (
    <>
      <div
        className={`fixed -top-2 -right-2 h-[220px] w-[220px] z-40 ${
          isShapesActive ? "pointer-events-none" : ""
        }`}
        style={{ willChange: "transform" }}
      >
        <DynamicShapesCanvas
          width={miniCanvasSize}
          height={miniCanvasSize}
          initialShape={initialCornerShape}
          autoStart={false}
          onReady={handleShapesReady}
          className="pointer-events-none w-full h-full"
        />
      </div>
      <div className="h-[85%] w-full flex flex-col justify-center sm:mt-0 -mt-8 sm:px-28">
        <p
          className="font-bold sm:px-0 px-4 sm:-mt-24 -mt-60 lg:text-8xl sm:text-7xl text-4xl leading-snug"
          style={{ fontFamily: "Helvetica Neue" }}
        >
          Hi, I'm Maayan
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
  )
}
