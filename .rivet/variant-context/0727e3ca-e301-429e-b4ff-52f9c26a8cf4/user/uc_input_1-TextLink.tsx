import { Page, getPageColor, getPageHighlight, getPageDeepColor } from "@/pageHelpers"
import { useToggles } from "toggletation"
import type { CSSProperties } from "react"

interface Props {
  text: string
  href: string
  page: Page
  newTab?: boolean
}

export default function TextLink({ text, href, page, newTab = true }: Props) {
  const { getValue } = useToggles()
  const linkStyle = getValue("linkStyle") as string
  const linkHoverStyle = getValue("linkHoverStyle") as string
  const accent = getPageColor(page, true)
  const highlight = getPageHighlight(page)
  const deep = getPageDeepColor(page)

  let style: CSSProperties = {}
  let className = "cursor-pointer"

  switch (linkStyle) {
    case "underline":
      style = {
        color: accent,
        textDecoration: "underline",
        textDecorationColor: accent,
        textUnderlineOffset: "3px",
      }
      break
    case "highlight":
      style = {
        color: deep,
        backgroundColor: highlight,
        borderRadius: "2px",
        padding: "0 2px",
        ["--link-accent" as string]: accent,
        ["--link-shadow" as string]: highlight,
      }
      className += ` link-hover-${linkHoverStyle || "fade"}`
      break
    case "dotted":
      style = {
        color: accent,
        textDecoration: "underline",
        textDecorationStyle: "dotted",
        textDecorationColor: accent,
        textUnderlineOffset: "3px",
      }
      break
    default:
      style = { color: accent }
      className += " hover:underline"
  }

  return (
    <>
      {" "}
      <a
        href={href}
        target={newTab ? "_blank" : undefined}
        className={className}
        style={style}
      >
        {text}
      </a>
    </>
  )
}
