import { useEffect } from "react"
import NavButtons from "@/components/NavButtons"
import { Item, Row } from "@/components/Item"
import { getPageColor } from "@/pageHelpers"
import TextLink from "./TextLink"

export function AboutInfo() {
  return (
    <p>
      I have spent my career building novel interfaces human computer
      interaction. I studied Design, HCI, Computer Science at Carnegie Mellon,
      where my
      <TextLink
        text="senior thesis"
        href="https://paper.dropbox.com/doc/Stamper-An-Artboard-Oriented-Programming-Environment--Aur96RpoCsXsC76bFeRTFYSGAQ-QXtfMXshBFBNCu6iCtx2J"
        page="ABOUT"
      />
      was published at
      <TextLink text="CHI," href="https://chi2020.acm.org/" page="ABOUT" />
      at the world's premier HCI conference.
      <br className="sm:hidden" /> <br className="sm:hidden" />
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
      to a team of a dozen and more than 30 business clients, I'm now building
      the AI emotional support companion
      <TextLink text="Eve." href="https://eve.space/" page="ABOUT" />
    </p>
  )
}
