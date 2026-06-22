import { useEffect } from "react"
import { prefetchAllLinkPreviews } from "@/lib/linkPreviewCache"
import { getAllLinkPreviewSources } from "@/lib/linkPreviewSources"

export default function LinkPreviewPrefetcher() {
  useEffect(() => {
    prefetchAllLinkPreviews(getAllLinkPreviewSources())
  }, [])

  return null
}
