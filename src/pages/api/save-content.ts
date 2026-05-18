import type { NextApiRequest, NextApiResponse } from "next"
import fs from "fs"
import path from "path"

const CONTENT_FILE = path.join(process.cwd(), "src/content/pages.json")

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  const { key, content } = req.body
  if (!key || typeof content !== "string") {
    return res.status(400).json({ error: "Missing key or content" })
  }

  try {
    const raw = fs.readFileSync(CONTENT_FILE, "utf-8")
    const pages = JSON.parse(raw)
    pages[key] = content
    fs.writeFileSync(CONTENT_FILE, JSON.stringify(pages, null, 2) + "\n", "utf-8")
    return res.status(200).json({ ok: true })
  } catch (err) {
    console.error("Failed to save content:", err)
    return res.status(500).json({ error: "Failed to save" })
  }
}
