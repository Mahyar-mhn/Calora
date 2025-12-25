"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  User,
  Plus,
  Scan,
  TrendingUp,
  Flame,
  Target,
  Footprints,
  Apple,
  Drumstick,
  Droplet,
  Sparkles,
  Menu,
  Home,
  Utensils,
  Cookie,
  Activity,
  History,
  LogOut,
  X,
  Clock,
  Settings,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Image from "next/image"
import { useRouter } from "next/navigation"
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts"

// Sample data for insights charts
const calorieTrendsData = [
  { date: "Dec 6", consumed: 1850, target: 2200, burned: 320 },
  { date: "Dec 7", consumed: 2100, target: 2200, burned: 280 },
  { date: "Dec 8", consumed: 1950, target: 2200, burned: 350 },
  { date: "Dec 9", consumed: 2200, target: 2200, burned: 290 },
  { date: "Dec 10", consumed: 1800, target: 2200, burned: 380 },
  { date: "Dec 11", consumed: 2050, target: 2200, burned: 310 },
  { date: "Dec 12", consumed: 1450, target: 2200, burned: 380 },
]

const weightTrajectoryData = [
  { week: "Week 1", weight: 85.2, goal: 82.0 },
  { week: "Week 2", weight: 84.8, goal: 82.0 },
  { week: "Week 3", weight: 84.3, goal: 82.0 },
  { week: "Week 4", weight: 83.9, goal: 82.0 },
  { week: "Week 5", weight: 83.5, goal: 82.0 },
  { week: "Week 6", weight: 83.1, goal: 82.0 },
  { week: "Week 7", weight: 82.8, goal: 82.0 },
  { week: "Week 8", weight: 82.5, goal: 82.0 },
]

// Sample recent activities data
const recentActivities = [
  {
    id: 1,
    type: "Running",
    duration: "30 min",
    calories: 280,
    time: "2 hours ago",
  },
  {
    id: 2,
    type: "Walking",
    duration: "45 min",
    calories: 120,
    time: "4 hours ago",
  },
  {
    id: 3,
    type: "Cycling",
    duration: "60 min",
    calories: 400,
    time: "Yesterday",
  },
  {
    id: 4,
    type: "Swimming",
    duration: "40 min",
    calories: 320,
    time: "2 days ago",
  },
]

