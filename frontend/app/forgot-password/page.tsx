"use client"

import type React from "react"
import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ThemeToggle } from "@/components/theme-toggle"
import { ArrowLeft, Mail } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Password reset request for:", email)
    setIsSubmitted(true)
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4" style={{ background: "#E7F2EF" }}>
      <div className="absolute right-4 top-4">
        <ThemeToggle />
      </div>
      <Card className="w-full max-w-md border-0 shadow-2xl" style={{ background: "#FFF9E5" }}>
        <CardHeader className="space-y-6 pt-8 pb-6">
          <div className="flex justify-center">
            <button
              onClick={() => router.push("/dashboard")}
              className="cursor-pointer transition-opacity hover:opacity-80"
              aria-label="Go to Dashboard"
            >
              <Image src="/images/logo.png" alt="Calora Logo" width={120} height={120} className="object-contain" />
            </button>
          </div>
          <div className="text-center space-y-2">
            <CardTitle className="text-3xl font-bold text-balance" style={{ color: "#004030" }}>
              {isSubmitted ? "Check Your Email" : "Forgot Password?"}
            </CardTitle>
            <CardDescription className="text-base" style={{ color: "#708993" }}>
              {isSubmitted
                ? "We've sent password reset instructions to your email"
                : "Enter your email and we'll send you instructions to reset your password"}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-6 pb-8">
          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" style={{ color: "#004030" }} className="font-medium">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5" style={{ color: "#708993" }} />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-11 pl-10 border-2 focus-visible:ring-offset-0"
                    style={{
                      borderColor: "#A1C2BD",
                      background: "#FFFFFF",
                      color: "#19183B",
                    }}
                  />
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
                Send Reset Link
              </Button>
            </form>
          ) : (
            <div className="space-y-5">
              <div
                className="p-4 rounded-lg border-2 text-center"
                style={{
                  borderColor: "#63A361",
                  background: "#E7F2EF",
                }}
              >
                <Mail className="h-12 w-12 mx-auto mb-3" style={{ color: "#4A9782" }} />
                <p className="text-sm font-medium" style={{ color: "#004030" }}>
                  Password reset link sent to:
                </p>
                <p className="text-sm font-semibold mt-1" style={{ color: "#4A9782" }}>
                  {email}
                </p>
              </div>

              <p className="text-sm text-center" style={{ color: "#708993" }}>
                {"Didn't receive the email? Check your spam folder or "}
                <button
                  type="button"
                  onClick={() => setIsSubmitted(false)}
                  className="font-semibold hover:underline"
                  style={{ color: "#4A9782" }}
                >
                  try again
                </button>
              </p>
            </div>
          )}

          <div className="pt-2">
            <Link
              href="/login"
              className="flex items-center justify-center gap-2 text-sm font-medium hover:underline"
              style={{ color: "#4A9782" }}
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Sign In
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

