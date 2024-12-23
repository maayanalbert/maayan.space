import { usePageContext } from "@/InfoContext"
import { AboutInfo } from "@/components/AboutInfo"
import ContactInfo from "@/components/ContactInfo"
import { PhilosophyInfo } from "@/components/PhilosophyInfo"
import NavButtons from "@/components/NavButtons"
import { ReactNode, useEffect } from "react"
import { DefaultInfo } from "@/components/DefaultInfo"

/**
 * A wrapper for the main page
 */
export default function Home() {
  useEffect(() => {
    document.title = "Maayan"
  }, [])

  const { curPage } = usePageContext()

  return (
    <>
      <div className="h-[85%] w-full flex flex-col justify-center sm:mt-0 -mt-8 sm:px-28">
        <p
          className="font-bold sm:p-0 pl-8 sm:-mt-24 -mt-60 lg:text-8xl sm:text-7xl text-5xl leading-snug"
          style={{ fontFamily: "Helvetica Neue" }}
        >
          Hi, <br className="sm:hidden" /> I'm Maayan
        </p>
        <div className="relative w-full md:ml-[5px]  ml-[4px] flex sm:justify-start justify-center">
          <div
            className="absolute font-light w-full sm:text-[20px] text-[16px] sm:px-0 px-8 sm:pt-9 pt-8 leading-[1.4] sm:max-w-[900px]"
            style={{ color: "rgb(0, 0, 0)" }}
          >
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
