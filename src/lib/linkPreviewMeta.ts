import type { LinkPreviewApiResponse } from "@/pages/api/link-preview"
import { getLinkPreviewScreenshot } from "@/lib/linkPreviewScreenshots"

export type LinkPreviewMeta = {
  title: string
  domain: string
  description?: string
  hostname: string
  imageUrl?: string
  screenshotUrl?: string
  siteName?: string
  fetched?: boolean
}

export function getLinkPreviewMeta(
  href: string,
  text: string
): LinkPreviewMeta {
  try {
    const url = new URL(href, "https://example.com")
    const hostname = url.hostname.replace(/^www\./, "")
    const domain = hostname || text

    if (url.protocol === "mailto:") {
      return {
        title: text,
        domain: text,
        hostname: text,
        description: "Send an email",
      }
    }

    return {
      title: text,
      domain,
      hostname,
      screenshotUrl: getLinkPreviewScreenshot(href)?.path,
    }
  } catch {
    return {
      title: text,
      domain: text,
      hostname: text,
    }
  }
}

export function mergeLinkPreviewMeta(
  fallback: LinkPreviewMeta,
  fetched: Partial<LinkPreviewApiResponse>
): LinkPreviewMeta {
  return {
    title: fetched.title?.trim() || fallback.title,
    description: fetched.description?.trim() || fallback.description,
    imageUrl: fetched.imageUrl || fallback.imageUrl,
    screenshotUrl: fallback.screenshotUrl,
    siteName: fetched.siteName?.trim() || fallback.siteName,
    domain: fetched.domain || fallback.domain,
    hostname: fetched.hostname || fallback.hostname,
    fetched: Boolean(fetched.title || fetched.description || fetched.imageUrl),
  }
}

export function getFaviconUrl(hostname: string): string {
  return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(hostname)}&sz=32`
}

export function getPreviewThumbnail(meta: LinkPreviewMeta): string {
  return meta.imageUrl || meta.screenshotUrl || getFaviconUrl(meta.hostname)
}
