"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft } from "lucide-react"
import Image from "next/image"

export default function ProfileSetupForm() {
  const router = useRouter()
  const [age, setAge] = useState("")
  const [gender, setGender] = useState("")
  const [height, setHeight] = useState("")
  const [weight, setWeight] = useState("")
  const [activityLevel, setActivityLevel] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!gender || !activityLevel) {
      alert("Please select both gender and activity level")
      return
    }
    console.log("Profile setup:", { age, gender, height, weight, activityLevel })
    router.push("/goal-setup")
  }

  return (
    <Card className="w-full border-0 shadow-2xl" style={{ background: "#FFF9E5" }}>
      <CardHeader className="space-y-6 pt-8 pb-6">
        <div className="flex justify-center">
          <Image src="/images/logo.png" alt="Calora Logo" width={120} height={120} className="object-contain" />
        </div>
        <div className="text-center space-y-2">
          <CardTitle className="text-3xl font-bold text-balance" style={{ color: "#004030" }}>
            Profile Setup
          </CardTitle>
          <CardDescription className="text-base" style={{ color: "#708993" }}>
            Step 1: Tell us about yourself
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
          <div className="space-y-2">
          
          </div>

          <div className="gap-2 flex flex-row justify-between items-center">
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
              required
              min="1"
              max="120"
              className="py-5 border-2 focus-visible:ring-offset-0"
              style={{
                borderColor: "#A1C2BD",
                background: "#FFFFFF",
                color: "#19183B",
              }}
            />
            </div>
            <div className="flex flex-col gap-2  justify-center items-start w-full">
              <Label htmlFor="gender" style={{ color: "#004030" }} className="w-full font-medium">
              Gender
            </Label>
            <Select value={gender} onValueChange={setGender}>
              <SelectTrigger
                id="gender"
                className="py-5 border-2 w-full focus:ring-offset-0"
                style={{
                  borderColor: "#A1C2BD",
                  background: "#FFFFFF",
                  color: gender ? "#19183B" : "#708993",
                }}
              >
                <SelectValue placeholder="Select your gender" />
              </SelectTrigger>
              <SelectContent style={{ background: "#FFF9E5", borderColor: "#A1C2BD" }}>
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

          <div className="space-y-2">
            <Label htmlFor="height" style={{ color: "#004030" }} className="font-medium">
              Height (cm)
            </Label>
            <Input
              id="height"
              type="number"
              placeholder="Enter your height"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              required
              min="50"
              max="300"
              className="h-11 border-2 focus-visible:ring-offset-0"
              style={{
                borderColor: "#A1C2BD",
                background: "#FFFFFF",
                color: "#19183B",
              }}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="weight" style={{ color: "#004030" }} className="font-medium">
              Weight (kg)
            </Label>
            <Input
              id="weight"
              type="number"
              placeholder="Enter your weight"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              required
              min="20"
              max="500"
              step="0.1"
              className="h-11 border-2 focus-visible:ring-offset-0"
              style={{
                borderColor: "#A1C2BD",
                background: "#FFFFFF",
                color: "#19183B",
              }}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="activityLevel" style={{ color: "#004030" }} className="font-medium">
              Activity Level
            </Label>
            <Select value={activityLevel} onValueChange={setActivityLevel}>
              <SelectTrigger
                id="activityLevel"
                className="py-5 w-full border-2 focus:ring-offset-0"
                style={{
                  borderColor: "#A1C2BD",
                  background: "#FFFFFF",
                  color: activityLevel ? "#19183B" : "#708993",
                }}
              >
                <SelectValue placeholder="Select your activity level" />
              </SelectTrigger>
              <SelectContent style={{ background: "#FFF9E5", borderColor: "#A1C2BD" }}>
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

          <Button
            type="submit"
            className="w-full h-12 text-base font-semibold shadow-md hover:shadow-lg transition-all"
            style={{
              background: "#4A9782",
              color: "#FFF9E5",
            }}
          >
            Continue
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
