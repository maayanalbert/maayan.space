import LinkPreviewCard from "./LinkPreviewCard"
import GenieEnterAnimation from "./GenieEnterAnimation"
import { useLinkPreviewMeta } from "@/hooks/useLinkPreviewMeta"
import {
  BROWSER_PREVIEW_ANIMS,
  type BrowserPreviewAnim,
} from "@/lib/browserPreviewAnims"
import { useToggles } from "toggletation"
import { useCallback, useEffect, useState } from "react"

const SAMPLE_URL = "https://folklore.org/0-index.html"
const SAMPLE_TEXT = "the Macintosh"

function AnimStage({
  anim,
  replayKey,
  active,
}: {
  anim: BrowserPreviewAnim
  replayKey: number
  active: boolean
}) {
  const { meta, loading } = useLinkPreviewMeta(SAMPLE_URL, SAMPLE_TEXT)

  const card = (
    <LinkPreviewCard
      variant="browser"
      meta={meta}
      accent="rgb(150, 150, 150)"
      highlight="rgba(150, 150, 150, 0.2)"
      href={SAMPLE_URL}
      staticPreview
      loading={loading}
    />
  )

  return (
    <div className="browser-anim-stage">
      <span className="browser-anim-stage-link">the Macintosh</span>
      {active ? (
        <div
          key={anim === "genie" ? replayKey : `${anim}-${replayKey}`}
          className={`browser-anim-stage-portal link-preview-portal link-preview-portal--anim-${anim} link-preview-portal--centered`}
        >
          {anim === "genie" ? (
            <GenieEnterAnimation active anchorX={0.5} replayKey={replayKey}>
              {card}
            </GenieEnterAnimation>
          ) : (
            card
          )}
        </div>
      ) : (
        <div className="browser-anim-stage-portal browser-anim-stage-portal--idle link-preview-portal--centered">
          {card}
        </div>
      )}
    </div>
  )
}

function AnimOption({
  value,
  label,
  description,
  active,
  onSelect,
}: {
  value: BrowserPreviewAnim
  label: string
  description: string
  active: boolean
  onSelect: (value: BrowserPreviewAnim) => void
}) {
  const [replayKey, setReplayKey] = useState(0)

  useEffect(() => {
    if (active) setReplayKey((k) => k + 1)
  }, [active])

  const replay = useCallback(() => {
    setReplayKey((k) => k + 1)
  }, [])

  return (
    <div className={`browser-anim-item${active ? " is-active" : ""}`}>
      <div className="browser-anim-item-head">
        <button type="button" className="browser-anim-item-select" onClick={() => onSelect(value)}>
          <span className="browser-anim-item-label">{label}</span>
        </button>
        {active ? (
          <button type="button" className="browser-anim-item-replay" onClick={replay}>
            Replay
          </button>
        ) : null}
      </div>
      <button type="button" className="browser-anim-item-body" onClick={() => onSelect(value)}>
        <p className="browser-anim-item-desc">{description}</p>
        <AnimStage anim={value} replayKey={replayKey} active={active} />
      </button>
    </div>
  )
}

export default function BrowserPreviewAnimSidebar() {
  const { getValue, setToggle } = useToggles()
  const active = (getValue("browserPreviewAnim") || "slide") as BrowserPreviewAnim

  return (
    <aside className="browser-anim-sidebar" aria-label="Browser preview animations">
      <div className="browser-anim-sidebar-header">
        <p className="browser-anim-sidebar-title">Browser enter</p>
        <p className="browser-anim-sidebar-sub">
          Pick an animation, then hover a link with the browser preview style active.
        </p>
      </div>
      <div className="browser-anim-list">
        {BROWSER_PREVIEW_ANIMS.map((option) => (
          <AnimOption
            key={option.value}
            {...option}
            active={active === option.value}
            onSelect={(value) => setToggle("browserPreviewAnim", value)}
          />
        ))}
      </div>
    </aside>
  )
}
