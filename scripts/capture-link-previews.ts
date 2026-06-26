/**
 * Captures full-page link preview screenshots at a fixed 960px viewport width.
 * Run: pnpm capture-previews
 */
import { createHash } from "node:crypto"
import { mkdirSync, readFileSync, writeFileSync } from "node:fs"
import path from "node:path"
import { chromium, type Page } from "playwright"

/** Matches the browser preview card width ratio (268px card ← 960px source). */
export const PREVIEW_VIEWPORT_WIDTH = 960

const PREVIEW_VIEWPORT_HEIGHT = 720
const OUTPUT_DIR = path.join(process.cwd(), "public/link-previews")
const MANIFEST_PATH = path.join(
  process.cwd(),
  "src/generated/linkPreviewManifest.json"
)
const PAGES_PATH = path.join(process.cwd(), "src/content/pages.json")

const CONTACT_LINKS = [
  "https://twitter.com/_maayanster",
  "https://github.com/maayanalbert",
  "https://www.linkedin.com/in/maayan-albert/",
]

type ManifestEntry = {
  path: string
  width: number
  height: number
  capturedAt: string
}

type Manifest = Record<string, ManifestEntry>

function extractMarkdownLinks(content: string): string[] {
  const links: string[] = []
  const pattern = /\[([^\]]+)\]\(([^)]+)\)/g
  let match: RegExpExecArray | null

  while ((match = pattern.exec(content)) !== null) {
    links.push(match[2].trim())
  }

  return links
}

function getAllLinkHrefs(): string[] {
  const pages = JSON.parse(readFileSync(PAGES_PATH, "utf8")) as Record<
    string,
    string
  >
  const fromPages = Object.values(pages).flatMap(extractMarkdownLinks)
  const byHref = new Set<string>()

  for (const href of [...fromPages, ...CONTACT_LINKS]) {
    if (!href.startsWith("http")) continue
    byHref.add(href)
  }

  return Array.from(byHref)
}

function hrefToFilename(href: string): string {
  try {
    const url = new URL(href)
    const slug = `${url.hostname}${url.pathname}${url.search}`
      .replace(/^www\./, "")
      .replace(/[^a-zA-Z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 96)

    if (slug) return slug
  } catch {
    /* fall through */
  }

  return createHash("sha256").update(href).digest("hex").slice(0, 16)
}

async function dismissCommonOverlays(page: Page): Promise<void> {
  const selectors = [
    'button:has-text("Accept all")',
    'button:has-text("Accept All")',
    'button:has-text("I agree")',
    'button:has-text("Got it")',
    '[aria-label="Close"]',
  ]

  for (const selector of selectors) {
    const button = page.locator(selector).first()
    if (await button.isVisible({ timeout: 500 }).catch(() => false)) {
      await button.click({ timeout: 1000 }).catch(() => undefined)
      await page.waitForTimeout(400)
    }
  }
}

async function prepareYouTubePage(page: Page): Promise<void> {
  await page.waitForTimeout(30_000)

  // Lazy-loaded thumbnails need scroll + a visible player frame.
  await page.evaluate(async () => {
    const step = window.innerHeight * 0.75
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y)
      await new Promise((resolve) => setTimeout(resolve, 400))
    }
    window.scrollTo(0, 0)
  })

  await page.waitForTimeout(2000)
  await page
    .locator("#movie_player img, ytd-thumbnail img, #thumbnail img")
    .first()
    .waitFor({ state: "visible", timeout: 15_000 })
    .catch(() => undefined)
}

function getLoadWaitMs(href: string): number {
  try {
    const host = new URL(href).hostname.replace(/^www\./, "").toLowerCase()
    if (host === "youtube.com" || host === "youtu.be") return 30_000
  } catch {
    /* fall through */
  }
  return 1200
}

async function capturePage(
  page: Page,
  href: string,
  outputPath: string
): Promise<{ width: number; height: number }> {
  await page.goto(href, { waitUntil: "domcontentloaded", timeout: 60_000 })
  await dismissCommonOverlays(page)

  const host = (() => {
    try {
      return new URL(href).hostname.replace(/^www\./, "").toLowerCase()
    } catch {
      return ""
    }
  })()

  if (host === "youtube.com" || host === "youtu.be") {
    await prepareYouTubePage(page)
  } else {
    await page.waitForTimeout(getLoadWaitMs(href))
  }

  await page.screenshot({
    path: outputPath,
    fullPage: true,
    type: "jpeg",
    quality: 82,
    animations: "disabled",
  })

  const dimensions = await page.evaluate(() => ({
    width: document.documentElement.scrollWidth,
    height: document.documentElement.scrollHeight,
  }))

  return {
    width: PREVIEW_VIEWPORT_WIDTH,
    height: dimensions.height,
  }
}

async function main(): Promise<void> {
  const singleHref = process.argv[2]
  const hrefs = singleHref ? [singleHref] : getAllLinkHrefs()
  mkdirSync(OUTPUT_DIR, { recursive: true })
  mkdirSync(path.dirname(MANIFEST_PATH), { recursive: true })

  let manifest: Manifest = {}
  if (singleHref) {
    try {
      manifest = JSON.parse(readFileSync(MANIFEST_PATH, "utf8")) as Manifest
    } catch {
      /* start fresh if manifest missing */
    }
  }
  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext({
    viewport: {
      width: PREVIEW_VIEWPORT_WIDTH,
      height: PREVIEW_VIEWPORT_HEIGHT,
    },
    deviceScaleFactor: 1,
    userAgent:
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
    locale: "en-US",
  })

  const page = await context.newPage()

  console.log(
    `Capturing ${hrefs.length} link previews at ${PREVIEW_VIEWPORT_WIDTH}px wide…\n`
  )

  for (const href of hrefs) {
    const filename = `${hrefToFilename(href)}.jpg`
    const outputPath = path.join(OUTPUT_DIR, filename)
    const publicPath = `/link-previews/${filename}`

    process.stdout.write(`  ${href}\n    → ${publicPath} … `)

    try {
      const { width, height } = await capturePage(page, href, outputPath)
      manifest[href] = {
        path: publicPath,
        width,
        height,
        capturedAt: new Date().toISOString(),
      }
      console.log(`ok (${width}×${height})`)
    } catch (error) {
      console.log("failed")
      console.error(
        `    ${error instanceof Error ? error.message : String(error)}`
      )
    }
  }

  await browser.close()

  writeFileSync(MANIFEST_PATH, `${JSON.stringify(manifest, null, 2)}\n`, "utf8")
  console.log(
    `\nWrote manifest with ${Object.keys(manifest).length}/${hrefs.length} entries`
  )
  console.log(`  ${MANIFEST_PATH}`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
