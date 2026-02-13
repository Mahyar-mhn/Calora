"use client"

import { useEffect, useState } from "react"
import { useMenuInteractions } from "@/hooks/use-menu-interactions"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Menu, Home, Utensils, Cookie, Activity, History, Calendar, Crown, ChevronRight } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { ThemeToggle } from "@/components/theme-toggle"
import ProfileAvatarButton from "@/components/profile-avatar-button"

export default function WeeklyMealPlansPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { menuButtonRef, menuPanelRef } = useMenuInteractions(isMenuOpen, setIsMenuOpen)
  const [isAllowed, setIsAllowed] = useState(false)
  const router = useRouter()

  const handleNavigation = (path: string) => {
    router.push(path)
    setIsMenuOpen(false)
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

  const mealPlan = [
    {
      day: "Monday",
      meals: [
        { type: "Breakfast", name: "Oatmeal with Berries", calories: 350, protein: 12, carbs: 58, fats: 8 },
        { type: "Lunch", name: "Grilled Chicken Salad", calories: 425, protein: 38, carbs: 22, fats: 18 },
        { type: "Dinner", name: "Salmon with Quinoa", calories: 520, protein: 42, carbs: 45, fats: 20 },
        { type: "Snack", name: "Greek Yogurt & Almonds", calories: 220, protein: 15, carbs: 12, fats: 12 },
      ],
    },
    {
      day: "Tuesday",
      meals: [
        { type: "Breakfast", name: "Scrambled Eggs & Toast", calories: 380, protein: 22, carbs: 35, fats: 16 },
        { type: "Lunch", name: "Turkey Wrap", calories: 450, protein: 32, carbs: 42, fats: 15 },
        { type: "Dinner", name: "Beef Stir-Fry with Rice", calories: 580, protein: 45, carbs: 52, fats: 22 },
        { type: "Snack", name: "Apple with Peanut Butter", calories: 200, protein: 6, carbs: 24, fats: 10 },
      ],
    },
    {
      day: "Wednesday",
      meals: [
        { type: "Breakfast", name: "Protein Smoothie Bowl", calories: 360, protein: 28, carbs: 48, fats: 9 },
        { type: "Lunch", name: "Tuna Pasta Salad", calories: 480, protein: 35, carbs: 50, fats: 14 },
        { type: "Dinner", name: "Chicken Breast & Vegetables", calories: 490, protein: 48, carbs: 35, fats: 16 },
        { type: "Snack", name: "Protein Bar", calories: 180, protein: 15, carbs: 18, fats: 6 },
      ],
    },
    {
      day: "Thursday",
      meals: [
        { type: "Breakfast", name: "Avocado Toast with Egg", calories: 420, protein: 18, carbs: 38, fats: 22 },
        { type: "Lunch", name: "Chicken Caesar Salad", calories: 460, protein: 40, carbs: 20, fats: 24 },
        { type: "Dinner", name: "Grilled Shrimp & Sweet Potato", calories: 510, protein: 38, carbs: 48, fats: 18 },
        { type: "Snack", name: "Cottage Cheese & Fruit", calories: 190, protein: 14, carbs: 22, fats: 4 },
      ],
    },
    {
      day: "Friday",
      meals: [
        { type: "Breakfast", name: "Whole Grain Pancakes", calories: 390, protein: 16, carbs: 58, fats: 12 },
        { type: "Lunch", name: "Veggie Burrito Bowl", calories: 500, protein: 22, carbs: 68, fats: 16 },
        { type: "Dinner", name: "Baked Cod with Asparagus", calories: 440, protein: 42, carbs: 28, fats: 18 },
        { type: "Snack", name: "Trail Mix", calories: 210, protein: 8, carbs: 20, fats: 12 },
      ],
    },
    {
      day: "Saturday",
      meals: [
        { type: "Breakfast", name: "Breakfast Burrito", calories: 480, protein: 28, carbs: 45, fats: 22 },
        { type: "Lunch", name: "Margherita Pizza (2 slices)", calories: 520, protein: 24, carbs: 58, fats: 22 },
        { type: "Dinner", name: "Ribeye Steak & Baked Potato", calories: 680, protein: 52, carbs: 42, fats: 32 },
        { type: "Snack", name: "Dark Chocolate & Berries", calories: 150, protein: 3, carbs: 24, fats: 6 },
      ],
    },
    {
      day: "Sunday",
      meals: [
        { type: "Breakfast", name: "French Toast with Fruit", calories: 410, protein: 14, carbs: 62, fats: 14 },
        { type: "Lunch", name: "Chicken Poke Bowl", calories: 490, protein: 36, carbs: 52, fats: 16 },
        { type: "Dinner", name: "Grilled Chicken Pasta", calories: 560, protein: 42, carbs: 58, fats: 18 },
        { type: "Snack", name: "Hummus & Veggies", calories: 160, protein: 6, carbs: 18, fats: 8 },
      ],
    },
  ]

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
                  Weekly Meal Plans
                </h1>
                <Crown className="h-5 w-5" style={{ color: "#FFC50F" }} />
              </div>
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
          <div className="fixed inset-0 bg-black/20" onClick={() => setIsMenuOpen(false)} />
          <div
            ref={menuPanelRef}
            className="absolute left-4 top-2 z-50 w-[min(20rem,calc(100vw-2rem))] origin-top-left rounded-lg border shadow-lg animate-in fade-in-0 zoom-in-95 duration-200 sm:left-6"
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
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <Card className="mb-6" style={{ backgroundColor: "#FFF9E5", borderColor: "#DCD0A8" }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2" style={{ color: "#004030" }}>
              <Calendar className="h-6 w-6" />
              AI-Generated Meal Plan
              <Crown className="h-5 w-5" style={{ color: "#FFC50F" }} />
            </CardTitle>
            <CardDescription style={{ color: "#708993" }}>
              Your personalized weekly meal plan optimized for your calorie and macro targets
            </CardDescription>
          </CardHeader>
        </Card>

        <div className="space-y-4">
          {mealPlan.map((dayPlan, dayIndex) => (
            <Card key={dayIndex} style={{ backgroundColor: "#FFF9E5", borderColor: "#DCD0A8" }}>
              <CardHeader>
                <CardTitle style={{ color: "#004030" }}>{dayPlan.day}</CardTitle>
                <CardDescription style={{ color: "#708993" }}>
                  Total: {dayPlan.meals.reduce((sum, meal) => sum + meal.calories, 0)} calories
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  {dayPlan.meals.map((meal, mealIndex) => (
                    <div
                      key={mealIndex}
                      className="flex items-center justify-between rounded-lg border p-4"
                      style={{ borderColor: "#DCD0A8", backgroundColor: "#FFFFFF" }}
                    >
                      <div className="flex-1">
                        <div className="mb-1 flex items-center gap-2">
                          <span className="text-xs font-semibold uppercase" style={{ color: "#4A9782" }}>
                            {meal.type}
                          </span>
                        </div>
                        <h4 className="font-semibold" style={{ color: "#004030" }}>
                          {meal.name}
                        </h4>
                        <p className="text-sm" style={{ color: "#708993" }}>
                          {meal.calories} cal • P: {meal.protein}g • C: {meal.carbs}g • F: {meal.fats}g
                        </p>
                      </div>
                      <Button
                        size="icon"
                        variant="outline"
                        className="rounded-full bg-transparent"
                        style={{
                          borderColor: "#4A9782",
                          color: "#4A9782",
                        }}
                      >
                        <ChevronRight className="h-5 w-5" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}


