export type BrowserPreviewAnim = "slide" | "genie" | "pop" | "unfold" | "blur"

export const BROWSER_PREVIEW_ANIMS: {
  value: BrowserPreviewAnim
  label: string
  description: string
  explanation: string
}[] = [
  {
    value: "slide",
    label: "Slide",
    description: "Quick upward slide with a fade.",
    explanation:
      "Quick upward slide with a fade — fast and unobtrusive, the default for all preview types.\n\nFunctional but plain; doesn't reinforce the browser metaphor.",
  },
  {
    value: "genie",
    label: "Genie",
    description: "Mac dock genie — mesh warp with curved sides bulging outward.",
    explanation:
      "Authentic macOS genie minimize in reverse — the window unfurls from the link through a funnel whose sides curve outward, not straight pinch lines.\n\nRow-by-row horizontal warping on the screenshot preview.",
  },
  {
    value: "pop",
    label: "Pop",
    description: "Soft fade and scale — no bounce, just settles in.",
    explanation:
      "A quiet entrance — slight scale-up and drift into place with a smooth ease-out. No spring or overshoot.\n\nGentler than slide; barely noticeable unless you're watching for it.",
  },
  {
    value: "unfold",
    label: "Unfold",
    description: "3D hinge — rotates forward from the link edge.",
    explanation:
      "3D hinge unfold — the window rotates forward from the link edge like opening a laptop lid.\n\nSubtle depth cue; can feel slightly stiff on very flat layouts.",
  },
  {
    value: "blur",
    label: "Blur",
    description: "macOS-style materialize — blur resolves into focus.",
    explanation:
      "macOS-style materialize — blur and brightness resolve into a sharp window.\n\nSmooth and polished; less directional than genie or slide.",
  },
]
