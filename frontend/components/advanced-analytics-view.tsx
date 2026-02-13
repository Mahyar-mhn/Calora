"use client"

import { API_BASE } from "@/lib/api"
import { useEffect, useState } from "react"
import { useMenuInteractions } from "@/hooks/use-menu-interactions"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import {
  Menu,
  Home,
  Compass,
  Utensils,
  Cookie,
  Activity,
  History,
  TrendingUp,
  TrendingDown,
  Calendar,
  Download,
  Crown,
  BarChart3,
  PieChart,
  LineChartIcon,
  Target,
  FileText,
  File,
} from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import ProfileAvatarButton from "./profile-avatar-button"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart as RePieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  AreaChart,
  Area,
} from "recharts"

// Sample data for nutrient breakdown
const nutrientBreakdownData = [
  { name: "Protein", value: 25, color: "#63A361" },
  { name: "Carbs", value: 45, color: "#FFC50F" },
  { name: "Fats", value: 30, color: "#5B532C" },
]

// Sample data for micronutrients
const micronutrientData = [
  { nutrient: "Vitamin C", actual: 85, target: 90 },
  { nutrient: "Calcium", actual: 92, target: 100 },
  { nutrient: "Iron", actual: 78, target: 100 },
  { nutrient: "Vitamin D", actual: 65, target: 100 },
  { nutrient: "Fiber", actual: 88, target: 100 },
  { nutrient: "Omega-3", actual: 72, target: 100 },
]

// Sample data for calorie distribution by meal
const mealDistributionData = [
  { meal: "Breakfast", calories: 450, percentage: 20 },
  { meal: "Lunch", calories: 700, percentage: 32 },
  { meal: "Dinner", calories: 800, percentage: 36 },
  { meal: "Snacks", calories: 250, percentage: 12 },
]

// Sample data for monthly trends
const monthlyTrendsData = [
  { month: "Jan", weight: 86, calories: 2150, protein: 162 },
  { month: "Feb", weight: 85.2, calories: 2180, protein: 165 },
  { month: "Mar", weight: 84.5, calories: 2200, protein: 168 },
  { month: "Apr", weight: 83.8, calories: 2150, protein: 164 },
  { month: "May", weight: 83.0, calories: 2180, protein: 166 },
  { month: "Jun", weight: 82.5, calories: 2200, protein: 170 },
]

// Sample data for weekly performance
const weeklyPerformanceData = [
  { day: "Mon", adherence: 95, exercise: 85, sleep: 90, hydration: 88 },
  { day: "Tue", adherence: 88, exercise: 90, sleep: 85, hydration: 92 },
  { day: "Wed", adherence: 92, exercise: 88, sleep: 88, hydration: 90 },
  { day: "Thu", adherence: 90, exercise: 85, sleep: 92, hydration: 85 },
  { day: "Fri", adherence: 85, exercise: 92, sleep: 85, hydration: 88 },
  { day: "Sat", adherence: 95, exercise: 95, sleep: 90, hydration: 95 },
  { day: "Sun", adherence: 92, exercise: 88, sleep: 95, hydration: 90 },
]

