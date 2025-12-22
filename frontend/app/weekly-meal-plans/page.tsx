"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Menu, User, Home, Utensils, Cookie, Activity, History, Calendar, Crown, Plus, X, Sparkles } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { ThemeToggle } from "@/components/theme-toggle"

export default function WeeklyMealPlansPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [costLevel, setCostLevel] = useState("")
  const [focusType, setFocusType] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedPlan, setGeneratedPlan] = useState<any>(null)
  const [isMealModalOpen, setIsMealModalOpen] = useState(false)
  const [selectedMeal, setSelectedMeal] = useState<any>(null)
  const [mealQuantity, setMealQuantity] = useState("1")
  const [mealUnit, setMealUnit] = useState("serving")
  const router = useRouter()

  const handleNavigation = (path: string) => {
    router.push(path)
    setIsMenuOpen(false)
  }

  const generateMealPlan = () => {
    if (!costLevel || !focusType) {
      alert("Please select both cost level and focus type")
      return
    }

    setIsGenerating(true)

    // Simulate AI generation delay
    setTimeout(() => {
      const aiGeneratedPlan = generateAIPlan(costLevel, focusType)
      setGeneratedPlan(aiGeneratedPlan)
      setIsGenerating(false)
    }, 2000)
  }

  const generateAIPlan = (cost: string, focus: string) => {
    // AI-generated meal plan based on cost and focus preferences
    const baseMeals = {
      low: {
        breakfast: [
          { name: "Oatmeal with Banana", calories: 320, protein: 12, carbs: 55, fats: 6 },
          { name: "Whole Grain Toast with Egg", calories: 280, protein: 14, carbs: 32, fats: 10 },
          { name: "Greek Yogurt Parfait", calories: 250, protein: 18, carbs: 35, fats: 4 },
        ],
        lunch: [
          { name: "Chickpea Salad Sandwich", calories: 380, protein: 16, carbs: 58, fats: 8 },
          { name: "Lentil Soup with Bread", calories: 350, protein: 18, carbs: 52, fats: 6 },
          { name: "Tuna Salad Wrap", calories: 320, protein: 22, carbs: 38, fats: 12 },
        ],
        dinner: [
          { name: "Vegetable Stir-Fry with Rice", calories: 420, protein: 14, carbs: 68, fats: 8 },
          { name: "Bean Chili", calories: 380, protein: 20, carbs: 55, fats: 6 },
          { name: "Pasta with Tomato Sauce", calories: 400, protein: 16, carbs: 65, fats: 7 },
        ],
        snack: [
          { name: "Apple with Peanut Butter", calories: 180, protein: 5, carbs: 22, fats: 9 },
          { name: "Trail Mix (small)", calories: 150, protein: 4, carbs: 15, fats: 8 },
          { name: "Greek Yogurt", calories: 120, protein: 12, carbs: 8, fats: 2 },
        ],
      },
      medium: {
        breakfast: [
          { name: "Avocado Toast with Eggs", calories: 420, protein: 18, carbs: 38, fats: 22 },
          { name: "Smoothie Bowl", calories: 380, protein: 16, carbs: 52, fats: 12 },
          { name: "Breakfast Burrito", calories: 450, protein: 22, carbs: 45, fats: 18 },
        ],
        lunch: [
          { name: "Chicken Salad Bowl", calories: 480, protein: 32, carbs: 35, fats: 18 },
          { name: "Turkey Sandwich", calories: 420, protein: 28, carbs: 42, fats: 14 },
          { name: "Quinoa Salad", calories: 450, protein: 16, carbs: 58, fats: 12 },
        ],
        dinner: [
          { name: "Grilled Chicken with Vegetables", calories: 520, protein: 42, carbs: 35, fats: 16 },
          { name: "Salmon with Sweet Potato", calories: 580, protein: 38, carbs: 48, fats: 22 },
          { name: "Beef Stir-Fry", calories: 550, protein: 35, carbs: 42, fats: 20 },
        ],
        snack: [
          { name: "Mixed Nuts", calories: 220, protein: 6, carbs: 8, fats: 20 },
          { name: "Protein Bar", calories: 200, protein: 15, carbs: 20, fats: 8 },
          { name: "Cheese & Crackers", calories: 250, protein: 8, carbs: 18, fats: 16 },
        ],
      },
      high: {
        breakfast: [
          { name: "Smoked Salmon Bagel", calories: 520, protein: 28, carbs: 48, fats: 24 },
          { name: "Pancakes with Berries", calories: 480, protein: 12, carbs: 68, fats: 18 },
          { name: "Breakfast Sandwich", calories: 550, protein: 26, carbs: 45, fats: 28 },
        ],
        lunch: [
          { name: "Grilled Steak Salad", calories: 620, protein: 45, carbs: 25, fats: 32 },
          { name: "Shrimp Poke Bowl", calories: 580, protein: 35, carbs: 52, fats: 22 },
          { name: "Lobster Roll", calories: 650, protein: 32, carbs: 58, fats: 28 },
        ],
        dinner: [
          { name: "Filet Mignon", calories: 720, protein: 52, carbs: 8, fats: 48 },
          { name: "Seafood Paella", calories: 680, protein: 42, carbs: 65, fats: 24 },
          { name: "Duck Confit", calories: 750, protein: 38, carbs: 12, fats: 55 },
        ],
        snack: [
          { name: "Caviar on Toast", calories: 320, protein: 8, carbs: 22, fats: 24 },
          { name: "Artisanal Cheese Plate", calories: 380, protein: 15, carbs: 8, fats: 32 },
          { name: "Truffle Chocolate", calories: 280, protein: 4, carbs: 25, fats: 20 },
        ],
      },
    }

    // Adjust meals based on focus type
    const adjustForFocus = (meal: any, focus: string) => {
      if (focus === "protein") {
        return {
          ...meal,
          protein: Math.round(meal.protein * 1.3),
          carbs: Math.round(meal.carbs * 0.8),
          calories: Math.round(meal.calories * 1.1),
        }
      } else if (focus === "carbs") {
        return {
          ...meal,
          carbs: Math.round(meal.carbs * 1.4),
          protein: Math.round(meal.protein * 0.9),
          calories: Math.round(meal.calories * 1.2),
        }
      }
      return meal // calories focus - keep as is
    }

    const meals = baseMeals[cost as keyof typeof baseMeals]

    return [
      {
        day: "Monday",
        meals: [
          { type: "Breakfast", ...adjustForFocus(meals.breakfast[0], focus) },
          { type: "Lunch", ...adjustForFocus(meals.lunch[0], focus) },
          { type: "Dinner", ...adjustForFocus(meals.dinner[0], focus) },
          { type: "Snack", ...adjustForFocus(meals.snack[0], focus) },
        ],
      },
      {
        day: "Tuesday",
        meals: [
          { type: "Breakfast", ...adjustForFocus(meals.breakfast[1], focus) },
          { type: "Lunch", ...adjustForFocus(meals.lunch[1], focus) },
          { type: "Dinner", ...adjustForFocus(meals.dinner[1], focus) },
          { type: "Snack", ...adjustForFocus(meals.snack[1], focus) },
        ],
      },
      {
        day: "Wednesday",
        meals: [
          { type: "Breakfast", ...adjustForFocus(meals.breakfast[2], focus) },
          { type: "Lunch", ...adjustForFocus(meals.lunch[2], focus) },
          { type: "Dinner", ...adjustForFocus(meals.dinner[2], focus) },
          { type: "Snack", ...adjustForFocus(meals.snack[2], focus) },
        ],
      },
      {
        day: "Thursday",
        meals: [
          { type: "Breakfast", ...adjustForFocus(meals.breakfast[0], focus) },
          { type: "Lunch", ...adjustForFocus(meals.lunch[0], focus) },
          { type: "Dinner", ...adjustForFocus(meals.dinner[0], focus) },
          { type: "Snack", ...adjustForFocus(meals.snack[0], focus) },
        ],
      },
      {
        day: "Friday",
        meals: [
          { type: "Breakfast", ...adjustForFocus(meals.breakfast[1], focus) },
          { type: "Lunch", ...adjustForFocus(meals.lunch[1], focus) },
          { type: "Dinner", ...adjustForFocus(meals.dinner[1], focus) },
          { type: "Snack", ...adjustForFocus(meals.snack[1], focus) },
        ],
      },
      {
        day: "Saturday",
        meals: [
          { type: "Breakfast", ...adjustForFocus(meals.breakfast[2], focus) },
          { type: "Lunch", ...adjustForFocus(meals.lunch[2], focus) },
          { type: "Dinner", ...adjustForFocus(meals.dinner[2], focus) },
          { type: "Snack", ...adjustForFocus(meals.snack[2], focus) },
        ],
      },
      {
        day: "Sunday",
        meals: [
          { type: "Breakfast", ...adjustForFocus(meals.breakfast[0], focus) },
          { type: "Lunch", ...adjustForFocus(meals.lunch[0], focus) },
          { type: "Dinner", ...adjustForFocus(meals.dinner[0], focus) },
          { type: "Snack", ...adjustForFocus(meals.snack[0], focus) },
        ],
      },
    ]
  }

  const handleAddMeal = (meal: any) => {
    setSelectedMeal(meal)
    setMealQuantity("1")
    setMealUnit("serving")
    setIsMealModalOpen(true)
  }

  const handleConfirmMeal = () => {
    const multiplier = parseFloat(mealQuantity) || 1

    // Calculate adjusted nutrition
    const adjustedMeal = {
      ...selectedMeal,
      calories: Math.round(selectedMeal.calories * multiplier),
      protein: Math.round(selectedMeal.protein * multiplier * 10) / 10,
      carbs: Math.round(selectedMeal.carbs * multiplier * 10) / 10,
      fats: Math.round(selectedMeal.fats * multiplier * 10) / 10,
      quantity: mealQuantity,
      unit: mealUnit,
    }

    // In a real app, this would save to the user's daily meal log
    console.log("Adding meal to daily log:", adjustedMeal)
    alert(`${selectedMeal.name} has been added to your meal log!`)

    setIsMealModalOpen(false)
    setSelectedMeal(null)
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
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold" style={{ color: "#004030" }}>
                  Weekly Meal Plans
                </h1>
                <Crown className="h-5 w-5" style={{ color: "#FFC50F" }} />
              </div>
            </div>
            <div className="flex items-center gap-2">
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

      {/* Main Content */}
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {!generatedPlan ? (
          <div className="space-y-6">
            {/* AI Generator Card */}
            <Card style={{ backgroundColor: "#FFF9E5", borderColor: "#DCD0A8" }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2" style={{ color: "#004030" }}>
                  <Sparkles className="h-6 w-6" style={{ color: "#FFC50F" }} />
                  AI Meal Plan Generator
                  <Crown className="h-5 w-5" style={{ color: "#FFC50F" }} />
                </CardTitle>
                <CardDescription style={{ color: "#708993" }}>
                  Generate a personalized weekly meal plan using AI based on your preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Cost Level Selection */}
                <div className="space-y-2">
                  <Label style={{ color: "#004030", fontWeight: "600" }}>Budget Level</Label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { value: "low", label: "Low Cost", desc: "$20-30/week", color: "#63A361" },
                      { value: "medium", label: "Medium Cost", desc: "$40-60/week", color: "#FFC50F" },
                      { value: "high", label: "High Cost", desc: "$80+/week", color: "#5B532C" },
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setCostLevel(option.value)}
                        className={`rounded-lg border-2 p-4 text-left transition-all hover:shadow-md ${
                          costLevel === option.value ? "shadow-lg" : ""
                        }`}
                        style={{
                          borderColor: costLevel === option.value ? option.color : "#DCD0A8",
                          backgroundColor: costLevel === option.value ? "#E7F2EF" : "#FFFFFF",
                        }}
                      >
                        <div className="font-semibold" style={{ color: "#004030" }}>
                          {option.label}
                        </div>
                        <div className="text-sm" style={{ color: "#708993" }}>
                          {option.desc}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Focus Type Selection */}
                <div className="space-y-2">
                  <Label style={{ color: "#004030", fontWeight: "600" }}>Focus Type</Label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { value: "calories", label: "Calorie Control", desc: "Balanced macros", color: "#4A9782" },
                      { value: "protein", label: "High Protein", desc: "Muscle building", color: "#63A361" },
                      { value: "carbs", label: "High Carbs", desc: "Energy focused", color: "#FFC50F" },
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setFocusType(option.value)}
                        className={`rounded-lg border-2 p-4 text-left transition-all hover:shadow-md ${
                          focusType === option.value ? "shadow-lg" : ""
                        }`}
                        style={{
                          borderColor: focusType === option.value ? option.color : "#DCD0A8",
                          backgroundColor: focusType === option.value ? "#E7F2EF" : "#FFFFFF",
                        }}
                      >
                        <div className="font-semibold" style={{ color: "#004030" }}>
                          {option.label}
                        </div>
                        <div className="text-sm" style={{ color: "#708993" }}>
                          {option.desc}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Generate Button */}
                <Button
                  onClick={generateMealPlan}
                  disabled={isGenerating || !costLevel || !focusType}
                  className="w-full py-6 text-lg font-semibold transition-all hover:scale-95 hover:shadow-lg"
                  style={{
                    backgroundColor: "#4A9782",
                    color: "#FFF9E5",
                    opacity: isGenerating || !costLevel || !focusType ? 0.6 : 1,
                  }}
                >
                  {isGenerating ? (
                    <>
                      <div className="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Generating AI Plan...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-5 w-5" />
                      Generate My Weekly Plan
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Generated Plan Header */}
            <Card style={{ backgroundColor: "#FFF9E5", borderColor: "#DCD0A8" }}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between" style={{ color: "#004030" }}>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-6 w-6" />
                    Your AI-Generated Meal Plan
                    <Crown className="h-5 w-5" style={{ color: "#FFC50F" }} />
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => setGeneratedPlan(null)}
                    style={{
                      borderColor: "#4A9782",
                      color: "#004030",
                    }}
                  >
                    Generate New Plan
                  </Button>
                </CardTitle>
                <CardDescription style={{ color: "#708993" }}>
                  {costLevel.charAt(0).toUpperCase() + costLevel.slice(1)} budget •
                  {focusType === "calories" ? " Calorie-focused" :
                   focusType === "protein" ? " High-protein" :
                   " Carb-focused"} plan
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Weekly Meal Plan */}
            <div className="space-y-4">
              {generatedPlan.map((dayPlan: any, dayIndex: number) => (
                <Card key={dayIndex} style={{ backgroundColor: "#FFF9E5", borderColor: "#DCD0A8" }}>
                  <CardHeader>
                    <CardTitle style={{ color: "#004030" }}>{dayPlan.day}</CardTitle>
                    <CardDescription style={{ color: "#708993" }}>
                      Total: {dayPlan.meals.reduce((sum: number, meal: any) => sum + meal.calories, 0)} calories
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-2">
                      {dayPlan.meals.map((meal: any, mealIndex: number) => (
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
                            className="rounded-full transition-all hover:scale-110 hover:shadow-lg"
                            style={{
                              backgroundColor: "#4A9782",
                              color: "#FFF9E5",
                            }}
                            onClick={() => handleAddMeal(meal)}
                          >
                            <Plus className="h-5 w-5" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Meal Logging Modal */}
        <Dialog open={isMealModalOpen} onOpenChange={setIsMealModalOpen}>
          <DialogContent
            className="sm:max-w-md"
            style={{ backgroundColor: "#FFF9E5", borderColor: "#DCD0A8" }}
          >
            <DialogHeader>
              <DialogTitle style={{ color: "#004030" }}>Add to Meal Log</DialogTitle>
            </DialogHeader>
            {selectedMeal && (
              <div className="space-y-6">
                <div className="rounded-lg p-4" style={{ backgroundColor: "#E7F2EF" }}>
                  <h3 className="font-semibold" style={{ color: "#004030" }}>
                    {selectedMeal.name}
                  </h3>
                  <p className="text-sm" style={{ color: "#708993" }}>
                    Base: {selectedMeal.calories} cal • P: {selectedMeal.protein}g • C: {selectedMeal.carbs}g • F: {selectedMeal.fats}g
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="quantity" style={{ color: "#004030" }}>Quantity</Label>
                    <Input
                      id="quantity"
                      type="number"
                      step="0.1"
                      min="0.1"
                      value={mealQuantity}
                      onChange={(e) => setMealQuantity(e.target.value)}
                      style={{
                        borderColor: "#A1C2BD",
                        backgroundColor: "#FFFFFF",
                        color: "#004030",
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="unit" style={{ color: "#004030" }}>Unit</Label>
                    <Select value={mealUnit} onValueChange={setMealUnit}>
                      <SelectTrigger
                        id="unit"
                        style={{
                          borderColor: "#A1C2BD",
                          backgroundColor: "#FFFFFF",
                          color: mealUnit ? "#004030" : "#708993",
                        }}
                      >
                        <SelectValue placeholder="Unit" />
                      </SelectTrigger>
                      <SelectContent style={{ backgroundColor: "#FFF9E5", borderColor: "#A1C2BD" }}>
                        <SelectItem value="serving" style={{ color: "#19183B" }}>Serving</SelectItem>
                        <SelectItem value="cup" style={{ color: "#19183B" }}>Cup</SelectItem>
                        <SelectItem value="piece" style={{ color: "#19183B" }}>Piece</SelectItem>
                        <SelectItem value="bowl" style={{ color: "#19183B" }}>Bowl</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="rounded-lg p-4" style={{ backgroundColor: "#FFFFFF", borderColor: "#DCD0A8", borderWidth: 1, borderStyle: "solid" }}>
                  <h4 className="font-semibold mb-2" style={{ color: "#004030" }}>Adjusted Nutrition</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span style={{ color: "#708993" }}>Calories:</span>
                      <span className="ml-1 font-semibold" style={{ color: "#004030" }}>
                        {Math.round(selectedMeal.calories * (parseFloat(mealQuantity) || 1))} cal
                      </span>
                    </div>
                    <div>
                      <span style={{ color: "#708993" }}>Protein:</span>
                      <span className="ml-1 font-semibold" style={{ color: "#63A361" }}>
                        {Math.round(selectedMeal.protein * (parseFloat(mealQuantity) || 1) * 10) / 10}g
                      </span>
                    </div>
                    <div>
                      <span style={{ color: "#708993" }}>Carbs:</span>
                      <span className="ml-1 font-semibold" style={{ color: "#FFC50F" }}>
                        {Math.round(selectedMeal.carbs * (parseFloat(mealQuantity) || 1) * 10) / 10}g
                      </span>
                    </div>
                    <div>
                      <span style={{ color: "#708993" }}>Fats:</span>
                      <span className="ml-1 font-semibold" style={{ color: "#5B532C" }}>
                        {Math.round(selectedMeal.fats * (parseFloat(mealQuantity) || 1) * 10) / 10}g
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setIsMealModalOpen(false)}
                    className="flex-1"
                    style={{ borderColor: "#A1C2BD", color: "#004030" }}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleConfirmMeal}
                    className="flex-1 transition-all hover:scale-95 hover:shadow-lg"
                    style={{ backgroundColor: "#4A9782", color: "#FFF9E5" }}
                  >
                    Add to Meal Log
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </main>
    </div>
  )
}
