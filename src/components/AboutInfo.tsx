import { useTweaks } from "scaffold-tweaks"
import TextLink from "./TextLink"

const items = [
  <>
    I'm currently leading engineering for{" "}
    <TextLink text="Director" href="https://www.director.ai/" page="ABOUT" />{" "}
    at{" "}
    <TextLink
      text="Browserbase"
      href="https://www.browserbase.com/"
      page="ABOUT"
    />
  </>,
  <>
    I studied Design & CS at Carnegie Mellon, where I built an{" "}
    <TextLink
      text="artboard oriented IDE"
      href="https://twitter.com/supercgeek/status/1230163240815955968"
      page="ABOUT"
    />{" "}
    featured at{" "}
    <TextLink
      text="CHI"
      href="https://en.wikipedia.org/wiki/Conference_on_Human_Factors_in_Computing_Systems"
      page="ABOUT"
    />
    , the world's premiere HCI conference
  </>,
  <>
    I've worked at{" "}
    <TextLink text="Apple," href="https://www.apple.com/iwork/" page="ABOUT" />
    <TextLink
      text="Google,"
      href="https://www.google.com/travel/"
      page="ABOUT"
    />{" "}
    and scaled{" "}
    <TextLink text="Avenue" href="https://avenue.app/" page="ABOUT" /> (acquired
    by Clay) as founding engineer
  </>,
  <>
    Lately, I've enjoyed hosting{" "}
    <TextLink
      text="events"
      href="https://x.com/i/trending/1992484272687771743"
      page="ABOUT"
    />{" "}
    for the women of San Francisco —{" "}
    <TextLink text="DM me" href="https://x.com/maayanalbert" page="ABOUT" /> if
    you'd like to come to the next one :)
  </>,
]

function PraseLayout() {
  return (
    <ul className="list-none pl-0 space-y-5">
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  )
}

function CardsLayout() {
  return (
    <div className="flex flex-col gap-3">
      {items.map((item, i) => (
        <div
          key={i}
          className="border border-neutral-200 rounded-lg px-4 py-3 bg-white"
        >
          {item}
        </div>
      ))}
    </div>
  )
}

function TimelineLayout() {
  return (
    <div className="relative pl-6">
      <div className="absolute left-[7px] top-2 bottom-2 w-px bg-neutral-200" />
      <div className="flex flex-col gap-6">
        {items.map((item, i) => (
          <div key={i} className="relative">
            <div className="absolute -left-[25px] top-[6px] w-[9px] h-[9px] rounded-full border-2 border-neutral-400 bg-white" />
            {item}
          </div>
        ))}
      </div>
    </div>
  )
}

function CompactLayout() {
  return (
    <div className="flex flex-col divide-y divide-neutral-200">
      {items.map((item, i) => (
        <div key={i} className="py-3 first:pt-0 last:pb-0">
          {item}
        </div>
      ))}
    </div>
  )
}

export function AboutInfo() {
  const { getValue } = useTweaks()
  const layout = getValue("aboutLayout") as string

  if (layout === "cards") return <CardsLayout />
  if (layout === "timeline") return <TimelineLayout />
  if (layout === "compact") return <CompactLayout />
  return <PraseLayout />
}
