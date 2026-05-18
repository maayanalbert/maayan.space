import { Fragment, ReactNode } from "react"
import TextLink from "./TextLink"
import { Page } from "@/pageHelpers"

interface Props {
  text: string
  page: Page
}

export function MarkdownText({ text, page }: Props) {
  return <>{renderMarkdown(text, page)}</>
}

function renderMarkdown(text: string, page: Page): ReactNode[] {
  const nodes: ReactNode[] = []
  // Split on [text](url) patterns, keeping the delimiters
  const parts = text.split(/(\[[^\]]+\]\([^)]+\))/)

  parts.forEach((part, partIdx) => {
    const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/)
    if (linkMatch) {
      nodes.push(
        <TextLink
          key={partIdx}
          text={linkMatch[1]}
          href={linkMatch[2]}
          page={page}
        />
      )
    } else {
      // Strip trailing space before a link (TextLink adds its own leading space)
      const nextPart = parts[partIdx + 1]
      const nextIsLink = nextPart?.match(/^\[[^\]]+\]\([^)]+\)$/)
      const content = nextIsLink ? part.replace(/ $/, "") : part
      if (content) {
        nodes.push(<Fragment key={partIdx}>{content}</Fragment>)
      }
    }
  })

  return nodes
}
