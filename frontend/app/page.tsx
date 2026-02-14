"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Activity, Utensils, Sparkles, ShieldCheck } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

const LANDING_GRADIENT_BLOBS = [
  { top: "6%", left: "6%", width: 280, height: 190, delay: 0.4, duration: 24.2, opacity: 0.5, colorA: "rgba(255,197,15,0.58)", colorB: "rgba(255,249,229,0.22)", colorC: "rgba(74,151,130,0)" },
  { top: "15%", left: "30%", width: 340, height: 240, delay: 2.2, duration: 29.6, opacity: 0.4, colorA: "rgba(220,208,168,0.42)", colorB: "rgba(255,197,15,0.20)", colorC: "rgba(74,151,130,0)" },
  { top: "12%", left: "66%", width: 250, height: 180, delay: 1.6, duration: 26.4, opacity: 0.45, colorA: "rgba(255,197,15,0.48)", colorB: "rgba(161,194,189,0.24)", colorC: "rgba(74,151,130,0)" },
  { top: "37%", left: "10%", width: 360, height: 250, delay: 3.1, duration: 31.8, opacity: 0.34, colorA: "rgba(255,249,229,0.45)", colorB: "rgba(74,151,130,0.24)", colorC: "rgba(74,151,130,0)" },
  { top: "46%", left: "42%", width: 310, height: 210, delay: 0.8, duration: 28.5, opacity: 0.42, colorA: "rgba(255,197,15,0.44)", colorB: "rgba(255,249,229,0.18)", colorC: "rgba(74,151,130,0)" },
  { top: "58%", left: "74%", width: 260, height: 180, delay: 4.3, duration: 25.9, opacity: 0.38, colorA: "rgba(220,208,168,0.48)", colorB: "rgba(255,197,15,0.21)", colorC: "rgba(74,151,130,0)" },
  { top: "76%", left: "22%", width: 320, height: 220, delay: 2.9, duration: 30.2, opacity: 0.36, colorA: "rgba(255,197,15,0.35)", colorB: "rgba(161,194,189,0.23)", colorC: "rgba(74,151,130,0)" },
  { top: "80%", left: "60%", width: 290, height: 200, delay: 1.3, duration: 27.2, opacity: 0.34, colorA: "rgba(255,249,229,0.40)", colorB: "rgba(255,197,15,0.18)", colorC: "rgba(74,151,130,0)" },
] as const

const DARK_LANDING_BLOB_COLORS = [
  { colorA: "rgba(90,150,144,0.38)", colorB: "rgba(35,76,106,0.22)", colorC: "rgba(27,60,83,0)" },
  { colorA: "rgba(162,123,92,0.38)", colorB: "rgba(35,76,106,0.18)", colorC: "rgba(27,60,83,0)" },
  { colorA: "rgba(90,150,144,0.32)", colorB: "rgba(69,104,130,0.2)", colorC: "rgba(27,60,83,0)" },
  { colorA: "rgba(63,79,68,0.38)", colorB: "rgba(35,76,106,0.22)", colorC: "rgba(27,60,83,0)" },
  { colorA: "rgba(162,123,92,0.34)", colorB: "rgba(27,60,83,0.2)", colorC: "rgba(27,60,83,0)" },
  { colorA: "rgba(90,150,144,0.34)", colorB: "rgba(35,76,106,0.2)", colorC: "rgba(27,60,83,0)" },
  { colorA: "rgba(63,79,68,0.3)", colorB: "rgba(27,60,83,0.22)", colorC: "rgba(27,60,83,0)" },
  { colorA: "rgba(162,123,92,0.28)", colorB: "rgba(35,76,106,0.18)", colorC: "rgba(27,60,83,0)" },
] as const

