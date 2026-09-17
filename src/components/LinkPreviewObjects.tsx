import type { LinkPreviewMeta } from "@/lib/linkPreviewMeta"
import type { CSSProperties, ReactNode } from "react"

export const OBJECT_PREVIEW_VARIANTS = [
  "vinyl",
  "snowglobe",
  "radar",
  "ticker",
  "slot",
  "confetti",
] as const

export type ObjectPreviewVariant = (typeof OBJECT_PREVIEW_VARIANTS)[number]

export function isObjectPreview(
  variant: string
): variant is ObjectPreviewVariant {
  return (OBJECT_PREVIEW_VARIANTS as readonly string[]).includes(variant)
}

type ObjectProps = {
  variant: ObjectPreviewVariant
  meta: LinkPreviewMeta
  favicon: string
  vars: CSSProperties
  staticClass: string
  loadingClass: string
}

function shotSrc(meta: LinkPreviewMeta) {
  return meta.screenshotUrl || meta.imageUrl || null
}

function Shot({
  meta,
  favicon,
  className,
}: {
  meta: LinkPreviewMeta
  favicon: string
  className?: string
}) {
  const src = shotSrc(meta)
  if (src) {
    return (
      <img
        src={src}
        alt={meta.title}
        className={className}
        draggable={false}
      />
    )
  }
  return (
    <div className={`${className ?? ""} link-preview-shot-empty`}>
      <img src={favicon} alt="" width={22} height={22} />
      <span>{meta.domain}</span>
    </div>
  )
}

function Vinyl({ meta, favicon, vars, staticClass, loadingClass }: ObjectProps) {
  return (
    <div
      className={`link-preview link-preview-vinyl${staticClass}${loadingClass}`}
      style={vars}
    >
      <div className="link-preview-vinyl-sleeve" aria-hidden="true" />
      <div className="link-preview-vinyl-disc">
        <div className="link-preview-vinyl-grooves" aria-hidden="true" />
        <div className="link-preview-vinyl-label">
          <Shot meta={meta} favicon={favicon} className="link-preview-vinyl-shot" />
        </div>
        <div className="link-preview-vinyl-hole" aria-hidden="true" />
      </div>
      <div className="link-preview-vinyl-arm" aria-hidden="true">
        <div className="link-preview-vinyl-headshell" />
      </div>
      <span className="link-preview-vinyl-caption">{meta.domain}</span>
    </div>
  )
}

const SNOW_FLAKES = Array.from({ length: 12 }, (_, i) => i)

function SnowGlobe({ meta, favicon, vars, staticClass, loadingClass }: ObjectProps) {
  return (
    <div
      className={`link-preview link-preview-snowglobe${staticClass}${loadingClass}`}
      style={vars}
    >
      <div className="link-preview-snowglobe-dome">
        <div className="link-preview-snowglobe-scene">
          <Shot
            meta={meta}
            favicon={favicon}
            className="link-preview-snowglobe-shot"
          />
        </div>
        <div className="link-preview-snowglobe-flakes" aria-hidden="true">
          {SNOW_FLAKES.map((i) => (
            <span key={i} />
          ))}
        </div>
        <div className="link-preview-snowglobe-sheen" aria-hidden="true" />
      </div>
      <div className="link-preview-snowglobe-base">
        <span className="link-preview-snowglobe-plaque">{meta.domain}</span>
      </div>
    </div>
  )
}

function Radar({ meta, favicon, vars, staticClass, loadingClass }: ObjectProps) {
  return (
    <div
      className={`link-preview link-preview-radar${staticClass}${loadingClass}`}
      style={vars}
    >
      <div className="link-preview-radar-screen">
        <Shot meta={meta} favicon={favicon} className="link-preview-radar-shot" />
        <div className="link-preview-radar-rings" aria-hidden="true" />
        <div className="link-preview-radar-crosshair" aria-hidden="true" />
        <div className="link-preview-radar-sweep" aria-hidden="true" />
        <span className="link-preview-radar-blip link-preview-radar-blip--a" aria-hidden="true" />
        <span className="link-preview-radar-blip link-preview-radar-blip--b" aria-hidden="true" />
      </div>
      <div className="link-preview-radar-readout">
        <span className="link-preview-radar-domain">{meta.domain}</span>
        <span className="link-preview-radar-status">TRACKING</span>
      </div>
    </div>
  )
}

