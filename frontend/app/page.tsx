"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Activity, Utensils, Sparkles, ShieldCheck } from "lucide-react"
import { useEffect, useState } from "react"

export default function LandingPage() {
  const [scrollDirection, setScrollDirection] = useState<"down" | "up">("down")

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

  return (
    <div data-scroll-dir={scrollDirection} className="relative min-h-screen overflow-x-hidden bg-[#E7F2EF] text-[#004030]">
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute -top-36 left-1/2 h-[32rem] w-[32rem] -translate-x-1/2 rounded-full blur-3xl"
          style={{ background: "radial-gradient(circle, rgba(74,151,130,0.25) 0%, rgba(74,151,130,0) 70%)" }}
        />
        <div
          className="absolute bottom-[-12rem] right-[-8rem] h-[26rem] w-[26rem] rounded-full blur-3xl"
          style={{ background: "radial-gradient(circle, rgba(255,197,15,0.20) 0%, rgba(255,197,15,0) 75%)" }}
        />
      </div>

      <div className="relative mx-auto flex w-full max-w-[1240px] flex-col px-4 pb-14 pt-6 sm:px-6 lg:px-8">
        <header className="mb-8 rounded-2xl border border-[#A1C2BD] bg-[#FFF9E5]/85 p-3 backdrop-blur-md sm:mb-12 sm:p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="rounded-xl border border-[#DCD0A8] bg-[#FFF9E5] p-2 shadow-sm">
                <Image src="/images/logo.png" alt="Calora Logo" width={32} height={32} className="h-8 w-8 object-contain" />
              </div>
              <div>
                <p className="text-sm font-semibold tracking-[0.18em] text-[#4A9782]">CALORA</p>
                <p className="text-xs text-[#708993]">Smart Nutrition & Activity Tracking</p>
              </div>
            </div>

            <nav className="hidden items-center gap-8 text-sm text-[#708993] md:flex">
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
              <Link
                href="/login"
                className="rounded-xl border border-[#A1C2BD] bg-transparent px-4 py-2 text-sm font-semibold text-[#004030] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#4A9782] hover:bg-[#E7F2EF]"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="rounded-xl border border-[#4A9782] bg-[#4A9782] px-4 py-2 text-sm font-semibold text-[#FFF9E5] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#4A9782]/30"
              >
                Register
              </Link>
            </div>
          </div>
        </header>

        <main className="grid items-center gap-10 lg:grid-cols-[1.08fr_1fr] lg:gap-12">
          <section className="space-y-6 scroll-reveal">
            <p className="inline-flex items-center gap-2 rounded-full border border-[#DCD0A8] bg-[#FFF9E5] px-4 py-1.5 text-xs font-semibold tracking-[0.2em] text-[#4A9782]">
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
              Track meals, activities, macros, and weekly progress with a clean flow designed for focus. Calora helps
              you move from scattered logs to clear daily decisions.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <Link
                href="/signup"
                className="group inline-flex items-center gap-2 rounded-xl border border-[#4A9782] bg-[#4A9782] px-6 py-3 text-sm font-semibold text-[#FFF9E5] transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#4A9782]/35"
              >
                Start Registration
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
              <Link
                href="/features"
                className="inline-flex items-center gap-2 rounded-xl border border-[#DCD0A8] bg-[#FFF9E5] px-6 py-3 text-sm font-semibold text-[#004030] transition-all duration-200 hover:-translate-y-1 hover:border-[#4A9782]"
              >
                Explore Features
              </Link>
            </div>

            <div className="grid gap-3 pt-2 sm:grid-cols-3">
              <div className="rounded-xl border border-[#DCD0A8] bg-[#FFF9E5] p-4 transition-transform duration-200 hover:-translate-y-1">
                <p className="text-2xl font-semibold text-[#004030]">360</p>
                <p className="text-xs text-[#708993]">nutrition + activity visibility</p>
              </div>
              <div className="rounded-xl border border-[#DCD0A8] bg-[#FFF9E5] p-4 transition-transform duration-200 hover:-translate-y-1">
                <p className="text-2xl font-semibold text-[#004030]">AI</p>
                <p className="text-xs text-[#708993]">powered weekly insights</p>
              </div>
              <div className="rounded-xl border border-[#DCD0A8] bg-[#FFF9E5] p-4 transition-transform duration-200 hover:-translate-y-1">
                <p className="text-2xl font-semibold text-[#004030]">1 Tap</p>
                <p className="text-xs text-[#708993]">fast logging workflows</p>
              </div>
            </div>
          </section>

          <section id="insights" className="relative scroll-reveal">
            <div className="relative overflow-hidden rounded-3xl border border-[#A1C2BD] bg-[#FFF9E5] p-6 shadow-2xl shadow-[#4A9782]/15 sm:p-7">
              <div className="absolute inset-0 opacity-35" style={{ backgroundImage: "linear-gradient(125deg, #FFF9E5 0%, #E7F2EF 45%, #FFF9E5 100%)" }} />

              <div className="relative z-10">
                <div className="mb-6 flex items-center justify-between">
                  <p className="text-sm font-semibold tracking-[0.16em] text-[#4A9782]">CALORA LIVE OVERVIEW</p>
                  <span className="rounded-full bg-[#E7F2EF] px-3 py-1 text-xs font-semibold text-[#004030]">Today</span>
                </div>

                <div className="relative mx-auto mb-7 flex h-72 w-full max-w-[370px] items-center justify-center sm:h-80">
                  <div className="pulse-ring absolute h-72 w-72 rounded-full border border-[#A1C2BD]" />
                  <div className="pulse-ring-delayed absolute h-60 w-60 rounded-full border border-[#DCD0A8]" />
                  <div className="float-logo relative rounded-[2rem] border border-[#DCD0A8] bg-[#E7F2EF] p-6 shadow-xl shadow-[#4A9782]/20">
                    <Image src="/images/logo.png" alt="Calora Icon" width={130} height={130} className="h-28 w-28 object-contain sm:h-32 sm:w-32" />
                  </div>

                  <div className="absolute left-1 top-12 rounded-xl border border-[#DCD0A8] bg-[#FFF9E5] px-3 py-2 text-xs shadow-md">
                    <p className="font-semibold text-[#004030]">Consumed</p>
                    <p className="text-[#63A361]">1,580 kcal</p>
                  </div>

                  <div className="absolute right-0 top-6 rounded-xl border border-[#DCD0A8] bg-[#FFF9E5] px-3 py-2 text-xs shadow-md">
                    <p className="font-semibold text-[#004030]">Burned</p>
                    <p className="text-[#FFC50F]">420 kcal</p>
                  </div>

                  <div className="absolute -bottom-1 right-7 rounded-xl border border-[#DCD0A8] bg-[#FFF9E5] px-3 py-2 text-xs shadow-md">
                    <p className="font-semibold text-[#004030]">Protein Goal</p>
                    <p className="text-[#4A9782]">84%</p>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-3" id="features">
                  <article className="group rounded-xl border border-[#DCD0A8] bg-[#FFF9E5] p-3 transition-all duration-200 hover:-translate-y-1 hover:border-[#4A9782]">
                    <Utensils className="mb-2 h-5 w-5 text-[#4A9782]" />
                    <h3 className="text-sm font-semibold text-[#004030]">Meal Tracking</h3>
                    <p className="text-xs text-[#708993]">Fast log + instant macro updates.</p>
                  </article>
                  <article className="group rounded-xl border border-[#DCD0A8] bg-[#FFF9E5] p-3 transition-all duration-200 hover:-translate-y-1 hover:border-[#4A9782]">
                    <Activity className="mb-2 h-5 w-5 text-[#4A9782]" />
                    <h3 className="text-sm font-semibold text-[#004030]">Activity Sync</h3>
                    <p className="text-xs text-[#708993]">Workouts and calories in one feed.</p>
                  </article>
                  <article
                    id="security"
                    className="group rounded-xl border border-[#DCD0A8] bg-[#FFF9E5] p-3 transition-all duration-200 hover:-translate-y-1 hover:border-[#4A9782]"
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
          <article className="scroll-reveal rounded-2xl border border-[#DCD0A8] bg-[#FFF9E5] p-6">
            <p className="text-xs font-semibold tracking-[0.18em] text-[#4A9782]">STEP 01</p>
            <h2 className="mt-2 text-xl font-semibold">Create Your Account</h2>
            <p className="mt-2 text-sm text-[#708993]">
              Start with sign up, complete profile setup, and define your goal and daily calorie target.
            </p>
          </article>
          <article className="scroll-reveal rounded-2xl border border-[#DCD0A8] bg-[#FFF9E5] p-6">
            <p className="text-xs font-semibold tracking-[0.18em] text-[#4A9782]">STEP 02</p>
            <h2 className="mt-2 text-xl font-semibold">Log Meals and Activities</h2>
            <p className="mt-2 text-sm text-[#708993]">
              Use meal logging, food lookup, and activity tracking pages to keep your daily progress accurate.
            </p>
          </article>
          <article className="scroll-reveal rounded-2xl border border-[#DCD0A8] bg-[#FFF9E5] p-6">
            <p className="text-xs font-semibold tracking-[0.18em] text-[#4A9782]">STEP 03</p>
            <h2 className="mt-2 text-xl font-semibold">Review Insights Weekly</h2>
            <p className="mt-2 text-sm text-[#708993]">
              Open analytics and history to understand trends and improve your nutrition consistency.
            </p>
          </article>
        </section>

        <section className="mt-12 scroll-reveal rounded-3xl border border-[#A1C2BD] bg-[#FFF9E5] p-6 sm:p-8">
          <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:items-center">
            <div>
              <p className="text-xs font-semibold tracking-[0.2em] text-[#4A9782]">WHY CALORA</p>
              <h2 className="mt-2 text-3xl font-semibold sm:text-4xl">Built for Daily Clarity, Not Data Overload</h2>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#708993] sm:text-base">
                Calora keeps your flow simple: dashboard for overview, meal and activity pages for logging, and goal
                management for personalization. Premium users can export clean reports and monitor deeper trends.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  href="/login"
                  className="rounded-xl border border-[#A1C2BD] px-5 py-2.5 text-sm font-semibold transition-colors hover:bg-[#E7F2EF]"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="rounded-xl border border-[#4A9782] bg-[#4A9782] px-5 py-2.5 text-sm font-semibold text-[#FFF9E5] transition-opacity hover:opacity-90"
                >
                  Sign Up
                </Link>
              </div>
            </div>
            <div className="grid gap-3">
              <div className="rounded-xl border border-[#DCD0A8] bg-[#E7F2EF] p-4">
                <p className="text-sm font-semibold">Dashboard + Macro Progress</p>
                <p className="mt-1 text-xs text-[#708993]">Calorie and macro status in one glance.</p>
              </div>
              <div className="rounded-xl border border-[#DCD0A8] bg-[#E7F2EF] p-4">
                <p className="text-sm font-semibold">Activity and Device Connections</p>
                <p className="mt-1 text-xs text-[#708993]">Track burned calories and sync behavior.</p>
              </div>
              <div className="rounded-xl border border-[#DCD0A8] bg-[#E7F2EF] p-4">
                <p className="text-sm font-semibold">Advanced Analytics and Exports</p>
                <p className="mt-1 text-xs text-[#708993]">Professional CSV/PDF reports for follow-up.</p>
              </div>
            </div>
          </div>
        </section>
      </div>

      <style jsx>{`
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
      `}</style>
    </div>
  )
}
