import { PageContextProvider } from "@/InfoContext"
import "@/styles/globals.css"
import type { AppProps } from "next/app"
import "@/styles/moab-styles.css"
import { useEffect } from "react"
import {
  TogglesProvider,
  TogglesPanel,
  useToggles,
  type FieldDef,
} from "toggletation"

const FONT_FAMILIES: Record<string, { heading: string; body: string }> = {
  current: {
    heading: '"Helvetica Neue", Helvetica, Arial, sans-serif',
    body: '"Helvetica Neue", Helvetica, Arial, sans-serif',
  },
  helvetica: {
    heading: "Helvetica, Arial, sans-serif",
    body: "Helvetica, Arial, sans-serif",
  },
  futura: {
    heading: 'Futura, "Century Gothic", sans-serif',
    body: 'Futura, "Century Gothic", sans-serif',
  },
  futuraInter: {
    heading: 'Futura, "Century Gothic", sans-serif',
    body: '"Inter", sans-serif',
  },
  editorial: {
    heading: '"Playfair Display", serif',
    body: '"Inter", sans-serif',
  },
  modern: {
    heading: '"Space Grotesk", sans-serif',
    body: '"DM Sans", sans-serif',
  },
  warm: {
    heading: '"Plus Jakarta Sans", sans-serif',
    body: '"DM Sans", sans-serif',
  },
  expressive: {
    heading: '"Playfair Display", serif',
    body: '"Plus Jakarta Sans", sans-serif',
  },
  minimal: { heading: '"Inter", sans-serif', body: '"Inter", sans-serif' },
  friendly: { heading: '"DM Sans", sans-serif', body: '"DM Sans", sans-serif' },
  dmInter: {
    heading: '"DM Sans", sans-serif',
    body: '"Inter", sans-serif',
  },
}

