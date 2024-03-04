import { useEffect } from "react"
import NavButtons from "@/components/NavButtons"
import { Item, Row } from "@/components/Item"
import { getPageColor } from "@/pageHelpers"
import TextLink from "./TextLink"

export function AboutInfo() {
  return (
    <p>
      I studied Design & CS at
      <TextLink
        text="Carnegie Mellon,"
        href="https://www.cmu.edu/"
        page="ABOUT"
      />
      where my
      <TextLink
        text="thesis,"
        href="https://paper.dropbox.com/doc/Stamper-An-Artboard-Oriented-Programming-Environment--Aur96RpoCsXsC76bFeRTFYSGAQ-QXtfMXshBFBNCu6iCtx2J"
        page="ABOUT"
      />
      an IDE for creative technologists, was accepted into the most prestigious
      <TextLink
        text="HCI conference"
        href="https://en.wikipedia.org/wiki/Conference_on_Human_Factors_in_Computing_Systems"
        page="ABOUT"
      />
      in the world. <br className="sm:hidden" /> <br className="sm:hidden" />
      After working at
      <TextLink
        text="Apple,"
        href="https://www.apple.com/iwork/"
        page="ABOUT"
      />
      <TextLink
        text="Google,"
        href="https://www.google.com/travel/"
        page="ABOUT"
      />
      and as first hire scaling
      <TextLink text="Avenue" href="https://avenue.app/" page="ABOUT" />
      to more than 30 business clients and a team of a dozen, I'm now building
      the AI diary
      <TextLink text="Eve." href="https://eve.space/" page="ABOUT" />
      <br /> <br />
      My focus is on building tools for humans. Inspirations include
      <TextLink
        text="the Macintosh"
        href="https://folklore.org/0-index.html"
        page="ABOUT"
      />
      and classic hits like the
      <TextLink
        text="paperclip and zipper."
        href="https://www.barnesandnoble.com/w/the-evolution-of-useful-things-henry-petroski/1112257387"
        page="ABOUT"
      />
    </p>
  )
}
