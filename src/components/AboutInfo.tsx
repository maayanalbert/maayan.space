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
        text="thesis"
        href="https://paper.dropbox.com/doc/Stamper-An-Artboard-Oriented-Programming-Environment--Aur96RpoCsXsC76bFeRTFYSGAQ-QXtfMXshBFBNCu6iCtx2J"
        page="ABOUT"
      />
      was accepted into the most prestigious
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
      and as founding engieer scaling
      <TextLink text="Avenue" href="https://avenue.app/" page="ABOUT" />
      to 30 business partners and almost a billion rows of data processed, I'm
      now building the AI diary
      <TextLink text="Eve." href="https://eve.space/" page="ABOUT" />
    </p>
  )
}
