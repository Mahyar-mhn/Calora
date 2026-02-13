"use client"
import { API_BASE } from "@/lib/api"
import { useMenuInteractions } from "@/hooks/use-menu-interactions"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Menu, Plus, Search, Home, Utensils, Cookie, Activity, History, Calendar, Star } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import FoodModal from "@/components/food-modal"
import ProfileAvatarButton from "@/components/profile-avatar-button"

type FoodItem = {
  name: string
  calories: number
  protein: number
  carbs: number
  fats: number
  category: string
  servingSize?: string
}

const defaultFamousRecipes: FoodItem[] = [
  {
    name: "Grilled Chicken Breast",
    calories: 165,
    protein: 31,
    category: "🍗 High-Protein / Fitness Friendly",
    carbs: 0,
    fats: 3.6,
  },
  {
    name: "Turkey Breast (roasted)",
    calories: 135,
    protein: 30,
    category: "🍗 High-Protein / Fitness Friendly",
    carbs: 0,
    fats: 1,
  },
  {
    name: "Tuna (canned in water)",
    calories: 116,
    protein: 26,
    category: "🍗 High-Protein / Fitness Friendly",
    carbs: 0,
    fats: 0.8,
  },
  {
    name: "Salmon (grilled)",
    calories: 208,
    protein: 20,
    category: "🍗 High-Protein / Fitness Friendly",
    carbs: 0,
    fats: 13,
  },
  {
    name: "Egg Whites",
    calories: 52,
    protein: 11,
    category: "🍗 High-Protein / Fitness Friendly",
    carbs: 0.7,
    fats: 0.2,
  },
  {
    name: "Greek Yogurt (0% fat)",
    calories: 59,
    protein: 10,
    category: "🍗 High-Protein / Fitness Friendly",
    carbs: 3.6,
    fats: 0.4,
  },
  {
    name: "Cottage Cheese (low-fat)",
    calories: 98,
    protein: 11,
    category: "🍗 High-Protein / Fitness Friendly",
    carbs: 3.4,
    fats: 2.3,
  },
  { name: "Spaghetti Bolognese", calories: 158, protein: 8, category: "🍝 Popular Global Meals", carbs: 20, fats: 5 },
  { name: "Margherita Pizza", calories: 266, protein: 11, category: "🍝 Popular Global Meals", carbs: 33, fats: 10 },
  {
    name: "Beef Burger (plain patty)",
    calories: 250,
    protein: 26,
    category: "🍝 Popular Global Meals",
    carbs: 0,
    fats: 17,
  },
  { name: "Chicken Shawarma", calories: 194, protein: 23, category: "🍝 Popular Global Meals", carbs: 5, fats: 9 },
  {
    name: "Chicken Tikka Masala",
    calories: 168,
    protein: 14,
    category: "🍝 Popular Global Meals",
    carbs: 8,
    fats: 9,
  },
  { name: "Sushi (salmon roll)", calories: 130, protein: 6, category: "🍝 Popular Global Meals", carbs: 18, fats: 4 },
  {
    name: "White Rice (cooked)",
    calories: 130,
    protein: 2.7,
    category: "🍚 Everyday & Comfort Foods",
    carbs: 28,
    fats: 0.3,
  },
  {
    name: "Brown Rice (cooked)",
    calories: 123,
    protein: 2.6,
    category: "🍚 Everyday & Comfort Foods",
    carbs: 26,
    fats: 1,
  },
  { name: "French Fries", calories: 312, protein: 3.4, category: "🍚 Everyday & Comfort Foods", carbs: 41, fats: 15 },
  { name: "Mashed Potatoes", calories: 88, protein: 2, category: "🍚 Everyday & Comfort Foods", carbs: 18, fats: 1 },
  {
    name: "Omelette (plain)",
    calories: 154,
    protein: 11,
    category: "🍚 Everyday & Comfort Foods",
    carbs: 1,
    fats: 12,
  },
  {
    name: "Caesar Salad (no croutons)",
    calories: 120,
    protein: 6,
    category: "🥗 Healthy / Diet-Friendly",
    carbs: 8,
    fats: 7,
  },
  {
    name: "Lentils (cooked)",
    calories: 116,
    protein: 9,
    category: "🥗 Healthy / Diet-Friendly",
    carbs: 20,
    fats: 0.4,
  },
  {
    name: "Chickpeas (cooked)",
    calories: 164,
    protein: 9,
    category: "🥗 Healthy / Diet-Friendly",
    carbs: 27,
    fats: 2.6,
  },
  { name: "Avocado", calories: 160, protein: 2, category: "🥗 Healthy / Diet-Friendly", carbs: 9, fats: 15 },
  {
    name: "Mixed Vegetables (steamed)",
    calories: 35,
    protein: 2,
    category: "🥗 Healthy / Diet-Friendly",
    carbs: 7,
    fats: 0.2,
  },
  { name: "Dark Chocolate (70%)", calories: 598, protein: 7.8, category: "🍰 Snacks & Treats", carbs: 46, fats: 43 },
  { name: "Milk Chocolate", calories: 535, protein: 7.6, category: "🍰 Snacks & Treats", carbs: 59, fats: 30 },
  { name: "Ice Cream (vanilla)", calories: 207, protein: 3.5, category: "🍰 Snacks & Treats", carbs: 24, fats: 11 },
  { name: "Croissant", calories: 406, protein: 8, category: "🍰 Snacks & Treats", carbs: 46, fats: 21 },
]

