"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Menu,
  Home,
  Utensils,
  Cookie,
  Activity,
  History,
  Search,
  Scan,
  Plus,
  Camera,
  Crown,
  X,
  Minus,
} from "lucide-react"
import Image from "next/image"
import { useRouter, useSearchParams } from "next/navigation"
import FoodModal from "./food-modal"
import ProfileAvatarButton from "./profile-avatar-button"

type RecentMeal = {
  id?: number
  name: string
  calories: number
  protein: number
  carbs: number
  fats: number
  mealType?: string
  quantity?: number
  unit?: string
  date?: string
}

export default function MealFoodView() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()
  const searchParams = useSearchParams()
  const quickAddRef = useRef<HTMLDivElement>(null)
  const [isFoodModalOpen, setIsFoodModalOpen] = useState(false)
  const [selectedFood, setSelectedFood] = useState<{
    name: string
    calories: number
    protein: number
    carbs: number
    fats: number
  } | null>(null)

  const [isBarcodeModalOpen, setIsBarcodeModalOpen] = useState(false)
  const [barcodeImage, setBarcodeImage] = useState<string | null>(null)
  const barcodeFileInputRef = useRef<HTMLInputElement>(null)

  const [isAIPhotoModalOpen, setIsAIPhotoModalOpen] = useState(false)
  const [foodImage, setFoodImage] = useState<string | null>(null)
  const aiPhotoFileInputRef = useRef<HTMLInputElement>(null)

  const [recentFoods, setRecentFoods] = useState<RecentMeal[]>([])
  const [isLoadingRecents, setIsLoadingRecents] = useState(false)

  const [quickMealName, setQuickMealName] = useState("")
  const [quickCalories, setQuickCalories] = useState("")
  const [quickProtein, setQuickProtein] = useState("")
  const [quickCarbs, setQuickCarbs] = useState("")
  const [quickFats, setQuickFats] = useState("")
  const [quickMealType, setQuickMealType] = useState("breakfast")
  const [quickQuantity, setQuickQuantity] = useState("1")
  const [quickUnit, setQuickUnit] = useState("serving")

  const handleNavigation = (path: string) => {
    router.push(path)
    setIsMenuOpen(false)
  }

  useEffect(() => {
    const tab = searchParams.get("tab")
    if (tab === "custom") {
      quickAddRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
    }
    if (tab === "scan") {
      setIsBarcodeModalOpen(true)
    }
  }, [searchParams])

  useEffect(() => {
    const loadRecentMeals = async () => {
      const userStr = localStorage.getItem("calora_user")
      if (!userStr) return
      const user = JSON.parse(userStr)

      const endDate = new Date()
      const startDate = new Date()
      startDate.setDate(endDate.getDate() - 29)

      const from = startDate.toISOString().slice(0, 10)
      const to = endDate.toISOString().slice(0, 10)

      setIsLoadingRecents(true)
      try {
        const res = await fetch(`http://localhost:8080/meals/user/${user.id}/range?from=${from}&to=${to}`)
        if (!res.ok) {
          console.error("Failed to load recent meals", await res.text())
          return
        }
        const data = await res.json()

        const sorted = [...data].sort((a, b) => {
          const aTime = a?.date ? new Date(a.date).getTime() : 0
          const bTime = b?.date ? new Date(b.date).getTime() : 0
          return bTime - aTime
        })

        const mapped: RecentMeal[] = sorted.slice(0, 10).map((meal: any) => ({
          id: meal.id,
          name: meal.name ?? "Meal",
          calories: meal.calories ?? 0,
          protein: meal.protein ?? 0,
          carbs: meal.carbs ?? 0,
          fats: meal.fats ?? 0,
          mealType: meal.mealType,
          quantity: meal.quantity,
          unit: meal.unit,
          date: meal.date,
        }))

        setRecentFoods(mapped)
      } catch (err) {
        console.error("Failed to load recent meals", err)
      } finally {
        setIsLoadingRecents(false)
      }
    }

    loadRecentMeals()
  }, [])

  const handleFoodClick = (food: { name: string; calories: number; protein: number; carbs: number; fats: number }) => {
    setSelectedFood(food)
    setIsFoodModalOpen(true)
  }

  const handleBarcodeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setBarcodeImage(reader.result as string)
        // Backend will process the barcode image
        console.log("Barcode image uploaded, sending to backend...")
      }
      reader.readAsDataURL(file)
    }
  }

  const handleBarcodeCamera = () => {
    // Open camera for barcode scanning
    alert("Camera opened for barcode scanning (to be implemented with device camera API)")
  }

  const closeBarcodeModal = () => {
    setIsBarcodeModalOpen(false)
    setBarcodeImage(null)
  }

  const handleQuickAddMeal = async () => {
    if (!quickMealName || !quickCalories) {
      alert("Please enter meal name and calories")
      return
    }

    try {
      const userStr = localStorage.getItem("calora_user")
      if (!userStr) {
        alert("Please login to log meal")
        return
      }
      const user = JSON.parse(userStr)

      const mealData = {
        name: quickMealName,
        calories: Number.parseInt(quickCalories),
        protein: quickProtein ? Number.parseInt(quickProtein) : 0,
        carbs: quickCarbs ? Number.parseInt(quickCarbs) : 0,
        fats: quickFats ? Number.parseFloat(quickFats) : 0,
        mealType: quickMealType,
        quantity: Number.parseFloat(quickQuantity) || 1,
        unit: quickUnit,
        source: "quick-add",
        date: new Date().toISOString().slice(0, 19),
        user: { id: user.id },
      }

      const res = await fetch("http://localhost:8080/meals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mealData),
      })

      if (res.ok) {
        const saved = await res.json()
        setRecentFoods((prev) => [
          {
            id: saved.id,
            name: saved.name ?? quickMealName,
            calories: saved.calories ?? Number.parseInt(quickCalories),
            protein: saved.protein ?? (quickProtein ? Number.parseInt(quickProtein) : 0),
            carbs: saved.carbs ?? (quickCarbs ? Number.parseInt(quickCarbs) : 0),
            fats: saved.fats ?? (quickFats ? Number.parseFloat(quickFats) : 0),
            mealType: saved.mealType ?? quickMealType,
            quantity: saved.quantity ?? (Number.parseFloat(quickQuantity) || 1),
            unit: saved.unit ?? quickUnit,
            date: saved.date,
          },
          ...prev,
        ])

        alert("Meal added successfully")
        setQuickMealName("")
        setQuickCalories("")
        setQuickProtein("")
        setQuickCarbs("")
        setQuickFats("")
        setQuickMealType("breakfast")
        setQuickQuantity("1")
        setQuickUnit("serving")
      } else {
        console.error("Failed to add meal", await res.text())
        alert("Failed to add meal. Please try again.")
      }
    } catch (err) {
      console.error("Error logging meal", err)
      alert("Error logging meal")
    }
  }

  const handleDeleteRecentMeal = async (meal: RecentMeal, index: number) => {
    if (!meal.id) {
      setRecentFoods(recentFoods.filter((_, i) => i !== index))
      return
    }

    try {
      const userStr = localStorage.getItem("calora_user")
      const user = userStr ? JSON.parse(userStr) : null
      const userId = user?.id

      const url = userId
        ? `http://localhost:8080/meals/${meal.id}?userId=${userId}`
        : `http://localhost:8080/meals/${meal.id}`

      const res = await fetch(url, { method: "DELETE" })
      if (res.ok) {
        setRecentFoods(recentFoods.filter((_, i) => i !== index))
      } else {
        console.error("Failed to delete meal", await res.text())
        alert("Failed to delete meal. Please try again.")
      }
    } catch (err) {
      console.error("Error deleting meal", err)
      alert("Error deleting meal")
    }
  }

  const handleAIPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setFoodImage(reader.result as string)
        // Backend will process the food image with AI
        console.log("Food image uploaded, sending to AI backend...")
      }
      reader.readAsDataURL(file)
    }
  }

  const handleAIPhotoCamera = () => {
    // Open camera for food photo
    alert("Camera opened for food photo (to be implemented with device camera API)")
  }

  const closeAIPhotoModal = () => {
    setIsAIPhotoModalOpen(false)
    setFoodImage(null)
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
                Meal & Food
              </h1>
            </div>
            <ProfileAvatarButton onClick={() => router.push("/profile")} />
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
        <div className="space-y-6">
          {/* Search Section */}
          <Card style={{ backgroundColor: "#FFF9E5", borderColor: "#DCD0A8" }}>
            <CardHeader>
              <CardTitle style={{ color: "#004030" }}>Search Foods</CardTitle>
              <CardDescription style={{ color: "#708993" }}>Find verified foods from our database</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2" style={{ color: "#708993" }} />
                  <Input
                    type="text"
                    placeholder="Search for foods..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                    style={{
                      borderColor: "#A1C2BD",
                      backgroundColor: "#FFFFFF",
                      color: "#004030",
                    }}
                  />
                </div>
                <Button
                  className="transition-all hover:shadow-md"
                  style={{
                    backgroundColor: "#4A9782",
                    color: "#FFF9E5",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#3d7f6d"
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#4A9782"
                  }}
                >
                  Search
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Quick Add Meal */}
          <div ref={quickAddRef}>
            <Card style={{ backgroundColor: "#FFF9E5", borderColor: "#DCD0A8" }}>
              <CardHeader>
                <CardTitle style={{ color: "#004030" }}>Quick Add Meal</CardTitle>
                <CardDescription style={{ color: "#708993" }}>
                  Log a meal with calories and macros
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="quickMealName" className="mb-2 block text-sm font-medium" style={{ color: "#004030" }}>
                      Meal Name *
                    </Label>
                    <Input
                      id="quickMealName"
                      value={quickMealName}
                      onChange={(e) => setQuickMealName(e.target.value)}
                      placeholder="e.g., Turkey Sandwich"
                      style={{ borderColor: "#A1C2BD", backgroundColor: "#FFFFFF", color: "#004030" }}
                    />
                  </div>
                  <div>
                    <Label htmlFor="quickMealType" className="mb-2 block text-sm font-medium" style={{ color: "#004030" }}>
                      Meal Type
                    </Label>
                    <select
                      id="quickMealType"
                      value={quickMealType}
                      onChange={(e) => setQuickMealType(e.target.value)}
                      className="h-10 w-full rounded-lg border px-3 py-2 text-sm outline-none"
                      style={{ borderColor: "#A1C2BD", backgroundColor: "#FFFFFF", color: "#004030" }}
                    >
                      <option value="breakfast">Breakfast</option>
                      <option value="lunch">Lunch</option>
                      <option value="dinner">Dinner</option>
                      <option value="snack">Snack</option>
                    </select>
                  </div>
                </div>

                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="quickCalories" className="mb-2 block text-sm font-medium" style={{ color: "#004030" }}>
                      Calories *
                    </Label>
                    <Input
                      id="quickCalories"
                      type="number"
                      value={quickCalories}
                      onChange={(e) => setQuickCalories(e.target.value)}
                      placeholder="450"
                      style={{ borderColor: "#A1C2BD", backgroundColor: "#FFFFFF", color: "#004030" }}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor="quickQuantity" className="mb-2 block text-sm font-medium" style={{ color: "#004030" }}>
                        Quantity
                      </Label>
                      <Input
                        id="quickQuantity"
                        type="number"
                        step="0.1"
                        min="0.1"
                        value={quickQuantity}
                        onChange={(e) => setQuickQuantity(e.target.value)}
                        style={{ borderColor: "#A1C2BD", backgroundColor: "#FFFFFF", color: "#004030" }}
                      />
                    </div>
                    <div>
                      <Label htmlFor="quickUnit" className="mb-2 block text-sm font-medium" style={{ color: "#004030" }}>
                        Unit
                      </Label>
                      <select
                        id="quickUnit"
                        value={quickUnit}
                        onChange={(e) => setQuickUnit(e.target.value)}
                        className="h-10 w-full rounded-lg border px-3 py-2 text-sm outline-none"
                        style={{ borderColor: "#A1C2BD", backgroundColor: "#FFFFFF", color: "#004030" }}
                      >
                        <option value="serving">serving</option>
                        <option value="gram">gram (g)</option>
                        <option value="ounce">ounce (oz)</option>
                        <option value="cup">cup</option>
                        <option value="piece">piece</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="mt-4 grid gap-4 md:grid-cols-3">
                  <div>
                    <Label htmlFor="quickProtein" className="mb-2 block text-sm font-medium" style={{ color: "#004030" }}>
                      Protein (g)
                    </Label>
                    <Input
                      id="quickProtein"
                      type="number"
                      value={quickProtein}
                      onChange={(e) => setQuickProtein(e.target.value)}
                      placeholder="30"
                      style={{ borderColor: "#A1C2BD", backgroundColor: "#FFFFFF", color: "#004030" }}
                    />
                  </div>
                  <div>
                    <Label htmlFor="quickCarbs" className="mb-2 block text-sm font-medium" style={{ color: "#004030" }}>
                      Carbs (g)
                    </Label>
                    <Input
                      id="quickCarbs"
                      type="number"
                      value={quickCarbs}
                      onChange={(e) => setQuickCarbs(e.target.value)}
                      placeholder="45"
                      style={{ borderColor: "#A1C2BD", backgroundColor: "#FFFFFF", color: "#004030" }}
                    />
                  </div>
                  <div>
                    <Label htmlFor="quickFats" className="mb-2 block text-sm font-medium" style={{ color: "#004030" }}>
                      Fats (g)
                    </Label>
                    <Input
                      id="quickFats"
                      type="number"
                      step="0.1"
                      value={quickFats}
                      onChange={(e) => setQuickFats(e.target.value)}
                      placeholder="12"
                      style={{ borderColor: "#A1C2BD", backgroundColor: "#FFFFFF", color: "#004030" }}
                    />
                  </div>
                </div>

                <Button
                  onClick={handleQuickAddMeal}
                  className="mt-4 w-full transition-all hover:shadow-md"
                  style={{ backgroundColor: "#4A9782", color: "#FFF9E5" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#3d7f6d"
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#4A9782"
                  }}
                >
                  Add Meal
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Input Methods */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card
              className="cursor-pointer transition-all hover:shadow-lg"
              style={{ backgroundColor: "#FFF9E5", borderColor: "#DCD0A8" }}
              onClick={() => setIsBarcodeModalOpen(true)}
            >
              <CardContent className="flex flex-col items-center justify-center gap-4 p-6">
                <div
                  className="flex h-20 w-20 items-center justify-center rounded-full"
                  style={{ backgroundColor: "#E7F2EF" }}
                >
                  <Scan className="h-10 w-10" style={{ color: "#4A9782" }} />
                </div>
                <div className="text-center">
                  <h3 className="font-semibold" style={{ color: "#004030" }}>
                    Scan Barcode
                  </h3>
                  <p className="mt-1 text-sm" style={{ color: "#708993" }}>
                    Quick scan for packaged foods
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card
              className="cursor-pointer transition-all hover:shadow-lg md:col-span-2"
              style={{ backgroundColor: "#FFF9E5", borderColor: "#DCD0A8" }}
              onClick={() => setIsAIPhotoModalOpen(true)}
            >
              <CardContent className="flex flex-col items-center justify-center gap-4 p-6">
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-20 w-20 items-center justify-center rounded-full"
                    style={{ backgroundColor: "#E7F2EF" }}
                  >
                    <Camera className="h-10 w-10" style={{ color: "#4A9782" }} />
                  </div>
                  <div
                    className="flex items-center gap-2 rounded-full px-3 py-1"
                    style={{ backgroundColor: "#FFC50F" }}
                  >
                    <Crown className="h-4 w-4" style={{ color: "#004030" }} />
                    <span className="text-xs font-bold" style={{ color: "#004030" }}>
                      PREMIUM
                    </span>
                  </div>
                </div>
                <div className="text-center">
                  <h3 className="font-semibold" style={{ color: "#004030" }}>
                    AI Photo Recognition
                  </h3>
                  <p className="mt-1 text-sm" style={{ color: "#708993" }}>
                    Take a photo and let AI identify your food
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>


          {/* Recent Foods */}
          <Card style={{ backgroundColor: "#FFF9E5", borderColor: "#DCD0A8" }}>
            <CardHeader>
              <CardTitle style={{ color: "#004030" }}>Recent Foods</CardTitle>
              <CardDescription style={{ color: "#708993" }}>Quickly add foods you've logged before</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {isLoadingRecents ? (
                  <p className="text-sm" style={{ color: "#708993" }}>
                    Loading recent meals...
                  </p>
                ) : recentFoods.length > 0 ? (
                  recentFoods.map((food, index) => (
                    <div
                      key={food.id ?? index}
                      className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-opacity-50"
                      style={{ borderColor: "#A1C2BD", backgroundColor: "#FFFFFF" }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "#E7F2EF"
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "#FFFFFF"
                      }}
                    >
                      <div>
                        <h4 className="font-medium" style={{ color: "#004030" }}>
                          {food.name}
                        </h4>
                        <p className="text-sm" style={{ color: "#708993" }}>
                          {food.calories} cal ??? P: {food.protein}g ??? C: {food.carbs}g ??? F: {food.fats}g
                          {food.quantity ? ` ??? ${food.quantity} ${food.unit ?? ""}` : ""}
                          {food.mealType ? ` ??? ${food.mealType}` : ""}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleFoodClick(food)}
                          className="transition-all"
                          style={{
                            backgroundColor: "#4A9782",
                            color: "#FFF9E5",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = "#3d7f6d"
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = "#4A9782"
                          }}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="transition-all bg-transparent"
                          style={{
                            borderColor: "#DCD0A8",
                            color: "#004030",
                          }}
                          onClick={() => handleDeleteRecentMeal(food, index)}
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
                    No recent meals yet. Add your first meal above.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {isBarcodeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50" onClick={closeBarcodeModal} />
          <div className="relative w-full max-w-md rounded-lg p-6 shadow-xl" style={{ backgroundColor: "#FFF9E5" }}>
            <button
              onClick={closeBarcodeModal}
              className="absolute right-4 top-4 rounded-full p-1 transition-colors"
              style={{ color: "#004030" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#E7F2EF"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent"
              }}
            >
              <X className="h-5 w-5" />
            </button>

            <h2 className="mb-6 text-2xl font-bold" style={{ color: "#004030" }}>
              Scan Barcode
            </h2>

            <div className="space-y-4">
              <input
                ref={barcodeFileInputRef}
                type="file"
                accept="image/*"
                onChange={handleBarcodeUpload}
                className="hidden"
              />

              <Button
                onClick={() => barcodeFileInputRef.current?.click()}
                className="w-full transition-all hover:shadow-md"
                style={{ backgroundColor: "#4A9782", color: "#FFF9E5" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#3d7f6d"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#4A9782"
                }}
              >
                Upload Barcode Image
              </Button>

              <Button
                onClick={handleBarcodeCamera}
                className="w-full transition-all hover:shadow-md"
                style={{ backgroundColor: "#004030", color: "#FFF9E5" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#002820"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#004030"
                }}
              >
                <Camera className="mr-2 h-5 w-5" />
                Open Camera
              </Button>

              {barcodeImage && (
                <div className="mt-4">
                  <p className="mb-2 text-sm font-medium" style={{ color: "#004030" }}>
                    Barcode Preview:
                  </p>
                  <img
                    src={barcodeImage || "/placeholder.svg"}
                    alt="Barcode"
                    className="w-full rounded-lg border"
                    style={{ borderColor: "#DCD0A8" }}
                  />
                  <p className="mt-2 text-sm" style={{ color: "#708993" }}>
                    Processing barcode...
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {isAIPhotoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50" onClick={closeAIPhotoModal} />
          <div className="relative w-full max-w-md rounded-lg p-6 shadow-xl" style={{ backgroundColor: "#FFF9E5" }}>
            <button
              onClick={closeAIPhotoModal}
              className="absolute right-4 top-4 rounded-full p-1 transition-colors"
              style={{ color: "#004030" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#E7F2EF"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent"
              }}
            >
              <X className="h-5 w-5" />
            </button>

            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold" style={{ color: "#004030" }}>
                AI Photo Recognition
              </h2>
              <div className="flex items-center gap-2 rounded-full px-3 py-1" style={{ backgroundColor: "#FFC50F" }}>
                <Crown className="h-4 w-4" style={{ color: "#004030" }} />
                <span className="text-xs font-bold" style={{ color: "#004030" }}>
                  PREMIUM
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <input
                ref={aiPhotoFileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAIPhotoUpload}
                className="hidden"
              />

              <Button
                onClick={() => aiPhotoFileInputRef.current?.click()}
                className="w-full transition-all hover:shadow-md"
                style={{ backgroundColor: "#4A9782", color: "#FFF9E5" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#3d7f6d"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#4A9782"
                }}
              >
                Upload Food Image
              </Button>

              <Button
                onClick={handleAIPhotoCamera}
                className="w-full transition-all hover:shadow-md"
                style={{ backgroundColor: "#004030", color: "#FFF9E5" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#002820"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#004030"
                }}
              >
                <Camera className="mr-2 h-5 w-5" />
                Take Photo
              </Button>

              {foodImage && (
                <div className="mt-4">
                  <p className="mb-2 text-sm font-medium" style={{ color: "#004030" }}>
                    Food Image Preview:
                  </p>
                  <img
                    src={foodImage || "/placeholder.svg"}
                    alt="Food"
                    className="w-full rounded-lg border"
                    style={{ borderColor: "#DCD0A8" }}
                  />
                  <p className="mt-2 text-sm" style={{ color: "#708993" }}>
                    AI is analyzing your food...
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <FoodModal
  isOpen={isFoodModalOpen}
  onClose={() => setIsFoodModalOpen(false)}
  foodName={selectedFood?.name ?? ""}
  calories={selectedFood?.calories ?? 0}
  protein={selectedFood?.protein ?? 0}
  carbs={selectedFood?.carbs ?? 0}
  fats={selectedFood?.fats ?? 0}
  servingSize={"100g"}
/>


    </div>
  )
}
