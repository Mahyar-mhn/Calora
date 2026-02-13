import { Suspense } from "react"
import MealFoodView from "@/components/meal-food-view"

export default function MealFoodPage() {
  return (
    <Suspense fallback={null}>
      <MealFoodView />
    </Suspense>
  )
}
