"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  User,
  Menu,
  Home,
  Utensils,
  Cookie,
  Activity,
  History,
  TrendingUp,
  Calendar,
  Sparkles,
  Crown,
} from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"

// Sample data for calorie trends (last 7 days)
const calorieTrendsData = [
  { date: "Mon", consumed: 2100, target: 2200, burned: 350 },
  { date: "Tue", consumed: 2300, target: 2200, burned: 420 },
  { date: "Wed", consumed: 2050, target: 2200, burned: 380 },
  { date: "Thu", consumed: 2200, target: 2200, burned: 400 },
  { date: "Fri", consumed: 2150, target: 2200, burned: 360 },
  { date: "Sat", consumed: 2400, target: 2200, burned: 450 },
  { date: "Sun", consumed: 2100, target: 2200, burned: 320 },
]

// Sample data for macro adherence (last 7 days)
const macroAdherenceData = [
  { date: "Mon", protein: 165, carbs: 220, fats: 70 },
  { date: "Tue", protein: 158, carbs: 248, fats: 75 },
  { date: "Wed", protein: 172, carbs: 235, fats: 68 },
  { date: "Thu", protein: 165, carbs: 248, fats: 73 },
  { date: "Fri", protein: 160, carbs: 240, fats: 72 },
  { date: "Sat", protein: 170, carbs: 255, fats: 78 },
  { date: "Sun", protein: 162, carbs: 242, fats: 71 },
]

// Sample data for weight trajectory (last 8 weeks)
const weightTrajectoryData = [
  { week: "Week 1", weight: 85.5, goal: 82 },
  { week: "Week 2", weight: 85.2, goal: 82 },
  { week: "Week 3", weight: 84.8, goal: 82 },
  { week: "Week 4", weight: 84.5, goal: 82 },
  { week: "Week 5", weight: 84.0, goal: 82 },
  { week: "Week 6", weight: 83.8, goal: 82 },
  { week: "Week 7", weight: 83.3, goal: 82 },
  { week: "Week 8", weight: 83.0, goal: 82 },
]

export default function HistoryView() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
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
                History & Analytics
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
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5" style={{ color: "#4A9782" }} />
            <span className="font-medium" style={{ color: "#004030" }}>
              Last 30 Days
            </span>
          </div>
          <Button
            className="flex items-center gap-2"
            style={{
              backgroundColor: "#4A9782",
              color: "#FFF9E5",
            }}
            onClick={() => handleNavigation("/advanced-analytics")}
          >
            <Crown className="h-4 w-4" />
            Advanced Analytics
          </Button>
        </div>

        <div className="space-y-6">
          {/* Calorie Trends Chart */}
          <Card style={{ backgroundColor: "#FFF9E5", borderColor: "#DCD0A8" }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2" style={{ color: "#004030" }}>
                <TrendingUp className="h-5 w-5" style={{ color: "#FFC50F" }} />
                Calorie Trends
              </CardTitle>
              <CardDescription style={{ color: "#708993" }}>
                Track your daily calorie consumption vs. target over the last 7 days
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
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

          {/* Macro Adherence Chart */}
          <Card style={{ backgroundColor: "#FFF9E5", borderColor: "#DCD0A8" }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2" style={{ color: "#004030" }}>
                <Sparkles className="h-5 w-5" style={{ color: "#63A361" }} />
                Macro Adherence
              </CardTitle>
              <CardDescription style={{ color: "#708993" }}>
                Daily macronutrient intake over the last 7 days
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={macroAdherenceData}>
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
                  <Bar dataKey="protein" fill="#63A361" name="Protein (g)" />
                  <Bar dataKey="carbs" fill="#FFC50F" name="Carbs (g)" />
                  <Bar dataKey="fats" fill="#5B532C" name="Fats (g)" />
                </BarChart>
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
              <CardDescription style={{ color: "#708993" }}>Your weight progress over the last 8 weeks</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
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

          {/* Advanced Analytics Teaser */}
          <Card
            style={{
              backgroundColor: "#FFF9E5",
              borderColor: "#DCD0A8",
              background: "linear-gradient(135deg, #FFF9E5 0%, #E7F2EF 100%)",
            }}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2" style={{ color: "#004030" }}>
                <Crown className="h-5 w-5" style={{ color: "#FFC50F" }} />
                Advanced Analytics
                <span
                  className="ml-2 rounded-full px-3 py-1 text-xs font-semibold"
                  style={{ backgroundColor: "#FFC50F", color: "#004030" }}
                >
                  PREMIUM
                </span>
              </CardTitle>
              <CardDescription style={{ color: "#708993" }}>
                Unlock deeper insights and comprehensive health reports
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <ul className="space-y-2" style={{ color: "#004030" }}>
                  <li className="flex items-start gap-2">
                    <span className="mt-1">✓</span>
                    <span>Detailed nutrient breakdown and micronutrient tracking</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1">✓</span>
                    <span>Custom date range analysis and export reports</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1">✓</span>
                    <span>AI-powered insights and personalized recommendations</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1">✓</span>
                    <span>Comparative analysis and progress predictions</span>
                  </li>
                </ul>
                <Button
                  className="w-full"
                  style={{
                    backgroundColor: "#FFC50F",
                    color: "#004030",
                  }}
                  onClick={() => handleNavigation("/subscription")}
                >
                  <Crown className="mr-2 h-4 w-4" />
                  Upgrade to Premium
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
