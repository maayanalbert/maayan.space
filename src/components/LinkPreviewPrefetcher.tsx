import { useEffect } from "react"
import {
  prefetchAllLinkPreviews,
  preloadAllLinkPreviewImages,
} from "@/lib/linkPreviewCache"
import { getAllLinkPreviewSources } from "@/lib/linkPreviewSources"
import { getAllLinkPreviewScreenshotPaths } from "@/lib/linkPreviewScreenshots"

export default function LinkPreviewPrefetcher() {
  useEffect(() => {
    prefetchAllLinkPreviews(getAllLinkPreviewSources())

    const preload = () => preloadAllLinkPreviewImages(getAllLinkPreviewScreenshotPaths())
    if ("requestIdleCallback" in window) {
      requestIdleCallback(preload)
    } else {
      setTimeout(preload, 0)
    }
  }, [])

  return null
}
