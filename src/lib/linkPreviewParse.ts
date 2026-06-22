function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

function decodeHtmlEntities(value: string): string {
  return value
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, num) => String.fromCharCode(Number(num)))
}

function readMetaContent(html: string, key: string): string | undefined {
  const k = escapeRegex(key)
  const patterns = [
    new RegExp(
      `<meta[^>]+(?:property|name)\\s*=\\s*["']${k}["'][^>]+content\\s*=\\s*["']([^"']*)["']`,
      "i"
    ),
    new RegExp(
      `<meta[^>]+content\\s*=\\s*["']([^"']*)["'][^>]+(?:property|name)\\s*=\\s*["']${k}["']`,
      "i"
    ),
  ]

  for (const pattern of patterns) {
    const match = html.match(pattern)
    const value = match?.[1]?.trim()
    if (value) return decodeHtmlEntities(value)
  }
  return undefined
}

function readTitleTag(html: string): string | undefined {
  const match = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)
  const value = match?.[1]?.replace(/\s+/g, " ").trim()
  return value ? decodeHtmlEntities(value) : undefined
}

function resolveUrl(base: string, maybeRelative?: string): string | undefined {
  if (!maybeRelative) return undefined
  try {
    return new URL(maybeRelative, base).href
  } catch {
    return undefined
  }
}

export type ParsedLinkPreview = {
  title?: string
  description?: string
  imageUrl?: string
  siteName?: string
}

export function parseLinkPreviewHtml(html: string, pageUrl: string): ParsedLinkPreview {
  const headChunk = html.slice(0, 120_000)

  const title =
    readMetaContent(headChunk, "og:title") ||
    readMetaContent(headChunk, "twitter:title") ||
    readTitleTag(headChunk)

  const description =
    readMetaContent(headChunk, "og:description") ||
    readMetaContent(headChunk, "twitter:description") ||
    readMetaContent(headChunk, "description")

  const imageRaw =
    readMetaContent(headChunk, "og:image") ||
    readMetaContent(headChunk, "twitter:image") ||
    readMetaContent(headChunk, "twitter:image:src")

  const siteName = readMetaContent(headChunk, "og:site_name")

  return {
    title,
    description,
    imageUrl: resolveUrl(pageUrl, imageRaw),
    siteName,
  }
}
