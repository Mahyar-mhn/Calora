"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Menu,
  User,
  Home,
  Utensils,
  Cookie,
  Activity,
  History,
  Target,
  Bell,
  Crown,
  Shield,
  Camera,
  Edit,
  TrendingDown,
  Minus,
  TrendingUp,
  LogOut,
} from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"

export default function ProfileView() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isEditingGoal, setIsEditingGoal] = useState(false)
  const [selectedGoal, setSelectedGoal] = useState("Lose Weight")
  const [dailyCalorieTarget, setDailyCalorieTarget] = useState(2200)
  const router = useRouter()

  const handleNavigation = (path: string) => {
    router.push(path)
    setIsMenuOpen(false)
  }

  const handleProfilePictureUpload = () => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = "image/*"
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        alert(`Profile picture selected: ${file.name}\nThis would upload the image to the server.`)
      }
    }
    input.click()
  }

  const handleSaveChanges = () => {
    alert(`Profile updated successfully!\n\nName: ${userData.firstName} ${userData.lastName}\nEmail: ${userData.email}`)
  }

  const handleSaveGoal = () => {
    let newTarget = 2200
    if (selectedGoal === "Lose Weight") {
      newTarget = 1800
    } else if (selectedGoal === "Maintain Weight") {
      newTarget = 2200
    } else if (selectedGoal === "Gain Weight") {
      newTarget = 2600
    }
    setDailyCalorieTarget(newTarget)
    setIsEditingGoal(false)
    alert(`Goal updated to: ${selectedGoal}\nNew daily calorie target: ${newTarget} kcal`)
  }

  // Sample user data
  const [userData, setUserData] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    profilePicture: "/images/logo.png",
  })

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
                className="rounded-lg bg-transparent transition-all hover:bg-[#E7F2EF] transition-transform duration-300 ease-in-out"
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
                Profile
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className="rounded-full bg-transparent transition-colors hover:bg-[#E7F2EF]"
                style={{
                  borderColor: "#4A9782",
                  color: "#004030",
                }}
                onClick={() => handleNavigation("/profile")}
              >
                <User className="h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full bg-transparent transition-colors hover:bg-[#E7F2EF]"
                style={{
                  borderColor: "#4A9782",
                  color: "#004030",
                }}
                onClick={() => {
                  // Handle logout - in a real app this would clear auth tokens/session
                  alert("Logged out successfully!")
                  router.push("/login")
                }}
                title="Logout"
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
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
                className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left transition-colors hover:bg-[#E7F2EF]"
                style={{ color: "#004030" }}
                onClick={() => handleNavigation("/dashboard")}
              >
                <Home className="h-5 w-5" />
                <span className="font-medium">Dashboard</span>
              </button>
              <button
                className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left transition-colors hover:bg-[#E7F2EF]"
                style={{ color: "#004030" }}
                onClick={() => handleNavigation("/meal-food")}
              >
                <Utensils className="h-5 w-5" />
                <span className="font-medium">Meal & Food</span>
              </button>
              <button
                className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left transition-colors hover:bg-[#E7F2EF]"
                style={{ color: "#004030" }}
                onClick={() => handleNavigation("/food-modal")}
              >
                <Cookie className="h-5 w-5" />
                <span className="font-medium">Food Modal</span>
              </button>
              <button
                className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left transition-colors hover:bg-[#E7F2EF]"
                style={{ color: "#004030" }}
                onClick={() => handleNavigation("/activity-tracking")}
              >
                <Activity className="h-5 w-5" />
                <span className="font-medium">Activity Tracking</span>
              </button>
              <button
                className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left transition-colors hover:bg-[#E7F2EF]"
                style={{ color: "#004030" }}
                onClick={() => handleNavigation("/history")}
              >
                <History className="h-5 w-5" />
                <span className="font-medium">History</span>
              </button>
            </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-6">
          {/* Profile Information Card */}
          <Card style={{ backgroundColor: "#FFF9E5", borderColor: "#DCD0A8" }}>
            <CardHeader>
              <CardTitle style={{ color: "#004030" }}>Profile Information</CardTitle>
              <CardDescription style={{ color: "#708993" }}>Manage your account details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Profile Picture */}
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <div
                      className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-4"
                      style={{ borderColor: "#4A9782" }}
                    >
                      <User className="h-16 w-16" style={{ color: "#708993" }} />
                    </div>
                    <Button
                      size="icon"
                      className="absolute bottom-0 right-0 h-8 w-8 rounded-full transition-all hover:scale-110 hover:shadow-lg"
                      style={{
                        backgroundColor: "#4A9782",
                        color: "#FFF9E5",
                      }}
                      onClick={handleProfilePictureUpload}
                    >
                      <Camera className="h-4 w-4" />
                    </Button>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold" style={{ color: "#004030" }}>
                      Profile Picture
                    </h3>
                    <p className="text-sm" style={{ color: "#708993" }}>
                      Click the camera icon to upload a new photo
                    </p>
                  </div>
                </div>

                {/* Name Fields */}
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" style={{ color: "#004030" }}>
                      First Name
                    </Label>
                    <Input
                      id="firstName"
                      value={userData.firstName}
                      onChange={(e) => setUserData({ ...userData, firstName: e.target.value })}
                      className="transition-colors focus:border-[#4A9782]"
                      style={{
                        borderColor: "#A1C2BD",
                        backgroundColor: "#FFFFFF",
                        color: "#004030",
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" style={{ color: "#004030" }}>
                      Last Name
                    </Label>
                    <Input
                      id="lastName"
                      value={userData.lastName}
                      onChange={(e) => setUserData({ ...userData, lastName: e.target.value })}
                      className="transition-colors focus:border-[#4A9782]"
                      style={{
                        borderColor: "#A1C2BD",
                        backgroundColor: "#FFFFFF",
                        color: "#004030",
                      }}
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email" style={{ color: "#004030" }}>
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={userData.email}
                    onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                    className="transition-colors focus:border-[#4A9782]"
                    style={{
                      borderColor: "#A1C2BD",
                      backgroundColor: "#FFFFFF",
                      color: "#004030",
                    }}
                  />
                </div>

                <Button
                  className="w-full transition-all hover:shadow-lg hover:opacity-90"
                  style={{
                    backgroundColor: "#4A9782",
                    color: "#FFF9E5",
                  }}
                  onClick={handleSaveChanges}
                >
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Goal Status Card */}
          <Card style={{ backgroundColor: "#FFF9E5", borderColor: "#DCD0A8" }}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle style={{ color: "#004030" }}>Goal Status</CardTitle>
                  <CardDescription style={{ color: "#708993" }}>Your current health goals</CardDescription>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-2 transition-all hover:bg-[#E7F2EF] hover:shadow-md bg-transparent"
                  style={{
                    borderColor: "#4A9782",
                    color: "#004030",
                  }}
                  onClick={() => setIsEditingGoal(true)}
                >
                  <Edit className="h-4 w-4" />
                  Edit
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div
                  className="flex items-center justify-between rounded-lg p-4"
                  style={{ backgroundColor: "#E7F2EF" }}
                >
                  <div>
                    <p className="font-semibold" style={{ color: "#004030" }}>
                      Current Goal
                    </p>
                    <p className="text-sm" style={{ color: "#708993" }}>
                      {selectedGoal}
                    </p>
                  </div>
                  <Target className="h-8 w-8" style={{ color: "#4A9782" }} />
                </div>
                <div
                  className="flex items-center justify-between rounded-lg p-4"
                  style={{ backgroundColor: "#E7F2EF" }}
                >
                  <div>
                    <p className="font-semibold" style={{ color: "#004030" }}>
                      Daily Calorie Target
                    </p>
                    <p className="text-sm" style={{ color: "#708993" }}>
                      {dailyCalorieTarget.toLocaleString()} kcal
                    </p>
                  </div>
                  <span className="text-2xl font-bold" style={{ color: "#4A9782" }}>
                    {dailyCalorieTarget.toLocaleString()}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Settings & Preferences */}
          <Card style={{ backgroundColor: "#FFF9E5", borderColor: "#DCD0A8" }}>
            <CardHeader>
              <CardTitle style={{ color: "#004030" }}>Settings & Preferences</CardTitle>
              <CardDescription style={{ color: "#708993" }}>Manage your account settings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2">
                {/* Goal Management Settings */}
                <Button
                  variant="outline"
                  className="h-auto flex-col gap-3 bg-transparent p-6 transition-all hover:bg-[#E7F2EF] hover:shadow-md"
                  style={{
                    borderColor: "#4A9782",
                    backgroundColor: "#FFFFFF",
                  }}
                  onClick={() => handleNavigation("/goal-management")}
                >
                  <Target className="h-8 w-8" style={{ color: "#4A9782" }} />
                  <div className="text-center">
                    <p className="font-semibold" style={{ color: "#004030" }}>
                      Goal Management
                    </p>
                    <p className="text-xs" style={{ color: "#708993" }}>
                      Update your health goals
                    </p>
                  </div>
                </Button>

                {/* Notifications Settings */}
                <Button
                  variant="outline"
                  className="h-auto flex-col gap-3 bg-transparent p-6 transition-all hover:bg-[#E7F2EF] hover:shadow-md"
                  style={{
                    borderColor: "#4A9782",
                    backgroundColor: "#FFFFFF",
                  }}
                  onClick={() => handleNavigation("/notifications-settings")}
                >
                  <Bell className="h-8 w-8" style={{ color: "#4A9782" }} />
                  <div className="text-center">
                    <p className="font-semibold" style={{ color: "#004030" }}>
                      Notifications
                    </p>
                    <p className="text-xs" style={{ color: "#708993" }}>
                      Manage your alerts
                    </p>
                  </div>
                </Button>

                {/* Subscription & Premium */}
                <Button
                  variant="outline"
                  className="h-auto flex-col gap-3 bg-transparent p-6 transition-all hover:bg-[#FFF9E5] hover:shadow-md"
                  style={{
                    borderColor: "#FFC50F",
                    backgroundColor: "#FFFFFF",
                  }}
                  onClick={() => handleNavigation("/subscription")}
                >
                  <Crown className="h-8 w-8" style={{ color: "#FFC50F" }} />
                  <div className="text-center">
                    <p className="font-semibold" style={{ color: "#004030" }}>
                      Premium
                    </p>
                    <p className="text-xs" style={{ color: "#708993" }}>
                      Upgrade your account
                    </p>
                  </div>
                </Button>

                {/* Privacy Dashboard */}
                <Button
                  variant="outline"
                  className="h-auto flex-col gap-3 bg-transparent p-6 transition-all hover:bg-[#E7F2EF] hover:shadow-md"
                  style={{
                    borderColor: "#4A9782",
                    backgroundColor: "#FFFFFF",
                  }}
                  onClick={() => handleNavigation("/privacy-dashboard")}
                >
                  <Shield className="h-8 w-8" style={{ color: "#4A9782" }} />
                  <div className="text-center">
                    <p className="font-semibold" style={{ color: "#004030" }}>
                      Privacy
                    </p>
                    <p className="text-xs" style={{ color: "#708993" }}>
                      Control your data
                    </p>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Goal Edit Modal */}
      {isEditingGoal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsEditingGoal(false)} />
          <div
            className="relative z-10 w-full max-w-md rounded-lg border p-6 shadow-xl"
            style={{ backgroundColor: "#FFF9E5", borderColor: "#DCD0A8" }}
          >
            <h2 className="mb-4 text-2xl font-bold" style={{ color: "#004030" }}>
              Edit Your Goal
            </h2>
            <p className="mb-6 text-sm" style={{ color: "#708993" }}>
              Select your health goal. Your daily calorie target will be automatically calculated based on your profile
              data.
            </p>

            <div className="space-y-3">
              {/* Lose Weight Option */}
              <button
                className={`flex w-full items-center gap-4 rounded-lg border-2 p-4 text-left transition-all hover:shadow-md ${
                  selectedGoal === "Lose Weight" ? "shadow-md" : ""
                }`}
                style={{
                  borderColor: selectedGoal === "Lose Weight" ? "#4A9782" : "#DCD0A8",
                  backgroundColor: selectedGoal === "Lose Weight" ? "#E7F2EF" : "#FFFFFF",
                }}
                onClick={() => setSelectedGoal("Lose Weight")}
              >
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-full"
                  style={{ backgroundColor: "#4A9782" }}
                >
                  <TrendingDown className="h-6 w-6" style={{ color: "#FFF9E5" }} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold" style={{ color: "#004030" }}>
                    Lose Weight
                  </h3>
                  <p className="text-sm" style={{ color: "#708993" }}>
                    Calorie deficit for weight loss
                  </p>
                </div>
              </button>

              {/* Maintain Weight Option */}
              <button
                className={`flex w-full items-center gap-4 rounded-lg border-2 p-4 text-left transition-all hover:shadow-md ${
                  selectedGoal === "Maintain Weight" ? "shadow-md" : ""
                }`}
                style={{
                  borderColor: selectedGoal === "Maintain Weight" ? "#4A9782" : "#DCD0A8",
                  backgroundColor: selectedGoal === "Maintain Weight" ? "#E7F2EF" : "#FFFFFF",
                }}
                onClick={() => setSelectedGoal("Maintain Weight")}
              >
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-full"
                  style={{ backgroundColor: "#63A361" }}
                >
                  <Minus className="h-6 w-6" style={{ color: "#FFF9E5" }} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold" style={{ color: "#004030" }}>
                    Maintain Weight
                  </h3>
                  <p className="text-sm" style={{ color: "#708993" }}>
                    Balanced calorie intake
                  </p>
                </div>
              </button>

              {/* Gain Weight Option */}
              <button
                className={`flex w-full items-center gap-4 rounded-lg border-2 p-4 text-left transition-all hover:shadow-md ${
                  selectedGoal === "Gain Weight" ? "shadow-md" : ""
                }`}
                style={{
                  borderColor: selectedGoal === "Gain Weight" ? "#4A9782" : "#DCD0A8",
                  backgroundColor: selectedGoal === "Gain Weight" ? "#E7F2EF" : "#FFFFFF",
                }}
                onClick={() => setSelectedGoal("Gain Weight")}
              >
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-full"
                  style={{ backgroundColor: "#FFC50F" }}
                >
                  <TrendingUp className="h-6 w-6" style={{ color: "#004030" }} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold" style={{ color: "#004030" }}>
                    Gain Weight
                  </h3>
                  <p className="text-sm" style={{ color: "#708993" }}>
                    Calorie surplus for weight gain
                  </p>
                </div>
              </button>
            </div>

            <div className="mt-6 flex gap-3">
              <Button
                variant="outline"
                className="flex-1 transition-all hover:bg-[#E7F2EF] bg-transparent"
                style={{
                  borderColor: "#A1C2BD",
                  color: "#004030",
                }}
                onClick={() => setIsEditingGoal(false)}
              >
                Cancel
              </Button>
              <Button
                className="flex-1 transition-all hover:shadow-lg hover:opacity-90"
                style={{
                  backgroundColor: "#4A9782",
                  color: "#FFF9E5",
                }}
                onClick={handleSaveGoal}
              >
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
