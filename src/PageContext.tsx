import {
  ReactNode,
  RefObject,
  createContext,
  useContext,
  useRef,
  useState,
} from "react"
import { Page } from "./pageHelpers"

export const Pages = ["ABOUT", "CONTACT", "GEOGRAPHY"]

interface PageContextType {
  curPage?: Page
  curIndex: number // -1 - 2
  setCurPage: (page?: Page) => void
  curHoverIndex?: number // -1 - 2 or undefined
  setCurHoverIndex: (index?: number) => void
}

/**
 * Create the context
 */
const PageContext = createContext<PageContextType>({
  curPage: undefined,
  curIndex: 0,
  setCurPage: () => undefined,
  curHoverIndex: undefined,
  setCurHoverIndex: () => undefined,
})

interface Props {
  children: ReactNode
}

/**
 * Create the provider that everything that uses the context should be wrapped in
 */
export function PageContextProvider({ children }: Props) {
  const [curPage, setCurPage] = useState<Page>()
  const [curIndex, setCurIndex] = useState(0)
  const [curHoverIndex, setCurHoverIndex] = useState<number>()

  return (
    <PageContext.Provider
      value={{
        curIndex: curIndex,
        curPage,
        curHoverIndex,
        setCurHoverIndex,
        setCurPage: (page) => {
          if (page) {
            setCurPage(page)
            setCurIndex(Pages.indexOf(page))
          } else {
            setCurPage(undefined)
            setCurIndex(-1)
          }
        },
      }}
    >
      {children}
    </PageContext.Provider>
  )
}

/**
 * Use the context
 */
export function usePageContext(): PageContextType {
  const context = useContext(PageContext)
  return context
}
