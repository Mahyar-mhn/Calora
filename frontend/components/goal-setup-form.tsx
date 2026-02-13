"use client"
import { API_BASE } from "@/lib/api"
import type React from "react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import Image from "next/image"

type GoalType = "lose" | "maintain" | "gain"

export default function GoalSetupForm() {
  const router = useRouter()
  const [selectedGoal, setSelectedGoal] = useState<GoalType | "">("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedGoal) return

    // Get user from local storage
    const userStr = localStorage.getItem("calora_user")
    if (!userStr) {
      alert("No user found.")
      router.push("/signup")
      return
    }
    const user = JSON.parse(userStr)

    // Calculate TDEE
    let tdee = 2000 // Default fallback
    if (user.weight && user.height && user.age && user.gender) {
      let bmr = 10 * user.weight + 6.25 * user.height - 5 * user.age
      if (user.gender === "male") bmr += 5
      else bmr -= 161

      let multiplier = 1.2
      if (user.activityLevel === "lightly-active") multiplier = 1.375
      if (user.activityLevel === "moderately-active") multiplier = 1.55
      if (user.activityLevel === "very-active") multiplier = 1.725

      tdee = Math.round(bmr * multiplier)
    }

    // Determine target based on goal
    let dailyCalorieTarget = tdee
    if (selectedGoal === "lose") dailyCalorieTarget = Math.max(1200, tdee - 500) // Safety floor
    if (selectedGoal === "gain") dailyCalorieTarget = tdee + 500

    try {
      const res = await fetch(`${API_BASE}/users/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          goal: selectedGoal === "lose" ? "Lose Weight" : selectedGoal === "maintain" ? "Maintain Weight" : "Gain Weight",
          dailyCalorieTarget: Math.round(dailyCalorieTarget)
        })
      })

      if (res.ok) {
        const updatedUser = await res.json()
        localStorage.setItem("calora_user", JSON.stringify(updatedUser))
        router.push("/dashboard")
      } else {
        alert("Failed to save goal")
      }
    } catch (error) {
      console.error("Goal setup error", error)
      alert("Error saving goal")
    }
  }

  const goals: { value: GoalType; label: string; description: string }[] = [
    {
      value: "lose",
      label: "Lose Weight",
      description: "Create a calorie deficit to reduce weight",
    },
    {
      value: "maintain",
      label: "Maintain Weight",
      description: "Balance calories to maintain current weight",
    },
    {
      value: "gain",
      label: "Gain Weight",
      description: "Create a calorie surplus to increase weight",
    },
  ]

  return (
    <Card className="w-full border-0 shadow-2xl" style={{ background: "#FFF9E5" }}>
      <CardHeader className="space-y-6 pt-8 pb-6">
        <div className="flex justify-center">
          <Image src="/images/logo.png" alt="Calora Logo" width={120} height={120} className="object-contain" />
        </div>
        <div className="text-center space-y-2">
          <CardTitle className="text-3xl font-bold text-balance" style={{ color: "#004030" }}>
            Set Your Goal
          </CardTitle>
          <CardDescription className="text-base" style={{ color: "#708993" }}>
            Step 2: Choose your health objective
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-6 pb-8">
        <div className="mb-6">
          <Button
            variant="ghost"
            className="gap-2"
            style={{ color: "#004030" }}
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-3">
            <Label style={{ color: "#004030" }} className="font-medium text-base">
              What is your goal?
            </Label>
            <div className="space-y-3">
              {goals.map((goal) => (
                <button
                  key={goal.value}
                  type="button"
                  onClick={() => setSelectedGoal(goal.value)}
                  className="w-full p-4 rounded-lg border-2 text-left transition-all hover:shadow-md"
                  style={{
                    borderColor: selectedGoal === goal.value ? "#4A9782" : "#A1C2BD",
                    background: selectedGoal === goal.value ? "#E7F2EF" : "#FFFFFF",
                  }}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className="mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0"
                      style={{
                        borderColor: selectedGoal === goal.value ? "#4A9782" : "#A1C2BD",
                      }}
                    >
                      {selectedGoal === goal.value && (
                        <div className="w-3 h-3 rounded-full" style={{ background: "#4A9782" }} />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-base mb-1" style={{ color: "#004030" }}>
                        {goal.label}
                      </div>
                      <div className="text-sm" style={{ color: "#708993" }}>
                        {goal.description}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <Button
            type="submit"
            disabled={!selectedGoal}
            className="w-full h-12 text-base font-semibold shadow-md hover:shadow-lg transition-all disabled:opacity-50"
            style={{
              background: "#4A9782",
              color: "#FFF9E5",
            }}
          >
            Complete Setup
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