const fields: FieldDef[] = [
  {
    fieldId: "aboutLayout",
    type: "segmented",
    name: "Layout",
    category: "About",
    options: [
      {
        value: "prose",
        label: "Prose",
        explanation:
          "Flowing list — each item reads like a sentence in a paragraph. Feels conversational and unpretentious.\n\nItems compete for visual weight when there are four.",
        current: true,
      },
      {
        value: "cards",
        label: "Cards",
        explanation:
          "Each item gets its own contained box. Creates clear separation and equal visual weight per item.\n\nCan feel heavier and more corporate than the content warrants.",
        current: false,
      },
      {
        value: "timeline",
        label: "Timeline",
        explanation:
          "Left spine with dot markers — implies a narrative arc and chronological reading. Adds structure and momentum.\n\nWorks best when the items actually follow a sequence.",
        current: false,
      },
      {
        value: "compact",
        label: "Compact",
        explanation:
          "Tight divider-separated rows — maximum density with minimum decoration. Lets the text do all the work.\n\nFeels focused and editorial; the links carry the accent colour load.",
        current: false,
      },
    ],
  },
  {
    fieldId: "fontCombo",
    type: "select",
    name: "Font pairing",
    category: "Typography",
    options: [
      {
        value: "current",
        label: "Current — Helvetica Neue / Helvetica Neue",
        explanation:
          "Neutral and consistent — the same voice everywhere. Dependable.\n\nDoesn't use type to create hierarchy or personality. Good baseline to compare against.",
        current: true,
      },
      {
        value: "helvetica",
        label: "Helvetica / Helvetica",
        explanation:
          "The original — slightly wider and more open than Neue. Has a warmth and imperfection that Neue optimised away. Feels vintage in the best sense on a personal site.",
        current: false,
      },
      {
        value: "futura",
        label: "Futura / Futura",
        explanation:
          "Geometric and forward-looking — the circular forms give it a timeless optimism that's hard to fake.\n\nCan read as cold at body sizes; works best when the content has confidence to match.",
        current: false,
      },
      {
        value: "futuraInter",
        label: "Futura / Inter",
        explanation:
          "Distinctive geometric heading that hands off to a practical, highly-legible body. The contrast between Futura's personality and Inter's utility works well.",
        current: false,
      },
      {
        value: "editorial",
        label: "Editorial — Playfair / Inter",
        explanation:
          "High-contrast serif heading paired with a crisp UI sans for body. The contrast signals a literary, considered sensibility.\n\nCan tip into over-designed if the content doesn't match the register.",
        current: false,
      },
      {
        value: "modern",
        label: "Modern — Space Grotesk / DM Sans",
        explanation:
          "Two geometric sans-serifs that share DNA but have enough difference in weight and personality to create readable hierarchy. Feels contemporary and technical without being cold.",
        current: false,
      },
      {
        value: "warm",
        label: "Warm — Plus Jakarta / DM Sans",
        explanation:
          "Refined heading with rounded, approachable body text. Both have warmth built into their proportions — works well for a personal site that wants to feel human rather than corporate.",
        current: false,
      },
      {
        value: "expressive",
        label: "Expressive — Playfair / Plus Jakarta",
        explanation:
          "Serif heading with a contemporary geometric body. More expressive than Editorial — the body font's personality keeps it from feeling too formal. Strong for building a distinct voice.",
        current: false,
      },
      {
        value: "minimal",
        label: "Minimal — Inter / Inter",
        explanation:
          "Pure utility — Inter everywhere. Extremely legible and familiar, lets the content and layout do all the work.\n\nFalls flat without strong sizing contrast between heading and body.",
        current: false,
      },
      {
        value: "friendly",
        label: "Friendly — DM Sans / DM Sans",
        explanation:
          "Geometric and warm throughout — the rounded details give the whole page a consistent approachability. Works best when you want a personal, unhurried feel rather than technical precision.",
        current: false,
      },
      {
        value: "dmInter",
        label: "Sharp — DM Sans / Inter",
        explanation:
          "Warm expressive heading that hands off to a clean utilitarian body. The contrast is subtle — both are geometric sans — but effective for a site that wants personality in headlines without sacrificing readability.",
        current: false,
      },
    ],
  },
  {
    fieldId: "lineHeight",
    type: "slider",
    name: "Line height",
    category: "Typography",
    min: 1.1,
    max: 2.0,
    step: 0.05,
    options: [
      {
        value: 1.1,
        explanation:
          "Lines sit right on top of each other. Only works for large display headings you want to feel like a single unit.\n\nUnreadable at body sizes.",
        current: false,
      },
      {
        value: 1.25,
        explanation:
          "Compact — works for UI labels and short captions where vertical space matters.\n\nParagraphs blur together; readers have to work harder to track across lines.",
        current: false,
      },
      {
        value: 1.4,
        explanation:
          "Comfortable reading rhythm — gives each line room to breathe without feeling sparse.\n\nGood default for most body copy.",
        current: true,
      },
      {
        value: 1.65,
        explanation:
          "Relaxed and spacious — reads well for longer prose and gives the page an airy quality.\n\nCan feel loose for short paragraphs; the page may look underfull.",
        current: false,
      },
      {
        value: 1.9,
        explanation:
          "Very open — approaching double-spaced. Creates a deliberate, literary quality.\n\nParagraphs lose their sense of cohesion; works better for pull quotes than flowing body text.",
        current: false,
      },
    ],
  },
]

function TweaksCSSSync() {
  const { getValue } = useToggles()
  const fontCombo = getValue("fontCombo")
  const lineHeight = getValue("lineHeight")

  useEffect(() => {
    const fonts = FONT_FAMILIES[fontCombo] ?? FONT_FAMILIES.current
    document.documentElement.style.setProperty("--font-heading", fonts.heading)
    document.documentElement.style.setProperty("--font-body", fonts.body)
  }, [fontCombo])

  useEffect(() => {
    if (lineHeight) {
      document.documentElement.style.setProperty("--line-height", lineHeight)
    }
  }, [lineHeight])

  return null
}
export default function App({ Component, pageProps }: AppProps) {
  return (
    <TogglesProvider fields={fields}>
      <TweaksCSSSync />
      {/* @ts-ignore */}
      <PageContextProvider>
        {/* @ts-ignore */}
        <Component {...pageProps} />
      </PageContextProvider>
      {process.env.NODE_ENV === "development" && <TogglesPanel />}
    </TogglesProvider>
  )
}