const defaultSampleFoods: FoodItem[] = [
  {
    name: "Grilled Chicken Breast",
    calories: 165,
    protein: 31,
    carbs: 0,
    fats: 3.6,
    servingSize: "100g",
    category: "🍗 Lean Animal Proteins",
  },
  {
    name: "Brown Rice",
    calories: 112,
    protein: 2.6,
    carbs: 24,
    fats: 0.9,
    servingSize: "100g",
    category: "🍚 Complex Carbohydrates",
  },
  {
    name: "Steamed Broccoli",
    calories: 35,
    protein: 2.4,
    carbs: 7,
    fats: 0.4,
    servingSize: "100g",
    category: "🔥 Low-Calorie Foods",
  },
  {
    name: "Salmon Fillet",
    calories: 208,
    protein: 20,
    carbs: 0,
    fats: 13,
    servingSize: "100g",
    category: "🥩 Fatty Animal Proteins",
  },
  {
    name: "Greek Yogurt",
    calories: 59,
    protein: 10,
    carbs: 3.6,
    fats: 0.4,
    servingSize: "100g",
    category: "🏆 High Protein Density",
  },
  {
    name: "Banana",
    calories: 89,
    protein: 1.1,
    carbs: 23,
    fats: 0.3,
    servingSize: "1 medium",
    category: "🍞 Refined Carbohydrates",
  },
  {
    name: "Almonds",
    calories: 579,
    protein: 21,
    carbs: 22,
    fats: 50,
    servingSize: "100g",
    category: "🥑 Healthy Fats",
  },
  {
    name: "Sweet Potato",
    calories: 86,
    protein: 1.6,
    carbs: 20,
    fats: 0.1,
    servingSize: "100g",
    category: "🍚 Complex Carbohydrates",
  },
]

