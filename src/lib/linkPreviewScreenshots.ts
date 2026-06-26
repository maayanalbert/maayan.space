import manifest from "@/generated/linkPreviewManifest.json"

export type LinkPreviewScreenshot = {
  path: string
  width: number
  height: number
  capturedAt: string
}

const screenshots = manifest as Record<string, LinkPreviewScreenshot>

export function getAllLinkPreviewScreenshotPaths(): string[] {
  const paths = new Set<string>()
  for (const entry of Object.values(screenshots)) {
    if (entry.path) paths.add(entry.path)
  }
  return Array.from(paths)
}

export function getLinkPreviewScreenshot(
  href: string
): LinkPreviewScreenshot | undefined {
  return screenshots[href]
}

export function hasLinkPreviewScreenshot(href: string): boolean {
  return Boolean(getLinkPreviewScreenshot(href))
}
