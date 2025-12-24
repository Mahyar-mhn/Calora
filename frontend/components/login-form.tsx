"use client"

import type React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation" // Added useRouter import for navigation
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, EyeOff } from "lucide-react"
import Image from "next/image"

export default function LoginForm() {
  const router = useRouter() // Added router for navigation to dashboard
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const res = await fetch("http://localhost:8080/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      if (res.ok) {
        const user = await res.json()
        localStorage.setItem("calora_user", JSON.stringify(user))
        router.push("/dashboard")
      } else {
        alert("Login failed: Invalid credentials")
      }
    } catch (error) {
      console.error("Login error:", error)
      alert("Login error: " + error)
    }
  }
  const handleForgotPassword = () => {
    router.push("/forgot-password")
  }

  return (
    <Card className="w-full max-w-md border-0 shadow-2xl" style={{ background: "#FFF9E5" }}>
      <CardHeader className="space-y-6 pt-8 pb-6">
        <div className="flex justify-center">
          <Image src="/images/logo.png" alt="Calora Logo" width={120} height={120} className="object-contain" />
        </div>
        <div className="text-center space-y-2">
          <CardTitle className="text-3xl font-bold text-balance" style={{ color: "#004030" }}>
            Welcome Back
          </CardTitle>
          <CardDescription className="text-base" style={{ color: "#708993" }}>
            Sign in to continue your health journey
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
            <div className="flex items-center justify-between">
              <Label htmlFor="password" style={{ color: "#004030" }} className="font-medium">
                Password
              </Label>
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-sm font-medium hover:underline"
                style={{ color: "#4A9782" }}
              >
                Forgot?
              </button>
            </div>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
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

          <Button
            type="submit"
            className="w-full h-12 text-base font-semibold shadow-md hover:shadow-lg transition-all"
            style={{
              background: "#4A9782",
              color: "#FFF9E5",
            }}
          >
            Sign In
          </Button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t" style={{ borderColor: "#A1C2BD" }} />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span
              className="px-2 font-medium"
              style={{
                background: "#FFF9E5",
                color: "#708993",
              }}
            >
              Or continue with
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Button
            type="button"
            variant="outline"
            className="h-11 border-2 font-medium hover:shadow-md transition-all bg-transparent"
            style={{
              borderColor: "#A1C2BD",
              background: "#FFFFFF",
              color: "#19183B",
            }}
          >
            <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Google
          </Button>
          <Button
            type="button"
            variant="outline"
            className="h-11 border-2 font-medium hover:shadow-md transition-all bg-transparent"
            style={{
              borderColor: "#A1C2BD",
              background: "#FFFFFF",
              color: "#19183B",
            }}
          >
            <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
            </svg>
            Facebook
          </Button>
        </div>

        <div className="text-center pt-2">
          <p className="text-sm" style={{ color: "#708993" }}>
            {"Don't have an account? "}
            <Link href="/signup" className="font-semibold hover:underline" style={{ color: "#4A9782" }}>
              Sign Up
            </Link>
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
