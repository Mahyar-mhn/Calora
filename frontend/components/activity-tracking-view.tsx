"use client"
import { API_BASE } from "@/lib/api"
import { useMenuInteractions } from "@/hooks/use-menu-interactions"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Menu,
  Home,
  Compass,
  Utensils,
  Cookie,
  Activity,
  History,
  Dumbbell,
  Clock,
  Flame,
  Watch,
  Smartphone,
  CheckCircle,
  XCircle,
  Plus,
  Heart,
  Trophy,
  Sparkles,
  Zap,
  HomeIcon,
  Mountain,
  Users,
  Minus,
} from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import ProfileAvatarButton from "./profile-avatar-button"
import { ThemeToggle } from "@/components/theme-toggle"

type Activity = {
  id?: number
  type: string
  duration: number
  calories: number | null
  date: string
}

type DeviceConnection = {
  id?: number
  provider: string
  connected: boolean
}

const SAMPLE_DEVICE_APPS: DeviceConnection[] = [
  { provider: "Apple Health", connected: false },
  { provider: "Google Fit", connected: false },
  { provider: "Fitbit", connected: false },
  { provider: "Garmin", connected: false },
  { provider: "Strava", connected: false },
]

const workoutCategories = [
  {
    name: "Cardio / Endurance",
    icon: Heart,
    activities: [
      "Walking (slow)",
      "Walking (brisk)",
      "Jogging",
      "Running",
      "Treadmill",
      "Cycling (outdoor)",
      "Cycling (stationary)",
      "Jump Rope",
      "Elliptical",
      "Rowing Machine",
      "Stair Climbing",
      "Hiking",
      "Swimming (light)",
      "Swimming (laps)",
      "Aerobics",
      "Dance (general)",
      "Zumba",
    ],
  },
  {
    name: "Strength / Resistance Training",
    icon: Dumbbell,
    activities: [
      "Weight Training (light)",
      "Weight Training (moderate)",
      "Weight Training (heavy)",
      "Bodyweight Workout",
      "Circuit Training",
      "CrossFit",
      "Powerlifting",
      "Olympic Lifting",
      "Resistance Band Training",
      "Kettlebell Workout",
    ],
  },
  {
    name: "Sports",
    icon: Trophy,
    activities: [
      "Football (Soccer)",
      "Basketball",
      "Volleyball",
      "Tennis",
      "Badminton",
      "Table Tennis",
      "Squash",
      "Cricket",
      "Baseball",
      "Martial Arts",
      "Boxing",
      "Kickboxing",
      "Judo / Karate / Taekwondo",
      "Wrestling",
    ],
  },
  {
    name: "Flexibility & Mind–Body",
    icon: Sparkles,
    activities: ["Yoga", "Pilates", "Stretching", "Mobility Training", "Tai Chi"],
  },
  {
    name: "HIIT & Functional",
    icon: Zap,
    activities: ["HIIT Workout", "Functional Training", "Bootcamp", "Plyometrics", "Tabata"],
  },
  {
    name: "Daily Activities (Lifestyle)",
    icon: HomeIcon,
    activities: [
      "House Cleaning",
      "Cooking",
      "Gardening",
      "Carrying Groceries",
      "Standing Work",
      "Desk Work",
      "Walking Stairs (daily)",
      "Childcare",
      "Shopping",
      "Moving Furniture",
    ],
  },
  {
    name: "Outdoor & Recreational",
    icon: Mountain,
    activities: [
      "Skating",
      "Skateboarding",
      "Skiing",
      "Snowboarding",
      "Surfing",
      "Kayaking",
      "Canoeing",
      "Rock Climbing",
      "Jumping Trampoline",
    ],
  },
  {
    name: "Custom Activity",
    icon: Users,
    activities: ["Custom Activity (user-defined)"],
  },
]

