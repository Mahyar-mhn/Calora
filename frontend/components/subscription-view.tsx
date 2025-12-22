"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Menu,
  User,
  Home,
  Utensils,
  Cookie,
  Activity,
  History,
  ArrowLeft,
  Crown,
  Check,
  Sparkles,
  BarChart3,
  CloudUpload,
  Camera,
  CreditCard,
  X,
} from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"

export default function SubscriptionView() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<{ name: string; price: string } | null>(null)
  const router = useRouter()

  // Sample subscription status
  const [subscriptionStatus, setSubscriptionStatus] = useState({
    isPremium: false,
    plan: "Free",
    expiresAt: null,
  })

  const handleNavigation = (path: string) => {
    router.push(path)
    setIsMenuOpen(false)
  }

  const handleOpenPayment = (planName: string, price: string) => {
    setSelectedPlan({ name: planName, price })
    setIsPaymentModalOpen(true)
  }

  const handleConfirmPayment = () => {
    if (selectedPlan) {
      // Update subscription status
      setSubscriptionStatus({
        isPremium: true,
        plan: selectedPlan.name,
        expiresAt: selectedPlan.name === "Yearly" ? "Dec 31, 2025" : "Jan 31, 2025",
      })

      alert(`Payment confirmed for ${selectedPlan.name} plan at ${selectedPlan.price}! Your subscription is now active.`)
      setIsPaymentModalOpen(false)
      setSelectedPlan(null)
    }
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
                className="rounded-lg bg-transparent transition-all hover:shadow-md transition-transform duration-300 ease-in-out"
                style={{
                  borderColor: "#4A9782",
                  color: "#004030",
                  transform: isMenuOpen ? "rotate(180deg)" : "rotate(0deg)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#E7F2EF"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent"
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
                Subscription & Premium
              </h1>
            </div>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full bg-transparent transition-all hover:shadow-md"
              style={{
                borderColor: "#4A9782",
                color: "#004030",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#E7F2EF"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent"
              }}
              onClick={() => handleNavigation("/profile")}
            >
              <User className="h-5 w-5" />
            </Button>
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
      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Button
            variant="outline"
            className="bg-transparent transition-all hover:shadow-md"
            style={{
              borderColor: "#4A9782",
              color: "#004030",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#E7F2EF"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent"
            }}
            onClick={() => handleNavigation("/profile")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Profile
          </Button>
        </div>
        <div className="space-y-6">
          {/* Current Subscription Status */}
          <Card style={{ backgroundColor: "#FFF9E5", borderColor: "#DCD0A8" }}>
            <CardHeader>
              <CardTitle style={{ color: "#004030" }}>Current Subscription</CardTitle>
              <CardDescription style={{ color: "#708993" }}>Your account status and benefits</CardDescription>
            </CardHeader>
            <CardContent>
              <div
                className="flex items-center justify-between rounded-lg p-6"
                style={{ backgroundColor: subscriptionStatus.isPremium ? "#FFC50F20" : "#E7F2EF" }}
              >
                <div className="flex items-center gap-4">
                  <div
                    className="flex h-16 w-16 items-center justify-center rounded-full"
                    style={{ backgroundColor: subscriptionStatus.isPremium ? "#FFC50F" : "#708993" }}
                  >
                    <Crown className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold" style={{ color: "#004030" }}>
                      {subscriptionStatus.plan}
                    </p>
                    <p className="text-sm" style={{ color: "#708993" }}>
                      {subscriptionStatus.isPremium ? `Expires: ${subscriptionStatus.expiresAt}` : "Basic features"}
                    </p>
                  </div>
                </div>
                {!subscriptionStatus.isPremium && (
                  <Button
                    style={{
                      backgroundColor: "#FFC50F",
                      color: "#004030",
                    }}
                    className="font-semibold"
                  >
                    Upgrade Now
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Premium Features */}
          <Card style={{ backgroundColor: "#FFF9E5", borderColor: "#DCD0A8" }}>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Crown className="h-6 w-6" style={{ color: "#FFC50F" }} />
                <CardTitle style={{ color: "#004030" }}>Premium Features</CardTitle>
              </div>
              <CardDescription style={{ color: "#708993" }}>
                Unlock advanced features to supercharge your health journey
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* AI Meal Recognition */}
                <div className="flex items-start gap-4 rounded-lg p-4" style={{ backgroundColor: "#E7F2EF" }}>
                  <div
                    className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg"
                    style={{ backgroundColor: "#4A9782" }}
                  >
                    <Camera className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold" style={{ color: "#004030" }}>
                      AI Meal Recognition
                    </h4>
                    <p className="text-sm" style={{ color: "#708993" }}>
                      Instantly log meals by taking a photo. Our AI identifies food and calculates nutrition
                      automatically.
                    </p>
                  </div>
                  <Check className="h-5 w-5 flex-shrink-0" style={{ color: "#63A361" }} />
                </div>

                {/* Advanced Analytics */}
                <div className="flex items-start gap-4 rounded-lg p-4" style={{ backgroundColor: "#E7F2EF" }}>
                  <div
                    className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg"
                    style={{ backgroundColor: "#4A9782" }}
                  >
                    <BarChart3 className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold" style={{ color: "#004030" }}>
                      Advanced Analytics
                    </h4>
                    <p className="text-sm" style={{ color: "#708993" }}>
                      Get deep insights with custom reports, trend analysis, and personalized health predictions.
                    </p>
                  </div>
                  <Check className="h-5 w-5 flex-shrink-0" style={{ color: "#63A361" }} />
                </div>

                {/* Ad-Free Experience */}
                <div className="flex items-start gap-4 rounded-lg p-4" style={{ backgroundColor: "#E7F2EF" }}>
                  <div
                    className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg"
                    style={{ backgroundColor: "#4A9782" }}
                  >
                    <Sparkles className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold" style={{ color: "#004030" }}>
                      Ad-Free Experience
                    </h4>
                    <p className="text-sm" style={{ color: "#708993" }}>
                      Enjoy an uninterrupted, clean interface without any advertisements or distractions.
                    </p>
                  </div>
                  <Check className="h-5 w-5 flex-shrink-0" style={{ color: "#63A361" }} />
                </div>

                {/* Cloud Backup & Sync */}
                <div className="flex items-start gap-4 rounded-lg p-4" style={{ backgroundColor: "#E7F2EF" }}>
                  <div
                    className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg"
                    style={{ backgroundColor: "#4A9782" }}
                  >
                    <CloudUpload className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold" style={{ color: "#004030" }}>
                      Cloud Backup & Sync
                    </h4>
                    <p className="text-sm" style={{ color: "#708993" }}>
                      Automatically backup your data to the cloud and sync seamlessly across all your devices.
                    </p>
                  </div>
                  <Check className="h-5 w-5 flex-shrink-0" style={{ color: "#63A361" }} />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pricing Plans */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Monthly Plan */}
            <Card
              style={{ backgroundColor: "#FFF9E5", borderColor: "#DCD0A8" }}
              className="transition-transform hover:scale-105"
            >
              <CardHeader>
                <CardTitle className="text-center" style={{ color: "#004030" }}>
                  Monthly
                </CardTitle>
                <CardDescription className="text-center" style={{ color: "#708993" }}>
                  Perfect for trying out Premium
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="flex items-baseline justify-center gap-2">
                      <span className="text-5xl font-bold" style={{ color: "#004030" }}>
                        $2
                      </span>
                      <span className="text-lg" style={{ color: "#708993" }}>
                        /month
                      </span>
                    </div>
                    <p className="mt-2 text-sm" style={{ color: "#708993" }}>
                      Billed monthly
                    </p>
                  </div>
                  <Button
                    className="w-full transition-all hover:shadow-lg"
                    style={{
                      backgroundColor: "#4A9782",
                      color: "#FFF9E5",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#3d8270"
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "#4A9782"
                    }}
                    onClick={() => handleOpenPayment("Monthly", "$2/month")}
                  >
                    Choose Monthly
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Yearly Plan */}
            <Card
              style={{ backgroundColor: "#FFC50F20", borderColor: "#FFC50F", borderWidth: "2px" }}
              className="relative transition-transform hover:scale-105"
            >
              <div
                className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-4 py-1 text-xs font-semibold"
                style={{ backgroundColor: "#FFC50F", color: "#004030" }}
              >
                SAVE 17%
              </div>
              <CardHeader>
                <CardTitle className="text-center" style={{ color: "#004030" }}>
                  Yearly
                </CardTitle>
                <CardDescription className="text-center" style={{ color: "#708993" }}>
                  Best value for long-term users
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="flex items-baseline justify-center gap-2">
                      <span className="text-5xl font-bold" style={{ color: "#004030" }}>
                        $20
                      </span>
                      <span className="text-lg" style={{ color: "#708993" }}>
                        /year
                      </span>
                    </div>
                    <p className="mt-2 text-sm" style={{ color: "#708993" }}>
                      Just $1.67 per month
                    </p>
                  </div>
                  <Button
                    className="w-full font-semibold transition-all hover:shadow-lg"
                    style={{
                      backgroundColor: "#FFC50F",
                      color: "#004030",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#f0b800"
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "#FFC50F"
                    }}
                    onClick={() => handleOpenPayment("Yearly", "$20/year")}
                  >
                    Choose Yearly
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

        </div>
      </main>

      {isPaymentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsPaymentModalOpen(false)} />

          {/* Modal Content */}
          <div
            className="relative z-10 w-full max-w-md rounded-lg border-2 p-6 shadow-2xl"
            style={{ backgroundColor: "#FFF9E5", borderColor: "#DCD0A8" }}
          >
            {/* Close Button */}
            <button
              className="absolute right-4 top-4 rounded-lg p-1 transition-colors hover:bg-[#E7F2EF]"
              onClick={() => setIsPaymentModalOpen(false)}
              style={{ color: "#004030" }}
            >
              <X className="h-5 w-5" />
            </button>

            {/* Modal Header */}
            <div className="mb-6">
              <div className="mb-2 flex items-center gap-2">
                <CreditCard className="h-6 w-6" style={{ color: "#4A9782" }} />
                <h2 className="text-2xl font-bold" style={{ color: "#004030" }}>
                  Payment Details
                </h2>
              </div>
              <p className="text-sm" style={{ color: "#708993" }}>
                Complete your subscription to {selectedPlan?.name} plan
              </p>
            </div>

            {/* Plan Summary */}
            <div className="mb-6 rounded-lg p-4" style={{ backgroundColor: "#E7F2EF" }}>
              <div className="flex items-center justify-between">
                <span className="font-semibold" style={{ color: "#004030" }}>
                  {selectedPlan?.name} Plan
                </span>
                <span className="text-xl font-bold" style={{ color: "#4A9782" }}>
                  {selectedPlan?.price}
                </span>
              </div>
            </div>

            {/* Payment Form */}
            <form className="space-y-4">
              {/* Card Number */}
              <div className="space-y-2">
                <Label htmlFor="card-number" style={{ color: "#004030" }}>
                  Card Number
                </Label>
                <Input
                  id="card-number"
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  className="h-11 border-2"
                  style={{
                    borderColor: "#A1C2BD",
                    backgroundColor: "#FFFFFF",
                    color: "#19183B",
                  }}
                />
              </div>

              {/* Expiry and CVC */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expiry" style={{ color: "#004030" }}>
                    Expiry Date
                  </Label>
                  <Input
                    id="expiry"
                    type="text"
                    placeholder="MM/YY"
                    className="h-11 border-2"
                    style={{
                      borderColor: "#A1C2BD",
                      backgroundColor: "#FFFFFF",
                      color: "#19183B",
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cvc" style={{ color: "#004030" }}>
                    CVC
                  </Label>
                  <Input
                    id="cvc"
                    type="text"
                    placeholder="123"
                    className="h-11 border-2"
                    style={{
                      borderColor: "#A1C2BD",
                      backgroundColor: "#FFFFFF",
                      color: "#19183B",
                    }}
                  />
                </div>
              </div>

              {/* Cardholder Name */}
              <div className="space-y-2">
                <Label htmlFor="cardholder" style={{ color: "#004030" }}>
                  Cardholder Name
                </Label>
                <Input
                  id="cardholder"
                  type="text"
                  placeholder="John Doe"
                  className="h-11 border-2"
                  style={{
                    borderColor: "#A1C2BD",
                    backgroundColor: "#FFFFFF",
                    color: "#19183B",
                  }}
                />
              </div>

              {/* Confirm Payment Button */}
              <Button
                type="button"
                className="w-full h-12 text-base font-semibold transition-all hover:shadow-lg"
                style={{
                  backgroundColor: selectedPlan?.name === "Yearly" ? "#FFC50F" : "#4A9782",
                  color: selectedPlan?.name === "Yearly" ? "#004030" : "#FFF9E5",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = selectedPlan?.name === "Yearly" ? "#f0b800" : "#3d8270"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = selectedPlan?.name === "Yearly" ? "#FFC50F" : "#4A9782"
                }}
                onClick={handleConfirmPayment}
              >
                Confirm Payment
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
