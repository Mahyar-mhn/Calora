"use client"

import { API_BASE } from "@/lib/api"
import Image from "next/image"
import Link from "next/link"
import { Layers, Sparkles } from "lucide-react"
import { useEffect, useState } from "react"

type FeatureItem = {
  title: string
  description: string
  highlight: string
}

type FeatureStats = {
  label: string
  value: string
}

type FeaturesPayload = {
  title: string
  subtitle: string
  items: FeatureItem[]
  stats: FeatureStats[]
}

const fallbackData: FeaturesPayload = {
  title: "Calora Features",
  subtitle: "Everything users need to track nutrition, activity, goals, and premium insights in one workflow.",
  items: [
    {
      title: "Dashboard Overview",
      description: "See consumed, burned, and remaining calories with macro progress in real time.",
      highlight: "Live macro progress",
    },
    {
      title: "Meal and Food Logging",
      description: "Add foods quickly using manual search, barcode scan, or AI-based meal support.",
      highlight: "Fast and accurate logging",
    },
    {
      title: "Activity Tracking",
      description: "Track workouts, duration, and calories burned while syncing with connected devices.",
      highlight: "Device connection support",
    },
  ],
  stats: [
    { label: "Core Modules", value: "9" },
    { label: "Analytics Reports", value: "CSV + PDF" },
    { label: "Role Support", value: "User + Premium" },
    { label: "Platform", value: "Web Responsive" },
  ],
}

export default function FeaturesPage() {
  const [data, setData] = useState<FeaturesPayload>(fallbackData)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${API_BASE}/public/landing/features`)
        if (!res.ok) return
        const payload = (await res.json()) as FeaturesPayload
        if (payload?.title && payload?.items?.length) setData(payload)
      } catch (err) {
        console.error("Failed to load features content", err)
      }
    }

    load()
  }, [])

  return (
    <div className="min-h-screen bg-[#E7F2EF] text-[#004030]">
      <div className="mx-auto w-full max-w-[1200px] px-4 py-6 sm:px-6 lg:px-8">
        <header className="mb-8 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#A1C2BD] bg-[#FFF9E5] p-4">
          <div className="flex items-center gap-3">
            <Image src="/images/logo.png" alt="Calora Logo" width={36} height={36} className="h-9 w-9 object-contain" />
            <div>
              <p className="text-sm font-semibold tracking-[0.16em] text-[#4A9782]">CALORA</p>
              <p className="text-xs text-[#708993]">Feature Library</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/" className="rounded-lg border border-[#A1C2BD] px-4 py-2 text-sm font-semibold hover:bg-[#E7F2EF]">
              Home
            </Link>
            <Link href="/login" className="rounded-lg border border-[#4A9782] bg-[#4A9782] px-4 py-2 text-sm font-semibold text-[#FFF9E5] hover:opacity-90">
              Sign In
            </Link>
          </div>
        </header>

        <main className="space-y-8">
          <section className="rounded-3xl border border-[#A1C2BD] bg-[#FFF9E5] p-6 sm:p-8">
            <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#DCD0A8] bg-[#E7F2EF] px-3 py-1 text-xs font-semibold tracking-[0.18em] text-[#4A9782]">
              <Sparkles className="h-3.5 w-3.5" />
              PLATFORM CAPABILITIES
            </p>
            <h1 className="text-3xl font-semibold sm:text-4xl">{data.title}</h1>
            <p className="mt-3 max-w-3xl text-[#708993]">{data.subtitle}</p>
          </section>

          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {data.items.map((item) => (
              <article
                key={item.title}
                className="rounded-2xl border border-[#DCD0A8] bg-[#FFF9E5] p-5 transition-all duration-200 hover:-translate-y-1 hover:border-[#4A9782] hover:shadow-lg"
              >
                <Layers className="mb-3 h-5 w-5 text-[#4A9782]" />
                <h2 className="text-lg font-semibold">{item.title}</h2>
                <p className="mt-2 text-sm text-[#708993]">{item.description}</p>
                <p className="mt-4 inline-flex rounded-md bg-[#E7F2EF] px-2.5 py-1 text-xs font-semibold text-[#004030]">
                  {item.highlight}
                </p>
              </article>
            ))}
          </section>

          <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {data.stats.map((stat) => (
              <div key={stat.label} className="rounded-xl border border-[#DCD0A8] bg-[#FFF9E5] p-4">
                <p className="text-sm text-[#708993]">{stat.label}</p>
                <p className="mt-1 text-xl font-semibold">{stat.value}</p>
              </div>
            ))}
          </section>
        </main>
      </div>
    </div>
  )
}
