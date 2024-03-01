import { Page, getPageColor } from "@/pageHelpers"

interface Props {
  text: string
  href: string
  page: Page
}

export default function TextLink({ text, href, page }: Props) {
  return (
    <>
      {" "}
      <a
        href={href}
        target="_blank"
        className="hover:underline cursor-pointer"
        style={{ color: getPageColor(page, true) }}
      >
        {text}
      </a>{" "}
    </>
  )
}
