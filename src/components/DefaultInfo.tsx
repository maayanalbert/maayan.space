import { useEffect } from "react"
import NavButtons from "@/components/NavButtons"
import { Item, Row } from "@/components/Item"
import { getPageColor } from "@/pageHelpers"
import TextLink from "./TextLink"

export function DefaultInfo() {
  return (
    <p className="sm:text-[18px] text-[16px]">
      I build tools for humans. Inspirations include
      <TextLink
        text="the Macintosh"
        href="https://folklore.org/0-index.html"
        page="DEFAULT"
      />
      and classic hits like the
      <TextLink
        text="paperclip and zipper."
        href="https://www.penguinrandomhouse.com/books/130244/the-evolution-of-useful-things-by-henry-petroski/"
        page="DEFAULT"
      />{" "}
      Currently building
      <TextLink text="Eve." href="https://www.eve.space/" page="DEFAULT" />
    </p>
  )
}
