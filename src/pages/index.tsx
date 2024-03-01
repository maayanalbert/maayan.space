import { usePageContext } from "@/InfoContext"
import { AboutInfo } from "@/components/AboutInfo"
import ContactInfo from "@/components/ContactInfo"
import { PhilosophyInfo } from "@/components/PhilosophyInfo"
import NavButtons from "@/components/NavButtons"
import { ReactNode, useEffect } from "react"

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
      <div className="h-[85%] w-full flex flex-col justify-center sm:mt-0 -mt-8 sm:pl-28 pr-12">
        <p
          className="font-bold sm:p-0 pl-8 sm:-mt-4 -mt-44 sm:text-9xl text-5xl leading-snug"
          style={{ fontFamily: "Helvetica Neue" }}
        >
          Hi, <br className="sm:hidden" />
          I'm Maayan
        </p>
        <div className="relative w-full sm:ml-[10px] ml-[5px] flex sm:justify-start justify-center">
          <div
            className="absolute w-full sm:text-[16px] text-[14px] sm:px-0 px-8 sm:pt-8 pt-8 leading-[1.7] sm:w-[900px]"
            style={{ color: "rgb(36, 37, 37)" }}
          >
            {curPage === "ABOUT" ? (
              <AboutInfo />
            ) : curPage === "CONTACT" ? (
              <ContactInfo />
            ) : curPage === "PHILOSOPHY" ? (
              <PhilosophyInfo />
            ) : undefined}
          </div>
        </div>
      </div>
      <NavButtons />
    </>
  )
}
