import type { NextApiRequest, NextApiResponse } from "next"
import { parseLinkPreviewHtml } from "@/lib/linkPreviewParse"
import { isAllowedPreviewUrl } from "@/lib/linkPreviewSecurity"

export type LinkPreviewApiResponse = {
  title?: string
  description?: string
  imageUrl?: string
  siteName?: string
  domain: string
  hostname: string
}

const FETCH_TIMEOUT_MS = 6000
const MAX_BYTES = 512_000

async function readLimitedText(response: Response): Promise<string> {
  const reader = response.body?.getReader()
  if (!reader) return ""

  const decoder = new TextDecoder()
  let total = 0
  let html = ""

  while (total < MAX_BYTES) {
    const { done, value } = await reader.read()
    if (done || !value) break
    total += value.byteLength
    html += decoder.decode(value, { stream: true })
  }

  reader.cancel().catch(() => undefined)
  return html
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<LinkPreviewApiResponse | { error: string }>
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  const rawUrl = typeof req.query.url === "string" ? req.query.url : ""
  if (!rawUrl || !isAllowedPreviewUrl(rawUrl)) {
    return res.status(400).json({ error: "Invalid or disallowed URL" })
  }

  const target = new URL(rawUrl)
  const hostname = target.hostname.replace(/^www\./, "")

  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS)

    const response = await fetch(target.href, {
      signal: controller.signal,
      redirect: "follow",
      headers: {
        Accept: "text/html,application/xhtml+xml",
        "User-Agent":
          "Mozilla/5.0 (compatible; MaayanLinkPreview/1.0; +https://maayan.space)",
      },
    })

    clearTimeout(timeout)

    if (!response.ok) {
      return res.status(200).json({ domain: hostname, hostname })
    }

    const contentType = response.headers.get("content-type") ?? ""
    if (!contentType.includes("text/html") && !contentType.includes("application/xhtml")) {
      return res.status(200).json({ domain: hostname, hostname })
    }

    const html = await readLimitedText(response)
    const parsed = parseLinkPreviewHtml(html, response.url || target.href)

    return res.status(200).json({
      title: parsed.title,
      description: parsed.description,
      imageUrl: parsed.imageUrl,
      siteName: parsed.siteName,
      domain: hostname,
      hostname,
    })
  } catch {
    return res.status(200).json({ domain: hostname, hostname })
  }
}
