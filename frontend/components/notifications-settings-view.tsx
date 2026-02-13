"use client"

import { useState } from "react"
import { useMenuInteractions } from "@/hooks/use-menu-interactions"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Menu, Home, Utensils, Cookie, Activity, History, ArrowLeft } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import ProfileAvatarButton from "./profile-avatar-button"
import { ThemeToggle } from "@/components/theme-toggle"

export default function NotificationsSettingsView() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { menuButtonRef, menuPanelRef } = useMenuInteractions(isMenuOpen, setIsMenuOpen)
  const router = useRouter()

  // Notification preferences state
  const [mealReminders, setMealReminders] = useState(true)
  const [hydrationAlerts, setHydrationAlerts] = useState(true)
  const [streaksNudges, setStreaksNudges] = useState(false)

  const handleNavigation = (path: string) => {
    router.push(path)
    setIsMenuOpen(false)
  }

  const handleSave = () => {
    console.log("Saving notification settings:", { mealReminders, hydrationAlerts, streaksNudges })
    alert("Your notification preferences have been updated!")
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#E7F2EF" }}>
      {/* Header */}
      <header className="border-b" style={{ backgroundColor: "#FFF9E5", borderColor: "#DCD0A8" }}>
        <div className="mx-auto w-full max-w-[1600px] px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                className="rounded-lg bg-transparent"
                style={{
                  borderColor: "#4A9782",
                  color: "#004030",
                }}
                ref={menuButtonRef}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <Menu className={`h-5 w-5 transition-transform duration-300 ${isMenuOpen ? "rotate-180" : "rotate-0"}`} />
              </Button>
              <button
                onClick={() => router.push("/dashboard")}
                className="cursor-pointer transition-opacity hover:opacity-80"
                aria-label="Go to Dashboard"
              >
                <Image src="/images/logo.png" alt="Calora Logo" width={40} height={40} className="h-10 w-10" />
              </button>
              <h1 className="text-2xl font-bold" style={{ color: "#004030" }}>
                Notifications
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <ProfileAvatarButton onClick={() => handleNavigation("/profile")} />
            </div>
          </div>
        </div>
      </header>

      {/* Navigation menu dropdown */}
      {isMenuOpen && (
        <div className="relative z-50">
          <div
            className="absolute left-4 top-2 z-50 w-[min(20rem,calc(100vw-2rem))] origin-top-left rounded-lg border shadow-lg animate-in fade-in-0 zoom-in-95 duration-200 sm:left-6"
            ref={menuPanelRef}
            style={{ backgroundColor: "#FFF9E5", borderColor: "#DCD0A8" }}
          >
            <nav className="p-2">
              <button
                className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left transition-colors"
                style={{ color: "#004030" }}
                onClick={() => handleNavigation("/dashboard")}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#E7F2EF"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent"
                }}
              >
                <Home className="h-5 w-5" />
                <span className="font-medium">Dashboard</span>
              </button>
              <button
                className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left transition-colors"
                style={{ color: "#004030" }}
                onClick={() => handleNavigation("/meal-food")}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#E7F2EF"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent"
                }}
              >
                <Utensils className="h-5 w-5" />
                <span className="font-medium">Meal & Food</span>
              </button>
              <button
                className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left transition-colors"
                style={{ color: "#004030" }}
                onClick={() => handleNavigation("/food-modal")}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#E7F2EF"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent"
                }}
              >
                <Cookie className="h-5 w-5" />
                <span className="font-medium">Food Modal</span>
              </button>
              <button
                className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left transition-colors"
                style={{ color: "#004030" }}
                onClick={() => handleNavigation("/activity-tracking")}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#E7F2EF"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent"
                }}
              >
                <Activity className="h-5 w-5" />
                <span className="font-medium">Activity Tracking</span>
              </button>
              <button
                className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left transition-colors"
                style={{ color: "#004030" }}
                onClick={() => handleNavigation("/history")}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#E7F2EF"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent"
                }}
              >
                <History className="h-5 w-5" />
                <span className="font-medium">History</span>
              </button>
            </nav>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Button
            variant="outline"
            className="bg-transparent transition-all hover:shadow-md"
            style={{
              borderColor: "#4A9782",
              color: "#004030",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#E7F2EF"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent"
            }}
            onClick={() => handleNavigation("/profile")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Profile
          </Button>
        </div>

        <Card style={{ backgroundColor: "#FFF9E5", borderColor: "#DCD0A8" }}>
          <CardHeader>
            <CardTitle style={{ color: "#004030" }}>Notification Settings</CardTitle>
            <CardDescription style={{ color: "#708993" }}>Manage your app alerts and reminders</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Meal Reminders */}
              <div
                className="flex items-center justify-between rounded-lg border-2 p-4"
                style={{ borderColor: "#A1C2BD", backgroundColor: "#FFFFFF" }}
              >
                <div className="space-y-1">
                  <Label
                    htmlFor="meal-reminders"
                    className="text-base font-semibold cursor-pointer"
                    style={{ color: "#004030" }}
                  >
                    Meal Reminders
                  </Label>
                  <p className="text-sm" style={{ color: "#708993" }}>
                    Get notifications for breakfast, lunch, and dinner times
                  </p>
                </div>
                <button
                  id="meal-reminders"
                  role="switch"
                  aria-checked={mealReminders}
                  onClick={() => setMealReminders(!mealReminders)}
                  className="relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full p-1 transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                  style={{
                    backgroundColor: mealReminders ? "#4A9782" : "#708993",
                  }}
                >
                  <span
                    className="pointer-events-none inline-block h-5 w-5 rounded-full shadow-lg ring-0 transition-transform duration-200 ease-in-out"
                    style={{
                      backgroundColor: "#FFFFFF",
                      transform: mealReminders ? "translateX(20px)" : "translateX(0)",
                    }}
                  />
                </button>
              </div>

              {/* Hydration Alerts */}
              <div
                className="flex items-center justify-between rounded-lg border-2 p-4"
                style={{ borderColor: "#A1C2BD", backgroundColor: "#FFFFFF" }}
              >
                <div className="space-y-1">
                  <Label
                    htmlFor="hydration-alerts"
                    className="text-base font-semibold cursor-pointer"
                    style={{ color: "#004030" }}
                  >
                    Hydration Alerts
                  </Label>
                  <p className="text-sm" style={{ color: "#708993" }}>
                    Reminders to drink water throughout the day
                  </p>
                </div>
                <button
                  id="hydration-alerts"
                  role="switch"
                  aria-checked={hydrationAlerts}
                  onClick={() => setHydrationAlerts(!hydrationAlerts)}
                  className="relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full p-1 transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                  style={{
                    backgroundColor: hydrationAlerts ? "#4A9782" : "#708993",
                  }}
                >
                  <span
                    className="pointer-events-none inline-block h-5 w-5 rounded-full shadow-lg ring-0 transition-transform duration-200 ease-in-out"
                    style={{
                      backgroundColor: "#FFFFFF",
                      transform: hydrationAlerts ? "translateX(20px)" : "translateX(0)",
                    }}
                  />
                </button>
              </div>

              {/* Streaks & Nudges */}
              <div
                className="flex items-center justify-between rounded-lg border-2 p-4"
                style={{ borderColor: "#A1C2BD", backgroundColor: "#FFFFFF" }}
              >
                <div className="space-y-1">
                  <Label
                    htmlFor="streaks-nudges"
                    className="text-base font-semibold cursor-pointer"
                    style={{ color: "#004030" }}
                  >
                    Streaks & Nudges
                  </Label>
                  <p className="text-sm" style={{ color: "#708993" }}>
                    Motivational messages and achievement celebrations
                  </p>
                </div>
                <button
                  id="streaks-nudges"
                  role="switch"
                  aria-checked={streaksNudges}
                  onClick={() => setStreaksNudges(!streaksNudges)}
                  className="relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full p-1 transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                  style={{
                    backgroundColor: streaksNudges ? "#4A9782" : "#708993",
                  }}
                >
                  <span
                    className="pointer-events-none inline-block h-5 w-5 rounded-full shadow-lg ring-0 transition-transform duration-200 ease-in-out"
                    style={{
                      backgroundColor: "#FFFFFF",
                      transform: streaksNudges ? "translateX(20px)" : "translateX(0)",
                    }}
                  />
                </button>
              </div>

              {/* Save Button */}
              <Button
                type="button"
                className="w-full h-12 text-base font-semibold transition-all hover:shadow-lg"
                style={{
                  backgroundColor: "#4A9782",
                  color: "#FFF9E5",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#3d8270"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#4A9782"
                }}
                onClick={handleSave}
              >
                Save Preferences
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}



