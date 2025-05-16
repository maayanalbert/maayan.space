import TextLink from "./TextLink"

export function AboutInfo() {
  return (
    <p>
      I studied Design & CS at
      <TextLink
        text="Carnegie Mellon,"
        href="https://maayan-albert.squarespace.com/"
        page="ABOUT"
      />
      where I built an
      <TextLink
        text="IDE"
        href="https://paper.dropbox.com/doc/Stamper-An-Artboard-Oriented-Programming-Environment--Aur96RpoCsXsC76bFeRTFYSGAQ-QXtfMXshBFBNCu6iCtx2J"
        page="ABOUT"
      />
      that was featured at the world's premier
      <TextLink
        text="HCI conference"
        href="https://en.wikipedia.org/wiki/Conference_on_Human_Factors_in_Computing_Systems"
        page="ABOUT"
      />
      and
      <TextLink
        text="went viral"
        href="https://twitter.com/supercgeek/status/1230163240815955968"
        page="ABOUT"
      />
      on Twitter. <br className="sm:hidden" /> <br className="sm:hidden" />
      I've worked at
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
      and scaled
      <TextLink text="Avenue" href="https://avenue.app/" page="ABOUT" />
      as their founding engineer. I recently spent some time
      <TextLink
        text="hacking"
        href="https://www.tldraw.com/p/HFrtxo9YyXzDhVlVbFJ8F?d=v-1629.-1327.5286.3311.GELXZ5GWGZegoyQ0p-DLR"
        page="ABOUT"
      />
      on several projects, and am now interested in finding ways to close the
      gap between design, engineering, and emergent AI.
    </p>
  )
}
