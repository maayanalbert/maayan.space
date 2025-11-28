import { usePageContext } from "@/InfoContext"
import { Page as Page, getPageColor, getPageName } from "@/pageHelpers"
import { useRouter } from "next/router"
import { useEffect } from "react"

export default function NavButtons() {
  const { setCurPage } = usePageContext()
  const router = useRouter()

  // Read initial page from URL params on mount
  useEffect(() => {
    const { page } = router.query
    if (!page) {
      setCurPage(undefined)
    } else if (
      typeof page === "string" &&
      (page.toUpperCase() === "ABOUT" ||
        page.toUpperCase() === "CONTACT" ||
        page.toUpperCase() === "PHILOSOPHY")
    ) {
      setCurPage(page.toUpperCase() as Page)
    }
  }, [router.query]) // Changed dependency to router.query

  return (
    <div className="absolute w-full flex justify-start sm:pl-28 sm:pb-[72px] pb-14 p-4 bottom-0">
      {/* Mobile layout - 2 separate rows */}
      <div className="flex flex-col items-start gap-3 relative w-fit sm:hidden">
        <div className="flex items-start gap-3">
          <PageButton page="ABOUT" />

          <PageButton page="PHILOSOPHY" />
        </div>
        <div className="flex items-start gap-3">
          <HomeButton />
          <PageButton page="CONTACT" />
        </div>
      </div>
      {/* Desktop layout */}
      <div className="hidden sm:flex sm:flex-row items-start justify-between gap-3 relative w-fit">
        <HomeButton />
        <PageButton page="ABOUT" />
        <PageButton page="CONTACT" />
        <PageButton page="PHILOSOPHY" />
      </div>
    </div>
  )
}

export function HomeButton() {
  const { curPage, setCurPage } = usePageContext()
  const router = useRouter()

  const onPress = () => {
    setCurPage(undefined)
    router.push("/", undefined, { shallow: true })
  }

  return (
    <div
      className={`flex justify-start items-start sm:py-1.5 py-2 cursor-pointer relative 
      sm:w-9 w-fit text-sm sm:text-base group`}
      onClick={onPress}
    >
      <p
        className={`top-0 absolute h-full ${curPage ? "w-full" : "w-0"}
           transition-all ease-out group-hover:w-0`}
        style={{ backgroundColor: "black" }}
      />
      <div className="flex h-full w-full justify-center items-center px-3 sm:px-0">
        M
      </div>
    </div>
  )
}

interface PageButtonProps {
  page: Page
}

function PageButton({ page }: PageButtonProps) {
  const { curPage, setCurPage } = usePageContext()
  const router = useRouter()

  const onPress = () => {
    setCurPage(page)
    router.push(
      { pathname: "/", query: { page: page.toLowerCase() } },
      undefined,
      { shallow: true }
    )
  }
  return (
    <div
      className={`text-center sm:py-1.5 py-2 cursor-pointer relative 
      sm:w-28 w-fit text-base group select-none`}
      onClick={onPress}
    >
      <p
        className={`top-0 absolute h-full ${page === curPage ? "w-0" : "w-full"}
           transition-all ease-out group-hover:w-0`}
        style={{ backgroundColor: getPageColor(page) }}
      />
      <p // TODO: find out why this shows up as below the background color when it's not absolute
        className="top-0 h-full w-full  text-sm sm:text-base px-3 sm:px-0"
        style={{ color: "black" }}
      >
        {getPageName(page)}
      </p>
    </div>
  )
}
