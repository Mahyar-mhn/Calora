const rawApiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8081"

export const API_BASE = rawApiBase.endsWith("/") ? rawApiBase.slice(0, -1) : rawApiBase
