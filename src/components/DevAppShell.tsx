import BrowserPreviewAnimSidebar from "./BrowserPreviewAnimSidebar"
import LinkPreviewSidebar from "./LinkPreviewGallery"
import { useState, type ReactNode } from "react"

export default function DevAppShell({ children }: { children: ReactNode }) {
  const [browserAnimCollapsed, setBrowserAnimCollapsed] = useState(true)
  const [previewCollapsed, setPreviewCollapsed] = useState(false)

  return (
    <div className="dev-app-shell">
      <BrowserPreviewAnimSidebar
        collapsed={browserAnimCollapsed}
        onToggleCollapsed={() => setBrowserAnimCollapsed((c) => !c)}
      />
      <LinkPreviewSidebar
        collapsed={previewCollapsed}
        onToggleCollapsed={() => setPreviewCollapsed((c) => !c)}
      />
      <div className="dev-app-main">{children}</div>
    </div>
  )
}
