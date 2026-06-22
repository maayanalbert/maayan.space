import pages from "@/content/pages.json"

const CONTACT_LINKS = [
  { href: "https://twitter.com/_maayanster", text: "@maayanalbert" },
  { href: "https://github.com/maayanalbert", text: "@maayanalbert" },
  { href: "https://www.linkedin.com/in/maayan-albert/", text: "LinkedIn" },
]

function extractMarkdownLinks(content: string): { href: string; text: string }[] {
  const links: { href: string; text: string }[] = []
  const pattern = /\[([^\]]+)\]\(([^)]+)\)/g
  let match: RegExpExecArray | null

  while ((match = pattern.exec(content)) !== null) {
    links.push({ text: match[1].trim(), href: match[2].trim() })
  }

  return links
}

export function getAllLinkPreviewSources(): { href: string; text: string }[] {
  const fromPages = Object.values(pages).flatMap(extractMarkdownLinks)
  const byHref = new Map<string, { href: string; text: string }>()

  for (const link of [...fromPages, ...CONTACT_LINKS]) {
    if (!link.href.startsWith("http")) continue
    byHref.set(link.href, link)
  }

  return Array.from(byHref.values())
}
