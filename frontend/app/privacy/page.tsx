"use client"

import { API_BASE } from "@/lib/api"
import Image from "next/image"
import Link from "next/link"
import { LockKeyhole, ShieldCheck } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

type PrivacyPrinciple = {
  title: string
  description: string
}

type PrivacyPayload = {
  title: string
  subtitle: string
  principles: PrivacyPrinciple[]
  controls: string[]
}

const fallbackData: PrivacyPayload = {
  title: "Privacy and Account Safety",
  subtitle: "Calora keeps user profile controls simple and account actions transparent.",
  principles: [
    {
      title: "User-Controlled Profile",
      description: "Users can update profile data, goals, activity level, and preferences from their account.",
    },
    {
      title: "Clear Access Flows",
      description: "Authentication and premium access are handled through explicit user actions.",
    },
    {
      title: "Scoped Integrations",
      description: "Device connections can be connected or disconnected directly by the user.",
    },
    {
      title: "Export Transparency",
      description: "Report exports are initiated by the user and generated on request.",
    },
  ],
  controls: [
    "Profile and password updates",
    "Manage notifications",
    "Privacy dashboard settings",
    "Device connection toggles",
  ],
}

export default function PrivacyPage() {
  const router = useRouter()
  const [data, setData] = useState<PrivacyPayload>(fallbackData)
  const [authPromptTarget, setAuthPromptTarget] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${API_BASE}/public/landing/privacy`)
        if (!res.ok) return
        const payload = (await res.json()) as PrivacyPayload
        if (payload?.title && payload?.principles?.length) setData(payload)
      } catch (err) {
        console.error("Failed to load privacy content", err)
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
              <p className="text-xs text-[#708993]">Privacy</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link href="/" className="rounded-lg border border-[#A1C2BD] px-4 py-2 text-sm font-semibold hover:bg-[#E7F2EF]">
              Home
            </Link>
            <button
              className="rounded-lg border border-[#4A9782] bg-[#4A9782] px-4 py-2 text-sm font-semibold text-[#FFF9E5] transition-opacity hover:opacity-90"
              onClick={() => handleProtectedNavigation("/privacy-dashboard")}
            >
              Open Privacy Dashboard
            </button>
          </div>
        </header>

        <main className="space-y-8">
          <section className="rounded-3xl border border-[#A1C2BD] bg-[#FFF9E5] p-6 sm:p-8">
            <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#DCD0A8] bg-[#E7F2EF] px-3 py-1 text-xs font-semibold tracking-[0.18em] text-[#4A9782]">
              <ShieldCheck className="h-3.5 w-3.5" />
              TRUST AND SECURITY
            </p>
            <h1 className="text-3xl font-semibold sm:text-4xl">{data.title}</h1>
            <p className="mt-3 max-w-3xl text-[#708993]">{data.subtitle}</p>
          </section>

          <section className="grid gap-4 sm:grid-cols-2">
            {data.principles.map((item) => (
              <article
                key={item.title}
                className="rounded-2xl border border-[#DCD0A8] bg-[#FFF9E5] p-5 transition-all duration-200 hover:-translate-y-1 hover:border-[#4A9782] hover:shadow-lg"
              >
                <h2 className="text-lg font-semibold">{item.title}</h2>
                <p className="mt-2 text-sm text-[#708993]">{item.description}</p>
              </article>
            ))}
          </section>

          <section className="rounded-2xl border border-[#DCD0A8] bg-[#FFF9E5] p-6">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
              <LockKeyhole className="h-5 w-5 text-[#4A9782]" />
              User Controls Available
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {data.controls.map((item) => (
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
