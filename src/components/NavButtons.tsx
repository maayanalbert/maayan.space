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
    <div className="absolute w-full flex sm:justify-start justify-center sm:pl-28 sm:pb-[72px] pb-10 p-8 bottom-0">
      <div className="flex flex-row items-center justify-between gap-3 relative sm:w-fit w-full">
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
      sm:w-9 w-full text-sm sm:text-base group`}
      onClick={onPress}
    >
      <p
        className={`top-0 absolute h-full ${curPage ? "w-full" : "w-0"}
           transition-all ease-out group-hover:w-0`}
        style={{ backgroundColor: "black" }}
      />
      <div className="flex h-full w-full justify-center items-center">M</div>
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
      className={`text-center py-1.5 cursor-pointer relative 
      sm:w-28 w-full text-base group select-none`}
      onClick={onPress}
    >
      <p
        className={`top-0 absolute h-full ${page === curPage ? "w-0" : "w-full"}
           transition-all ease-out group-hover:w-0`}
        style={{ backgroundColor: getPageColor(page) }}
      />
      <p // TODO: find out why this shows up as below the background color when it's not absolute
        className="top-0 h-full w-full font-light"
        style={{ color: "black" }}
      >
        {getPageName(page)}
      </p>
    </div>
  )
}
