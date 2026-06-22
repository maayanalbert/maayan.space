import {
  getLinkPreviewMeta,
  mergeLinkPreviewMeta,
  type LinkPreviewMeta,
} from "@/lib/linkPreviewMeta"
import type { LinkPreviewApiResponse } from "@/pages/api/link-preview"

type Listener = () => void

const cache = new Map<string, LinkPreviewMeta>()
const pending = new Set<string>()
const listeners = new Set<Listener>()

function canFetchPreview(href: string): boolean {
  if (!href || href.startsWith("mailto:") || href.startsWith("tel:")) return false
  try {
    const url = new URL(href)
    return url.protocol === "http:" || url.protocol === "https:"
  } catch {
    return false
  }
}

function notify() {
  listeners.forEach((listener) => listener())
}

export function subscribeLinkPreviewCache(listener: Listener): () => void {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function getCachedLinkPreview(href: string, text: string): LinkPreviewMeta {
  return cache.get(href) ?? getLinkPreviewMeta(href, text)
}

export function isLinkPreviewPending(href: string): boolean {
  return pending.has(href)
}

export async function prefetchLinkPreview(
  href: string,
  text: string
): Promise<LinkPreviewMeta> {
  const fallback = getLinkPreviewMeta(href, text)

  if (!canFetchPreview(href)) return fallback
  if (cache.has(href)) return cache.get(href)!

  pending.add(href)
  notify()

  try {
    const response = await fetch(`/api/link-preview?url=${encodeURIComponent(href)}`)
    if (!response.ok) return fallback

    const data = (await response.json()) as LinkPreviewApiResponse
    const merged = mergeLinkPreviewMeta(fallback, data)
    cache.set(href, merged)
    return merged
  } catch {
    return fallback
  } finally {
    pending.delete(href)
    notify()
  }
}

export function prefetchAllLinkPreviews(
  sources: { href: string; text: string }[]
): void {
  const seen = new Set<string>()

  for (const source of sources) {
    if (seen.has(source.href)) continue
    seen.add(source.href)
    void prefetchLinkPreview(source.href, source.text)
  }
}
