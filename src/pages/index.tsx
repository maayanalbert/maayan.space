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

  const initialCornerShape = useMemo(
    () => ({
      x: windowSize.width - 10,
      y: 10,
      size: 32,
      color: "rgb(255,70,100)",
      shapeType: 0,
    }),
    [windowSize.width]
  )

  return (
    <>
      <div
        className={`fixed inset-0 w-screen h-screen z-40 pointer-events-none`}
        style={{ willChange: "transform" }}
      >
        <DynamicShapesCanvas
          width={windowSize.width}
          height={windowSize.height}
          initialShape={initialCornerShape}
          autoStart={false}
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