export default function DashboardView() {
  // Sample data - in production this would come from user profile and daily tracking
  const [summary, setSummary] = useState<any>(null)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const userData = localStorage.getItem("calora_user")
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const userStr = localStorage.getItem("calora_user")
        if (!userStr) return
        const user = JSON.parse(userStr)

        const res = await fetch(`http://localhost:8080/dashboard/summary/${user.id}`)
        if (res.ok) {
          const data = await res.json()
          setSummary(data)
        }
      } catch (err) {
        console.error("Failed to fetch dashboard summary", err)
      }
    }
    fetchSummary()
  }, [])

  const dailyCalorieTarget = summary?.dailyTarget || 2200
  const caloriesConsumed = summary?.caloriesConsumed || 0
  const caloriesBurned = summary?.caloriesBurned || 0
  const caloriesRemaining = summary?.caloriesRemaining || (dailyCalorieTarget - caloriesConsumed + caloriesBurned)

  // Macro targets (grams)
  const macroTargets = {
    protein: summary?.proteinTarget || 165,
    carbs: summary?.carbsTarget || 248,
    fats: summary?.fatsTarget || 73,
  }

  // Current macro intake (grams)
  const macroConsumed = {
    protein: summary?.proteinConsumed || 0,
    carbs: summary?.carbsConsumed || 0,
    fats: summary?.fatsConsumed || 0,
  }

  // State for menu visibility and popups
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isAddMealOpen, setIsAddMealOpen] = useState(false)
  const [isLogActivityOpen, setIsLogActivityOpen] = useState(false)
  const [isInsightsOpen, setIsInsightsOpen] = useState(false)
  const router = useRouter()

  const handleNavigation = (path: string) => {
    router.push(path)
    setIsMenuOpen(false)
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#E7F2EF" }}>
      {/* Header */}
      <header className="border-b" style={{ backgroundColor: "#FFF9E5", borderColor: "#DCD0A8" }}>
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Menu button on the left */}
              <Button
                variant="outline"
                size="icon"
                className="rounded-lg bg-transparent"
                style={{
                  borderColor: "#4A9782",
                  color: "#004030",
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
                Dashboard
              </h1>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full bg-transparent overflow-hidden"
                  style={{
                    borderColor: "#4A9782",
                    color: "#004030",
                  }}
                >
                  {user && user.profilePicture ? (
                    <img
                      src={user.profilePicture.startsWith("http") ? user.profilePicture : `http://localhost:8080${user.profilePicture}`}
                      alt="User"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <User className="h-5 w-5" />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" style={{ backgroundColor: "#FFF9E5", borderColor: "#DCD0A8" }}>
                <DropdownMenuLabel style={{ color: "#004030" }}>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user?.name || "User"}</p>
                    <p className="text-xs leading-none text-muted-foreground" style={{ color: "#708993" }}>
                      {user?.email || "user@example.com"}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator style={{ backgroundColor: "#DCD0A8" }} />
                <DropdownMenuItem onClick={() => router.push("/profile")} style={{ color: "#004030" }}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push("/settings")} style={{ color: "#004030" }}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator style={{ backgroundColor: "#DCD0A8" }} />
                <DropdownMenuItem
                  onClick={() => {
                    localStorage.removeItem("calora_user")
                    router.push("/login")
                  }}
                  style={{ color: "#ef4444" }}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Navigation menu dropdown */}
      {isMenuOpen && (
        <div className="relative z-50">
          <div
            className="absolute left-38 top-2 w-64 rounded-lg border shadow-lg"
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
      )}

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Target Summary */}
          <Card className="md:col-span-2 lg:col-span-3" style={{ backgroundColor: "#FFF9E5", borderColor: "#DCD0A8" }}>
            <CardHeader>
              <CardTitle style={{ color: "#004030" }}>Daily Target Summary</CardTitle>
              <CardDescription style={{ color: "#708993" }}>Your personalized daily requirements</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <Target className="h-5 w-5" style={{ color: "#4A9782" }} />
                    <span className="text-sm font-medium" style={{ color: "#708993" }}>
                      Daily Calories
                    </span>
                  </div>
                  <p className="text-3xl font-bold" style={{ color: "#004030" }}>
                    {dailyCalorieTarget}
                  </p>
                  <p className="text-sm" style={{ color: "#708993" }}>
                    kcal/day
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <Drumstick className="h-5 w-5" style={{ color: "#63A361" }} />
                    <span className="text-sm font-medium" style={{ color: "#708993" }}>
                      Protein
                    </span>
                  </div>
                  <p className="text-3xl font-bold" style={{ color: "#004030" }}>
                    {macroTargets.protein}g
                  </p>
                  <p className="text-sm" style={{ color: "#708993" }}>
                    per day
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <Apple className="h-5 w-5" style={{ color: "#FFC50F" }} />
                    <span className="text-sm font-medium" style={{ color: "#708993" }}>
                      Carbs
                    </span>
                  </div>
                  <p className="text-3xl font-bold" style={{ color: "#004030" }}>
                    {macroTargets.carbs}g
                  </p>
                  <p className="text-sm" style={{ color: "#708993" }}>
                    per day
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <Droplet className="h-5 w-5" style={{ color: "#5B532C" }} />
                    <span className="text-sm font-medium" style={{ color: "#708993" }}>
                      Fats
                    </span>
                  </div>
                  <p className="text-3xl font-bold" style={{ color: "#004030" }}>
                    {macroTargets.fats}g
                  </p>
                  <p className="text-sm" style={{ color: "#708993" }}>
                    per day
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Calories Consumed */}
          <Card style={{ backgroundColor: "#FFF9E5", borderColor: "#DCD0A8" }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2" style={{ color: "#004030" }}>
                <Apple className="h-5 w-5" style={{ color: "#FFC50F" }} />
                Consumed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold" style={{ color: "#004030" }}>
                {caloriesConsumed}
              </p>
              <p className="text-sm" style={{ color: "#708993" }}>
                calories
              </p>
            </CardContent>
          </Card>

          {/* Calories Burned */}
          <Card style={{ backgroundColor: "#FFF9E5", borderColor: "#DCD0A8" }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2" style={{ color: "#004030" }}>
                <Flame className="h-5 w-5" style={{ color: "#FFC50F" }} />
                Burned
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold" style={{ color: "#004030" }}>
                {caloriesBurned}
              </p>
              <p className="text-sm" style={{ color: "#708993" }}>
                calories
              </p>
            </CardContent>
          </Card>

          {/* Calories Remaining */}
          <Card style={{ backgroundColor: "#FFF9E5", borderColor: "#DCD0A8" }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2" style={{ color: "#004030" }}>
                <Target className="h-5 w-5" style={{ color: "#63A361" }} />
                Remaining
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold" style={{ color: "#63A361" }}>
                {caloriesRemaining}
              </p>
              <p className="text-sm" style={{ color: "#708993" }}>
                calories
              </p>
            </CardContent>
          </Card>

          {/* Macro Progress */}
          <Card className="md:col-span-2 lg:col-span-3" style={{ backgroundColor: "#FFF9E5", borderColor: "#DCD0A8" }}>
            <CardHeader>
              <CardTitle style={{ color: "#004030" }}>Macro Progress</CardTitle>
              <CardDescription style={{ color: "#708993" }}>Track your macronutrient intake</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Protein */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Drumstick className="h-4 w-4" style={{ color: "#63A361" }} />
                      <span className="font-medium" style={{ color: "#004030" }}>
                        Protein
                      </span>
                    </div>
                    <span className="text-sm" style={{ color: "#708993" }}>
                      {macroConsumed.protein}g / {macroTargets.protein}g
                    </span>
                  </div>
                  <Progress
                    value={(macroConsumed.protein / macroTargets.protein) * 100}
                    className="h-3"
                    style={
                      {
                        "--progress-background": "#63A361",
                      } as React.CSSProperties
                    }
                  />
                </div>

                {/* Carbs */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Apple className="h-4 w-4" style={{ color: "#FFC50F" }} />
                      <span className="font-medium" style={{ color: "#004030" }}>
                        Carbs
                      </span>
                    </div>
                    <span className="text-sm" style={{ color: "#708993" }}>
                      {macroConsumed.carbs}g / {macroTargets.carbs}g
                    </span>
                  </div>
                  <Progress
                    value={(macroConsumed.carbs / macroTargets.carbs) * 100}
                    className="h-3"
                    style={
                      {
                        "--progress-background": "#FFC50F",
                      } as React.CSSProperties
                    }
                  />
                </div>

                {/* Fats */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Droplet className="h-4 w-4" style={{ color: "#5B532C" }} />
                      <span className="font-medium" style={{ color: "#004030" }}>
                        Fats
                      </span>
                    </div>
                    <span className="text-sm" style={{ color: "#708993" }}>
                      {macroConsumed.fats}g / {macroTargets.fats}g
                    </span>
                  </div>
                  <Progress
                    value={(macroConsumed.fats / macroTargets.fats) * 100}
                    className="h-3"
                    style={
                      {
                        "--progress-background": "#5B532C",
                      } as React.CSSProperties
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="md:col-span-2 lg:col-span-2" style={{ backgroundColor: "#FFF9E5", borderColor: "#DCD0A8" }}>
            <CardHeader>
              <CardTitle style={{ color: "#004030" }}>Quick Actions</CardTitle>
              <CardDescription style={{ color: "#708993" }}>Track your meals and activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {/* Add Meal Button with Popup */}
                <Dialog open={isAddMealOpen} onOpenChange={setIsAddMealOpen}>
                  <DialogTrigger asChild>
                    <Button
                      className="h-24 flex-col gap-2 transition-all duration-200 hover:scale-105 hover:shadow-lg"
                      style={{
                        backgroundColor: "#4A9782",
                        color: "#FFF9E5",
                      }}
                    >
                      <Plus className="h-6 w-6" />
                      Add Meal
                    </Button>
                  </DialogTrigger>
                  <DialogContent
                    className="sm:max-w-md"
                    style={{ backgroundColor: "#FFF9E5", borderColor: "#DCD0A8" }}
                  >
                    <DialogHeader>
                      <DialogTitle style={{ color: "#004030" }}>Add Meal</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <Button
                        className="w-full h-16 flex-col gap-2 transition-all duration-200 hover:scale-95 hover:shadow-lg"
                        onClick={() => {
                          setIsAddMealOpen(false)
                          router.push("/meal-food?tab=custom")
                        }}
                        style={{
                          backgroundColor: "#4A9782",
                          color: "#FFF9E5",
                        }}
                      >
                        <Plus className="h-6 w-6" />
                        Add Custom Meal
                      </Button>
                      <Button
                        className="w-full h-16 flex-col gap-2 transition-all duration-200 hover:scale-95 hover:shadow-lg"
                        onClick={() => {
                          setIsAddMealOpen(false)
                          router.push("/food-modal")
                        }}
                        style={{
                          backgroundColor: "#FFC50F",
                          color: "#004030",
                        }}
                      >
                        <Cookie className="h-6 w-6" />
                        Choose from Recipes
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>

                {/* Scan Barcode Button */}
                <Button
                  className="h-24 flex-col gap-2 transition-all duration-200 hover:scale-105 hover:shadow-lg"
                  onClick={() => router.push("/meal-food?tab=scan")}
                  style={{
                    backgroundColor: "#4A9782",
                    color: "#FFF9E5",
                  }}
                >
                  <Scan className="h-6 w-6" />
                  Scan Barcode
                </Button>

                {/* Log Activity Button with Popup */}
                <Dialog open={isLogActivityOpen} onOpenChange={setIsLogActivityOpen}>
                  <DialogTrigger asChild>
                    <Button
                      className="h-24 flex-col gap-2 transition-all duration-200 hover:scale-105 hover:shadow-lg"
                      style={{
                        backgroundColor: "#4A9782",
                        color: "#FFF9E5",
                      }}
                    >
                      <Footprints className="h-6 w-6" />
                      Log Activity
                    </Button>
                  </DialogTrigger>
                  <DialogContent
                    className="sm:max-w-lg"
                    style={{ backgroundColor: "#FFF9E5", borderColor: "#DCD0A8" }}
                  >
                    <DialogHeader>
                      <DialogTitle style={{ color: "#004030" }}>Recent Activity</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      <p className="text-sm" style={{ color: "#708993" }}>
                        Your activities from today:
                      </p>
                      {recentActivities.map((activity) => (
                        <div
                          key={activity.id}
                          className="p-4 rounded-lg border"
                          style={{ backgroundColor: "#E7F2EF", borderColor: "#A1C2BD" }}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium" style={{ color: "#004030" }}>
                                {activity.type}
                              </h4>
                              <p className="text-sm" style={{ color: "#708993" }}>
                                {activity.duration} • {activity.calories} calories
                              </p>
                            </div>
                            <div className="flex items-center gap-1 text-xs" style={{ color: "#708993" }}>
                              <Clock className="h-3 w-3" />
                              {activity.time}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <Button
                      onClick={() => {
                        setIsLogActivityOpen(false)
                        router.push("/activity-tracking")
                      }}
                      className="w-full transition-all duration-200 hover:scale-95 hover:shadow-lg"
                      style={{
                        backgroundColor: "#4A9782",
                        color: "#FFF9E5",
                      }}
                    >
                      Log New Activity
                    </Button>
                  </DialogContent>
                </Dialog>

                {/* View Insights Button with Popup */}
                <Dialog open={isInsightsOpen} onOpenChange={setIsInsightsOpen}>
                  <DialogTrigger asChild>
                    <Button
                      className="h-24 flex-col gap-2 transition-all duration-200 hover:scale-105 hover:shadow-lg"
                      style={{
                        backgroundColor: "#4A9782",
                        color: "#FFF9E5",
                      }}
                    >
                      <TrendingUp className="h-6 w-6" />
                      View Insights
                    </Button>
                  </DialogTrigger>
                  <DialogContent
                    className="sm:max-w-4xl max-h-[80vh] overflow-y-auto"
                    style={{ backgroundColor: "#FFF9E5", borderColor: "#DCD0A8" }}
                  >
                    <DialogHeader>
                      <DialogTitle style={{ color: "#004030" }}>Health Insights</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-6">
                      {/* Calorie Trends Chart */}
                      <Card style={{ backgroundColor: "#FFF9E5", borderColor: "#DCD0A8" }}>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2" style={{ color: "#004030" }}>
                            <TrendingUp className="h-5 w-5" style={{ color: "#FFC50F" }} />
                            Calorie Trends
                          </CardTitle>
                          <CardDescription style={{ color: "#708993" }}>
                            Daily calorie consumption vs. target over the last 7 days
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <ResponsiveContainer width="100%" height={250}>
                            <LineChart data={calorieTrendsData}>
                              <CartesianGrid strokeDasharray="3 3" stroke="#A1C2BD" />
                              <XAxis dataKey="date" stroke="#708993" />
                              <YAxis stroke="#708993" />
                              <Tooltip
                                contentStyle={{
                                  backgroundColor: "#FFF9E5",
                                  border: "1px solid #DCD0A8",
                                  borderRadius: "8px",
                                  color: "#004030",
                                }}
                              />
                              <Legend />
                              <Line type="monotone" dataKey="consumed" stroke="#FFC50F" strokeWidth={2} name="Consumed" />
                              <Line type="monotone" dataKey="target" stroke="#63A361" strokeWidth={2} name="Target" />
                              <Line type="monotone" dataKey="burned" stroke="#5B532C" strokeWidth={2} name="Burned" />
                            </LineChart>
                          </ResponsiveContainer>
                        </CardContent>
                      </Card>

                      {/* Weight Trajectory Chart */}
                      <Card style={{ backgroundColor: "#FFF9E5", borderColor: "#DCD0A8" }}>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2" style={{ color: "#004030" }}>
                            <TrendingUp className="h-5 w-5" style={{ color: "#4A9782" }} />
                            Weight Trajectory
                          </CardTitle>
                          <CardDescription style={{ color: "#708993" }}>
                            Your weight progress over the last 8 weeks
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <ResponsiveContainer width="100%" height={250}>
                            <LineChart data={weightTrajectoryData}>
                              <CartesianGrid strokeDasharray="3 3" stroke="#A1C2BD" />
                              <XAxis dataKey="week" stroke="#708993" />
                              <YAxis stroke="#708993" domain={[80, 87]} />
                              <Tooltip
                                contentStyle={{
                                  backgroundColor: "#FFF9E5",
                                  border: "1px solid #DCD0A8",
                                  borderRadius: "8px",
                                  color: "#004030",
                                }}
                              />
                              <Legend />
                              <Line type="monotone" dataKey="weight" stroke="#FFC50F" strokeWidth={3} name="Current Weight (kg)" />
                              <Line
                                type="monotone"
                                dataKey="goal"
                                stroke="#63A361"
                                strokeWidth={2}
                                strokeDasharray="5 5"
                                name="Goal Weight (kg)"
                              />
                            </LineChart>
                          </ResponsiveContainer>
                        </CardContent>
                      </Card>
                    </div>
                    <Button
                      onClick={() => {
                        setIsInsightsOpen(false)
                        router.push("/history")
                      }}
                      className="w-full mt-4 transition-all duration-200 hover:scale-95 hover:shadow-lg"
                      style={{
                        backgroundColor: "#4A9782",
                        color: "#FFF9E5",
                      }}
                    >
                      View Full Analytics
                    </Button>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>

          {/* AI Insights Card */}
          <Card style={{ backgroundColor: "#FFF9E5", borderColor: "#DCD0A8" }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2" style={{ color: "#004030" }}>
                <Sparkles className="h-5 w-5" style={{ color: "#FFC50F" }} />
                AI Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="rounded-lg p-4" style={{ backgroundColor: "#E7F2EF" }}>
                  <p className="text-sm font-medium" style={{ color: "#004030" }}>
                    Great progress today!
                  </p>
                  <p className="mt-2 text-sm" style={{ color: "#708993" }}>
                    You're 59% towards your calorie goal. Consider adding a protein-rich snack to reach your targets.
                  </p>
                </div>
                <div className="rounded-lg p-4" style={{ backgroundColor: "#E7F2EF" }}>
                  <p className="text-sm font-medium" style={{ color: "#004030" }}>
                    Hydration Reminder
                  </p>
                  <p className="mt-2 text-sm" style={{ color: "#708993" }}>
                    Don't forget to drink water throughout the day!
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