export default function ActivityTrackingView() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { menuButtonRef, menuPanelRef } = useMenuInteractions(isMenuOpen, setIsMenuOpen)
  const [isWorkoutDropdownOpen, setIsWorkoutDropdownOpen] = useState(false)
  const [workoutType, setWorkoutType] = useState("")
  const [duration, setDuration] = useState("")
  const [calories, setCalories] = useState("")
  const [isCategoryOpen, setIsCategoryOpen] = useState(false)
  const [isConnectionsModalOpen, setIsConnectionsModalOpen] = useState(false)
  const [recentActivities, setRecentActivities] = useState<Activity[]>([])
  const [isLoadingActivities, setIsLoadingActivities] = useState(false)
  const [deviceConnections, setDeviceConnections] = useState<DeviceConnection[]>(SAMPLE_DEVICE_APPS)
  const [isLoadingConnections, setIsLoadingConnections] = useState(false)

  const router = useRouter()

  const handleNavigation = (path: string) => {
    router.push(path)
    setIsMenuOpen(false)
  }

  const handleWorkoutSelect = (workout: string) => {
    setWorkoutType(workout)
    setIsWorkoutDropdownOpen(false)
  }

  const loadDeviceConnections = async () => {
    const userStr = localStorage.getItem("calora_user")
    if (!userStr) return
    const user = JSON.parse(userStr)

    setIsLoadingConnections(true)
    try {
      const res = await fetch(`${API_BASE}/device-connections/user/${user.id}`)
      if (!res.ok) {
        console.error("Failed to load device connections", await res.text())
        return
      }
      const data = await res.json()
      if (Array.isArray(data)) {
        const merged = SAMPLE_DEVICE_APPS.map((sample) => {
          const backendValue = data.find(
            (item: DeviceConnection) => item.provider.toLowerCase() === sample.provider.toLowerCase(),
          )
          return backendValue
            ? { ...sample, id: backendValue.id, connected: !!backendValue.connected }
            : sample
        })
        setDeviceConnections(merged)
      }
    } catch (err) {
      console.error("Failed to load device connections", err)
    } finally {
      setIsLoadingConnections(false)
    }
  }

  const handleToggleConnection = async (provider: string) => {
    const userStr = localStorage.getItem("calora_user")
    if (!userStr) {
      alert("Please login first")
      return
    }
    const user = JSON.parse(userStr)

    try {
      const res = await fetch(`${API_BASE}/device-connections/user/${user.id}/toggle`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ provider }),
      })
      if (!res.ok) {
        console.error("Failed to update device connection", await res.text())
        alert("Failed to update connection")
        return
      }
      const updated = await res.json()
      setDeviceConnections((prev) =>
        prev.map((device) =>
          device.provider === updated.provider ? { ...device, connected: updated.connected } : device,
        ),
      )
    } catch (err) {
      console.error("Failed to update device connection", err)
      alert("Failed to update connection")
    }
  }

  useEffect(() => {
    const loadActivities = async () => {
      const userStr = localStorage.getItem("calora_user")
      if (!userStr) return
      const user = JSON.parse(userStr)

      const endDate = new Date()
      const startDate = new Date()
      startDate.setDate(endDate.getDate() - 29)

      const from = startDate.toISOString().slice(0, 10)
      const to = endDate.toISOString().slice(0, 10)

      setIsLoadingActivities(true)
      try {
        const res = await fetch(`${API_BASE}/activities/user/${user.id}/range?from=${from}&to=${to}`)
        if (!res.ok) {
          console.error("Failed to load activities", await res.text())
          return
        }
        const data = await res.json()
        const mapped: Activity[] = (data ?? []).map((activity: any) => ({
          id: activity.id,
          type: activity.type ?? "Activity",
          duration: activity.duration ?? 0,
          calories: activity.caloriesBurned ?? 0,
          date: activity.date ? new Date(activity.date).toLocaleString() : "",
        }))
        setRecentActivities(mapped)
      } catch (err) {
        console.error("Failed to load activities", err)
      } finally {
        setIsLoadingActivities(false)
      }
    }

    loadActivities()
    loadDeviceConnections()
  }, [])

  useEffect(() => {
    if (!isConnectionsModalOpen) return
    loadDeviceConnections()
  }, [isConnectionsModalOpen])

  const handleLogActivity = async () => {
    if (!workoutType || !duration) {
      alert("Please fill in workout type and duration")
      return
    }

    const durationValue = Number.parseInt(duration)
    if (Number.isNaN(durationValue) || durationValue <= 0) {
      alert("Duration must be greater than 0")
      return
    }

    if (calories && (Number.isNaN(Number.parseInt(calories)) || Number.parseInt(calories) <= 0)) {
      alert("Calories must be greater than 0")
      return
    }

    try {
      const userStr = localStorage.getItem("calora_user")
      if (!userStr) {
        alert("Please login to log activity")
        return
      }
      const user = JSON.parse(userStr)

      const activityData = {
        type: workoutType,
        duration: durationValue,
        caloriesBurned: calories ? Number.parseInt(calories) : durationValue * 5, // Simple auto-calc fallback
        date: new Date().toISOString().slice(0, 19),
        user: { id: user.id } // Send user ID association
      }

      const res = await fetch(`${API_BASE}/activities`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(activityData),
      })

      if (res.ok) {
        const savedActivity = await res.json()
        const newActivity = {
          id: savedActivity.id,
          type: savedActivity.type,
          duration: savedActivity.duration,
          calories: savedActivity.caloriesBurned,
          date: new Date(savedActivity.date).toLocaleString(),
        }
        setRecentActivities([newActivity, ...recentActivities])

        alert(`Activity logged successfully!`)
        // Reset form
        setWorkoutType("")
        setDuration("")
        setCalories("")
      } else {
        console.error("Failed to log activity", await res.text())
        alert("Failed to log activity. Please try again.")
      }
    } catch (err) {
      console.error("Error logging activity", err)
      alert("Error logging activity")
    }
  }

  const handleDeleteActivity = async (activity: Activity, index: number) => {
    if (!activity.id) {
      setRecentActivities(recentActivities.filter((_, i) => i !== index))
      return
    }

    try {
      const userStr = localStorage.getItem("calora_user")
      const user = userStr ? JSON.parse(userStr) : null
      const userId = user?.id
      const url = userId
        ? `${API_BASE}/activities/${activity.id}?userId=${userId}`
        : `${API_BASE}/activities/${activity.id}`

      const res = await fetch(url, { method: "DELETE" })
      if (res.ok) {
        setRecentActivities(recentActivities.filter((_, i) => i !== index))
      } else {
        console.error("Failed to delete activity", await res.text())
        alert("Failed to delete activity. Please try again.")
      }
    } catch (err) {
      console.error("Error deleting activity", err)
      alert("Error deleting activity")
    }
  }

  const watchConnected = deviceConnections.some(
    (d) => (d.provider === "Apple Health" || d.provider === "Fitbit" || d.provider === "Garmin") && d.connected,
  )
  const phoneConnected = deviceConnections.some(
    (d) => (d.provider === "Google Fit" || d.provider === "Apple Health") && d.connected,
  )

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
                Activity Tracking
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
                className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left transition-colors hover:bg-opacity-50"
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
                className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left transition-colors hover:bg-opacity-50"
                style={{ color: "#004030" }}
                onClick={() => handleNavigation("/explore")}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#E7F2EF"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent"
                }}
              >
                <Compass className="h-5 w-5" />
                <span className="font-medium">Explore</span>
              </button>
              <button
                className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left transition-colors hover:bg-opacity-50"
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
                className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left transition-colors hover:bg-opacity-50"
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
                className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left transition-colors hover:bg-opacity-50"
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
                className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left transition-colors hover:bg-opacity-50"
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
      <main className="mx-auto w-full max-w-[1600px] px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Manual Log Section */}
          <Card className="lg:col-span-2" style={{ backgroundColor: "#FFF9E5", borderColor: "#DCD0A8" }}>
            <CardHeader>
              <CardTitle style={{ color: "#004030" }}>Log Activity</CardTitle>
              <CardDescription style={{ color: "#708993" }}>
                Manually log your workout or physical activity
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="workoutType" style={{ color: "#004030" }}>
                  Workout Type *
                </Label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsWorkoutDropdownOpen(!isWorkoutDropdownOpen)}
                    className="flex w-full items-center justify-between rounded-md border px-3 py-2 text-left"
                    style={{
                      borderColor: "#A1C2BD",
                      backgroundColor: "#FFFFFF",
                      color: workoutType ? "#004030" : "#708993",
                    }}
                  >
                    <span>{workoutType || "Select a workout type"}</span>
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      style={{
                        transform: isWorkoutDropdownOpen ? "rotate(180deg)" : "rotate(0deg)",
                        transition: "transform 0.2s",
                      }}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {isWorkoutDropdownOpen && (
                    <div className="relative z-50">
                      <div className="fixed inset-0" onClick={() => setIsWorkoutDropdownOpen(false)} />
                      <div
                        className="absolute left-0 right-0 mt-1 max-h-96 overflow-y-auto rounded-lg border shadow-lg"
                        style={{ backgroundColor: "#FFF9E5", borderColor: "#DCD0A8" }}
                      >
                        {workoutCategories.map((category) => {
                          const IconComponent = category.icon
                          return (
                            <div
                              key={category.name}
                              className="border-b last:border-b-0"
                              style={{ borderColor: "#DCD0A8" }}
                            >
                              <div className="flex items-center gap-2 px-4 py-2" style={{ backgroundColor: "#E7F2EF" }}>
                                <IconComponent className="h-4 w-4" style={{ color: "#4A9782" }} />
                                <span className="text-sm font-semibold" style={{ color: "#004030" }}>
                                  {category.name}
                                </span>
                              </div>
                              <div className="py-1">
                                {category.activities.map((activity) => (
                                  <button
                                    key={activity}
                                    type="button"
                                    onClick={() => handleWorkoutSelect(activity)}
                                    className="w-full px-4 py-2 text-left text-sm transition-colors"
                                    style={{ color: "#004030" }}
                                    onMouseEnter={(e) => {
                                      e.currentTarget.style.backgroundColor = "#E7F2EF"
                                    }}
                                    onMouseLeave={(e) => {
                                      e.currentTarget.style.backgroundColor = "transparent"
                                    }}
                                  >
                                    {activity}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Duration */}
              <div className="space-y-2">
                <Label htmlFor="duration" style={{ color: "#004030" }}>
                  Duration (minutes) *
                </Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2" style={{ color: "#708993" }} />
                  <Input
                    id="duration"
                    type="number"
                    placeholder="30"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="pl-10"
                    style={{
                      borderColor: "#A1C2BD",
                      backgroundColor: "#FFFFFF",
                      color: "#004030",
                    }}
                  />
                </div>
              </div>

              {/* Calories Burned (Optional) */}
              <div className="space-y-2">
                <Label htmlFor="calories" style={{ color: "#004030" }}>
                  Calories Burned (optional)
                </Label>
                <div className="relative">
                  <Flame className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2" style={{ color: "#FFC50F" }} />
                  <Input
                    id="calories"
                    type="number"
                    placeholder="Auto-calculated if left blank"
                    value={calories}
                    onChange={(e) => setCalories(e.target.value)}
                    className="pl-10"
                    style={{
                      borderColor: "#A1C2BD",
                      backgroundColor: "#FFFFFF",
                      color: "#004030",
                    }}
                  />
                </div>
                <p className="text-sm" style={{ color: "#708993" }}>
                  Leave blank to auto-calculate based on your profile and activity
                </p>
              </div>

              {/* Submit Button */}
              <Button
                onClick={handleLogActivity}
                className="w-full transition-all"
                style={{
                  backgroundColor: "#4A9782",
                  color: "#FFF9E5",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#3d7f6d"
                  e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#4A9782"
                  e.currentTarget.style.boxShadow = "none"
                }}
              >
                <Plus className="mr-2 h-5 w-5" />
                Log Activity
              </Button>
            </CardContent>
          </Card>

          {/* Device Sync Section */}
          <Card style={{ backgroundColor: "#FFF9E5", borderColor: "#DCD0A8" }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2" style={{ color: "#004030" }}>
                <Watch className="h-5 w-5" style={{ color: "#4A9782" }} />
                Device Sync
              </CardTitle>
              <CardDescription style={{ color: "#708993" }}>Connect your fitness devices</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Fitness Tracker */}
              <div
                className="flex items-center justify-between rounded-lg border p-4"
                style={{ borderColor: "#A1C2BD", backgroundColor: "#FFFFFF" }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-full"
                    style={{ backgroundColor: "#E7F2EF" }}
                  >
                    <Watch className="h-5 w-5" style={{ color: "#4A9782" }} />
                  </div>
                  <div>
                    <p className="font-medium" style={{ color: "#004030" }}>
                      Fitness Tracker
                    </p>
                    <p className="text-sm" style={{ color: "#708993" }}>
                      Apple Watch, Fitbit
                    </p>
                  </div>
                </div>
                {watchConnected ? (
                  <CheckCircle className="h-6 w-6" style={{ color: "#63A361" }} />
                ) : (
                  <XCircle className="h-6 w-6" style={{ color: "#708993" }} />
                )}
              </div>

              {/* Smartphone */}
              <div
                className="flex items-center justify-between rounded-lg border p-4"
                style={{ borderColor: "#A1C2BD", backgroundColor: "#FFFFFF" }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-full"
                    style={{ backgroundColor: "#E7F2EF" }}
                  >
                    <Smartphone className="h-5 w-5" style={{ color: "#4A9782" }} />
                  </div>
                  <div>
                    <p className="font-medium" style={{ color: "#004030" }}>
                      Smartphone
                    </p>
                    <p className="text-sm" style={{ color: "#708993" }}>
                      Google Fit, Health
                    </p>
                  </div>
                </div>
                {phoneConnected ? (
                  <CheckCircle className="h-6 w-6" style={{ color: "#63A361" }} />
                ) : (
                  <XCircle className="h-6 w-6" style={{ color: "#708993" }} />
                )}
              </div>

              <Button
                variant="outline"
                className="w-full bg-transparent transition-all"
                style={{
                  borderColor: "#4A9782",
                  color: "#004030",
                }}
                onClick={() => setIsConnectionsModalOpen(true)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#E7F2EF"
                  e.currentTarget.style.borderColor = "#004030"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent"
                  e.currentTarget.style.borderColor = "#4A9782"
                }}
              >
                Manage Connections
              </Button>
            </CardContent>
          </Card>

          {/* Recent Activities */}
          <Card className="lg:col-span-3" style={{ backgroundColor: "#FFF9E5", borderColor: "#DCD0A8" }}>
            <CardHeader>
              <CardTitle style={{ color: "#004030" }}>Recent Activities</CardTitle>
              <CardDescription style={{ color: "#708993" }}>Your logged workouts and activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {isLoadingActivities ? (
                  <p className="text-sm" style={{ color: "#708993" }}>
                    Loading activities...
                  </p>
                ) : recentActivities.length > 0 ? (
                  recentActivities.map((activity, index) => (
                    <div
                      key={activity.id ?? index}
                      className="flex items-center justify-between rounded-lg border p-4"
                      style={{ borderColor: "#A1C2BD", backgroundColor: "#FFFFFF" }}
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className="flex h-12 w-12 items-center justify-center rounded-full"
                          style={{ backgroundColor: "#E7F2EF" }}
                        >
                          <Activity className="h-6 w-6" style={{ color: "#4A9782" }} />
                        </div>
                        <div>
                          <h4 className="font-medium" style={{ color: "#004030" }}>
                            {activity.type}
                          </h4>
                          <p className="text-sm" style={{ color: "#708993" }}>
                            {activity.date}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="font-semibold" style={{ color: "#004030" }}>
                            {activity.calories} cal
                          </p>
                          <p className="text-sm" style={{ color: "#708993" }}>
                            {activity.duration} min
                          </p>
                        </div>
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-8 w-8 rounded-full transition-all bg-transparent"
                          style={{
                            borderColor: "#DCD0A8",
                            color: "#004030",
                          }}
                          onClick={() => handleDeleteActivity(activity, index)}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = "#ff4444"
                            e.currentTarget.style.borderColor = "#ff4444"
                            e.currentTarget.style.color = "#FFFFFF"
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = "transparent"
                            e.currentTarget.style.borderColor = "#DCD0A8"
                            e.currentTarget.style.color = "#004030"
                          }}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm italic" style={{ color: "#708993" }}>
                    No activities yet. Log your first workout.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Manage Connections Modal */}
      {isConnectionsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50" onClick={() => setIsConnectionsModalOpen(false)} />
          <div
            className="relative w-full max-w-md max-h-[90vh] overflow-y-auto rounded-lg p-6 shadow-xl"
            style={{ backgroundColor: "#FFF9E5" }}
          >
            <button
              onClick={() => setIsConnectionsModalOpen(false)}
              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full transition-all"
              style={{ backgroundColor: "#DCD0A8", color: "#004030" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#4A9782"
                e.currentTarget.style.color = "#FFF9E5"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#DCD0A8"
                e.currentTarget.style.color = "#004030"
              }}
            >
              ✕
            </button>

            <h2 className="mb-6 text-2xl font-bold" style={{ color: "#004030" }}>
              Manage Device Connections
            </h2>

            <p className="mb-6 text-sm" style={{ color: "#708993" }}>
              Connect your fitness devices and apps to automatically sync your activity data.
            </p>

            <div className="space-y-3">
              {deviceConnections.map((device) => (
                <div
                  key={device.id ?? device.provider}
                  className="flex items-center justify-between rounded-lg border p-4"
                  style={{ borderColor: "#A1C2BD", backgroundColor: "#FFFFFF" }}
                >
                  <span className="font-medium" style={{ color: "#004030" }}>
                    {device.provider}
                  </span>
                  <Button
                    size="sm"
                    className="transition-all"
                    disabled={isLoadingConnections}
                    style={{
                      backgroundColor: device.connected ? "#63A361" : "#4A9782",
                      color: "#FFF9E5",
                      opacity: isLoadingConnections ? 0.7 : 1,
                    }}
                    onClick={() => handleToggleConnection(device.provider)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.opacity = isLoadingConnections ? "0.7" : "0.8"
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.opacity = isLoadingConnections ? "0.7" : "1"
                    }}
                  >
                    {device.connected ? "Disconnect" : "Connect"}
                  </Button>
                </div>
              ))}
              {isLoadingConnections && (
                <p className="text-xs" style={{ color: "#708993" }}>
                  Syncing your connection status...
                </p>
              )}
            </div>

            <Button
              className="mt-6 w-full transition-all"
              style={{
                backgroundColor: "#4A9782",
                color: "#FFF9E5",
              }}
              onClick={() => setIsConnectionsModalOpen(false)}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#3d7f6d"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#4A9782"
              }}
            >
              Done
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}




