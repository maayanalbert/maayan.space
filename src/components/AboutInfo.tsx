import TextLink from "./TextLink"

export function AboutInfo() {
  return (
    <p>
      I'm leading engineering for
      <TextLink text="Director" href="https://www.director.ai/" page="ABOUT" />
      at
      <TextLink
        text="Browserbase."
        href="https://www.browserbase.com/"
        page="ABOUT"
      />
      We're currently
      <TextLink
        text="hiring"
        href="https://jobs.ashbyhq.com/browserbase/887f4a45-077f-4994-a3f1-eae9a2231e57"
        page="ABOUT"
      />{" "}
      so reach out if you're a strong backend engineer! I studied Design & CS at
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
      (acquired by Clay) as their founding engineer. In my spare time, I've
      prototyped some
      <TextLink
        text="AI experiments"
        href="https://projects.maayan.space/"
        page="ABOUT"
      />
      in several spaces. My newest hobby is hosting
      <TextLink
        text="events"
        href="https://x.com/i/trending/1992484272687771743"
        page="ABOUT"
      />
      for the women of San Francisco.{" "}
      <TextLink text="DM me" href="https://x.com/maayanalbert" page="ABOUT" />{" "}
      if you'd like to come to the next one :)
    </p>
  )
}
