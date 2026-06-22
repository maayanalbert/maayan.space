import manifest from "@/generated/linkPreviewManifest.json"

export type LinkPreviewScreenshot = {
  path: string
  width: number
  height: number
  capturedAt: string
}

const screenshots = manifest as Record<string, LinkPreviewScreenshot>

/** Hostnames that prefer captured screenshots over live iframes / OG images. */
const SCREENSHOT_FALLBACK_HOSTS = new Set([
  "apple.com",
  "google.com",
  "drive.google.com",
  "twitter.com",
  "x.com",
  "penguinrandomhouse.com",
  "linkedin.com",
  "github.com",
  "youtube.com",
  "youtu.be",
])

function normalizeHostname(hostname: string): string {
  return hostname.replace(/^www\./, "").toLowerCase()
}

export function hostnameUsesScreenshotFallback(hostname: string): boolean {
  const host = normalizeHostname(hostname)
  if (SCREENSHOT_FALLBACK_HOSTS.has(host)) return true
  return Array.from(SCREENSHOT_FALLBACK_HOSTS).some(
    (allowed) => host === allowed || host.endsWith(`.${allowed}`)
  )
}

export function getLinkPreviewScreenshot(
  href: string
): LinkPreviewScreenshot | undefined {
  const entry = screenshots[href]
  if (!entry) return undefined

  try {
    const hostname = new URL(href).hostname
    if (!hostnameUsesScreenshotFallback(hostname)) return undefined
  } catch {
    return undefined
  }

  return entry
}

export function hasLinkPreviewScreenshot(href: string): boolean {
  return Boolean(getLinkPreviewScreenshot(href))
}