function Ticker({ meta, favicon, vars, staticClass, loadingClass }: ObjectProps) {
  const tickerText = `${meta.title}${
    meta.description ? `  —  ${meta.description}` : ""
  }  •  ${meta.domain}  •  `

  return (
    <div
      className={`link-preview link-preview-ticker${staticClass}${loadingClass}`}
      style={vars}
    >
      <div className="link-preview-ticker-feed">
        <Shot meta={meta} favicon={favicon} className="link-preview-ticker-shot" />
        <span className="link-preview-ticker-rec" aria-hidden="true" />
      </div>
      <div className="link-preview-ticker-bar">
        <span className="link-preview-ticker-live">LIVE</span>
        <div className="link-preview-ticker-scroll">
          <div className="link-preview-ticker-track">
            <span>{tickerText}</span>
            <span>{tickerText}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

const SLOT_SYMBOLS = ["7", "★", "$", "♦", "♣", "♠"]
const SLOT_STRIP = [...SLOT_SYMBOLS, ...SLOT_SYMBOLS]

function Slot({ meta, favicon, vars, staticClass, loadingClass }: ObjectProps) {
  return (
    <div
      className={`link-preview link-preview-slot${staticClass}${loadingClass}`}
      style={vars}
    >
      <div className="link-preview-slot-marquee" aria-hidden="true">
        <i />
        <i />
        <i />
        <i />
        <i />
      </div>
      <div className="link-preview-slot-window">
        {[0, 1, 2].map((reel) => (
          <div key={reel} className="link-preview-slot-reel">
            <div className="link-preview-slot-strip">
              {SLOT_STRIP.map((sym, idx) => (
                <span key={idx}>{sym}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="link-preview-slot-tray">
        <Shot meta={meta} favicon={favicon} className="link-preview-slot-thumb" />
        <span className="link-preview-slot-jackpot">{meta.domain}</span>
      </div>
    </div>
  )
}

const CONFETTI_COLORS = [
  "#ff5470",
  "#ffd23f",
  "#2ec4b6",
  "#ff9f1c",
  "#06d6a0",
  "#ef476f",
]

const CONFETTI_PIECE_COUNT = 34

type ConfettiPiece = {
  tx: number
  ty: number
  rot: number
  delay: number
  width: number
  height: number
  round: boolean
  color: string
}

const CONFETTI_PIECES: ConfettiPiece[] = Array.from(
  { length: CONFETTI_PIECE_COUNT },
  (_, i) => {
    const angle =
      (i / CONFETTI_PIECE_COUNT) * Math.PI * 2 + ((i % 3) - 1) * 0.14
    const distance = 92 + ((i * 41) % 130)
    const tx = Math.cos(angle) * distance
    const ty = Math.sin(angle) * distance * 0.92
    const rot = (i % 2 === 0 ? 1 : -1) * (440 + ((i * 67) % 420))
    const delay = ((i * 13) % 22) * 0.006
    const round = i % 3 === 0
    const width = round ? 6 + (i % 3) * 2 : 5 + (i % 4) * 2
    const height = round ? width : width * (1.5 + ((i % 2) * 0.4))
    const color = CONFETTI_COLORS[i % CONFETTI_COLORS.length]
    return { tx, ty, rot, delay, width, height, round, color }
  }
)

function Confetti({ meta, favicon, vars, staticClass, loadingClass }: ObjectProps) {
  return (
    <div
      className={`link-preview link-preview-confetti${staticClass}${loadingClass}`}
      style={vars}
    >
      <div className="link-preview-confetti-flash" aria-hidden="true" />
      <div className="link-preview-confetti-burst" aria-hidden="true">
        {CONFETTI_PIECES.map((piece, i) => (
          <span
            key={i}
            style={
              {
                "--tx": `${piece.tx}px`,
                "--ty": `${piece.ty}px`,
                "--rot": `${piece.rot}deg`,
                width: `${piece.width}px`,
                height: `${piece.height}px`,
                borderRadius: piece.round ? "50%" : "1px",
                background: piece.color,
                animationDelay: `${piece.delay}s`,
              } as CSSProperties
            }
          />
        ))}
      </div>
      <div className="link-preview-confetti-frame">
        <Shot meta={meta} favicon={favicon} className="link-preview-confetti-shot" />
      </div>
      <span className="link-preview-confetti-caption">{meta.title}</span>
      <span className="link-preview-confetti-domain">{meta.domain}</span>
    </div>
  )
}

const OBJECTS: Record<
  ObjectPreviewVariant,
  (props: ObjectProps) => JSX.Element
> = {
  vinyl: Vinyl,
  snowglobe: SnowGlobe,
  radar: Radar,
  ticker: Ticker,
  slot: Slot,
  confetti: Confetti,
}

export default function LinkPreviewObject(props: ObjectProps) {
  const Node = OBJECTS[props.variant]
  return <Node {...props} />
}
