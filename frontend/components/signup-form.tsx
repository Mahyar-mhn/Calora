"use client"
import { API_BASE } from "@/lib/api"
import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, EyeOff } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"

const sanitizeRedirect = (redirect: string | null, fallback: string) => {
  if (!redirect) return fallback
  if (!redirect.startsWith("/") || redirect.startsWith("//")) return fallback
  return redirect
}

export default function SignUpForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const safeRedirect = sanitizeRedirect(searchParams.get("redirect"), "/profile-setup")
  const safeRequestedRedirect = sanitizeRedirect(searchParams.get("redirect"), "")
  const loginHref = safeRequestedRedirect ? `/login?redirect=${encodeURIComponent(safeRequestedRedirect)}` : "/login"

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      console.log("[v0] Password mismatch")
      return
    }

    try {
      const res = await fetch(`${API_BASE}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name: "New User" }), // Name is hardcoded for now or we can add a field
      })

      if (res.ok) {
        const user = await res.json()
        localStorage.setItem("calora_user", JSON.stringify(user))
        router.push(safeRedirect)
      } else {
        const errorData = await res.json()
        console.error("Signup failed:", errorData)
        // Ideally show error to user, but avoiding UI changes as requested, just logging for now
        alert("Signup failed: " + (errorData.message || "Unknown error"))
      }
    } catch (error) {
      console.error("Signup error:", error)
      alert("Signup error: " + error)
    }
  }

  return (
    <Card className="w-full max-w-md border-0 shadow-2xl" style={{ background: "#FFF9E5" }}>
      <CardHeader className="space-y-6 pt-8 pb-6">
        <div className="flex justify-center">
          <Image src="/images/logo.png" alt="Calora Logo" width={120} height={120} className="object-contain" />
        </div>
        <div className="text-center space-y-2">
          <CardTitle className="text-3xl font-bold text-balance" style={{ color: "#004030" }}>
            Create Account
          </CardTitle>
          <CardDescription className="text-base" style={{ color: "#708993" }}>
            Start your journey to better health
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-6 pb-8">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email" style={{ color: "#004030" }} className="font-medium">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-11 border-2 focus-visible:ring-offset-0"
              style={{
                borderColor: "#A1C2BD",
                background: "#FFFFFF",
                color: "#19183B",
              }}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" style={{ color: "#004030" }} className="font-medium">
              Password
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-11 pr-10 border-2 focus-visible:ring-offset-0"
                style={{
                  borderColor: "#A1C2BD",
                  background: "#FFFFFF",
                  color: "#19183B",
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 hover:opacity-70 transition-opacity"
                style={{ color: "#708993" }}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword" style={{ color: "#004030" }} className="font-medium">
              Confirm Password
            </Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="h-11 pr-10 border-2 focus-visible:ring-offset-0"
                style={{
                  borderColor: "#A1C2BD",
                  background: "#FFFFFF",
                  color: "#19183B",
                }}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 hover:opacity-70 transition-opacity"
                style={{ color: "#708993" }}
              >
                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full h-12 text-base font-semibold shadow-md hover:shadow-lg transition-all"
            style={{
              background: "#4A9782",
              color: "#FFF9E5",
            }}
          >
            Continue to Profile Setup
          </Button>
        </form>

        <div className="text-center pt-2">
          <p className="text-sm" style={{ color: "#708993" }}>
            Already have an account?{" "}
            <Link href={loginHref} className="font-semibold hover:underline" style={{ color: "#4A9782" }}>
              Sign In
            </Link>
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

