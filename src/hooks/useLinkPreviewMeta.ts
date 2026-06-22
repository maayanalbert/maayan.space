import { useEffect, useState } from "react"
import {
  getCachedLinkPreview,
  isLinkPreviewPending,
  subscribeLinkPreviewCache,
} from "@/lib/linkPreviewCache"

export function useLinkPreviewMeta(href: string, text: string) {
  const [, bump] = useState(0)

  useEffect(() => subscribeLinkPreviewCache(() => bump((n) => n + 1)), [])

  const meta = getCachedLinkPreview(href, text)
  const loading = isLinkPreviewPending(href) && !meta.fetched

  return { meta, loading }
}
