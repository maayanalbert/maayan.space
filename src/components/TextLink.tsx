import { Page, getPageColor } from "@/pageHelpers"

interface Props {
  text: string
  href: string
  page: Page
  newTab?: boolean
}

export default function TextLink({ text, href, page, newTab = true }: Props) {
  return (
    <>
      {" "}
      <a
        href={href}
        target={newTab ? "_blank" : undefined}
        className="hover:underline cursor-pointer"
        style={{ color: getPageColor(page, true) }}
      >
        {text}
      </a>{" "}
    </>
  )
}
