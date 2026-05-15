import { useTweaks } from "./TweaksContext"
import {
  TweaksPanelShell,
  Section,
  Field,
  SelectControl,
  SliderControl,
} from "./TweaksPrimitives"

export type Combo = {
  label: string
  heading: string
  body: string
  blurb: string
}

export const COMBOS: Record<string, Combo> = {
  current: {
    label: "Current — Helvetica Neue / Helvetica Neue",
    heading: '"Helvetica Neue", Helvetica, Arial, sans-serif',
    body: '"Helvetica Neue", Helvetica, Arial, sans-serif',
    blurb:
      "Neutral and consistent — the same voice everywhere. Dependable, but doesn't use type to create hierarchy or personality. Good baseline to compare against.",
  },
  helvetica: {
    label: "Helvetica / Helvetica",
    heading: "Helvetica, Arial, sans-serif",
    body: "Helvetica, Arial, sans-serif",
    blurb:
      "The original — slightly wider and more open than Neue. Has a warmth and imperfection that Neue optimised away. Feels vintage in the best sense on a personal site.",
  },
  futura: {
    label: "Futura / Futura",
    heading: 'Futura, "Century Gothic", sans-serif',
    body: 'Futura, "Century Gothic", sans-serif',
    blurb:
      "Geometric and forward-looking — the circular forms give it a timeless optimism that's hard to fake. Can read as cold at body sizes; works best when the content has confidence to match.",
  },
  futuraInter: {
    label: "Futura / Inter",
    heading: 'Futura, "Century Gothic", sans-serif',
    body: '"Inter", sans-serif',
    blurb:
      "Distinctive geometric heading that hands off to a practical, highly-legible body. The contrast between Futura's personality and Inter's utility works well — the heading gets the character, the body stays out of the way.",
  },
  editorial: {
    label: "Editorial — Playfair / Inter",
    heading: '"Playfair Display", serif',
    body: '"Inter", sans-serif',
    blurb:
      "High-contrast serif heading paired with a crisp UI sans for body. The contrast signals a literary, considered sensibility. Can tip into over-designed if the content doesn't match the register.",
  },
  modern: {
    label: "Modern — Space Grotesk / DM Sans",
    heading: '"Space Grotesk", sans-serif',
    body: '"DM Sans", sans-serif',
    blurb:
      "Two geometric sans-serifs that share DNA but have enough difference in weight and personality to create readable hierarchy. Feels contemporary and technical without being cold.",
  },
  warm: {
    label: "Warm — Plus Jakarta / DM Sans",
    heading: '"Plus Jakarta Sans", sans-serif',
    body: '"DM Sans", sans-serif',
    blurb:
      "Refined heading with rounded, approachable body text. Both have warmth built into their proportions — works well for a personal site that wants to feel human rather than corporate.",
  },
  expressive: {
    label: "Expressive — Playfair / Plus Jakarta",
    heading: '"Playfair Display", serif',
    body: '"Plus Jakarta Sans", sans-serif',
    blurb:
      "Serif heading with a contemporary geometric body. More expressive than Editorial — the body font's personality keeps it from feeling too formal. Strong for building a distinct voice.",
  },
  minimal: {
    label: "Minimal — Inter / Inter",
    heading: '"Inter", sans-serif',
    body: '"Inter", sans-serif',
    blurb:
      "Pure utility — Inter everywhere. Extremely legible and familiar, lets the content and layout do all the work. Falls flat without strong sizing contrast between heading and body.",
  },
  friendly: {
    label: "Friendly — DM Sans / DM Sans",
    heading: '"DM Sans", sans-serif',
    body: '"DM Sans", sans-serif',
    blurb:
      "Geometric and warm throughout — the rounded details give the whole page a consistent approachability. Works best when you want a personal, unhurried feel rather than technical precision.",
  },
  dmInter: {
    label: "Sharp — DM Sans / Inter",
    heading: '"DM Sans", sans-serif',
    body: '"Inter", sans-serif',
    blurb:
      "Warm expressive heading that hands off to a clean utilitarian body. The contrast is subtle — both are geometric sans — but effective for a site that wants personality in headlines without sacrificing readability.",
  },
}

const COMBO_OPTIONS = Object.entries(COMBOS).map(([value, { label }]) => ({
  label,
  value,
}))

export const DEFAULT_LINE_HEIGHT = 1.4

export default function TweaksPanel() {
  const { tweaks, setTweak } = useTweaks()
  const combo = tweaks.fontCombo ?? "current"
  const { blurb } = COMBOS[combo]
  const lineHeight = tweaks.lineHeight ? Number(tweaks.lineHeight) : DEFAULT_LINE_HEIGHT

  return (
    <TweaksPanelShell>
      <Section label="Typography">
        <Field label="Font pairing" blurb={blurb}>
          <SelectControl
            options={COMBO_OPTIONS}
            value={combo}
            onChange={(v) => setTweak("fontCombo", v)}
          />
        </Field>
        <Field
          label="Line height"
          blurb={
            lineHeight < 1.3
              ? "Very tight — creates density and urgency. Works for short bursts of text but fatigues quickly in longer passages."
              : lineHeight < 1.5
              ? "Compact and efficient — close to the browser default. Feels natural for short copy; can feel cramped on longer lines."
              : lineHeight < 1.7
              ? "Comfortable reading rhythm — gives each line room to breathe without feeling sparse. Good default for most body copy."
              : "Airy and open — adds a relaxed, editorial quality. Works well with large type; can feel unanchored with small or dense text."
          }
        >
          <SliderControl
            min={1.1}
            max={2.0}
            step={0.05}
            value={lineHeight}
            onChange={(v) => setTweak("lineHeight", String(v))}
          />
        </Field>
      </Section>
    </TweaksPanelShell>
  )
}
