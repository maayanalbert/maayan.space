import TextLink from "./TextLink"
import { useToggles } from "toggletation"

const HERO_COPY: Record<string, string> = {
  current: "I make simple, useful, and slightly magical tools for humans.",
  minimal: "I make tools.",
  inevitable: "I build things that feel like they should have always existed. Small software, made with care.",
  focused:
    "I design and build software products from scratch — the kind that are small, useful, and feel considered. Not bloated. Not rushed. Just the right thing, done well.",
  attention: "I build tools that respect your attention.",
  craft: "I make software the way a good carpenter makes furniture — built to last, nothing wasted, satisfying to use.",
  question: "What if software felt more like a well-sharpened pencil than a Swiss Army knife? That's what I'm trying to find out.",
  human: "I build tools for people who notice when things are done well.",
  quiet: "Small software. Considered, not clever.",
}

export function DefaultInfo() {
  const { getValue } = useToggles()
  const heroCopy = getValue("heroCopy") as string

  return (
    <p className="sm:text-[26px] text-xl" style={{ lineHeight: "var(--line-height, 1.4)" }}>
      {HERO_COPY[heroCopy] ?? HERO_COPY.current}
      {" "}Inspirations include
      <TextLink
        text="the Macintosh"
        href="https://folklore.org/0-index.html"
        page="DEFAULT"
      />{" "}
      and classic hits like the
      <TextLink
        text="paperclip and zipper"
        href="https://www.penguinrandomhouse.com/books/130244/the-evolution-of-useful-things-by-henry-petroski/"
        page="DEFAULT"
      />
      .
    </p>
  )
}
