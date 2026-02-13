const defaultHost =
  typeof window !== "undefined" && window.location?.hostname ? window.location.hostname : "127.0.0.1"
const rawApiBase = process.env.NEXT_PUBLIC_API_URL || `http://${defaultHost}:8081`

export const API_BASE = rawApiBase.endsWith("/") ? rawApiBase.slice(0, -1) : rawApiBase
