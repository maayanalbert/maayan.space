# scaffold-tweaks

Live design-variant panels for React apps. Define fields, get a floating panel for free — no UI to write.

A draggable button sits in the corner of your app. Click it to open a panel with segmented controls, dropdowns, and sliders. Your components read the current values and re-render instantly.

## Install

```bash
npm install scaffold-tweaks
```

Peer deps: React ≥ 18.

## Setup

Wrap your app in `TweaksProvider` and drop in `TweaksPanel`:

```tsx
import { TweaksProvider, TweaksPanel, type FieldDef } from 'scaffold-tweaks'

const fields: FieldDef[] = [
  {
    fieldId: 'view',
    type: 'segmented',
    name: 'View',
    category: 'Layout',
    options: [
      { value: 'grid', explanation: 'Good for visual browsing.\n\nHarder to compare details.', current: true },
      { value: 'list', explanation: 'Good for comparing line by line.\n\nGets unwieldy when long.', current: false },
    ],
  },
]

export default function App({ children }) {
  return (
    <TweaksProvider fields={fields}>
      {children}
      <TweaksPanel />
    </TweaksProvider>
  )
}
```

## Defining fields

Three control types:

```ts
// Segmented toggle — 2–4 short options
{ fieldId: 'view', type: 'segmented', name: 'View', category: 'Layout', options: [...] }

// Select dropdown — many options or long labels
{ fieldId: 'font', type: 'select', name: 'Font pairing', category: 'Typography', options: [...] }

// Slider — continuous numeric range
{ fieldId: 'lineHeight', type: 'slider', name: 'Line height', category: 'Typography',
  min: 1.1, max: 2.0, step: 0.05, options: [...] }
```

`category` groups fields into labeled sections. Multiple fields can share a category.

## Options

```ts
type Option = {
  value: string | number  // numbers for sliders, strings for everything else
  label?: string          // display label (falls back to value)
  explanation: string     // trade-off assessment — what this option is good for and where it falls short
  current: boolean        // true = initial state (exactly one per field)
}
```

Separate the strengths and weaknesses with `\n\n` — the panel renders them as two paragraphs:

```ts
explanation: "Good for visual browsing and quick orientation.\n\nHarder to compare specific details side by side."
```

For sliders, add options at representative points across the range. The panel picks the nearest one as the slider moves, so explanations update dynamically while dragging.

## Consuming state

### Conditional logic

```tsx
import { useTweaks } from 'scaffold-tweaks'

const { getValue } = useTweaks()
const view = getValue('view')
return view === 'grid' ? <Grid items={items} /> : <List items={items} />
```

### Whole component swap

```tsx
import { useVariant } from 'scaffold-tweaks'

const Card = useVariant('cardStyle', {
  default: DefaultCard,
  elevated: ElevatedCard,
  minimal: MinimalCard,
})
return <Card {...props} />
```

Falls back to the first map entry if the current value isn't found.

### CSS custom property

```tsx
const { getValue } = useTweaks()
useEffect(() => {
  document.documentElement.style.setProperty('--line-height', getValue('lineHeight'))
}, [getValue('lineHeight')])
```

## Agent setup

The package ships with a `SKILL.md` — a plain-markdown file that tells AI coding assistants how to use scaffold-tweaks correctly. Copy it to the right place for your tool:

```bash
# Cursor
mkdir -p .cursor/skills/scaffold-tweaks
cp node_modules/scaffold-tweaks/SKILL.md .cursor/skills/scaffold-tweaks/SKILL.md

# Claude
cat node_modules/scaffold-tweaks/SKILL.md >> CLAUDE.md

# GitHub Copilot
cat node_modules/scaffold-tweaks/SKILL.md >> .github/copilot-instructions.md

# Windsurf
cat node_modules/scaffold-tweaks/SKILL.md >> .windsurfrules
```

Once wired up, your agent will proactively suggest tweaks panels whenever you ask for design variants, layout options, or style alternatives.
