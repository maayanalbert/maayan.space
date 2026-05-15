---
name: scaffold-tweaks
description: >-
  Build live design-variant panels using the scaffold's Tweaks system
  (TweaksContext, TweaksPrimitives, TweaksPanel). Use proactively whenever
  the user asks for variants, alternatives, or options of any kind — layout,
  colour, typography, density, style — even if they don't mention a tweaks
  panel explicitly.
---

# Scaffold Tweaks System

## The three files

| File | Role |
|---|---|
| `app/components/TweaksContext.tsx` | `Record<string,string>` store — `useTweaks()` / `setTweak(key, value)` |
| `app/components/TweaksPrimitives.tsx` | Building blocks: `TweaksPanelShell`, `Section`, `Field`, `SegmentedControl`, `SelectControl`, `SliderControl` |
| `app/components/TweaksPanel.tsx` | **Empty by default** (`return null`) — you write the content here |

The root layout already wraps the app in `<TweaksProvider>` and renders `<TweaksPanel />` — no wiring needed.

## When to build the panel

**Build it proactively** whenever the user asks for variants, alternatives, or options of any kind — layout choices, colour schemes, typography, density, card styles, etc. They don't need to say "tweaks panel". Keep `TweaksPanel` as `return null` only when there are genuinely no variants to expose.

## Authoring rules

1. **First option is always the current design.** Label it "Current" (or "Original"). Its value must reproduce exactly what's on screen when the user opens the panel — this gives a comparison baseline.

2. **All controls live inside `<Section>` components.** Never put controls directly inside `<TweaksPanelShell>`. Use one section per logical theme (e.g. "Typography", "Layout", "Colour"). Sections are collapsible.

3. **Every `<Field>` must have a `blurb` prop.** 1–2 sentences, honest trade-off assessment of the *currently selected* option — what it's good for and where it falls short. Not a visual description. Not bullet points. Updates dynamically as the user changes the control:

```tsx
blurb={{
  default: 'Good default for most cases — the accent adds brand presence without much effort. Can feel arbitrary if the colour doesn\'t map to anything meaningful in the content.',
  minimal: 'Works well when content density is high and you don\'t want the chrome to compete. Falls apart if cards don\'t have strong enough internal structure to hold themselves together.',
  elevated: 'Great for drawing focus to individual items and making the UI feel premium. Starts to look cluttered when there are many cards close together.',
}[tweaks.cardStyle ?? 'default']}
```

4. **`SliderControl` always goes inside a `<Field>`.** The field's label sits above the bar; the bar shows the current value on the right.

## Panel template

```tsx
'use client'
import { useTweaks } from './TweaksContext'
import { TweaksPanelShell, Section, Field, SegmentedControl, SelectControl, SliderControl } from './TweaksPrimitives'

export default function TweaksPanel() {
  const { tweaks, setTweak } = useTweaks()
  return (
    <TweaksPanelShell>
      <Section label="Layout">
        <Field
          label="View"
          blurb={
            tweaks.view === 'list'
              ? 'Good for comparing items line by line when titles and metadata matter more than visuals. Gets unwieldy if the list grows long with no grouping.'
              : 'Good for visual browsing and quick orientation across many items. Harder to compare specific details side by side.'
          }
        >
          <SegmentedControl
            options={[{ label: 'Grid', value: 'grid' }, { label: 'List', value: 'list' }]}
            value={tweaks.view ?? 'grid'}
            onChange={(v) => setTweak('view', v)}
          />
        </Field>
      </Section>
    </TweaksPanelShell>
  )
}
```

## Reading tweaks in components

```tsx
import { useTweaks } from '@/app/components/TweaksContext'

function CardGrid() {
  const { tweaks } = useTweaks()
  const isGrid = (tweaks.view ?? 'grid') === 'grid'
  // ...
}
```

For instant propagation without prop drilling, prefer CSS custom properties:

```tsx
useEffect(() => {
  document.documentElement.style.setProperty(
    '--density-gap',
    tweaks.density === 'compact' ? '12px' : tweaks.density === 'spacious' ? '40px' : '24px'
  )
}, [tweaks.density])
```
