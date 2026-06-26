import LinkPreviewCard, { type LinkPreviewVariant } from "./LinkPreviewCard"
import { useLinkPreviewMeta } from "@/hooks/useLinkPreviewMeta"
import { useToggles } from "toggletation"

export const LINK_PREVIEW_VARIANTS: {
  value: LinkPreviewVariant
  label: string
  mobbinRef: string
}[] = [
  { value: "none", label: "None", mobbinRef: "Baseline" },
  { value: "tooltip", label: "Tooltip", mobbinRef: "Asana" },
  { value: "card", label: "Card", mobbinRef: "Maze" },
  { value: "notion", label: "Notion", mobbinRef: "Notion" },
  { value: "gamma", label: "Rich", mobbinRef: "Gamma" },
  { value: "linear", label: "Context", mobbinRef: "Linear" },
  { value: "wikipedia", label: "Wikipedia", mobbinRef: "Wikipedia" },
  { value: "wikipediaStripe", label: "Wiki left", mobbinRef: "Left" },
  { value: "wikipediaStripeTop", label: "Wiki top", mobbinRef: "Top" },
  { value: "wikipediaStripeBottom", label: "Wiki bottom", mobbinRef: "Bottom" },
  { value: "wikipediaStripeBottomLeft", label: "Wiki corner", mobbinRef: "Bottom + left" },
  { value: "sticky", label: "Sticky note", mobbinRef: "Analog" },
  { value: "terminal", label: "Terminal", mobbinRef: "CLI" },
  { value: "polaroid", label: "Polaroid", mobbinRef: "Photo" },
  { value: "ticket", label: "Ticket", mobbinRef: "Event" },
  { value: "marginalia", label: "Marginalia", mobbinRef: "Manuscript" },
  { value: "receipt", label: "Receipt", mobbinRef: "Thermal" },
  { value: "orbit", label: "Orbit", mobbinRef: "Portal" },
  { value: "flip", label: "Flip card", mobbinRef: "Interactive" },
  { value: "tilt", label: "Tilt / holographic", mobbinRef: "3D" },
  { value: "typewriter", label: "Typewriter", mobbinRef: "Animated" },
  { value: "filmstrip", label: "Filmstrip scrub", mobbinRef: "Scrub" },
  { value: "mac", label: "Macintosh", mobbinRef: "Retro" },
  { value: "browser", label: "Browser (centered)", mobbinRef: "Screenshot" },
  { value: "browserLeft", label: "Browser (left)", mobbinRef: "Screenshot" },
]

const SAMPLE_URL = "https://folklore.org/0-index.html"
const SAMPLE_TEXT = "the Macintosh"

function LinkPreviewGalleryDemo({ variant }: { variant: LinkPreviewVariant }) {
  const { meta, loading } = useLinkPreviewMeta(SAMPLE_URL, SAMPLE_TEXT)

  return (
    <LinkPreviewCard
      variant={variant}
      meta={meta}
      accent="rgb(150, 150, 150)"
      highlight="rgba(150, 150, 150, 0.2)"
      href={SAMPLE_URL}
      staticPreview
      loading={loading}
    />
  )
}

function LinkPreviewGalleryList() {
  const { getValue, setToggle } = useToggles()
  const active = getValue("linkPreviewStyle") as LinkPreviewVariant

  return (
    <div className="link-preview-gallery-list">
      {LINK_PREVIEW_VARIANTS.map(({ value, label, mobbinRef }) => {
        const isActive = active === value
        return (
          <div key={value}>
            {value === "sticky" && (
              <p className="link-preview-gallery-section">Experimental</p>
            )}
            {value === "flip" && (
              <p className="link-preview-gallery-section">Interactive</p>
            )}
            <button
              type="button"
              className={`link-preview-gallery-item${isActive ? " is-active" : ""}`}
              onClick={() => setToggle("linkPreviewStyle", value)}
            >
              <div className="link-preview-gallery-item-head">
                <span className="link-preview-gallery-label">{label}</span>
                <span className="link-preview-gallery-ref">{mobbinRef}</span>
              </div>
              {value !== "none" ? (
                <div className="link-preview-gallery-demo">
                  <LinkPreviewGalleryDemo variant={value} />
                </div>
              ) : (
                <p className="link-preview-gallery-none">No preview on hover</p>
              )}
            </button>
          </div>
        )
      })}
    </div>
  )
}

type SidebarProps = {
  collapsed?: boolean
  onToggleCollapsed?: () => void
}

export default function LinkPreviewSidebar({
  collapsed = false,
  onToggleCollapsed,
}: SidebarProps) {
  return (
    <aside
      className={`link-preview-sidebar${collapsed ? " link-preview-sidebar--collapsed" : ""}`}
      aria-label="Link preview variants"
      aria-expanded={!collapsed}
    >
      <button
        type="button"
        className="link-preview-sidebar-toggle"
        onClick={onToggleCollapsed}
        aria-label={collapsed ? "Expand preview variants" : "Collapse preview variants"}
        title={collapsed ? "Expand preview variants" : "Collapse preview variants"}
      >
        {collapsed ? "‹" : "›"}
      </button>
      {collapsed ? (
        <button
          type="button"
          className="link-preview-sidebar-rail"
          onClick={onToggleCollapsed}
          aria-label="Expand preview variants"
        >
          <span className="link-preview-sidebar-rail-label">Previews</span>
        </button>
      ) : (
        <>
          <div className="link-preview-sidebar-header">
            <p className="link-preview-sidebar-title">Link previews</p>
            <p className="link-preview-sidebar-sub">
              Hover links on the page, or pick a variant below.
            </p>
          </div>
          <LinkPreviewGalleryList />
        </>
      )}
    </aside>
  )
}
