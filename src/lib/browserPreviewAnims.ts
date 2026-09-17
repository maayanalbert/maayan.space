export type BrowserPreviewAnim =
  | "slide"
  | "genie"
  | "pop"
  | "unfold"
  | "blur"
  | "flip"
  | "orbit"
  | "tilt"
  | "print"
  | "drop"
  | "wipe"
  | "glitch"
  | "swing"
  | "iris"
  | "slap"

export const BROWSER_PREVIEW_ANIMS: {
  value: BrowserPreviewAnim
  label: string
  description: string
  explanation: string
  section?: string
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
  {
    value: "flip",
    label: "Flip",
    section: "Dynamic",
    description: "Card flip — the window turns around its spine.",
    explanation:
      "Borrowed from the flip-card preview: the window rotates in on the Y axis like a playing card turning face-up.\n\nDramatic and readable; a little theatrical if you hover many links in a row.",
  },
  {
    value: "orbit",
    label: "Orbit",
    description: "Spins in on an arc while scaling up.",
    explanation:
      "The orbit preview's spin, applied to the window — it arrives on a short arc and settles.\n\nEye-catching; the rotation can feel busy next to dense prose.",
  },
  {
    value: "tilt",
    label: "Holo tilt",
    description: "3D settle with a holographic sheen sweep.",
    explanation:
      "The holographic card's tilt and sheen, used as an entrance — the window leans in, then a light streak crosses the glass.\n\nVery 'object-like'; sheen reads best on screenshot-heavy destinations.",
  },
  {
    value: "print",
    label: "Print",
    description: "Grows up from the link like a receipt printing.",
    explanation:
      "Receipt energy: the window extrudes upward from the link, as if the page is being printed out of the text.\n\nStrong spatial link to the hover target; scaleY can briefly squash the screenshot.",
  },
  {
    value: "drop",
    label: "Drop",
    description: "Polaroid drop — falls in with a slight rotate.",
    explanation:
      "Polaroid / sticky-note drop: the window falls into place with a small tilt, then squares up.\n\nPhysical and friendly; the rotate can feel casual on a very formal page.",
  },
  {
    value: "wipe",
    label: "Wipe",
    description: "Filmstrip wipe — the window is revealed left to right.",
    explanation:
      "Filmstrip scrub, as an entrance: a hard left-to-right wipe uncovers the window.\n\nGraphic and fast; the hard edge is more editorial than skeuomorphic.",
  },
  {
    value: "glitch",
    label: "Glitch",
    description: "Terminal snap — chromatic jitter, then lock.",
    explanation:
      "Terminal / sci-fi snap: a few frames of offset and contrast, then the window locks on.\n\nThe most digital of the set; can feel aggressive if the rest of the site is quiet.",
  },
  {
    value: "swing",
    label: "Swing",
    description: "Hangs from the link and swings into rest.",
    explanation:
      "Ticket-stub / hanging-sign motion: the window is pinned to the link and swings in like a shop sign.\n\nPlayful and spatial; a wide swing can clip on tight layouts.",
  },
  {
    value: "iris",
    label: "Iris",
    description: "Circular reveal opening from the link.",
    explanation:
      "An aperture opens from the link and the window is inside it — like a camera iris, or a portal.\n\nVery graphic; the circle cut can feel abrupt on the first frame.",
  },
  {
    value: "slap",
    label: "Slap",
    description: "Sticky-note slap — hits the page a little too big, then settles.",
    explanation:
      "Sticky-note slap: the window lands oversized and slightly crooked, then seats itself.\n\nThe punchiest option; too much if every hover should stay polite.",
  },
]

export const DYNAMIC_BROWSER_ANIMS = BROWSER_PREVIEW_ANIMS.filter(
  (anim) => anim.section === "Dynamic"
)
