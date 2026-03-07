import TextLink from "./TextLink"

export function AboutInfo() {
  return (
    <ul className="list-none pl-0 space-y-5">
      <li className="">
        I'm currently leading engineering for
        <TextLink
          text="Director"
          href="https://www.director.ai/"
          page="ABOUT"
        />{" "}
        at
        <TextLink
          text="Browserbase"
          href="https://www.browserbase.com/"
          page="ABOUT"
        />
      </li>
      <li className="">
        I studied Design & CS at Carnegie Mellon, where I built an
        <TextLink
          text="artboard oriented IDE"
          href="https://twitter.com/supercgeek/status/1230163240815955968"
          page="ABOUT"
        />{" "}
        featured at
        <TextLink
          text="CHI"
          href="https://en.wikipedia.org/wiki/Conference_on_Human_Factors_in_Computing_Systems"
          page="ABOUT"
        />
        , the world's premiere HCI conference
      </li>
      <li className="">
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
        />{" "}
        and scaled
        <TextLink text="Avenue" href="https://avenue.app/" page="ABOUT" /> {""}
        (acquired by Clay) as founding engineer
      </li>
      <li className="">
        Lately, I've enjoyed hosting
        <TextLink
          text="events"
          href="https://x.com/i/trending/1992484272687771743"
          page="ABOUT"
        />{" "}
        {""}
        for the women of San Francisco —
        <TextLink
          text="DM me"
          href="https://x.com/maayanalbert"
          page="ABOUT"
        />{" "}
        if you'd like to come to the next one :)
      </li>
    </ul>
  )
}
