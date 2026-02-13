"use client"
import { API_BASE } from "@/lib/api"
import { useMenuInteractions } from "@/hooks/use-menu-interactions"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Menu, Home, Utensils, Cookie, Activity, History, ArrowLeft } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import ProfileAvatarButton from "./profile-avatar-button"

export default function GoalManagementView() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { menuButtonRef, menuPanelRef } = useMenuInteractions(isMenuOpen, setIsMenuOpen)
  const router = useRouter()

  // User physical data state
  const [age, setAge] = useState("28")
  const [gender, setGender] = useState("male")
  const [height, setHeight] = useState("175")
  const [weight, setWeight] = useState("75")
  const [activityLevel, setActivityLevel] = useState("moderately-active")
  const [userId, setUserId] = useState<number | null>(null)

  // Results
  const [bmr, setBmr] = useState(0)
  const [tdee, setTdee] = useState(0)

  const normalizeActivityLevel = (value: string) => {
    const normalized = value.toLowerCase().trim()
    if (normalized === "lightly-active") return "lightly-active"
    if (normalized === "moderately-active") return "moderately-active"
    if (normalized === "very-active") return "very-active"
    if (normalized === "light" || normalized === "lightly active") return "lightly-active"
    if (normalized === "moderate" || normalized === "moderately active") return "moderately-active"
    if (normalized === "active" || normalized === "very active") return "very-active"
    if (normalized === "sedentary") return "sedentary"
    return "moderately-active"
  }

  // Load data

  useEffect(() => {
    const userStr = localStorage.getItem("calora_user")
    if (userStr) {
      const storedUser = JSON.parse(userStr)
      console.log("GoalManagement loaded user from localStorage:", storedUser)
      setUserId(storedUser.id)

      if (storedUser.id) {
        // Fetch fresh data from API
        fetch(`${API_BASE}/users/${storedUser.id}`)
          .then(async (res) => {
            if (res.ok) return res.json();

            // Handle 404 specifically
            if (res.status === 404) {
              console.warn("User not found in backend (404). Clearing stale local storage.");
              localStorage.removeItem("calora_user");
              // Optional: redirect to login or show message
              // router.push("/login"); 
              throw new Error("User not found (404) - Stale local storage cleared");
            }

            const text = await res.text();
            throw new Error(`Failed to fetch user: ${res.status} ${text}`);
          })
          .then((user) => {
            console.log("GoalManagement fetched fresh user:", user);
            if (user.age) {
              console.log("Setting age:", user.age)
              setAge(user.age.toString())
            }
            if (user.gender) {
              console.log("Setting gender:", user.gender)
              setGender(user.gender.toLowerCase().trim())
            }
            if (user.height) {
              console.log("Setting height:", user.height)
              setHeight(user.height.toString())
            }
            if (user.weight) {
              console.log("Setting weight:", user.weight)
              setWeight(user.weight.toString())
            }
            if (user.activityLevel) {
              console.log("Setting activityLevel:", user.activityLevel)
              setActivityLevel(normalizeActivityLevel(user.activityLevel))
            } else {
              console.log("activityLevel missing in fetched user object")
              // Fallback to local storage if API missing field (unlikely)
              if (storedUser.activityLevel) {
                setActivityLevel(normalizeActivityLevel(storedUser.activityLevel))
              }
            }
          })
          .catch((err) => {
            console.error("Error fetching user data:", err);
            // Fallback to local storage data on error (unless it was a 404 cleared above)
            if (storedUser && localStorage.getItem("calora_user")) {
              if (storedUser.age) setAge(storedUser.age.toString())
              if (storedUser.gender) setGender(storedUser.gender.toLowerCase().trim())
              if (storedUser.height) setHeight(storedUser.height.toString())
              if (storedUser.weight) setWeight(storedUser.weight.toString())
              if (storedUser.activityLevel) setActivityLevel(normalizeActivityLevel(storedUser.activityLevel))
            }
          });
      }
    } else {
      console.log("No calora_user in localStorage")
    }
  }, [])

  // Calculate BMR and TDEE whenever inputs change
  useEffect(() => {
    const a = parseInt(age)
    const h = parseFloat(height)
    const w = parseFloat(weight)

    if (!isNaN(a) && !isNaN(h) && !isNaN(w)) {
      // Mifflin-St Jeor Equation
      let bmrCalc = 10 * w + 6.25 * h - 5 * a
      if (gender === "male") bmrCalc += 5
      else bmrCalc -= 161

      setBmr(Math.round(bmrCalc))

      // TDEE multipliers
      let multiplier = 1.2 // sedentary
      if (activityLevel === "lightly-active") multiplier = 1.375
      if (activityLevel === "moderately-active") multiplier = 1.55
      if (activityLevel === "very-active") multiplier = 1.725

      setTdee(Math.round(bmrCalc * multiplier))
    }
  }, [age, gender, height, weight, activityLevel])

  const handleNavigation = (path: string) => {
    router.push(path)
    setIsMenuOpen(false)
  }

  const handleSave = async () => {
    if (!userId) return

    try {
      const res = await fetch(`${API_BASE}/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          age: parseInt(age),
          gender,
          height: parseFloat(height),
          weight: parseFloat(weight),
          activityLevel
        })
      })

      if (res.ok) {
        const updatedUser = await res.json()
        // Update local storage
        const currentUserStr = localStorage.getItem("calora_user")
        const currentUser = currentUserStr ? JSON.parse(currentUserStr) : {}
        const mergedUser = {
          ...currentUser,
          age: updatedUser.age,
          gender: updatedUser.gender,
          height: updatedUser.height,
          weight: updatedUser.weight,
          activityLevel: updatedUser.activityLevel
        }
        localStorage.setItem("calora_user", JSON.stringify(mergedUser))

        alert("Your health profile has been updated successfully!")
      } else {
        alert("Failed to save changes")
      }
    } catch (e) {
      console.error("Save error", e)
      alert("Error saving changes")
    }
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
                Goal Management
              </h1>
            </div>
            <ProfileAvatarButton onClick={() => handleNavigation("/profile")} />
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
            <CardTitle style={{ color: "#004030" }}>Goal Management Settings</CardTitle>
            <CardDescription style={{ color: "#708993" }}>
              Update your physical inputs that drive BMR/TDEE calculations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-6">
              {/* Age and Gender Row */}
              <div className="gap-2 flex flex-row justify-between items-start">
                <div className="flex flex-col justify-center items-start gap-2 w-full">
                  <Label htmlFor="age" style={{ color: "#004030" }} className="font-medium">
                    Age
                  </Label>
                  <Input
                    id="age"
                    type="number"
                    placeholder="Enter your age"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    min="1"
                    max="120"
                    className="py-5 border-2 focus-visible:ring-offset-0"
                    style={{
                      borderColor: "#A1C2BD",
                      backgroundColor: "#FFFFFF",
                      color: "#19183B",
                    }}
                  />
                </div>
                <div className="flex flex-col gap-2 justify-center items-start w-full">
                  <Label htmlFor="gender" style={{ color: "#004030" }} className="w-full font-medium">
                    Gender
                  </Label>
                  <Select value={gender} onValueChange={setGender}>
                    <SelectTrigger
                      id="gender"
                      className="py-5 border-2 w-full focus:ring-offset-0"
                      style={{
                        borderColor: "#A1C2BD",
                        backgroundColor: "#FFFFFF",
                        color: gender ? "#19183B" : "#708993",
                      }}
                    >
                      <SelectValue placeholder="Select your gender" />
                    </SelectTrigger>
                    <SelectContent style={{ backgroundColor: "#FFF9E5", borderColor: "#A1C2BD" }}>
                      <SelectItem value="male" style={{ color: "#19183B" }}>
                        Male
                      </SelectItem>
                      <SelectItem value="female" style={{ color: "#19183B" }}>
                        Female
                      </SelectItem>
                      <SelectItem value="other" style={{ color: "#19183B" }}>
                        Other
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Height and Weight Row */}
              <div className="gap-2 flex flex-row justify-between items-start">
                <div className="flex flex-col justify-center items-start gap-2 w-full">
                  <Label htmlFor="height" style={{ color: "#004030" }} className="font-medium">
                    Height (cm)
                  </Label>
                  <Input
                    id="height"
                    type="number"
                    placeholder="Enter your height"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    min="50"
                    max="300"
                    className="py-5 border-2 focus-visible:ring-offset-0"
                    style={{
                      borderColor: "#A1C2BD",
                      backgroundColor: "#FFFFFF",
                      color: "#19183B",
                    }}
                  />
                </div>
                <div className="flex flex-col gap-2 justify-center items-start w-full">
                  <Label htmlFor="weight" style={{ color: "#004030" }} className="font-medium">
                    Weight (kg)
                  </Label>
                  <Input
                    id="weight"
                    type="number"
                    placeholder="Enter your weight"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    min="20"
                    max="500"
                    step="0.1"
                    className="py-5 border-2 focus-visible:ring-offset-0"
                    style={{
                      borderColor: "#A1C2BD",
                      backgroundColor: "#FFFFFF",
                      color: "#19183B",
                    }}
                  />
                </div>
              </div>

              {/* Activity Level */}
              <div className="space-y-2">
                <Label htmlFor="activityLevel" style={{ color: "#004030" }} className="font-medium">
                  Activity Level
                </Label>
                <Select value={activityLevel} onValueChange={(value) => setActivityLevel(normalizeActivityLevel(value))}>
                  <SelectTrigger
                    id="activityLevel"
                    className="h-12 w-full border-2 focus:ring-offset-0"
                    style={{
                      borderColor: "#A1C2BD",
                      backgroundColor: "#FFFFFF",
                      color: activityLevel ? "#19183B" : "#708993",
                    }}
                  >
                    <SelectValue placeholder="Select your activity level" />
                  </SelectTrigger>
                  <SelectContent style={{ backgroundColor: "#FFF9E5", borderColor: "#A1C2BD" }}>
                    <SelectItem value="sedentary" style={{ color: "#19183B" }}>
                      Sedentary - Little to no exercise
                    </SelectItem>
                    <SelectItem value="lightly-active" style={{ color: "#19183B" }}>
                      Lightly Active - Exercise 1-3 days/week
                    </SelectItem>
                    <SelectItem value="moderately-active" style={{ color: "#19183B" }}>
                      Moderately Active - Exercise 3-5 days/week
                    </SelectItem>
                    <SelectItem value="very-active" style={{ color: "#19183B" }}>
                      Very Active - Exercise 6-7 days/week
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Calculated Results */}
              <div className="rounded-lg p-4 space-y-3" style={{ backgroundColor: "#E7F2EF" }}>
                <h3 className="font-semibold" style={{ color: "#004030" }}>
                  Calculated Results
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm" style={{ color: "#708993" }}>
                      BMR (Basal Metabolic Rate)
                    </p>
                    <p className="text-2xl font-bold" style={{ color: "#4A9782" }}>
                      {bmr.toLocaleString()}
                    </p>
                    <p className="text-xs" style={{ color: "#708993" }}>
                      calories/day
                    </p>
                  </div>
                  <div>
                    <p className="text-sm" style={{ color: "#708993" }}>
                      TDEE (Total Daily Energy)
                    </p>
                    <p className="text-2xl font-bold" style={{ color: "#4A9782" }}>
                      {tdee.toLocaleString()}
                    </p>
                    <p className="text-xs" style={{ color: "#708993" }}>
                      calories/day
                    </p>
                  </div>
                </div>
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
                Save Changes
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}




