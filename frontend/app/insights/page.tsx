"use client"

import { API_BASE } from "@/lib/api"
import Image from "next/image"
import Link from "next/link"
import { TrendingUp, ChartBarIncreasing } from "lucide-react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

type InsightCard = {
  label: string
  value: string
  description: string
}

type InsightsPayload = {
  title: string
  subtitle: string
  cards: InsightCard[]
  recommendations: string[]
}

const fallbackData: InsightsPayload = {
  title: "Insights That Drive Better Decisions",
  subtitle: "Calora combines meal logs and activity logs into meaningful trends users can act on daily.",
  cards: [
    {
      label: "Nutrition Accuracy",
      value: "Macro progress",
      description: "Protein, carbs, and fats are compared against daily targets.",
    },
    {
      label: "Energy Balance",
      value: "Consumed vs Burned",
      description: "Users can review net calorie behavior and consistency.",
    },
    {
      label: "Historical Trends",
      value: "Daily to monthly",
      description: "Charts summarize recent behavior and long-term direction.",
    },
    {
      label: "Premium Exports",
      value: "Shareable reports",
      description: "Generate analytics reports in professional CSV/PDF formats.",
    },
  ],
  recommendations: [
    "Log meals as they happen to keep progress bars accurate throughout the day.",
    "Track workouts on the same day to keep net-calorie insights meaningful.",
    "Review weekly trends before adjusting calorie goals to avoid over-corrections.",
    "Use Advanced Analytics export for monthly check-ins and coaching reviews.",
  ],
}

export default function InsightsPage() {
  const router = useRouter()
  const [data, setData] = useState<InsightsPayload>(fallbackData)
  const [authPromptTarget, setAuthPromptTarget] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${API_BASE}/public/landing/insights`)
        if (!res.ok) return
        const payload = (await res.json()) as InsightsPayload
        if (payload?.title && payload?.cards?.length) setData(payload)
      } catch (err) {
        console.error("Failed to load insights content", err)
      }
    }

    load()
  }, [])

  const handleProtectedNavigation = (targetPath: string) => {
    const userStr = localStorage.getItem("calora_user")
    if (userStr) {
      try {
        const user = JSON.parse(userStr)
        if (user?.id) {
          router.push(targetPath)
          return
        }
      } catch {
        // Ignore malformed local storage and show auth prompt.
      }
    }
    setAuthPromptTarget(targetPath)
  }

  return (
    <div className="min-h-screen bg-[#E7F2EF] text-[#004030]">
      <div className="mx-auto w-full max-w-[1200px] px-4 py-6 sm:px-6 lg:px-8">
        <header className="mb-8 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#A1C2BD] bg-[#FFF9E5] p-4">
          <div className="flex items-center gap-3">
            <Image src="/images/logo.png" alt="Calora Logo" width={36} height={36} className="h-9 w-9 object-contain" />
            <div>
              <p className="text-sm font-semibold tracking-[0.16em] text-[#4A9782]">CALORA</p>
              <p className="text-xs text-[#708993]">Insights Center</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/" className="rounded-lg border border-[#A1C2BD] px-4 py-2 text-sm font-semibold hover:bg-[#E7F2EF]">
              Home
            </Link>
            <button
              className="rounded-lg border border-[#4A9782] bg-[#4A9782] px-4 py-2 text-sm font-semibold text-[#FFF9E5] transition-opacity hover:opacity-90"
              onClick={() => handleProtectedNavigation("/advanced-analytics")}
            >
              Open Analytics
            </button>
          </div>
        </header>

        <main className="space-y-8">
          <section className="rounded-3xl border border-[#A1C2BD] bg-[#FFF9E5] p-6 sm:p-8">
            <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#DCD0A8] bg-[#E7F2EF] px-3 py-1 text-xs font-semibold tracking-[0.18em] text-[#4A9782]">
              <ChartBarIncreasing className="h-3.5 w-3.5" />
              TREND INTELLIGENCE
            </p>
            <h1 className="text-3xl font-semibold sm:text-4xl">{data.title}</h1>
            <p className="mt-3 max-w-3xl text-[#708993]">{data.subtitle}</p>
          </section>

          <section className="grid gap-4 sm:grid-cols-2">
            {data.cards.map((card) => (
              <article
                key={card.label}
                className="rounded-2xl border border-[#DCD0A8] bg-[#FFF9E5] p-5 transition-all duration-200 hover:-translate-y-1 hover:border-[#4A9782] hover:shadow-lg"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#708993]">{card.label}</p>
                <h2 className="mt-1 text-xl font-semibold">{card.value}</h2>
                <p className="mt-2 text-sm text-[#708993]">{card.description}</p>
              </article>
            ))}
          </section>

          <section className="rounded-2xl border border-[#DCD0A8] bg-[#FFF9E5] p-6">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
              <TrendingUp className="h-5 w-5 text-[#4A9782]" />
              Practical Recommendations
            </h2>
            <div className="grid gap-3">
              {data.recommendations.map((item) => (
                <p key={item} className="rounded-xl border border-[#DCD0A8] bg-[#E7F2EF] px-4 py-3 text-sm text-[#004030]">
                  {item}
                </p>
              ))}
            </div>
          </section>
        </main>
      </div>

      {authPromptTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button
            className="absolute inset-0 bg-black/40"
            onClick={() => setAuthPromptTarget(null)}
            aria-label="Close login required dialog"
          />
          <div className="relative z-10 w-full max-w-md rounded-2xl border border-[#DCD0A8] bg-[#FFF9E5] p-6 shadow-xl">
            <h2 className="text-xl font-semibold text-[#004030]">Login Required</h2>
            <p className="mt-2 text-sm text-[#708993]">
              Please sign in or create an account first, then we will continue to your requested page.
            </p>
            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <button
                className="rounded-lg border border-[#A1C2BD] px-4 py-2 text-sm font-semibold text-[#004030] transition-colors hover:bg-[#E7F2EF]"
                onClick={() => router.push(`/login?redirect=${encodeURIComponent(authPromptTarget)}`)}
              >
                Sign In
              </button>
              <button
                className="rounded-lg border border-[#4A9782] bg-[#4A9782] px-4 py-2 text-sm font-semibold text-[#FFF9E5] transition-opacity hover:opacity-90"
                onClick={() => router.push(`/signup?redirect=${encodeURIComponent(authPromptTarget)}`)}
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
