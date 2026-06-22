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
    fieldId: "heroLayout",
    type: "segmented",
    name: "Header layout",
    category: "Layout",
    options: [
      {
        value: "stacked",
        label: "Stacked",
        explanation:
          "Large heading anchored at the top with body copy floated below — the heading acts almost like a poster element. Maximum emphasis on the name.\n\nThe gap between heading and body can feel disconnected on taller viewports.",
        current: true,
      },
      {
        value: "split",
        label: "Split",
        explanation:
          "Heading on the left column, body on the right — name and context live side by side at a glance. Creates a clear, balanced two-part read.\n\nNeeds a wide viewport to breathe; collapses to stacked on mobile.",
        current: false,
      },
      {
        value: "tight",
        label: "Tight",
        explanation:
          "Heading and body in the same vertical flow with a minimal gap — reads more like a single introduction than two separate elements.\n\nReduces the visual drama of the heading; works best when the body copy is short.",
        current: false,
      },
    ],
  },
  {
    fieldId: "heroCopy",
    type: "select",
    name: "Hero copy",
    category: "Copy",
    options: [
      {
        value: "current",
        label: "Whimsical — simple, useful, slightly magical",
        explanation:
          "Warm and a little playful — 'slightly magical' signals craft and care without taking itself too seriously.\n\nThe word 'magical' might read as vague to someone looking for specifics.",
        current: true,
      },
      {
        value: "minimal",
        label: "Ultra-short — I make tools.",
        explanation:
          "Three words. Lets the rest of the page do the explaining. Maximum confidence.\n\nMight read as abrupt or incomplete before the reader sees the rest.",
        current: false,
      },
      {
        value: "inevitable",
        label: "Two-sentence — should have always existed",
        explanation:
          "Adds a second beat — 'Small software, made with care' — that grounds the slightly abstract first sentence with something concrete and personal.\n\nTwo sentences means more text to absorb before the links.",
        current: false,
      },
      {
        value: "focused",
        label: "Long — not bloated, not rushed",
        explanation:
          "Three sentences that build a case — what the work is, what it isn't, and what it aims for. More room to set tone and filter for the right audience.\n\nThe longest option; risks losing readers who scan rather than read.",
        current: false,
      },
      {
        value: "attention",
        label: "Poetic — tools that respect your attention",
        explanation:
          "Frames the work through the user's experience — attention as the thing being protected. Quiet and considered.\n\nCould read as abstract to someone unfamiliar with the attention-economy framing.",
        current: false,
      },
      {
        value: "craft",
        label: "Analogy — software like furniture",
        explanation:
          "A tactile metaphor that grounds abstract software work in physical craft. 'Built to last, nothing wasted' is concrete and memorable.\n\nThe carpenter analogy is well-worn — works best if the rest of the site has a similarly considered, material feel.",
        current: false,
      },
      {
        value: "question",
        label: "Question — pencil vs. Swiss Army knife",
        explanation:
          "Opens with a question that positions the work as an ongoing investigation rather than a solved problem. The pencil/knife contrast is crisp and immediately legible.\n\nA question can feel unresolved — some readers want a declaration, not a provocation.",
        current: false,
      },
      {
        value: "human",
        label: "Audience — for people who notice",
        explanation:
          "Implicitly flatters the reader — if you're reading this, you're probably someone who notices. Filters for the right audience by describing them.\n\nSelf-selecting framing can read as exclusive if the tone elsewhere isn't warm enough to balance it.",
        current: false,
      },
      {
        value: "quiet",
        label: "Ultra-short — small software, considered not clever",
        explanation:
          "Two fragments. Maximal compression — 'considered, not clever' does a lot of work in four words, pushing back against the industry's obsession with cleverness.\n\nRequires confidence; anything that follows needs to live up to the restraint.",
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
    fieldId: "linkStyle",
    type: "segmented",
    name: "Link style",
    category: "Typography",
    options: [
      {
        value: "color",
        label: "Color",
        explanation:
          "The link announces itself by hue alone — no decoration interrupts the reading line. Very clean.\n\nEntirely dependent on colour perception; invisible to users with colour blindness or in bright ambient light.",
        current: true,
      },
      {
        value: "underline",
        label: "Underline",
        explanation:
          "A persistent underline makes links universally scannable without relying on colour. Offset keeps it clear of descenders.\n\nAdds visual noise in dense prose — every link competes for attention equally.",
        current: false,
      },
      {
        value: "highlight",
        label: "Highlight",
        explanation:
          "A faint background wash behind the link text — more marker than underline. Warm and editorial; works well at low link density.\n\nCan read as busy when links cluster close together.",
        current: false,
      },
      {
        value: "dotted",
        label: "Dotted",
        explanation:
          "A dotted underline signals interactive without the weight of a solid line — gentler and more conversational.\n\nDots can be hard to see at small sizes or on low-contrast displays.",
        current: false,
      },
    ],
  },
]

function TogglesCSSSync() {
  const { getValue } = useToggles()
  const fontCombo = getValue("fontCombo")

  useEffect(() => {
    const fonts = FONT_FAMILIES[fontCombo] ?? FONT_FAMILIES.current
    document.documentElement.style.setProperty("--font-heading", fonts.heading)
    document.documentElement.style.setProperty("--font-body", fonts.body)
  }, [fontCombo])

  return null
}
export default function App({ Component, pageProps }: AppProps) {
  return (
    <TogglesProvider fields={fields} defaults={{ fontCombo: "friendly", linkStyle: "highlight" }}>
      <TogglesCSSSync />
      {/* @ts-ignore */}
      <PageContextProvider>
        {/* @ts-ignore */}
        <Component {...pageProps} />
      </PageContextProvider>
      {process.env.NODE_ENV === "development" && <TogglesPanel />}
    </TogglesProvider>
  )
}
