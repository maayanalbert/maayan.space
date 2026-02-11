import { ReactNode, createContext, useContext, useState } from "react"
import { Page } from "./pageHelpers"

export const Pages = ["ABOUT", "CONTACT", "GEOGRAPHY"]

interface PageContextType {
  curPage?: Page
  setCurPage: (page?: Page) => void
  shapesActive: boolean
  setShapesActive: (active: boolean) => void
}

const PageContext = createContext<PageContextType | undefined>(undefined)

interface Props {
  children: ReactNode
}

export const PageContextProvider = ({ children }: Props): JSX.Element => {
  const [curPage, setCurPage] = useState<Page>()
  const [shapesActive, setShapesActive] = useState(false)

  return (
    <PageContext.Provider
      value={{
        curPage,
        setCurPage,
        shapesActive,
        setShapesActive,
      }}
    >
      {children}
    </PageContext.Provider>
  )
}

export function usePageContext(): PageContextType {
  const context = useContext(PageContext)
  if (!context) {
    throw new Error("usePageContext must be used within a PageContextProvider")
  }
  return context
}
