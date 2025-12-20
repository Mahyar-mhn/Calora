"use client"

import type React from "react"

import { useState, useRef } from "react"
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
  Search,
  Scan,
  Plus,
  Camera,
  Crown,
  X,
  Minus,
} from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import FoodModal from "./food-modal"

export default function MealFoodView() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()
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

  const [isRecipeModalOpen, setIsRecipeModalOpen] = useState(false)
  const [recipeName, setRecipeName] = useState("")
  const [ingredients, setIngredients] = useState<{ name: string; quantity: string; unit: string }[]>([])
  const [isAddIngredientOpen, setIsAddIngredientOpen] = useState(false)
  const [newIngredient, setNewIngredient] = useState({ name: "", quantity: "", unit: "g" })
  const [totalCalories, setTotalCalories] = useState(0)
  const [recipeCategory, setRecipeCategory] = useState("🏆 High Protein Density")
  const [recipeMealType, setRecipeMealType] = useState("🍛 Main Dishes")
  const [showNutrition, setShowNutrition] = useState(false)

  const [isAIPhotoModalOpen, setIsAIPhotoModalOpen] = useState(false)
  const [foodImage, setFoodImage] = useState<string | null>(null)
  const aiPhotoFileInputRef = useRef<HTMLInputElement>(null)

  const [selectedRecipe, setSelectedRecipe] = useState<any>(null)
  const [recipeQuantity, setRecipeQuantity] = useState("1")
  const [recipeUnit, setRecipeUnit] = useState("serving")
  const [recentFoods, setRecentFoods] = useState([
    { name: "Grilled Chicken Breast", calories: 165, protein: 31, carbs: 0, fats: 3.6 },
    { name: "Brown Rice (1 cup)", calories: 216, protein: 5, carbs: 45, fats: 1.8 },
    { name: "Greek Yogurt", calories: 100, protein: 17, carbs: 6, fats: 0.7 },
  ])

  const handleNavigation = (path: string) => {
    router.push(path)
    setIsMenuOpen(false)
  }

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

  const handleAddIngredient = () => {
    if (newIngredient.name && newIngredient.quantity) {
      setIngredients([...ingredients, newIngredient])
      setNewIngredient({ name: "", quantity: "", unit: "g" })
      setIsAddIngredientOpen(false)
    }
  }

  const handleRemoveIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index))
  }

  const handleCalculateCalories = () => {
    // Backend will calculate total calories based on ingredients
    const mockCalories = ingredients.length * 150 // Mock calculation
    setTotalCalories(mockCalories)
    setShowNutrition(true)
    console.log("Calculating calories from backend for ingredients:", ingredients)
  }

  const handleAddRecipeToFoods = () => {
    console.log("Adding custom recipe to recent foods:", {
      name: recipeName,
      category: recipeCategory,
      mealType: recipeMealType,
      ingredients,
      calories: totalCalories,
    })
    alert(`${recipeName} has been added to your Recent Foods!`)
    closeRecipeModal()
  }

  const closeRecipeModal = () => {
    setIsRecipeModalOpen(false)
    setRecipeName("")
    setIngredients([])
    setTotalCalories(0)
    setIsAddIngredientOpen(false)
    setShowNutrition(false)
    setRecipeCategory("🏆 High Protein Density")
    setRecipeMealType("🍛 Main Dishes")
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
            <Button
              variant="outline"
              size="icon"
              className="rounded-full bg-transparent"
              style={{
                borderColor: "#4A9782",
                color: "#004030",
              }}
              onClick={() => router.push("/profile")}
            >
              <User className="h-5 w-5" />
            </Button>
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
              className="cursor-pointer transition-all hover:shadow-lg"
              style={{ backgroundColor: "#FFF9E5", borderColor: "#DCD0A8" }}
              onClick={() => setIsRecipeModalOpen(true)}
            >
              <CardContent className="flex flex-col items-center justify-center gap-4 p-6">
                <div
                  className="flex h-20 w-20 items-center justify-center rounded-full"
                  style={{ backgroundColor: "#E7F2EF" }}
                >
                  <Plus className="h-10 w-10" style={{ color: "#4A9782" }} />
                </div>
                <div className="text-center">
                  <h3 className="font-semibold" style={{ color: "#004030" }}>
                    Custom Recipe
                  </h3>
                  <p className="mt-1 text-sm" style={{ color: "#708993" }}>
                    Create your own recipe
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
                {recentFoods.map((food, index) => (
                  <div
                    key={index}
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
                        {food.calories} cal • P: {food.protein}g • C: {food.carbs}g • F: {food.fats}g
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
                        onClick={() => {
                          setRecentFoods(recentFoods.filter((_, i) => i !== index))
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

      {/* Custom Recipe Modal */}
      {isRecipeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50" onClick={closeRecipeModal} />
          <div
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-lg p-6 shadow-xl"
            style={{ backgroundColor: "#FFF9E5" }}
          >
            <button
              onClick={closeRecipeModal}
              className="absolute right-4 top-4 rounded-full p-1 transition-colors hover:bg-opacity-50"
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
              Create Custom Recipe
            </h2>

            <div className="space-y-6">
              <div>
                <Label htmlFor="recipeName" className="mb-2 block text-sm font-medium" style={{ color: "#004030" }}>
                  Recipe Name
                </Label>
                <Input
                  id="recipeName"
                  value={recipeName}
                  onChange={(e) => setRecipeName(e.target.value)}
                  placeholder="Enter recipe name"
                  style={{ borderColor: "#A1C2BD", backgroundColor: "#FFFFFF", color: "#004030" }}
                />
              </div>

              <div>
                <Label className="mb-2 block text-sm font-medium" style={{ color: "#004030" }}>
                  Category (Auto-suggested)
                </Label>
                <select
                  value={recipeCategory}
                  onChange={(e) => setRecipeCategory(e.target.value)}
                  className="h-10 w-full rounded-lg border px-3 py-2 text-sm outline-none"
                  style={{ borderColor: "#A1C2BD", backgroundColor: "#FFFFFF", color: "#004030" }}
                >
                  <option value="🍗 Lean Animal Proteins">🍗 Lean Animal Proteins</option>
                  <option value="🥩 Fatty Animal Proteins">🥩 Fatty Animal Proteins</option>
                  <option value="🌱 Plant Proteins">🌱 Plant Proteins</option>
                  <option value="🍚 Complex Carbohydrates">🍚 Complex Carbohydrates</option>
                  <option value="🍞 Refined Carbohydrates">🍞 Refined Carbohydrates</option>
                  <option value="🥑 Healthy Fats">🥑 Healthy Fats</option>
                  <option value="🍟 High-Fat / Processed">🍟 High-Fat / Processed</option>
                  <option value="🔥 Low-Calorie Foods">🔥 Low-Calorie Foods</option>
                  <option value="⚖️ Moderate-Calorie Foods">⚖️ Moderate-Calorie Foods</option>
                  <option value="💣 High-Calorie Foods">💣 High-Calorie Foods</option>
                  <option value="🏆 High Protein Density">🏆 High Protein Density</option>
                  <option value="⚠️ Low Protein Density">⚠️ Low Protein Density</option>
                </select>
              </div>

              <div>
                <Label className="mb-2 block text-sm font-medium" style={{ color: "#004030" }}>
                  Meal Type
                </Label>
                <select
                  value={recipeMealType}
                  onChange={(e) => setRecipeMealType(e.target.value)}
                  className="h-10 w-full rounded-lg border px-3 py-2 text-sm outline-none"
                  style={{ borderColor: "#A1C2BD", backgroundColor: "#FFFFFF", color: "#004030" }}
                >
                  <option value="🍳 Breakfast Foods">🍳 Breakfast Foods</option>
                  <option value="🍛 Main Dishes">🍛 Main Dishes</option>
                  <option value="🥗 Side Dishes">🥗 Side Dishes</option>
                  <option value="🍰 Desserts">🍰 Desserts</option>
                  <option value="🥤 Snacks & Drinks">🥤 Snacks & Drinks</option>
                </select>
              </div>

              <div>
                <div className="mb-3 flex items-center justify-between">
                  <Label className="text-sm font-medium" style={{ color: "#004030" }}>
                    Ingredients
                  </Label>
                  <Button
                    size="sm"
                    onClick={() => setIsAddIngredientOpen(true)}
                    className="transition-all hover:shadow-md"
                    style={{ backgroundColor: "#4A9782", color: "#FFF9E5" }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#3d7f6d"
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "#4A9782"
                    }}
                  >
                    <Plus className="mr-1 h-4 w-4" />
                    Add Ingredient
                  </Button>
                </div>

                {ingredients.length > 0 && (
                  <div className="space-y-2">
                    {ingredients.map((ingredient, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between rounded-lg border p-3"
                        style={{ borderColor: "#A1C2BD", backgroundColor: "#FFFFFF" }}
                      >
                        <span style={{ color: "#004030" }}>
                          {ingredient.name} - {ingredient.quantity} {ingredient.unit}
                        </span>
                        <button
                          onClick={() => handleRemoveIngredient(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {ingredients.length > 0 && !showNutrition && (
                <Button
                  onClick={handleCalculateCalories}
                  className="w-full transition-all hover:shadow-md"
                  style={{ backgroundColor: "#004030", color: "#FFF9E5" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#002820"
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#004030"
                  }}
                >
                  Calculate Nutrition
                </Button>
              )}

              {showNutrition && totalCalories > 0 && (
                <div className="space-y-4">
                  <div className="rounded-lg border p-4" style={{ backgroundColor: "#E7F2EF", borderColor: "#A1C2BD" }}>
                    <h4 className="mb-2 text-lg font-semibold" style={{ color: "#004030" }}>
                      Total Calories
                    </h4>
                    <p className="text-3xl font-bold" style={{ color: "#4A9782" }}>
                      {totalCalories} kcal
                    </p>
                  </div>

                  <Button
                    onClick={handleAddRecipeToFoods}
                    className="w-full transition-all hover:shadow-md"
                    style={{ backgroundColor: "#4A9782", color: "#FFF9E5" }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#3d7f6d"
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "#4A9782"
                    }}
                  >
                    Add Recipe to Food Library
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {isAddIngredientOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50" onClick={() => setIsAddIngredientOpen(false)} />
          <div className="relative w-full max-w-md rounded-lg p-6 shadow-xl" style={{ backgroundColor: "#FFF9E5" }}>
            <h3 className="mb-4 text-xl font-bold" style={{ color: "#004030" }}>
              Add Ingredient
            </h3>

            <div className="space-y-4">
              <div>
                <Label htmlFor="ingredientName" className="mb-2 block text-sm font-medium" style={{ color: "#004030" }}>
                  Ingredient Name
                </Label>
                <Input
                  id="ingredientName"
                  value={newIngredient.name}
                  onChange={(e) => setNewIngredient({ ...newIngredient, name: e.target.value })}
                  placeholder="e.g., Chicken breast"
                  style={{ borderColor: "#A1C2BD", backgroundColor: "#FFFFFF", color: "#004030" }}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="quantity" className="mb-2 block text-sm font-medium" style={{ color: "#004030" }}>
                    Quantity
                  </Label>
                  <Input
                    id="quantity"
                    type="number"
                    value={newIngredient.quantity}
                    onChange={(e) => setNewIngredient({ ...newIngredient, quantity: e.target.value })}
                    placeholder="100"
                    style={{ borderColor: "#A1C2BD", backgroundColor: "#FFFFFF", color: "#004030" }}
                  />
                </div>

                <div>
                  <Label htmlFor="unit" className="mb-2 block text-sm font-medium" style={{ color: "#004030" }}>
                    Unit
                  </Label>
                  <select
                    id="unit"
                    value={newIngredient.unit}
                    onChange={(e) => setNewIngredient({ ...newIngredient, unit: e.target.value })}
                    className="h-10 w-full rounded-lg border px-3 py-2 text-sm outline-none"
                    style={{ borderColor: "#A1C2BD", backgroundColor: "#FFFFFF", color: "#004030" }}
                  >
                    <option value="g">gram (g)</option>
                    <option value="kg">kilogram (kg)</option>
                    <option value="oz">ounce (oz)</option>
                    <option value="lb">pound (lb)</option>
                    <option value="cup">cup</option>
                    <option value="tbsp">tablespoon</option>
                    <option value="tsp">teaspoon</option>
                    <option value="piece">piece</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => setIsAddIngredientOpen(false)}
                  variant="outline"
                  className="flex-1 transition-colors"
                  style={{ borderColor: "#A1C2BD", color: "#004030" }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAddIngredient}
                  className="flex-1 transition-all hover:shadow-md"
                  style={{ backgroundColor: "#4A9782", color: "#FFF9E5" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#3d7f6d"
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#4A9782"
                  }}
                >
                  Add
                </Button>
              </div>
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

      <FoodModal isOpen={isFoodModalOpen} onClose={() => setIsFoodModalOpen(false)} food={selectedFood} />
    </div>
  )
}