export default function LandingPage() {
  const [scrollDirection, setScrollDirection] = useState<"down" | "up">("down")
  const [introPhase, setIntroPhase] = useState<"fire" | "logo" | "done">("fire")
  const { resolvedTheme } = useTheme()
  const [themeReady, setThemeReady] = useState(false)

  useEffect(() => {
    setThemeReady(true)
  }, [])

  useEffect(() => {
    const revealElements = Array.from(document.querySelectorAll<HTMLElement>(".scroll-reveal"))
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view")
          } else {
            entry.target.classList.remove("in-view")
          }
        })
      },
      { threshold: 0.14 }
    )

    revealElements.forEach((el) => observer.observe(el))

    let previousY = window.scrollY
    const onScroll = () => {
      const currentY = window.scrollY
      setScrollDirection(currentY > previousY ? "down" : "up")
      previousY = currentY
    }
    window.addEventListener("scroll", onScroll, { passive: true })

    return () => {
      observer.disconnect()
      window.removeEventListener("scroll", onScroll)
    }
  }, [])

  useEffect(() => {
    const fireTimer = window.setTimeout(() => setIntroPhase("logo"), 1200)
    const doneTimer = window.setTimeout(() => setIntroPhase("done"), 2300)
    return () => {
      window.clearTimeout(fireTimer)
      window.clearTimeout(doneTimer)
    }
  }, [])

  const isDark = themeReady && resolvedTheme === "dark"
  const gradientBlobs = LANDING_GRADIENT_BLOBS.map((blob, index) => ({
    ...blob,
    ...(isDark ? DARK_LANDING_BLOB_COLORS[index % DARK_LANDING_BLOB_COLORS.length] : {}),
  }))
  const orbA = isDark
    ? "radial-gradient(circle, rgba(90,150,144,0.3) 0%, rgba(90,150,144,0) 72%)"
    : "radial-gradient(circle, rgba(74,151,130,0.25) 0%, rgba(74,151,130,0) 70%)"
  const orbB = isDark
    ? "radial-gradient(circle, rgba(162,123,92,0.26) 0%, rgba(162,123,92,0) 75%)"
    : "radial-gradient(circle, rgba(255,197,15,0.20) 0%, rgba(255,197,15,0) 75%)"
  const overlayBackground = isDark
    ? "radial-gradient(circle at center, rgba(35, 76, 106, 0.96) 0%, rgba(27, 60, 83, 0.98) 58%)"
    : "radial-gradient(circle at center, rgba(255, 249, 229, 0.95) 0%, rgba(231, 242, 239, 0.98) 60%)"
  const baseGradient = isDark
    ? "linear-gradient(120deg, #1b3c53 0%, #234c6a 34%, #2f5755 62%, #1b3c53 100%)"
    : "linear-gradient(120deg, #d4e4e8 0%, #dbe9eb 34%, #dce7de 62%, #cfe1e6 100%)"

  return (
    <div
      data-scroll-dir={scrollDirection}
      className={`relative min-h-screen overflow-x-hidden bg-[#E7F2EF] text-[#004030] landing-root ${isDark ? "landing-dark" : ""}`}
    >
      {introPhase !== "done" && (
        <div
          className={`startup-overlay ${introPhase === "logo" ? "startup-logo" : "startup-fire"}`}
          style={{ background: overlayBackground }}
        >
          <div className="startup-center">
            <div className="startup-fire-wrap" aria-hidden={introPhase !== "fire"}>
              <div className="fire-aura fire-aura-wide" />
              <div className="fire-aura fire-aura-tight" />
              <div className="tiny-fire fire-outer" />
              <div className="tiny-fire fire-mid" />
              <div className="tiny-fire fire-inner" />
              <div className="tiny-fire fire-core" />
              <div className="tiny-fire fire-base" />
              <span className="fire-ember ember-1" />
              <span className="fire-ember ember-2" />
              <span className="fire-ember ember-3" />
              <span className="fire-ember ember-4" />
              <span className="fire-smoke smoke-1" />
              <span className="fire-smoke smoke-2" />
            </div>
            <div className="startup-logo-wrap" aria-hidden={introPhase !== "logo"}>
              <div className="startup-logo-shell">
                <Image src="/images/logo.png" alt="Calora Icon" width={86} height={86} className="h-20 w-20 object-contain sm:h-[5.4rem] sm:w-[5.4rem]" />
              </div>
              <p className="startup-brand">CALORA</p>
            </div>
          </div>
        </div>
      )}

      <div className={`landing-content ${introPhase === "done" ? "landing-ready" : ""}`}>
      <div className="pointer-events-none absolute inset-0">
        <div className="base-live-gradient" style={{ background: baseGradient }} />
        <div
          className="absolute -top-36 left-1/2 h-[32rem] w-[32rem] -translate-x-1/2 rounded-full blur-3xl"
          style={{ background: orbA }}
        />
        <div
          className="absolute bottom-[-12rem] right-[-8rem] h-[26rem] w-[26rem] rounded-full blur-3xl"
          style={{ background: orbB }}
        />
        <div className="gradient-blob-field" aria-hidden="true">
          {gradientBlobs.map((blob, idx) => (
            <span
              key={`blob-${idx}`}
              className="floating-gradient-blob"
              style={{
                top: blob.top,
                left: blob.left,
                width: `${blob.width}px`,
                height: `${blob.height}px`,
                opacity: blob.opacity,
                background: `radial-gradient(ellipse at 32% 38%, ${blob.colorA} 0%, ${blob.colorB} 50%, ${blob.colorC} 100%)`,
                animationDuration: `${blob.duration}s, ${Math.max(7.2, blob.duration * 0.56)}s`,
                animationDelay: `-${blob.delay}s, -${(blob.delay * 0.7).toFixed(2)}s`,
              }}
            />
          ))}
        </div>
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-[1240px] flex-col px-4 pb-14 pt-6 sm:px-6 lg:px-8">
        <header className="landing-header mb-8 rounded-2xl border border-[#A1C2BD] bg-[#FFF9E5] p-3 sm:mb-12 sm:p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="landing-logo-shell rounded-xl border border-[#DCD0A8] bg-[#FFF9E5] p-2 shadow-sm">
                <Image src="/images/logo.png" alt="Calora Logo" width={32} height={32} className="h-8 w-8 object-contain" />
              </div>
              <div>
                <p className="landing-brand text-sm font-semibold tracking-[0.18em] text-[#4A9782]">CALORA</p>
                <p className="text-xs text-[#708993]">Smart Nutrition & Activity Tracking</p>
              </div>
            </div>

            <nav className="landing-nav hidden items-center gap-8 text-sm text-[#708993] md:flex">
              <Link href="/features" className="transition-colors hover:text-[#004030]">
                Features
              </Link>
              <Link href="/insights" className="transition-colors hover:text-[#004030]">
                Insights
              </Link>
              <Link href="/privacy" className="transition-colors hover:text-[#004030]">
                Privacy
              </Link>
            </nav>

            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Link
                href="/login"
                className="landing-signin rounded-xl border border-[#A1C2BD] bg-transparent px-4 py-2 text-sm font-semibold text-[#004030] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#4A9782] hover:bg-[#E7F2EF]"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="landing-register rounded-xl border border-[#4A9782] bg-[#4A9782] px-4 py-2 text-sm font-semibold text-[#FFF9E5] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#4A9782]/30"
              >
                Register
              </Link>
            </div>
          </div>
        </header>

        <main className="landing-main grid items-center gap-10 lg:grid-cols-[1.08fr_1fr] lg:gap-12">
          <section className="space-y-6 scroll-reveal">
            <p className="landing-pill inline-flex items-center gap-2 rounded-full border border-[#DCD0A8] bg-[#FFF9E5] px-4 py-1.5 text-xs font-semibold tracking-[0.2em] text-[#4A9782]">
              <Sparkles className="h-3.5 w-3.5" />
              NEW EXPERIENCE
            </p>

            <h1 className="text-balance text-4xl font-semibold leading-[1.05] text-[#004030] sm:text-5xl lg:text-6xl">
              Your Health Dashboard,{" "}
              <span className="bg-gradient-to-r from-[#004030] via-[#4A9782] to-[#63A361] bg-clip-text text-transparent">
                One Calm Place
              </span>
            </h1>

            <p className="max-w-xl text-pretty text-base leading-relaxed text-[#708993] sm:text-lg">
              Track meals, activities, macros, and weekly progress with a clean flow designed for focus. Explore the
              community, follow people, and use direct messaging while staying consistent with your own goals.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <Link
                href="/signup"
                className="landing-primary group inline-flex items-center gap-2 rounded-xl border border-[#4A9782] bg-[#4A9782] px-6 py-3 text-sm font-semibold text-[#FFF9E5] transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#4A9782]/35"
              >
                Start Registration
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
              <Link
                href="/features"
                className="landing-secondary inline-flex items-center gap-2 rounded-xl border border-[#DCD0A8] bg-[#FFF9E5] px-6 py-3 text-sm font-semibold text-[#004030] transition-all duration-200 hover:-translate-y-1 hover:border-[#4A9782]"
              >
                Explore Features
              </Link>
            </div>

            <div className="grid gap-3 pt-2 sm:grid-cols-3">
              <div className="landing-stat-card rounded-xl border border-[#DCD0A8] bg-[#FFF9E5] p-4 transition-transform duration-200 hover:-translate-y-1">
                <p className="text-2xl font-semibold text-[#004030]">360</p>
                <p className="text-xs text-[#708993]">nutrition + activity visibility</p>
              </div>
              <div className="landing-stat-card rounded-xl border border-[#DCD0A8] bg-[#FFF9E5] p-4 transition-transform duration-200 hover:-translate-y-1">
                <p className="text-2xl font-semibold text-[#004030]">AI</p>
                <p className="text-xs text-[#708993]">powered weekly insights</p>
              </div>
              <div className="landing-stat-card rounded-xl border border-[#DCD0A8] bg-[#FFF9E5] p-4 transition-transform duration-200 hover:-translate-y-1">
                <p className="text-2xl font-semibold text-[#004030]">1 Tap</p>
                <p className="text-xs text-[#708993]">fast logging workflows</p>
              </div>
            </div>
          </section>

          <section id="insights" className="relative scroll-reveal">
            <div className="landing-hero-card relative overflow-hidden rounded-3xl border border-[#A1C2BD] bg-[#FFF9E5] p-6 shadow-2xl shadow-[#4A9782]/15 sm:p-7">
              <div className="landing-hero-overlay absolute inset-0 opacity-35" style={{ backgroundImage: "linear-gradient(125deg, #FFF9E5 0%, #E7F2EF 45%, #FFF9E5 100%)" }} />

              <div className="relative z-10">
                <div className="mb-6 flex items-center justify-between">
                  <p className="landing-overview-label text-sm font-semibold tracking-[0.16em] text-[#4A9782]">CALORA LIVE OVERVIEW</p>
                  <span className="landing-today rounded-full bg-[#E7F2EF] px-3 py-1 text-xs font-semibold text-[#004030]">Today</span>
                </div>

                <div className="relative mx-auto mb-7 flex h-72 w-full max-w-[370px] items-center justify-center sm:h-80">
                  <div className="pulse-ring absolute h-72 w-72 rounded-full border border-[#A1C2BD]" />
                  <div className="pulse-ring-delayed absolute h-60 w-60 rounded-full border border-[#DCD0A8]" />
                  <div className="landing-logo-card float-logo relative rounded-[2rem] border border-[#DCD0A8] bg-[#E7F2EF] p-6 shadow-xl shadow-[#4A9782]/20">
                    <Image src="/images/logo.png" alt="Calora Icon" width={130} height={130} className="h-28 w-28 object-contain sm:h-32 sm:w-32" />
                  </div>

                  <div className="landing-float-card absolute left-1 top-12 rounded-xl border border-[#DCD0A8] bg-[#FFF9E5] px-3 py-2 text-xs shadow-md">
                    <p className="font-semibold text-[#004030]">Consumed</p>
                    <p className="text-[#63A361]">1,580 kcal</p>
                  </div>

                  <div className="landing-float-card absolute right-0 top-6 rounded-xl border border-[#DCD0A8] bg-[#FFF9E5] px-3 py-2 text-xs shadow-md">
                    <p className="font-semibold text-[#004030]">Burned</p>
                    <p className="text-[#FFC50F]">420 kcal</p>
                  </div>

                  <div className="landing-float-card absolute -bottom-1 right-7 rounded-xl border border-[#DCD0A8] bg-[#FFF9E5] px-3 py-2 text-xs shadow-md">
                    <p className="font-semibold text-[#004030]">Protein Goal</p>
                    <p className="text-[#4A9782]">84%</p>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-3" id="features">
                  <article className="landing-mini-card group rounded-xl border border-[#DCD0A8] bg-[#FFF9E5] p-3 transition-all duration-200 hover:-translate-y-1 hover:border-[#4A9782]">
                    <Utensils className="mb-2 h-5 w-5 text-[#4A9782]" />
                    <h3 className="text-sm font-semibold text-[#004030]">Meal Tracking</h3>
                    <p className="text-xs text-[#708993]">Fast log + instant macro updates.</p>
                  </article>
                  <article className="landing-mini-card group rounded-xl border border-[#DCD0A8] bg-[#FFF9E5] p-3 transition-all duration-200 hover:-translate-y-1 hover:border-[#4A9782]">
                    <Activity className="mb-2 h-5 w-5 text-[#4A9782]" />
                    <h3 className="text-sm font-semibold text-[#004030]">Activity Sync</h3>
                    <p className="text-xs text-[#708993]">Workouts and calories in one feed.</p>
                  </article>
                  <article
                    id="security"
                    className="landing-mini-card group rounded-xl border border-[#DCD0A8] bg-[#FFF9E5] p-3 transition-all duration-200 hover:-translate-y-1 hover:border-[#4A9782]"
                  >
                    <ShieldCheck className="mb-2 h-5 w-5 text-[#4A9782]" />
                    <h3 className="text-sm font-semibold text-[#004030]">Privacy First</h3>
                    <p className="text-xs text-[#708993]">Secure account and clean controls.</p>
                  </article>
                </div>
              </div>
            </div>
          </section>
        </main>

        <section className="mt-14 grid gap-4 md:grid-cols-3">
          <article className="landing-step-card scroll-reveal rounded-2xl border border-[#DCD0A8] bg-[#FFF9E5] p-6">
            <p className="text-xs font-semibold tracking-[0.18em] text-[#4A9782]">STEP 01</p>
            <h2 className="mt-2 text-xl font-semibold">Create Your Account</h2>
            <p className="mt-2 text-sm text-[#708993]">
              Start with sign up, complete profile setup, and define your goal and daily calorie target.
            </p>
          </article>
          <article className="landing-step-card scroll-reveal rounded-2xl border border-[#DCD0A8] bg-[#FFF9E5] p-6">
            <p className="text-xs font-semibold tracking-[0.18em] text-[#4A9782]">STEP 02</p>
            <h2 className="mt-2 text-xl font-semibold">Log Meals and Activities</h2>
            <p className="mt-2 text-sm text-[#708993]">
              Use meal logging, food lookup, and activity tracking pages to keep your daily progress accurate.
            </p>
          </article>
          <article className="landing-step-card scroll-reveal rounded-2xl border border-[#DCD0A8] bg-[#FFF9E5] p-6">
            <p className="text-xs font-semibold tracking-[0.18em] text-[#4A9782]">STEP 03</p>
            <h2 className="mt-2 text-xl font-semibold">Explore and Message</h2>
            <p className="mt-2 text-sm text-[#708993]">
              Find people in Explore, follow progress, and send direct messages to stay accountable together.
            </p>
          </article>
        </section>

        <section className="landing-why mt-12 scroll-reveal rounded-3xl border border-[#A1C2BD] bg-[#FFF9E5] p-6 sm:p-8">
          <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:items-center">
            <div>
              <p className="text-xs font-semibold tracking-[0.2em] text-[#4A9782]">WHY CALORA</p>
              <h2 className="mt-2 text-3xl font-semibold sm:text-4xl">Built for Daily Clarity, Not Data Overload</h2>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#708993] sm:text-base">
                Calora keeps your flow simple: dashboard for overview, meal and activity pages for logging, and goal
                management for personalization. You also get Explore and direct messaging for community support.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  href="/login"
                  className="landing-cta-secondary rounded-xl border border-[#A1C2BD] px-5 py-2.5 text-sm font-semibold transition-colors hover:bg-[#E7F2EF]"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="landing-cta-primary rounded-xl border border-[#4A9782] bg-[#4A9782] px-5 py-2.5 text-sm font-semibold text-[#FFF9E5] transition-opacity hover:opacity-90"
                >
                  Sign Up
                </Link>
              </div>
            </div>
            <div className="grid gap-3">
              <div className="landing-why-item rounded-xl border border-[#DCD0A8] bg-[#E7F2EF] p-4">
                <p className="text-sm font-semibold">Dashboard + Macro Progress</p>
                <p className="mt-1 text-xs text-[#708993]">Calorie and macro status in one glance.</p>
              </div>
              <div className="landing-why-item rounded-xl border border-[#DCD0A8] bg-[#E7F2EF] p-4">
                <p className="text-sm font-semibold">Explore and Messaging</p>
                <p className="mt-1 text-xs text-[#708993]">Search people, follow, and chat directly.</p>
              </div>
              <div className="landing-why-item rounded-xl border border-[#DCD0A8] bg-[#E7F2EF] p-4">
                <p className="text-sm font-semibold">Advanced Analytics and Exports</p>
                <p className="mt-1 text-xs text-[#708993]">Professional CSV/PDF reports for follow-up.</p>
              </div>
            </div>
          </div>
        </section>
      </div>
      </div>

      <style jsx>{`
        .landing-content {
          opacity: 0;
          transform: translateY(16px) scale(0.992);
          transition: opacity 520ms ease, transform 520ms ease;
        }

        .landing-content.landing-ready {
          opacity: 1;
          transform: translateY(0) scale(1);
        }

        .landing-dark {
          color: #e9e1d7;
        }

        .landing-dark .landing-main {
          background: transparent !important;
        }

        .landing-dark .landing-header {
          background: rgba(16, 32, 44, 0.82) !important;
          border-color: rgba(117, 165, 178, 0.28) !important;
          box-shadow: 0 18px 40px rgba(7, 18, 28, 0.45) !important;
          backdrop-filter: blur(18px);
        }

        .landing-dark .landing-logo-shell {
          background: rgba(14, 30, 42, 0.9) !important;
          border-color: rgba(117, 165, 178, 0.35) !important;
          box-shadow: 0 12px 24px rgba(7, 18, 28, 0.5) !important;
        }

        .landing-dark .landing-brand {
          color: #9bd3c8 !important;
        }

        .landing-dark .landing-nav a {
          color: #c7d3de !important;
        }

        .landing-dark .landing-nav a:hover {
          color: #f3ede3 !important;
        }

        .landing-dark .landing-signin {
          background: rgba(12, 26, 37, 0.6) !important;
          border-color: rgba(117, 165, 178, 0.35) !important;
          color: #e9e1d7 !important;
        }

        .landing-dark .landing-signin:hover {
          background: rgba(29, 54, 70, 0.7) !important;
          border-color: rgba(90, 150, 144, 0.55) !important;
        }

        .landing-dark .landing-register,
        .landing-dark .landing-primary,
        .landing-dark .landing-cta-primary {
          background: linear-gradient(135deg, #5a9690 0%, #3f7f7a 100%) !important;
          border-color: rgba(90, 150, 144, 0.85) !important;
          color: #f2ede6 !important;
          box-shadow: 0 18px 34px rgba(7, 18, 28, 0.5) !important;
        }

        .landing-dark .landing-register:hover,
        .landing-dark .landing-primary:hover,
        .landing-dark .landing-cta-primary:hover {
          filter: brightness(1.08);
        }

        .landing-dark .landing-secondary,
        .landing-dark .landing-cta-secondary {
          background: rgba(16, 32, 44, 0.7) !important;
          border-color: rgba(117, 165, 178, 0.32) !important;
          color: #e9e1d7 !important;
        }

        .landing-dark .landing-secondary:hover,
        .landing-dark .landing-cta-secondary:hover {
          background: rgba(29, 54, 70, 0.78) !important;
          border-color: rgba(90, 150, 144, 0.6) !important;
        }

        .landing-dark .landing-pill {
          background: rgba(21, 44, 60, 0.72) !important;
          border-color: rgba(90, 150, 144, 0.45) !important;
          color: #9fd0c7 !important;
        }

        .landing-dark .landing-pill svg {
          color: #9fd0c7 !important;
        }

        .landing-dark .landing-stat-card {
          background: rgba(19, 39, 55, 0.9) !important;
          border-color: rgba(117, 165, 178, 0.25) !important;
          box-shadow: 0 18px 36px rgba(7, 18, 28, 0.45) !important;
        }

        .landing-dark .landing-stat-card p {
          color: #f1eae1 !important;
        }

        .landing-dark .landing-stat-card p + p {
          color: #c0b7ad !important;
        }

        .landing-dark .landing-hero-card {
          background: rgba(20, 40, 56, 0.92) !important;
          border-color: rgba(117, 165, 178, 0.3) !important;
          box-shadow: 0 32px 70px rgba(7, 18, 28, 0.6) !important;
        }

        .landing-dark .landing-hero-overlay {
          background-image: linear-gradient(135deg, rgba(36, 72, 92, 0.6) 0%, rgba(18, 36, 52, 0.9) 56%, rgba(36, 72, 92, 0.6) 100%) !important;
          opacity: 0.7 !important;
        }

        .landing-dark .landing-overview-label {
          color: #8dcfc2 !important;
        }

        .landing-dark .landing-today {
          background: rgba(15, 30, 43, 0.8) !important;
          color: #e9e1d7 !important;
          border: 1px solid rgba(90, 150, 144, 0.35) !important;
        }

        .landing-dark .pulse-ring {
          border-color: rgba(117, 165, 178, 0.25) !important;
        }

        .landing-dark .pulse-ring-delayed {
          border-color: rgba(90, 150, 144, 0.25) !important;
        }

        .landing-dark .landing-logo-card {
          background: rgba(15, 32, 45, 0.92) !important;
          border-color: rgba(90, 150, 144, 0.35) !important;
          box-shadow: 0 18px 40px rgba(7, 18, 28, 0.5) !important;
        }

        .landing-dark .landing-float-card {
          background: rgba(20, 43, 60, 0.92) !important;
          border-color: rgba(117, 165, 178, 0.25) !important;
          box-shadow: 0 12px 26px rgba(7, 18, 28, 0.45) !important;
        }

        .landing-dark .landing-mini-card {
          background: rgba(20, 43, 60, 0.9) !important;
          border-color: rgba(117, 165, 178, 0.24) !important;
        }

        .landing-dark .landing-mini-card:hover {
          background: rgba(28, 54, 72, 0.95) !important;
          border-color: rgba(90, 150, 144, 0.55) !important;
        }

        .landing-dark .landing-step-card {
          background: rgba(20, 40, 56, 0.9) !important;
          border-color: rgba(117, 165, 178, 0.25) !important;
          box-shadow: 0 18px 36px rgba(7, 18, 28, 0.45) !important;
        }

        .landing-dark .landing-step-card p {
          color: #c8c0b7 !important;
        }

        .landing-dark .landing-step-card h2 {
          color: #f1eae1 !important;
        }

        .landing-dark .landing-why {
          background: rgba(18, 36, 52, 0.9) !important;
          border-color: rgba(117, 165, 178, 0.3) !important;
          box-shadow: 0 24px 54px rgba(7, 18, 28, 0.5) !important;
        }

        .landing-dark .landing-why-item {
          background: rgba(16, 32, 44, 0.85) !important;
          border-color: rgba(117, 165, 178, 0.22) !important;
        }

        .landing-dark .landing-why-item p {
          color: #e7dfd6 !important;
        }

        .landing-dark .landing-why-item p + p {
          color: #c0b7ad !important;
        }

        .startup-overlay {
          position: fixed;
          inset: 0;
          z-index: 120;
          display: grid;
          place-items: center;
          transition: opacity 360ms ease, transform 360ms ease;
        }

        .gradient-blob-field {
          position: absolute;
          inset: 0;
          overflow: clip;
          z-index: 1;
          pointer-events: none;
        }

        .base-live-gradient {
          position: absolute;
          inset: -18%;
          background-size: 170% 170%;
          animation: baseGradientDrift 22s ease-in-out infinite;
          opacity: 0.9;
        }

        .floating-gradient-blob {
          position: absolute;
          border-radius: 58% 42% 50% 50% / 38% 55% 45% 62%;
          filter: blur(2px);
          mix-blend-mode: normal;
          animation-name: blobFloat, blobGlow;
          animation-iteration-count: infinite, infinite;
          animation-timing-function: ease-in-out, ease-in-out;
          will-change: transform, opacity;
        }

        .floating-gradient-blob::after {
          content: "";
          position: absolute;
          top: 20%;
          left: 16%;
          width: 46%;
          height: 38%;
          border-radius: 999px;
          background: radial-gradient(circle, rgba(255, 255, 255, 0.44) 0%, rgba(255, 255, 255, 0) 86%);
          filter: blur(3px);
        }

        .startup-center {
          display: grid;
          place-items: center;
          min-height: 12rem;
        }

        .startup-fire-wrap,
        .startup-logo-wrap {
          grid-area: 1 / 1;
          opacity: 0;
          transform: scale(0.86) translateY(10px);
          transition: opacity 280ms ease, transform 280ms ease;
        }

        .startup-fire .startup-fire-wrap {
          opacity: 1;
          transform: scale(1) translateY(0);
        }

        .startup-logo .startup-fire-wrap {
          opacity: 0;
          transform: scale(0.72) translateY(12px);
        }

        .startup-logo .startup-logo-wrap {
          opacity: 1;
          transform: scale(1) translateY(0);
        }

        .startup-logo-shell {
          display: grid;
          place-items: center;
          width: 6.1rem;
          height: 6.1rem;
          border: 1px solid #dcd0a8;
          border-radius: 1.35rem;
          background: #fff9e5;
          box-shadow: 0 16px 36px rgba(74, 151, 130, 0.24);
          animation: logoBreathe 900ms ease-in-out infinite;
        }

        .startup-brand {
          margin-top: 0.5rem;
          text-align: center;
          font-size: 0.78rem;
          font-weight: 700;
          letter-spacing: 0.24em;
          color: #4a9782;
        }

        :global(.dark) .base-live-gradient {
          opacity: 0.92;
        }

        :global(.dark) .gradient-blob-field {
          opacity: 0.48;
        }

        :global(.dark) .floating-gradient-blob::after {
          background: radial-gradient(circle, rgba(210, 193, 182, 0.18) 0%, rgba(210, 193, 182, 0) 86%);
        }

        :global(.dark) .startup-logo-shell {
          border-color: #456882;
          background: #234c6a;
          animation-name: logoBreatheDark;
        }

        :global(.dark) .startup-brand {
          color: #5a9690;
        }

        .startup-fire-wrap {
          position: relative;
          width: 7rem;
          height: 8.8rem;
        }

        .tiny-fire {
          position: absolute;
          left: 50%;
          transform-origin: 50% 100%;
          border-radius: 56% 44% 52% 48% / 70% 70% 30% 30%;
        }

        .fire-aura {
          position: absolute;
          left: 50%;
          bottom: 0.2rem;
          transform: translateX(-50%);
          border-radius: 999px;
          pointer-events: none;
          mix-blend-mode: multiply;
        }

        .fire-aura-wide {
          width: 7rem;
          height: 2.8rem;
          background: radial-gradient(circle at center, rgba(255, 153, 0, 0.45) 0%, rgba(255, 153, 0, 0) 72%);
          filter: blur(8px);
          animation: auraPulse 950ms ease-in-out infinite;
        }

        .fire-aura-tight {
          width: 4.9rem;
          height: 1.8rem;
          background: radial-gradient(circle at center, rgba(255, 224, 130, 0.65) 0%, rgba(255, 224, 130, 0) 76%);
          filter: blur(4px);
          animation: auraPulse 720ms ease-in-out 130ms infinite;
        }

        .fire-outer {
          width: 4.1rem;
          height: 6.6rem;
          bottom: 0.55rem;
          margin-left: -2.05rem;
          background: radial-gradient(
            82% 68% at 50% 24%,
            rgba(255, 253, 235, 0.98) 0%,
            rgba(255, 208, 87, 0.9) 34%,
            rgba(255, 150, 27, 0.92) 62%,
            rgba(239, 62, 0, 0.95) 100%
          );
          filter: drop-shadow(0 0 18px rgba(255, 132, 8, 0.6));
          animation: flicker 620ms ease-in-out infinite;
        }

        .fire-mid {
          width: 2.9rem;
          height: 5rem;
          bottom: 0.9rem;
          margin-left: -1.45rem;
          background: radial-gradient(
            84% 70% at 50% 20%,
            rgba(255, 252, 237, 0.98) 0%,
            rgba(255, 225, 143, 0.92) 42%,
            rgba(255, 167, 46, 0.92) 100%
          );
          animation: flicker 500ms ease-in-out 80ms infinite;
        }

        .fire-inner {
          width: 2rem;
          height: 3.25rem;
          bottom: 1.5rem;
          margin-left: -1rem;
          background: radial-gradient(
            88% 74% at 50% 22%,
            rgba(255, 255, 249, 0.98) 0%,
            rgba(255, 244, 198, 0.95) 52%,
            rgba(255, 209, 112, 0.9) 100%
          );
          animation: flicker 430ms ease-in-out 120ms infinite;
        }

        .fire-core {
          width: 1rem;
          height: 1.65rem;
          bottom: 2.1rem;
          margin-left: -0.5rem;
          background: radial-gradient(circle at 50% 22%, #ffffff 0%, #fff8d9 70%, #ffe9b3 100%);
          animation: flicker 340ms ease-in-out 140ms infinite;
        }

        .fire-base {
          width: 3.7rem;
          height: 0.62rem;
          bottom: 0;
          margin-left: -1.85rem;
          background: linear-gradient(90deg, rgba(255, 126, 0, 0.32) 0%, rgba(255, 188, 62, 0.72) 48%, rgba(255, 126, 0, 0.32) 100%);
          filter: blur(3px);
          animation: baseGlow 680ms ease-in-out infinite;
        }

        .fire-ember {
          position: absolute;
          bottom: 1.1rem;
          left: 50%;
          width: 0.32rem;
          height: 0.32rem;
          border-radius: 999px;
          background: radial-gradient(circle, rgba(255, 244, 173, 1) 0%, rgba(255, 167, 37, 0.95) 60%, rgba(255, 120, 0, 0) 100%);
          pointer-events: none;
          animation: emberRise 1.25s linear infinite;
        }

        .ember-1 {
          margin-left: -1.55rem;
          animation-delay: 0ms;
        }

        .ember-2 {
          margin-left: 1.3rem;
          animation-delay: 340ms;
        }

        .ember-3 {
          margin-left: -0.2rem;
          animation-delay: 520ms;
        }

        .ember-4 {
          margin-left: 0.85rem;
          animation-delay: 780ms;
        }

        .fire-smoke {
          position: absolute;
          left: 50%;
          top: 0.2rem;
          border-radius: 999px;
          background: rgba(92, 122, 129, 0.16);
          filter: blur(1.2px);
          pointer-events: none;
          animation: smokeDrift 1.4s ease-out infinite;
        }

        .smoke-1 {
          width: 0.9rem;
          height: 0.9rem;
          margin-left: -1rem;
          animation-delay: 120ms;
        }

        .smoke-2 {
          width: 0.72rem;
          height: 0.72rem;
          margin-left: 0.4rem;
          animation-delay: 560ms;
        }

        .scroll-reveal {
          opacity: 0;
          transition: transform 700ms ease, opacity 700ms ease;
          will-change: transform, opacity;
        }

        [data-scroll-dir="down"] :global(.scroll-reveal) {
          transform: translateY(26px);
        }

        [data-scroll-dir="up"] :global(.scroll-reveal) {
          transform: translateY(-26px);
        }

        .scroll-reveal.in-view {
          opacity: 1;
          transform: translateY(0);
        }

        .float-logo {
          animation: floatLogo 4.2s ease-in-out infinite;
        }

        .pulse-ring {
          animation: pulseRing 3.8s ease-in-out infinite;
        }

        .pulse-ring-delayed {
          animation: pulseRing 3.8s ease-in-out 1.6s infinite;
        }

        @keyframes floatLogo {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes pulseRing {
          0%,
          100% {
            transform: scale(1);
            opacity: 0.55;
          }
          50% {
            transform: scale(1.06);
            opacity: 1;
          }
        }

        @keyframes flicker {
          0%,
          100% {
            transform: translateX(-50%) scaleY(1) scaleX(1) rotate(0deg);
            opacity: 0.95;
          }
          30% {
            transform: translateX(-50%) scaleY(1.13) scaleX(0.92) rotate(-1.8deg);
            opacity: 1;
          }
          56% {
            transform: translateX(-50%) scaleY(0.91) scaleX(1.05) rotate(1.5deg);
            opacity: 0.88;
          }
          80% {
            transform: translateX(-50%) scaleY(1.05) scaleX(0.96) rotate(-0.6deg);
            opacity: 0.97;
          }
        }

        @keyframes auraPulse {
          0%,
          100% {
            opacity: 0.45;
            transform: translateX(-50%) scale(0.96);
          }
          50% {
            opacity: 0.95;
            transform: translateX(-50%) scale(1.08);
          }
        }

        @keyframes emberRise {
          0% {
            transform: translateY(0) translateX(0) scale(1);
            opacity: 0;
          }
          12% {
            opacity: 0.95;
          }
          75% {
            opacity: 0.65;
          }
          100% {
            transform: translateY(-4.6rem) translateX(0.5rem) scale(0.56);
            opacity: 0;
          }
        }

        @keyframes smokeDrift {
          0% {
            transform: translateY(0) translateX(0) scale(0.72);
            opacity: 0;
          }
          35% {
            opacity: 0.34;
          }
          100% {
            transform: translateY(-2.2rem) translateX(0.8rem) scale(1.15);
            opacity: 0;
          }
        }

        @keyframes blobFloat {
          0% {
            transform: translate3d(0, 0, 0) scale(0.96) rotate(0deg);
          }
          20% {
            transform: translate3d(12vw, -10vh, 0) scale(1.03) rotate(6deg);
          }
          42% {
            transform: translate3d(-11vw, 14vh, 0) scale(0.94) rotate(-7deg);
          }
          68% {
            transform: translate3d(14vw, 21vh, 0) scale(1.06) rotate(4deg);
          }
          86% {
            transform: translate3d(-8vw, -12vh, 0) scale(0.98) rotate(-4deg);
          }
          100% {
            transform: translate3d(0, 0, 0) scale(0.96) rotate(0deg);
          }
        }

        @keyframes blobGlow {
          0%,
          100% {
            opacity: 0.24;
            filter: blur(2px);
          }
          50% {
            opacity: 0.6;
            filter: blur(0.8px);
          }
        }

        @keyframes baseGradientDrift {
          0%,
          100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        @keyframes baseGlow {
          0%,
          100% {
            opacity: 0.58;
            transform: translateX(-50%) scaleX(1);
          }
          50% {
            opacity: 0.88;
            transform: translateX(-50%) scaleX(1.14);
          }
        }

        @keyframes logoBreathe {
          0%,
          100% {
            transform: translateY(0);
            box-shadow: 0 16px 36px rgba(74, 151, 130, 0.24);
          }
          50% {
            transform: translateY(-4px);
            box-shadow: 0 20px 40px rgba(74, 151, 130, 0.28);
          }
        }

        @keyframes logoBreatheDark {
          0%,
          100% {
            transform: translateY(0);
            box-shadow: 0 16px 36px rgba(90, 150, 144, 0.18);
          }
          50% {
            transform: translateY(-4px);
            box-shadow: 0 20px 40px rgba(90, 150, 144, 0.24);
          }
        }
      `}</style>
    </div>
  )
}