export default function FoodModalPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { menuButtonRef, menuPanelRef } = useMenuInteractions(isMenuOpen, setIsMenuOpen)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("All")
  const [isFamousRecipesOpen, setIsFamousRecipesOpen] = useState(false)
  const [selectedFamousFood, setSelectedFamousFood] = useState<FoodItem | null>(null)
  const [famousQuantity, setFamousQuantity] = useState("1")
  const [famousUnit, setFamousUnit] = useState("serving")
  const router = useRouter()

  const [foods, setFoods] = useState<FoodItem[]>(defaultSampleFoods)
  const [famousRecipes, setFamousRecipes] = useState<FoodItem[]>(defaultFamousRecipes)
  const [isLoadingFoods, setIsLoadingFoods] = useState(false)
  const [isLoadingRecipes, setIsLoadingRecipes] = useState(false)
  const [selectedFood, setSelectedFood] = useState<FoodItem>(defaultSampleFoods[0])

  useEffect(() => {
    const loadFoods = async () => {
      setIsLoadingFoods(true)
      try {
        const res = await fetch(`${API_BASE}/foods`)
        if (res.ok) {
          const data = await res.json()
          if (Array.isArray(data) && data.length > 0) {
            setFoods(data)
            setSelectedFood(data[0])
          }
        }
      } catch (err) {
        console.error("Failed to load foods", err)
      } finally {
        setIsLoadingFoods(false)
      }
    }

    const loadRecipes = async () => {
      setIsLoadingRecipes(true)
      try {
        const res = await fetch(`${API_BASE}/recipes`)
        if (res.ok) {
          const data = await res.json()
          if (Array.isArray(data) && data.length > 0) {
            setFamousRecipes(data)
          }
        }
      } catch (err) {
        console.error("Failed to load recipes", err)
      } finally {
        setIsLoadingRecipes(false)
      }
    }

    loadFoods()
    loadRecipes()
  }, [])

  const handleNavigation = (path: string) => {
    router.push(path)
    setIsMenuOpen(false)
  }

  const handlePremiumNavigation = (path: string) => {
    const userStr = localStorage.getItem("calora_user")
    const currentUser = userStr ? JSON.parse(userStr) : null
    if (!currentUser?.isPremium) {
      router.push("/subscription")
      setIsMenuOpen(false)
      return
    }
    handleNavigation(path)
  }

  const filteredFoods = foods.filter((food) => {
    const matchesSearch = food.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = categoryFilter === "All" || food.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  const handleOpenModal = (food: FoodItem) => {
    setSelectedFood(food)
    setIsModalOpen(true)
  }

  const handleSelectFamousRecipe = (food: FoodItem) => {
    setSelectedFamousFood(food)
  }

  const handleAddFamousToLog = async () => {
    if (!selectedFamousFood) return
    const userStr = localStorage.getItem("calora_user")
    if (!userStr) {
      alert("Please login to log food")
      return
    }
    const user = JSON.parse(userStr)

    const multiplier = Number.parseFloat(famousQuantity) || 1
    const totalCalories = Math.round(selectedFamousFood.calories * multiplier)
    const totalProtein = Math.round(selectedFamousFood.protein * multiplier)
    const totalCarbs = Math.round(selectedFamousFood.carbs * multiplier)
    const totalFats = Number.parseFloat((selectedFamousFood.fats * multiplier).toFixed(1))

    const mealData = {
      name: selectedFamousFood.name,
      calories: totalCalories,
      protein: totalProtein,
      carbs: totalCarbs,
      fats: totalFats,
      mealType: "recipe",
      quantity: multiplier,
      unit: famousUnit,
      source: "famous-recipe",
      date: new Date().toISOString().slice(0, 19),
      user: { id: user.id },
    }

    try {
      const res = await fetch(`${API_BASE}/meals`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mealData),
      })

      if (res.ok) {
        alert(`${selectedFamousFood.name} has been added to your meals!`)
        setSelectedFamousFood(null)
        setFamousQuantity("1")
        setFamousUnit("serving")
        setIsFamousRecipesOpen(false)
      } else {
        console.error("Failed to log recipe meal", await res.text())
        alert("Failed to save meal. Please try again.")
      }
    } catch (err) {
      console.error("Error logging recipe meal", err)
      alert("Error logging meal")
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
                Food Modal
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
      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Button
            className="w-full rounded-lg py-6 text-lg font-semibold shadow-md transition-all duration-200 hover:scale-105 hover:shadow-lg"
            style={{
              backgroundColor: "#4A9782",
              color: "#FFF9E5",
            }}
            onClick={() => handlePremiumNavigation("/weekly-meal-plans")}
          >
            <Calendar className="mr-2 h-5 w-5" />
            View AI Weekly Meal Plans
            <span
              className="ml-2 rounded-full px-2 py-1 text-xs font-bold"
              style={{ backgroundColor: "#FFC50F", color: "#004030" }}
            >
              Premium
            </span>
          </Button>
        </div>

        <div className="mb-6">
          <Button
            className="w-full rounded-lg py-6 text-lg font-semibold shadow-md transition-all duration-200 hover:scale-105 hover:shadow-lg"
            style={{
              backgroundColor: "#FFC50F",
              color: "#004030",
            }}
            onClick={() => setIsFamousRecipesOpen(true)}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#e6b10e"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#FFC50F"
            }}
          >
            <Star className="mr-2 h-5 w-5" />
            Browse Famous Recipes
          </Button>
        </div>

        <Card style={{ backgroundColor: "#FFF9E5", borderColor: "#DCD0A8" }}>
          <CardHeader>
            <CardTitle style={{ color: "#004030" }}>Search Foods</CardTitle>
            <CardDescription style={{ color: "#708993" }}>
              Search for foods and click the + button to add them to your meal
            </CardDescription>
            {isLoadingFoods && (
              <p className="mt-2 text-xs" style={{ color: "#708993" }}>
                Loading foods...
              </p>
            )}
            <div className="relative mt-4">
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

            <div className="mt-4">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="h-10 w-full rounded-lg border px-3 py-2 text-sm outline-none"
                style={{
                  borderColor: "#A1C2BD",
                  backgroundColor: "#FFFFFF",
                  color: "#004030",
                }}
              >
                <option value="All">All Categories</option>
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
          </CardHeader>
          <CardContent>
            {filteredFoods.length > 0 ? (
              <div className="space-y-3">
                {filteredFoods.map((food, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded-lg border p-4"
                    style={{ borderColor: "#DCD0A8", backgroundColor: "#FFFFFF" }}
                  >
                    <div className="flex-1">
                      <h3 className="font-semibold" style={{ color: "#004030" }}>
                        {food.name}
                      </h3>
                      <p className="text-xs mb-1" style={{ color: "#708993" }}>
                        {food.category}
                      </p>
                      <p className="text-sm" style={{ color: "#708993" }}>
                        {food.calories} cal • {food.protein}g protein • {food.servingSize ?? "100g"}
                      </p>
                    </div>
                    <Button
                      size="icon"
                      className="rounded-full transition-all hover:shadow-md"
                      style={{
                        backgroundColor: "#4A9782",
                        color: "#FFF9E5",
                      }}
                      onClick={() => handleOpenModal(food)}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "#3d7f6d"
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "#4A9782"
                      }}
                    >
                      <Plus className="h-5 w-5" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="py-8 text-center" style={{ color: "#708993" }}>
                No foods found. Try a different search term or category.
              </p>
            )}
          </CardContent>
        </Card>
      </main>

      {/* Food Modal */}
      <FoodModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        foodName={selectedFood.name}
        calories={selectedFood.calories}
        protein={selectedFood.protein}
        carbs={selectedFood.carbs}
        fats={selectedFood.fats}
        servingSize={selectedFood.servingSize ?? "100g"}
        category={selectedFood.category}
      />

      {isFamousRecipesOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50" onClick={() => setIsFamousRecipesOpen(false)} />
          <div
            className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-lg p-6 shadow-xl"
            style={{ backgroundColor: "#FFF9E5" }}
          >
            <button
              onClick={() => setIsFamousRecipesOpen(false)}
              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full transition-all"
              style={{ backgroundColor: "#DCD0A8", color: "#004030" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#4A9782"
                e.currentTarget.style.color = "#FFF9E5"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#DCD0A8"
                e.currentTarget.style.color = "#004030"
              }}
            >
              ✕
            </button>

            <h2 className="mb-6 text-2xl font-bold" style={{ color: "#004030" }}>
              Famous Recipes
            </h2>

            {!selectedFamousFood ? (
              <div className="space-y-4">
                {isLoadingRecipes && (
                  <p className="text-sm" style={{ color: "#708993" }}>
                    Loading recipes...
                  </p>
                )}
                {famousRecipes.map((food, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded-lg border p-4 cursor-pointer transition-colors hover:bg-opacity-50"
                    style={{ borderColor: "#DCD0A8", backgroundColor: "#FFFFFF" }}
                    onClick={() => handleSelectFamousRecipe(food)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#E7F2EF"
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "#FFFFFF"
                    }}
                  >
                    <div className="flex-1">
                      <h3 className="font-semibold" style={{ color: "#004030" }}>
                        {food.name}
                      </h3>
                      <p className="text-xs mb-1" style={{ color: "#708993" }}>
                        {food.category}
                      </p>
                      <p className="text-sm" style={{ color: "#708993" }}>
                        {food.calories} cal • P: {food.protein}g • C: {food.carbs}g • F: {food.fats}g
                      </p>
                    </div>
                    <Plus className="h-5 w-5" style={{ color: "#4A9782" }} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-2" style={{ color: "#004030" }}>
                    {selectedFamousFood.name}
                  </h3>
                  <p className="text-sm" style={{ color: "#708993" }}>
                    {selectedFamousFood.category}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium" style={{ color: "#004030" }}>
                      Quantity
                    </label>
                    <Input
                      type="number"
                      step="0.1"
                      min="0.1"
                      value={famousQuantity}
                      onChange={(e) => setFamousQuantity(e.target.value)}
                      style={{
                        borderColor: "#A1C2BD",
                        backgroundColor: "#FFFFFF",
                        color: "#004030",
                      }}
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium" style={{ color: "#004030" }}>
                      Unit
                    </label>
                    <select
                      value={famousUnit}
                      onChange={(e) => setFamousUnit(e.target.value)}
                      className="h-10 w-full rounded-lg border px-3 py-2 text-sm outline-none"
                      style={{
                        borderColor: "#A1C2BD",
                        backgroundColor: "#FFFFFF",
                        color: "#004030",
                      }}
                    >
                      <option value="serving">serving (100g)</option>
                      <option value="gram">gram (g)</option>
                      <option value="ounce">ounce (oz)</option>
                      <option value="piece">piece</option>
                    </select>
                  </div>
                </div>

                <div className="rounded-lg border p-4" style={{ backgroundColor: "#E7F2EF", borderColor: "#A1C2BD" }}>
                  <h4 className="mb-4 text-lg font-semibold" style={{ color: "#004030" }}>
                    Nutrition Facts
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span style={{ color: "#004030" }}>Calories</span>
                      <span className="font-bold" style={{ color: "#004030" }}>
                        {Math.round(selectedFamousFood.calories * Number.parseFloat(famousQuantity))} kcal
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span style={{ color: "#708993" }}>Protein</span>
                      <span style={{ color: "#63A361" }}>
                        {Math.round(selectedFamousFood.protein * Number.parseFloat(famousQuantity))}g
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span style={{ color: "#708993" }}>Carbs</span>
                      <span className="font-bold" style={{ color: "#FFC50F" }}>
                        {Math.round(selectedFamousFood.carbs * Number.parseFloat(famousQuantity))}g
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span style={{ color: "#708993" }}>Fats</span>
                      <span style={{ color: "#5B532C" }}>
                        {(selectedFamousFood.fats * Number.parseFloat(famousQuantity)).toFixed(1)}g
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={() => setSelectedFamousFood(null)}
                    variant="outline"
                    className="flex-1 transition-colors"
                    style={{ borderColor: "#A1C2BD", color: "#004030" }}
                  >
                    Back
                  </Button>
                  <Button
                    onClick={handleAddFamousToLog}
                    className="flex-1 transition-all hover:shadow-md"
                    style={{ backgroundColor: "#4A9782", color: "#FFF9E5" }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#3d7f6d"
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "#4A9782"
                    }}
                  >
                    Add to Recent Foods
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}




