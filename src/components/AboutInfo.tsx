import { MarkdownText } from "./MarkdownText"
import pages from "@/content/pages.json"

export function AboutInfo() {
  return (
    <div className="flex flex-col gap-4">
      {pages.about.split("\n\n").map((paragraph, i) => (
        <p key={i}>
          <MarkdownText text={paragraph} page="ABOUT" />
        </p>
      ))}
    </div>
  )
}
