"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X } from "lucide-react"

interface FoodModalProps {
  isOpen: boolean
  onClose: () => void
  foodName: string
  calories: number
  protein: number
  carbs: number
  fats: number
  servingSize: string
  category?: string
}

export default function FoodModal({
  isOpen,
  onClose,
  foodName,
  calories,
  protein,
  carbs,
  fats,
  servingSize,
  category,
}: FoodModalProps) {
  const [mealType, setMealType] = useState("breakfast")
  const [quantity, setQuantity] = useState("1")
  const [unit, setUnit] = useState("serving")

  if (!isOpen) return null

  const quantityValue = Number.parseFloat(quantity) || 1
  const multiplier = quantityValue

  const handleAddToLog = async () => {
    try {
      const userStr = localStorage.getItem("calora_user")
      if (!userStr) {
        alert("Please login to log food")
        return
      }
      const user = JSON.parse(userStr)

      const totalCalories = Math.round(calories * multiplier)
      const totalProtein = Math.round(protein * multiplier)
      const totalCarbs = Math.round(carbs * multiplier)
      const totalFats = Number.parseFloat((fats * multiplier).toFixed(1))

      const mealData = {
        name: foodName,
        calories: totalCalories,
        protein: totalProtein,
        carbs: totalCarbs,
        fats: totalFats,
        mealType,
        quantity: quantityValue,
        unit,
        source: "food-modal",
        date: new Date().toISOString().slice(0, 19),
        user: { id: user.id }
      }

      const res = await fetch("http://localhost:8080/meals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mealData),
      })

      if (res.ok) {
        console.log("Meal logged successfully")
        // Show success feedback
        alert(`Successfully added ${quantity} ${unit} of ${foodName} to ${mealType}!`)

        // Close modal after adding
        onClose()

        // Reset form
        setMealType("breakfast")
        setQuantity("1")
        setUnit("serving")
      } else {
        console.error("Failed to log meal", await res.text())
        alert("Failed to save meal. Please try again.")
      }

    } catch (err) {
      console.error("Error logging meal", err)
      alert("Error logging meal")
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        onKeyDown={(e) => e.key === "Escape" && onClose()}
        role="button"
        tabIndex={0}
        aria-label="Close modal"
      />

      {/* Modal */}
      <div
        className="relative z-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-lg border shadow-xl"
        style={{ backgroundColor: "#FFF9E5", borderColor: "#DCD0A8" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b p-6" style={{ borderColor: "#DCD0A8" }}>
          <h2 className="text-2xl font-bold" style={{ color: "#004030" }}>
            Add Food to Log
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose} style={{ color: "#004030" }}>
            <X className="h-6 w-6" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Food Name */}
          <div className="mb-6">
            <h3 className="text-xl font-semibold" style={{ color: "#004030" }}>
              {foodName}
            </h3>
            {category && (
              <p className="text-sm mt-1" style={{ color: "#708993" }}>
                {category}
              </p>
            )}
            <p className="text-sm mt-1" style={{ color: "#708993" }}>
              Serving size: {servingSize}
            </p>
          </div>

          <div className="space-y-6">
            {/* Meal Type Selection */}
            <div>
              <Label className="mb-3 block text-sm font-medium" style={{ color: "#004030" }}>
                Meal Type
              </Label>
              <div className="grid grid-cols-4 gap-3">
                {[
                  { value: "breakfast", label: "Breakfast" },
                  { value: "lunch", label: "Lunch" },
                  { value: "dinner", label: "Dinner" },
                  { value: "snack", label: "Snack" },
                ].map((meal) => (
                  <button
                    key={meal.value}
                    onClick={() => setMealType(meal.value)}
                    className="rounded-lg border px-4 py-3 text-sm font-medium transition-colors"
                    style={{
                      backgroundColor: mealType === meal.value ? "#4A9782" : "#FFFFFF",
                      color: mealType === meal.value ? "#FFF9E5" : "#004030",
                      borderColor: mealType === meal.value ? "#4A9782" : "#A1C2BD",
                    }}
                  >
                    {meal.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity and Unit */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="quantity" className="mb-2 block text-sm font-medium" style={{ color: "#004030" }}>
                  Quantity
                </Label>
                <Input
                  id="quantity"
                  type="number"
                  step="0.1"
                  min="0.1"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  style={{
                    borderColor: "#A1C2BD",
                    backgroundColor: "#FFFFFF",
                    color: "#004030",
                  }}
                />
              </div>
              <div>
                <Label htmlFor="unit" className="mb-2 block text-sm font-medium" style={{ color: "#004030" }}>
                  Unit
                </Label>
                <select
                  id="unit"
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className="h-10 w-full rounded-lg border px-3 py-2 text-sm outline-none"
                  style={{
                    borderColor: "#A1C2BD",
                    backgroundColor: "#FFFFFF",
                    color: "#004030",
                  }}
                >
                  <option value="serving">serving</option>
                  <option value="gram">gram (g)</option>
                  <option value="ounce">ounce (oz)</option>
                  <option value="cup">cup</option>
                  <option value="piece">piece</option>
                </select>
              </div>
            </div>

            {/* Detailed Nutrition Facts */}
            <div className="rounded-lg border p-4" style={{ backgroundColor: "#E7F2EF", borderColor: "#A1C2BD" }}>
              <h4 className="mb-4 text-lg font-semibold" style={{ color: "#004030" }}>
                Nutrition Facts
              </h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-medium" style={{ color: "#004030" }}>
                    Calories
                  </span>
                  <span className="text-lg font-bold" style={{ color: "#004030" }}>
                    {Math.round(calories * multiplier)} kcal
                  </span>
                </div>
                <div className="h-px w-full" style={{ backgroundColor: "#A1C2BD" }} />
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-sm" style={{ color: "#708993" }}>
                      Protein
                    </div>
                    <div className="mt-1 text-lg font-bold" style={{ color: "#63A361" }}>
                      {Math.round(protein * multiplier)}g
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm" style={{ color: "#708993" }}>
                      Carbs
                    </div>
                    <div className="mt-1 text-lg font-bold" style={{ color: "#FFC50F" }}>
                      {Math.round(carbs * multiplier)}g
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm" style={{ color: "#708993" }}>
                      Fats
                    </div>
                    <div className="mt-1 text-lg font-bold" style={{ color: "#5B532C" }}>
                      {(fats * multiplier).toFixed(1)}g
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t p-6" style={{ borderColor: "#DCD0A8" }}>
          <Button
            variant="outline"
            onClick={onClose}
            className="hover:opacity-80 bg-transparent"
            style={{
              borderColor: "#A1C2BD",
              color: "#004030",
              backgroundColor: "transparent",
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleAddToLog}
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
            Add to Log
          </Button>
        </div>
      </div>
    </div>
  )
}
