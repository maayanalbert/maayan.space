import BrowserPreviewAnimSidebar from "./BrowserPreviewAnimSidebar"
import LinkPreviewSidebar from "./LinkPreviewGallery"
import { useState, type ReactNode } from "react"

export default function DevAppShell({ children }: { children: ReactNode }) {
  const [previewCollapsed, setPreviewCollapsed] = useState(true)

  return (
    <div className="dev-app-shell">
      <BrowserPreviewAnimSidebar />
      <LinkPreviewSidebar
        collapsed={previewCollapsed}
        onToggleCollapsed={() => setPreviewCollapsed((c) => !c)}
      />
      <div className="dev-app-main">{children}</div>
    </div>
  )
}
