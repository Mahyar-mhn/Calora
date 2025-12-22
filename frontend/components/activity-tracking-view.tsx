"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  User,
  Menu,
  Home,
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
  const [isWorkoutDropdownOpen, setIsWorkoutDropdownOpen] = useState(false)
  const [workoutType, setWorkoutType] = useState("")
  const [duration, setDuration] = useState("")
  const [calories, setCalories] = useState("")
  const [isCategoryOpen, setIsCategoryOpen] = useState(false)
  const [isConnectionsModalOpen, setIsConnectionsModalOpen] = useState(false)
  const [deviceConnections, setDeviceConnections] = useState([
    { name: "Apple Health", connected: true },
    { name: "Google Fit", connected: true },
    { name: "Fitbit", connected: false },
    { name: "Garmin", connected: false },
    { name: "Strava", connected: false },
  ])
  const [recentActivities, setRecentActivities] = useState([
    { type: "Running", duration: 30, calories: 300, date: "Today, 8:00 AM" },
    { type: "Weight Training", duration: 45, calories: 200, date: "Yesterday, 6:00 PM" },
    { type: "Cycling", duration: 60, calories: 450, date: "2 days ago" },
  ])

  const handleDeviceConnection = (deviceName: string) => {
    setDeviceConnections(prev => prev.map(device =>
      device.name === deviceName
        ? { ...device, connected: !device.connected }
        : device
    ))

    const device = deviceConnections.find(d => d.name === deviceName)
    const action = device?.connected ? "disconnected" : "connected"
    alert(`${deviceName} has been ${action} successfully!`)
  }
  const router = useRouter()

  const handleNavigation = (path: string) => {
    router.push(path)
    setIsMenuOpen(false)
  }

  const handleWorkoutSelect = (workout: string) => {
    setWorkoutType(workout)
    setIsWorkoutDropdownOpen(false)
  }

  const handleLogActivity = () => {
    if (workoutType && duration) {
      const newActivity = {
        type: workoutType,
        duration: Number.parseInt(duration),
        calories: calories ? Number.parseInt(calories) : null,
        date: new Date().toLocaleString(),
      }
      setRecentActivities([newActivity, ...recentActivities])
      alert(
        `Activity logged!\nWorkout: ${workoutType}\nDuration: ${duration} minutes\nCalories Burned: ${calories || "Auto-calculated"}`,
      )
      // Reset form
      setWorkoutType("")
      setDuration("")
      setCalories("")
    } else {
      alert("Please fill in workout type and duration")
    }
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#E7F2EF" }}>
      {/* Header */}
      <header className="border-b" style={{ backgroundColor: "#FFF9E5", borderColor: "#DCD0A8" }}>
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                className="rounded-lg bg-transparent transition-transform duration-300 ease-in-out"
                style={{
                  borderColor: "#4A9782",
                  color: "#004030",
                  transform: isMenuOpen ? "rotate(180deg)" : "rotate(0deg)",
                }}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <Menu className="h-5 w-5" />
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
            <Button
              variant="outline"
              size="icon"
              className="rounded-full bg-transparent"
              style={{
                borderColor: "#4A9782",
                color: "#004030",
              }}
              onClick={() => handleNavigation("/profile")}
            >
              <User className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Navigation menu dropdown */}
      <div className={`relative z-50 transition-all duration-300 ${isMenuOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
        <div
          className={`absolute left-2 top-2 w-64 rounded-lg border shadow-lg transition-all duration-300 ${
            isMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-2 opacity-0'
          }`}
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

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
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
                <CheckCircle className="h-6 w-6" style={{ color: "#63A361" }} />
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
                <XCircle className="h-6 w-6" style={{ color: "#708993" }} />
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
                {recentActivities.map((activity, index) => (
                  <div
                    key={index}
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
                        onClick={() => {
                          setRecentActivities(recentActivities.filter((_, i) => i !== index))
                        }}
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
                ))}
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
              {deviceConnections.map((device, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-lg border p-4"
                  style={{ borderColor: "#A1C2BD", backgroundColor: "#FFFFFF" }}
                >
                  <span className="font-medium" style={{ color: "#004030" }}>
                    {device.name}
                  </span>
                  <Button
                    size="sm"
                    className="transition-all"
                    onClick={() => handleDeviceConnection(device.name)}
                    style={{
                      backgroundColor: device.connected ? "#63A361" : "#4A9782",
                      color: "#FFF9E5",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.opacity = "0.8"
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.opacity = "1"
                    }}
                  >
                    {device.connected ? "Connected" : "Connect"}
                  </Button>
                </div>
              ))}
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
