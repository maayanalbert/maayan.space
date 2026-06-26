const BLOCKED_HOSTS = new Set(["localhost", "0.0.0.0", "[::1]", "metadata.google.internal"])

function isPrivateIpv4(host: string): boolean {
  const parts = host.split(".").map(Number)
  if (parts.length !== 4 || parts.some((n) => Number.isNaN(n))) return false
  const [a, b] = parts
  if (a === 10) return true
  if (a === 127) return true
  if (a === 0) return true
  if (a === 169 && b === 254) return true
  if (a === 172 && b >= 16 && b <= 31) return true
  if (a === 192 && b === 168) return true
  return false
}

export function isAllowedPreviewUrl(raw: string): boolean {
  try {
    const url = new URL(raw)
    if (url.protocol !== "http:" && url.protocol !== "https:") return false
    const host = url.hostname.toLowerCase()
    if (BLOCKED_HOSTS.has(host)) return false
    if (host.endsWith(".local") || host.endsWith(".internal")) return false
    if (isPrivateIpv4(host)) return false
    return true
  } catch {
    return false
  }
}
