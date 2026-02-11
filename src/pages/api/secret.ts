import type { NextApiRequest, NextApiResponse } from "next"
import { google } from "googleapis"

type SecretPayload = {
  fullName: string
  theirSecret: string
}

type ApiResponse =
  | { ok: true }
  | {
      ok: false
      error: string
    }

function requireEnv(name: string): string {
  const value = process.env[name]
  if (!value) throw new Error(`Missing env var: ${name}`)
  return value
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST")
    return res.status(405).json({ ok: false, error: "Method not allowed." })
  }

  try {
    const { fullName, theirSecret } = (req.body ?? {}) as Partial<SecretPayload>

    if (!fullName?.trim()) {
      return res.status(400).json({ ok: false, error: "Full name is required." })
    }
    if (!theirSecret?.trim()) {
      return res
        .status(400)
        .json({ ok: false, error: "Secret is required." })
    }

    const spreadsheetId = requireEnv("GOOGLE_SHEETS_SPREADSHEET_ID")
    const sheetName = process.env.GOOGLE_SHEETS_SHEET_NAME || "Sheet1"
    const clientEmail = requireEnv("GOOGLE_SERVICE_ACCOUNT_EMAIL")
    const privateKey = requireEnv("GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY").replace(
      /\\n/g,
      "\n"
    )

    const auth = new google.auth.JWT({
      email: clientEmail,
      key: privateKey,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    })

    const sheets = google.sheets({ version: "v4", auth })

    const createdAt = new Date().toISOString()
    const userAgent = req.headers["user-agent"] ?? ""
    const referer = req.headers.referer ?? ""
    const ip =
      (req.headers["x-forwarded-for"] as string | undefined)?.split(",")[0] ??
      req.socket.remoteAddress ??
      ""

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: `${sheetName}!A:H`,
      valueInputOption: "RAW",
      insertDataOption: "INSERT_ROWS",
      requestBody: {
        values: [
          [
            createdAt,
            fullName.trim(),
            "",
            theirSecret.trim(),
            referer,
            ip,
            userAgent,
            "maayan.space",
          ],
        ],
      },
    })

    return res.status(200).json({ ok: true })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error"
    return res.status(500).json({ ok: false, error: message })
  }
}

