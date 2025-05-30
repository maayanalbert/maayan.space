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
  setCurPage: (page?: Page) => void
}

/**
 * Create the context
 */
const PageContext = createContext<PageContextType | undefined>(undefined)

interface Props {
  children: ReactNode
}

/**
 * Create the provider that everything that uses the context should be wrapped in
 */
export const PageContextProvider = ({ children }: Props): JSX.Element => {
  const [curPage, setCurPage] = useState<Page>()

  return (
    <PageContext.Provider
      value={{
        curPage,
        setCurPage,
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
  if (!context) {
    throw new Error("usePageContext must be used within a PageContextProvider")
  }
  return context
}
