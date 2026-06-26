import { PageContextProvider } from "@/InfoContext"
import "@/styles/globals.css"
import type { AppProps } from "next/app"
import "@/styles/moab-styles.css"
import { useEffect } from "react"
import LinkPreviewPrefetcher from "@/components/LinkPreviewPrefetcher"
import DevAppShell from "@/components/DevAppShell"
import { BROWSER_PREVIEW_ANIMS } from "@/lib/browserPreviewAnims"
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
  {
    fieldId: "linkHoverStyle",
    type: "select",
    name: "Link hover",
    category: "Typography",
    options: [
      {
        value: "fade",
        label: "Fade",
        explanation:
          "The quietest gesture — the link softens on hover without changing shape or colour. Keeps the reading line calm.\n\nCan feel inert if the rest of the page is already low-contrast; some users may not notice the state change.",
        current: true,
      },
      {
        value: "deepen",
        label: "Deepen",
        explanation:
          "Colour and saturation intensify on hover — the link feels more present without adding decoration.\n\nFilter-based darkening can look muddy on some accent colours; less effective on underlined styles where the line already carries weight.",
        current: false,
      },
      {
        value: "fill",
        label: "Fill",
        explanation:
          "Hover inverts the highlight — background becomes the accent colour and text goes white. Clear and decisive.\n\nThe strongest signal in the set; can feel loud when several links sit close together.",
        current: false,
      },
      {
        value: "pop",
        label: "Pop",
        explanation:
          "A tiny lift and soft shadow on hover — tactile without shouting. Works well with the highlight wash as a base.\n\nSubtle enough that touch devices never see it; shadow can clip if the link sits near a container edge.",
        current: false,
      },
      {
        value: "fillpop",
        label: "Fill + pop",
        explanation:
          "Combines the solid fill with the lift — the most expressive option, good for a single primary link.\n\nToo much motion and colour shift when many links cluster; best at low link density.",
        current: false,
      },
    ],
  },
  {
    fieldId: "linkPreviewStyle",
    type: "select",
    name: "Link preview",
    category: "Links",
    options: [
      {
        value: "none",
        label: "None",
        explanation:
          "No preview — the link behaves like a plain anchor. Quietest option for dense prose.\n\nVisitors can't peek at the destination before clicking.",
        current: true,
      },
      {
        value: "tooltip",
        label: "Tooltip — domain only",
        explanation:
          "A small dark tooltip with just the domain — minimal and fast to scan. Inspired by Asana field hints.\n\nNo title or description; less useful for ambiguous link text.",
        current: false,
      },
      {
        value: "card",
        label: "Card — favicon + title",
        explanation:
          "Compact white card with favicon, link text, and domain. Good balance of information and restraint — similar to Maze link previews.\n\nNo thumbnail or long description; feels utilitarian rather than editorial.",
        current: false,
      },
      {
        value: "notion",
        label: "Notion — with description",
        explanation:
          "Richer card with a short description and 'Link to web page' footer — feels like Notion's link mention preview.\n\nTaller popover; needs room below the link in the layout.",
        current: false,
      },
      {
        value: "gamma",
        label: "Rich — thumbnail block",
        explanation:
          "Thumbnail tile plus title and description — the most visual option, inspired by Gamma embed previews.\n\nLargest footprint; can feel heavy when several links sit close together.",
        current: false,
      },
      {
        value: "linear",
        label: "Context — status row",
        explanation:
          "Structured card with a status label and linked destination row — similar to Linear's dependency popovers.\n\nMore 'tool UI' than editorial; works best for external/project links.",
        current: false,
      },
      {
        value: "wikipedia",
        label: "Wikipedia — excerpt card",
        explanation:
          "Horizontal card with a thumbnail slot, blue title, and multi-line excerpt — like Wikipedia's link hovercards.\n\nThe widest option; thumbnail is a placeholder unless you wire real Open Graph images.",
        current: false,
      },
      {
        value: "wikipediaStripe",
        label: "Wikipedia — left stripe",
        explanation:
          "Same excerpt layout as Wikipedia, on a clean white card with a coloured spine on the left tied to the link accent.\n\nFeels integrated with the site's highlight links.",
        current: false,
      },
      {
        value: "wikipediaStripeTop",
        label: "Wikipedia — top stripe",
        explanation:
          "Accent stripe along the top edge only — like a cap on the preview card.\n\nSubtle anchor to the link colour without framing the whole card.",
        current: false,
      },
      {
        value: "wikipediaStripeBottom",
        label: "Wikipedia — bottom stripe",
        explanation:
          "Accent stripe along the bottom edge — sits just above the link when the preview opens.\n\nCreates a visual bridge between card and highlighted link text.",
        current: false,
      },
      {
        value: "wikipediaStripeBottomLeft",
        label: "Wikipedia — bottom + left",
        explanation:
          "L-shaped accent frame: stripe on the left and along the bottom.\n\nThe most tied-to-the-link option — corner emphasis without a full border.",
        current: false,
      },
      {
        value: "sticky",
        label: "Sticky note",
        explanation:
          "Yellow post-it with tape, slight tilt, and handwritten energy — like you annotated the page yourself.\n\nPlayful and human; clashes with very formal copy.",
        current: false,
      },
      {
        value: "terminal",
        label: "Terminal — curl output",
        explanation:
          "Fake shell session that 'curls' the URL and prints title and description as JSON.\n\nNiche but delightful for a technical audience; reads as inside joke.",
        current: false,
      },
      {
        value: "polaroid",
        label: "Polaroid snapshot",
        explanation:
          "Instant-film frame with OG image and a scrawled caption — memory-object, not UI chrome.\n\nWorks best when the destination has a strong thumbnail.",
        current: false,
      },
      {
        value: "ticket",
        label: "Ticket stub",
        explanation:
          "Perforated admission ticket with accent-coloured stub — 'ADMIT ONE' to the URL.\n\nTheatrical and fun; wide footprint.",
        current: false,
      },
      {
        value: "marginalia",
        label: "Marginalia",
        explanation:
          "Manuscript margin note with a curved arrow — like a scholar's aside in the page gutter.\n\nQuiet and literary; description-forward.",
        current: false,
      },
      {
        value: "receipt",
        label: "Thermal receipt",
        explanation:
          "Monospaced receipt with zig-zag tear edge — prints the link as a transaction.\n\nUnexpected and deadpan; narrow and tall.",
        current: false,
      },
      {
        value: "orbit",
        label: "Orbit portal",
        explanation:
          "Floating card inside a slowly spinning accent ring — sci-fi portal to the destination.\n\nThe most animated option; draws the eye.",
        current: false,
      },
      {
        value: "flip",
        label: "Flip card",
        explanation:
          "Hover the preview card itself to flip it — front shows the OG image, back reveals the title and description.\n\nA tactile 3D interaction.",
        current: false,
      },
      {
        value: "tilt",
        label: "Tilt / holographic",
        explanation:
          "Move your mouse across the preview card to tilt it in 3D perspective, with a sheen that follows your cursor — like a holographic trading card.",
        current: false,
      },
      {
        value: "typewriter",
        label: "Typewriter",
        explanation:
          "Domain, title, and description type out character by character as the preview appears.\n\nFeels alive; monospace aesthetic.",
        current: false,
      },
      {
        value: "filmstrip",
        label: "Filmstrip scrub",
        explanation:
          "Move your mouse left/right across the card to scrub through three panels: source → title → description.\n\nA novel information-reveal gesture.",
        current: false,
      },
      {
        value: "mac",
        label: "Macintosh",
        explanation:
          "A tiny classic Macintosh computer — beige case, carry handle, screen bezel, Mac OS window chrome, and a floppy drive slot.\n\nFun, memorable, and unmistakably retro.",
        current: false,
      },
      {
        value: "browser",
        label: "Browser (centered)",
        explanation:
          "A mini browser window with a captured screenshot of the site, horizontally centered above the link.",
        current: false,
      },
      {
        value: "browserLeft",
        label: "Browser (left)",
        explanation:
          "Same mini browser window with a screenshot preview, but left-aligned with the link instead of centered.",
        current: false,
      },
    ],
  },
  {
    fieldId: "browserPreviewAnim",
    type: "select",
    name: "Browser enter",
    category: "Links",
    options: BROWSER_PREVIEW_ANIMS.map((anim, index) => ({
      value: anim.value,
      label: anim.label,
      explanation: anim.explanation,
      current: index === 0,
    })),
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
  const isDev = process.env.NODE_ENV === "development"

  const page = (
    /* @ts-ignore */
    <PageContextProvider>
      {/* @ts-ignore */}
      <Component {...pageProps} />
    </PageContextProvider>
  )

  return (
    <TogglesProvider fields={fields} defaults={{ fontCombo: "friendly", linkStyle: "highlight" }}>
      <TogglesCSSSync />
      <LinkPreviewPrefetcher />
      {isDev ? (
        <DevAppShell>{page}</DevAppShell>
      ) : (
        page
      )}
      {isDev && <TogglesPanel />}
    </TogglesProvider>
  )
}