export default function AdvancedAnalyticsView() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { menuButtonRef, menuPanelRef } = useMenuInteractions(isMenuOpen, setIsMenuOpen)
  const [selectedMonths, setSelectedMonths] = useState(6)
  const [isExportOpen, setIsExportOpen] = useState(false)
  const [isAllowed, setIsAllowed] = useState(false)
  const [isExporting, setIsExporting] = useState<"" | "csv" | "pdf">("")
  const router = useRouter()

  const handleNavigation = (path: string) => {
    router.push(path)
    setIsMenuOpen(false)
  }

  const downloadReport = (format: "csv" | "pdf") => {
    const userStr = localStorage.getItem("calora_user")
    const currentUser = userStr ? JSON.parse(userStr) : null
    if (!currentUser?.id) {
      alert("Please login again to export reports.")
      return
    }

    setIsExporting(format)
    const exportUrl = `${API_BASE}/exports/analytics/${currentUser.id}?months=${selectedMonths}&format=${format}`

    // Use direct browser navigation for file downloads to avoid fetch/CORS blob issues.
    const link = document.createElement("a")
    link.href = exportUrl
    link.download = `analytics-report.${format}`
    document.body.appendChild(link)
    link.click()
    link.remove()

    setIsExportOpen(false)
    window.setTimeout(() => setIsExporting(""), 400)
  }

  useEffect(() => {
    const userStr = localStorage.getItem("calora_user")
    const currentUser = userStr ? JSON.parse(userStr) : null
    if (!currentUser?.isPremium) {
      router.replace("/subscription")
      return
    }
    setIsAllowed(true)
  }, [router])

  if (!isAllowed) {
    return null
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
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold" style={{ color: "#004030" }}>
                  Advanced Analytics
                </h1>
                <span
                  className="rounded-full px-3 py-1 text-xs font-semibold"
                  style={{ backgroundColor: "#FFC50F", color: "#004030" }}
                >
                  PREMIUM
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <ProfileAvatarButton onClick={() => router.push("/profile")} />
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
      <main className="mx-auto w-full max-w-[1600px] px-4 py-8 sm:px-6 lg:px-8">
        {/* Action Bar */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5" style={{ color: "#4A9782" }} />
              <span className="font-medium" style={{ color: "#004030" }}>
                Custom Range: Last {selectedMonths} {selectedMonths === 1 ? "Month" : "Months"}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="1"
                max="12"
                value={selectedMonths}
                onChange={(e) => setSelectedMonths(Number(e.target.value))}
                className="h-2 w-64 cursor-pointer appearance-none rounded-lg"
                style={{
                  background: `linear-gradient(to right, #4A9782 0%, #4A9782 ${((selectedMonths - 1) / 11) * 100}%, #DCD0A8 ${((selectedMonths - 1) / 11) * 100}%, #DCD0A8 100%)`,
                }}
              />
              <span className="text-sm font-medium" style={{ color: "#708993" }}>
                {selectedMonths} {selectedMonths === 1 ? "Month" : "Months"}
              </span>
            </div>
          </div>
          {/* Export Report Button with Popup */}
          <Dialog open={isExportOpen} onOpenChange={setIsExportOpen}>
            <DialogTrigger asChild>
              <Button
                className="flex items-center gap-2 transition-all duration-200 hover:scale-105 hover:shadow-lg"
                style={{
                  backgroundColor: "#4A9782",
                  color: "#FFF9E5",
                }}
              >
                <Download className="h-4 w-4" />
                Export Report
              </Button>
            </DialogTrigger>
            <DialogContent
              className="sm:max-w-md"
              style={{ backgroundColor: "#FFF9E5", borderColor: "#DCD0A8" }}
            >
              <DialogHeader>
                <DialogTitle style={{ color: "#004030" }}>Export Analytics Report</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <p className="text-sm" style={{ color: "#708993" }}>
                  Choose your preferred export format. The report will include your {selectedMonths}-month analytics data.
                </p>
                <Button
                  className="w-full py-10 flex-col flex gap-2 transition-all duration-200 hover:scale-105"
                  onClick={() => downloadReport("csv")}
                  style={{
                    backgroundColor: "#63A361",
                    color: "#FFF9E5",
                  }}
                  disabled={isExporting !== ""}
                >
                  <FileText className="h-6 w-6" />
                  {isExporting === "csv" ? "Exporting CSV..." : "Export as CSV"}
                  <span className="text-xs opacity-80">Spreadsheet format</span>
                </Button>
                <Button
                  className="w-full py-10 flex-col gap-2 transition-all duration-200 hover:scale-105"
                  onClick={() => downloadReport("pdf")}
                  style={{
                    backgroundColor: "#FFC50F",
                    color: "#004030",
                  }}
                  disabled={isExporting !== ""}
                >
                  <File className="h-6 w-6" />
                  {isExporting === "pdf" ? "Exporting PDF..." : "Export as PDF"}
                  <span className="text-xs opacity-80">Document format</span>
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Summary */}
        <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card style={{ backgroundColor: "#FFF9E5", borderColor: "#DCD0A8" }}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium" style={{ color: "#708993" }}>
                    Avg Daily Adherence
                  </p>
                  <p className="mt-2 text-3xl font-bold" style={{ color: "#004030" }}>
                    91%
                  </p>
                </div>
                <div className="rounded-full p-3" style={{ backgroundColor: "#E7F2EF" }}>
                  <Target className="h-6 w-6" style={{ color: "#63A361" }} />
                </div>
              </div>
              <div className="mt-2 flex items-center gap-1 text-sm" style={{ color: "#63A361" }}>
                <TrendingUp className="h-4 w-4" />
                <span>+3% from last month</span>
              </div>
            </CardContent>
          </Card>

          <Card style={{ backgroundColor: "#FFF9E5", borderColor: "#DCD0A8" }}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium" style={{ color: "#708993" }}>
                    Weight Progress
                  </p>
                  <p className="mt-2 text-3xl font-bold" style={{ color: "#004030" }}>
                    -3.5 kg
                  </p>
                </div>
                <div className="rounded-full p-3" style={{ backgroundColor: "#E7F2EF" }}>
                  <TrendingDown className="h-6 w-6" style={{ color: "#FFC50F" }} />
                </div>
              </div>
              <div className="mt-2 flex items-center gap-1 text-sm" style={{ color: "#63A361" }}>
                <TrendingDown className="h-4 w-4" />
                <span>On track to goal</span>
              </div>
            </CardContent>
          </Card>

          <Card style={{ backgroundColor: "#FFF9E5", borderColor: "#DCD0A8" }}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium" style={{ color: "#708993" }}>
                    Workout Streak
                  </p>
                  <p className="mt-2 text-3xl font-bold" style={{ color: "#004030" }}>
                    28 days
                  </p>
                </div>
                <div className="rounded-full p-3" style={{ backgroundColor: "#E7F2EF" }}>
                  <Activity className="h-6 w-6" style={{ color: "#4A9782" }} />
                </div>
              </div>
              <div className="mt-2 flex items-center gap-1 text-sm" style={{ color: "#63A361" }}>
                <TrendingUp className="h-4 w-4" />
                <span>Personal best!</span>
              </div>
            </CardContent>
          </Card>

          <Card style={{ backgroundColor: "#FFF9E5", borderColor: "#DCD0A8" }}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium" style={{ color: "#708993" }}>
                    Macro Accuracy
                  </p>
                  <p className="mt-2 text-3xl font-bold" style={{ color: "#004030" }}>
                    89%
                  </p>
                </div>
                <div className="rounded-full p-3" style={{ backgroundColor: "#E7F2EF" }}>
                  <PieChart className="h-6 w-6" style={{ color: "#5B532C" }} />
                </div>
              </div>
              <div className="mt-2 flex items-center gap-1 text-sm" style={{ color: "#63A361" }}>
                <TrendingUp className="h-4 w-4" />
                <span>+5% improvement</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {/* Monthly Trends */}
          <Card style={{ backgroundColor: "#FFF9E5", borderColor: "#DCD0A8" }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2" style={{ color: "#004030" }}>
                <LineChartIcon className="h-5 w-5" style={{ color: "#FFC50F" }} />
                {selectedMonths}-Month Progress Overview
              </CardTitle>
              <CardDescription style={{ color: "#708993" }}>
                Comprehensive view of weight, calories, and protein intake
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={monthlyTrendsData}>
                  <defs>
                    <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#FFC50F" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#FFC50F" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorCalories" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#63A361" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#63A361" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#A1C2BD" />
                  <XAxis dataKey="month" stroke="#708993" />
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
                  <Area
                    type="monotone"
                    dataKey="weight"
                    stroke="#FFC50F"
                    fillOpacity={1}
                    fill="url(#colorWeight)"
                    name="Weight (kg)"
                  />
                  <Area
                    type="monotone"
                    dataKey="protein"
                    stroke="#63A361"
                    fillOpacity={1}
                    fill="url(#colorCalories)"
                    name="Protein (g)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Nutrient Breakdown */}
            <Card style={{ backgroundColor: "#FFF9E5", borderColor: "#DCD0A8" }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2" style={{ color: "#004030" }}>
                  <PieChart className="h-5 w-5" style={{ color: "#63A361" }} />
                  Macronutrient Distribution
                </CardTitle>
                <CardDescription style={{ color: "#708993" }}>Average breakdown of your daily intake</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RePieChart>
                    <Pie
                      data={nutrientBreakdownData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {nutrientBreakdownData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#FFF9E5",
                        border: "1px solid #DCD0A8",
                        borderRadius: "8px",
                        color: "#004030",
                      }}
                    />
                  </RePieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Meal Distribution */}
            <Card style={{ backgroundColor: "#FFF9E5", borderColor: "#DCD0A8" }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2" style={{ color: "#004030" }}>
                  <BarChart3 className="h-5 w-5" style={{ color: "#FFC50F" }} />
                  Calorie Distribution by Meal
                </CardTitle>
                <CardDescription style={{ color: "#708993" }}>
                  How you distribute calories throughout the day
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={mealDistributionData} layout="vertical" margin={{ left: 80, right: 20, top: 20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#A1C2BD" />
                    <XAxis type="number" stroke="#708993" />
                    <YAxis dataKey="meal" type="category" stroke="#708993" width={70} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#FFF9E5",
                        border: "1px solid #DCD0A8",
                        borderRadius: "8px",
                        color: "#004030",
                      }}
                    />
                    <Bar dataKey="calories" fill="#FFC50F" radius={[0, 8, 8, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Micronutrient Tracking */}
          <Card style={{ backgroundColor: "#FFF9E5", borderColor: "#DCD0A8" }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2" style={{ color: "#004030" }}>
                <Crown className="h-5 w-5" style={{ color: "#FFC50F" }} />
                Micronutrient Adherence
              </CardTitle>
              <CardDescription style={{ color: "#708993" }}>
                Track your daily vitamin and mineral intake
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-3 text-sm font-medium" style={{ color: "#708993" }}>
                Percentage (%)
              </p>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={micronutrientData} margin={{ top: 20, right: 30, left: 36, bottom: 60 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#A1C2BD" />
                  <XAxis
                    dataKey="nutrient"
                    stroke="#708993"
                    angle={-45}
                    textAnchor="end"
                    height={80}
                    interval={0}
                  />
                  <YAxis stroke="#708993" domain={[0, 100]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#FFF9E5",
                      border: "1px solid #DCD0A8",
                      borderRadius: "8px",
                      color: "#004030",
                    }}
                    formatter={(value, name) => [`${value}%`, name === 'actual' ? 'Actual Intake' : 'Target']}
                  />
                  <Legend />
                  <Bar dataKey="actual" fill="#63A361" name="Actual Intake" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="target" fill="#FFC50F" name="Target" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Weekly Performance */}
          <Card style={{ backgroundColor: "#FFF9E5", borderColor: "#DCD0A8" }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2" style={{ color: "#004030" }}>
                <Target className="h-5 w-5" style={{ color: "#4A9782" }} />
                Weekly Performance Score
              </CardTitle>
              <CardDescription style={{ color: "#708993" }}>
                Multi-dimensional view of your health habits
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={weeklyPerformanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#A1C2BD" />
                  <XAxis dataKey="day" stroke="#708993" />
                  <YAxis stroke="#708993" domain={[0, 100]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#FFF9E5",
                      border: "1px solid #DCD0A8",
                      borderRadius: "8px",
                      color: "#004030",
                    }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="adherence" stroke="#63A361" strokeWidth={2} name="Diet Adherence" />
                  <Line type="monotone" dataKey="exercise" stroke="#FFC50F" strokeWidth={2} name="Exercise" />
                  <Line type="monotone" dataKey="sleep" stroke="#4A9782" strokeWidth={2} name="Sleep Quality" />
                  <Line type="monotone" dataKey="hydration" stroke="#5B532C" strokeWidth={2} name="Hydration" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* AI Insights */}
          <Card style={{ backgroundColor: "#FFF9E5", borderColor: "#DCD0A8" }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2" style={{ color: "#004030" }}>
                <Crown className="h-5 w-5" style={{ color: "#FFC50F" }} />
                AI-Powered Insights & Predictions
              </CardTitle>
              <CardDescription style={{ color: "#708993" }}>
                Personalized recommendations based on your data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="rounded-lg border p-4" style={{ borderColor: "#DCD0A8", backgroundColor: "#E7F2EF" }}>
                  <h4 className="font-semibold" style={{ color: "#004030" }}>
                    🎯 Goal Prediction
                  </h4>
                  <p className="mt-2 text-sm" style={{ color: "#708993" }}>
                    Based on your current progress, you're on track to reach your goal weight of 82kg in approximately{" "}
                    <strong>6 weeks</strong>. Maintain your current adherence rate for optimal results.
                  </p>
                </div>
                <div className="rounded-lg border p-4" style={{ borderColor: "#DCD0A8", backgroundColor: "#E7F2EF" }}>
                  <h4 className="font-semibold" style={{ color: "#004030" }}>
                    💪 Optimization Tip
                  </h4>
                  <p className="mt-2 text-sm" style={{ color: "#708993" }}>
                    Your protein intake is consistently below target on weekends. Consider adding a protein shake or
                    Greek yogurt to your Saturday breakfast routine.
                  </p>
                </div>
                <div className="rounded-lg border p-4" style={{ borderColor: "#DCD0A8", backgroundColor: "#E7F2EF" }}>
                  <h4 className="font-semibold" style={{ color: "#004030" }}>
                    📊 Pattern Recognition
                  </h4>
                  <p className="mt-2 text-sm" style={{ color: "#708993" }}>
                    Your best adherence days correlate with morning workouts (95% vs 88% on non-workout days). Consider
                    increasing morning exercise frequency.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <style jsx>{`
        input[type="range"]::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #004030;
          cursor: pointer;
          border: 2px solid #FFF9E5;
        }
        input[type="range"]::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #004030;
          cursor: pointer;
          border: 2px solid #FFF9E5;
        }
      `}</style>
    </div>
  )
}




