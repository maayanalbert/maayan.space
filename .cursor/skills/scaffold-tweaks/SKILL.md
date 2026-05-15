---
name: scaffold-tweaks
description: >-
  Build live design-variant panels using the scaffold-tweaks package.
  Use proactively whenever the user asks for variants, alternatives, or options
  of any kind — layout, colour, typography, density, style — even if they don't
  mention a tweaks panel explicitly.
---

# scaffold-tweaks

npm package at `packages/scaffold-tweaks`. Import from `'scaffold-tweaks'`.

## Setup (already wired in `_app.tsx`)

`TweaksProvider` wraps the app and receives a `fields: FieldDef[]` array.
`TweaksPanel` renders automatically — no panel content to write.

```tsx
import { TweaksProvider, TweaksPanel, type FieldDef } from 'scaffold-tweaks'

const fields: FieldDef[] = [ /* ... */ ]

<TweaksProvider fields={fields}>
  {children}
  <TweaksPanel />
</TweaksProvider>
```

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
  value: string | number   // slider values are numbers; others are strings
  label?: string           // display label for select/segmented (falls back to value)
  explanation: string      // honest trade-off assessment of THIS option — what it's good for and where it falls short
  current: boolean         // true = original design baseline (exactly one per field)
}
```

**Rules:**
1. Exactly one option per field must have `current: true`. Its value becomes the initial state.
2. Every `explanation` must assess the *currently selected* option — trade-offs, not a visual description.
3. For sliders, put one option with the default value and `current: true`. The explanation updates from the panel context (write blurbs for different ranges if needed, or one general one).

## Consuming state — three tiers

Pick the right tier for what the tweak affects:

### Tier 1 — Conditional rendering / logic
```tsx
import { useTweaks } from 'scaffold-tweaks'

const { getValue } = useTweaks()
const view = getValue('view')
return view === 'grid' ? <Grid items={items} /> : <List items={items} />
```

### Tier 2 — Whole component swap
```tsx
import { useVariant } from 'scaffold-tweaks'

const Card = useVariant('cardStyle', {
  default: DefaultCard,
  elevated: ElevatedCard,
  minimal: MinimalCard,
})
return <Card {...props} />
```
Returns the component constructor for the current field value. Falls back to the first entry if the value isn't in the map.

### Tier 3 — CSS custom property
```tsx
const { getValue } = useTweaks()
useEffect(() => {
  document.documentElement.style.setProperty('--line-height', getValue('lineHeight'))
}, [getValue('lineHeight')])
```

## Full example

```tsx
const fields: FieldDef[] = [
  {
    fieldId: 'view',
    type: 'segmented',
    name: 'View',
    category: 'Layout',
    options: [
      { value: 'grid', explanation: 'Good for visual browsing and quick orientation. Harder to compare specific details side by side.', current: true },
      { value: 'list', explanation: 'Good for comparing items line by line when titles and metadata matter more than visuals. Gets unwieldy if the list grows long.', current: false },
    ],
  },
  {
    fieldId: 'cardStyle',
    type: 'segmented',
    name: 'Card style',
    category: 'Layout',
    options: [
      { value: 'default', explanation: 'Neutral baseline — works for most content without adding opinion.', current: true },
      { value: 'elevated', explanation: 'Adds depth and premium feel. Can feel cluttered when cards are dense.', current: false },
    ],
  },
]
```
