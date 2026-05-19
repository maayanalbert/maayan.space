---
name: toggletation
description: >-
  Build live design-variant panels using the toggletation package.
  Use proactively whenever the user asks for variants, alternatives, or options
  of any kind — layout, colour, typography, density, style — even if they don't
  mention a tweaks panel explicitly.
---

# toggletation

Import from `'toggletation'`.

## Setup

`TogglesProvider` wraps the app and receives a `fields: FieldDef[]` array.
`TogglesPanel` renders automatically — no panel content to write.

```tsx
import { TogglesProvider, TogglesPanel, type FieldDef } from 'toggletation'

const fields: FieldDef[] = [ /* ... */ ]

<TogglesProvider fields={fields}>
  {children}
  {process.env.NODE_ENV === "development" && <TogglesPanel />}
</TogglesProvider>
```

### `defaults` prop — promoting panel selections to code

`TogglesProvider` accepts an optional `defaults` prop that overrides `current: true` at init without touching the `fields` array:

```tsx
<TogglesProvider fields={fields} defaults={{ linkStyle: "highlight", lineHeight: 1.6 }}>
```

Only supply fields you want to change from their baseline — omitted fields fall back to `current: true`.

**Workflow:** tweak in the panel → click the save button next to the dials icon → paste the copied snippet as the `defaults` prop. See [Saving selections](#saving-selections) below.

## Saving selections

The panel has two built-in affordances for working with state:

### localStorage persistence

All selections are automatically persisted to `localStorage` under the key `toggletation-state`. The panel restores your last selections on every reload. New fields added to the `fields` array start at their `current: true` value regardless.

### Modified indicators

Any field whose live value differs from its `current: true` baseline turns **blue** — the selected segment label, select text, or slider value label. This gives you a at-a-glance diff of what has drifted from the coded baseline.

### Save button

When any field is modified a save button (bookmark icon) appears to the inward side of the dials toggle button. Clicking it:

1. Copies a ready-to-paste snippet to clipboard:
   ```
   defaults={{
     linkStyle: "highlight",
     lineHeight: 1.6
   }}
   ```
2. Shows a brief checkmark confirmation.

Paste the snippet into `TogglesProvider` as the `defaults` prop. The field definitions (`fields` array) never need to change.

## Defining fields

Each field maps to one control in the panel. Three control types:

```ts
// Segmented toggle (2–4 short options)
{ fieldId: 'view', type: 'segmented', name: 'View', category: 'Layout', options: [...] }

// Select dropdown (many options or long labels)
{ fieldId: 'fontCombo', type: 'select', name: 'Font pairing', category: 'Typography', options: [...] }

// Slider (continuous numeric range)
{ fieldId: 'lineHeight', type: 'slider', name: 'Line height', category: 'Typography',
  min: 1.1, max: 2.0, step: 0.05, options: [...] }
```

`category` groups fields into sections. Multiple fields can share a category.

## Defining options

```ts
type Option = {
  value: string | number // slider values are numbers; others are strings
  label?: string // display label for select/segmented (falls back to value)
  explanation: string // honest trade-off assessment of THIS option — what it's good for and where it falls short
  current: boolean // true = original design baseline (exactly one per field)
}
```

**Rules:**

1. Exactly one option per field must have `current: true`. Its value becomes the initial state.
2. Every `explanation` must assess the _currently selected_ option — trade-offs, not a visual description.
3. For sliders, add multiple options at representative points across the range. The panel picks the nearest one by value as the slider moves — explanations update dynamically as the user drags.

### Multi-paragraph explanations

Use `\n\n` to separate the good and bad parts of an explanation. The panel renders them as two distinct paragraphs with a gap:

```ts
explanation: "What this option does well — its character and strengths.\n\nWhere it falls short or what it requires to work."
```

## Explanation style

Field explanations use a collapsible chevron toggle. Each field is collapsed by default; clicking the chevron expands the explanation beneath the control. No other style should be used.

## Consuming state — three tiers

Pick the right tier for what the tweak affects:

### Tier 1 — Conditional rendering / logic

```tsx
import { useToggles } from "toggletation"

const { getValue } = useToggles()
const view = getValue("view")
return view === "grid" ? <Grid items={items} /> : <List items={items} />
```

### Tier 2 — Whole component swap

```tsx
import { useVariant } from "toggletation"

const Card = useVariant("cardStyle", {
  default: DefaultCard,
  elevated: ElevatedCard,
  minimal: MinimalCard,
})
return <Card {...props} />
```

Returns the component constructor for the current field value. Falls back to the first entry if the value isn't in the map.

### Tier 3 — CSS custom property

```tsx
const { getValue } = useToggles()
useEffect(() => {
  document.documentElement.style.setProperty(
    "--line-height",
    getValue("lineHeight")
  )
}, [getValue("lineHeight")])
```

**No-flash rule:** `useEffect` runs after the first paint, so the CSS variable is unset on the initial render. Whenever a Tier 3 field is promoted to `defaults`, also set the matching CSS variable in `:root` to that same value. This makes the first paint correct and eliminates the flash.

```css
/* globals.css — keep in sync with the defaults prop */
:root {
  --line-height: 1.6; /* matches defaults={{ lineHeight: 1.6 }} */
}
```

## Full example

```tsx
const fields: FieldDef[] = [
  {
    fieldId: "view",
    type: "segmented",
    name: "View",
    category: "Layout",
    options: [
      {
        value: "grid",
        explanation:
          "Good for visual browsing and quick orientation.\n\nHarder to compare specific details side by side.",
        current: true,
      },
      {
        value: "list",
        explanation:
          "Good for comparing items line by line when titles and metadata matter more than visuals.\n\nGets unwieldy if the list grows long.",
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
          "Very tight — only works for large display headings.\n\nUnreadable at body sizes.",
        current: false,
      },
      {
        value: 1.4,
        explanation:
          "Comfortable reading rhythm — gives each line room to breathe.\n\nGood default for most body copy.",
        current: true,
      },
      {
        value: 1.9,
        explanation:
          "Very open — approaching double-spaced. Creates an airy quality.\n\nParagraphs lose cohesion at this density.",
        current: false,
      },
    ],
  },
]
```
