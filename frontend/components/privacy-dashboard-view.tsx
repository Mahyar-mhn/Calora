"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Menu,
  User,
  Home,
  Utensils,
  Cookie,
  Activity,
  History,
  Eye,
  Download,
  Trash2,
  FileText,
  Shield,
  ArrowLeft,
} from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"

export default function PrivacyDashboardView() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const router = useRouter()

  const handleNavigation = (path: string) => {
    router.push(path)
    setIsMenuOpen(false)
  }

  const handleViewData = () => {
    alert("Viewing your data... This will display all your stored information.")
  }

  const handleExportData = () => {
    alert("Exporting your data... You will receive a download link shortly.")
  }

  const handleDeleteData = () => {
    const confirmed = confirm("Are you sure you want to delete all your data? This action cannot be undone.")
    if (confirmed) {
      alert("Data deletion initiated. Your account data will be permanently removed.")
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
                className="rounded-lg bg-transparent transition-all hover:bg-[#E7F2EF] transition-transform duration-300 ease-in-out"
                style={{
                  borderColor: "#4A9782",
                  color: "#004030",
                  transform: isMenuOpen ? "rotate(180deg)" : "rotate(0deg)",
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
                Privacy Dashboard
              </h1>
            </div>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full bg-transparent transition-colors hover:bg-[#E7F2EF]"
              style={{
                borderColor: "#4A9782",
                color: "#004030",
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
                className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left transition-colors hover:bg-[#E7F2EF]"
                style={{ color: "#004030" }}
                onClick={() => handleNavigation("/dashboard")}
              >
                <Home className="h-5 w-5" />
                <span className="font-medium">Dashboard</span>
              </button>
              <button
                className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left transition-colors hover:bg-[#E7F2EF]"
                style={{ color: "#004030" }}
                onClick={() => handleNavigation("/meal-food")}
              >
                <Utensils className="h-5 w-5" />
                <span className="font-medium">Meal & Food</span>
              </button>
              <button
                className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left transition-colors hover:bg-[#E7F2EF]"
                style={{ color: "#004030" }}
                onClick={() => handleNavigation("/food-modal")}
              >
                <Cookie className="h-5 w-5" />
                <span className="font-medium">Food Modal</span>
              </button>
              <button
                className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left transition-colors hover:bg-[#E7F2EF]"
                style={{ color: "#004030" }}
                onClick={() => handleNavigation("/activity-tracking")}
              >
                <Activity className="h-5 w-5" />
                <span className="font-medium">Activity Tracking</span>
              </button>
              <button
                className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left transition-colors hover:bg-[#E7F2EF]"
                style={{ color: "#004030" }}
                onClick={() => handleNavigation("/history")}
              >
                <History className="h-5 w-5" />
                <span className="font-medium">History</span>
              </button>
            </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Button
          variant="outline"
          className="mb-6 bg-transparent transition-all hover:shadow-md"
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

        <div className="space-y-6">
          {/* Privacy Header Card */}
          <Card style={{ backgroundColor: "#FFF9E5", borderColor: "#DCD0A8" }}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Shield className="h-8 w-8" style={{ color: "#4A9782" }} />
                <div>
                  <CardTitle style={{ color: "#004030" }}>Privacy & Data Control</CardTitle>
                  <CardDescription style={{ color: "#708993" }}>
                    Manage your personal data and privacy settings
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Data Management Actions */}
          <Card style={{ backgroundColor: "#FFF9E5", borderColor: "#DCD0A8" }}>
            <CardHeader>
              <CardTitle style={{ color: "#004030" }}>Your Data</CardTitle>
              <CardDescription style={{ color: "#708993" }}>
                View, export, or delete your personal information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {/* View Data Button */}
                <Button
                  variant="outline"
                  className="h-auto justify-start gap-4 bg-white p-6 transition-all hover:bg-[#E7F2EF] hover:shadow-md"
                  style={{
                    borderColor: "#4A9782",
                  }}
                  onClick={handleViewData}
                >
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-lg"
                    style={{ backgroundColor: "#E7F2EF" }}
                  >
                    <Eye className="h-6 w-6" style={{ color: "#4A9782" }} />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-semibold" style={{ color: "#004030" }}>
                      View My Data
                    </p>
                    <p className="text-sm" style={{ color: "#708993" }}>
                      See all the information we have stored about you
                    </p>
                  </div>
                </Button>

                {/* Export Data Button */}
                <Button
                  variant="outline"
                  className="h-auto justify-start gap-4 bg-white p-6 transition-all hover:bg-[#E7F2EF] hover:shadow-md"
                  style={{
                    borderColor: "#4A9782",
                  }}
                  onClick={handleExportData}
                >
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-lg"
                    style={{ backgroundColor: "#E7F2EF" }}
                  >
                    <Download className="h-6 w-6" style={{ color: "#4A9782" }} />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-semibold" style={{ color: "#004030" }}>
                      Export My Data
                    </p>
                    <p className="text-sm" style={{ color: "#708993" }}>
                      Download a copy of your data in a portable format
                    </p>
                  </div>
                </Button>

                {/* Delete Data Button */}
                <Button
                  variant="outline"
                  className="h-auto justify-start gap-4 bg-white p-6 transition-all hover:bg-red-50 hover:shadow-md"
                  style={{
                    borderColor: "#FF6B6B",
                  }}
                  onClick={handleDeleteData}
                >
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-lg"
                    style={{ backgroundColor: "#FFE5E5" }}
                  >
                    <Trash2 className="h-6 w-6" style={{ color: "#FF6B6B" }} />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-semibold" style={{ color: "#004030" }}>
                      Delete My Data
                    </p>
                    <p className="text-sm" style={{ color: "#708993" }}>
                      Permanently remove all your data from our servers
                    </p>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Privacy Policy Card */}
          <Card style={{ backgroundColor: "#FFF9E5", borderColor: "#DCD0A8" }}>
            <CardHeader>
              <CardTitle style={{ color: "#004030" }}>Privacy Information</CardTitle>
              <CardDescription style={{ color: "#708993" }}>Learn about how we handle your data</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="rounded-lg border p-4" style={{ backgroundColor: "#FFFFFF", borderColor: "#DCD0A8" }}>
                  <div className="flex items-start gap-3">
                    <FileText className="mt-1 h-5 w-5 shrink-0" style={{ color: "#4A9782" }} />
                    <div>
                      <h3 className="font-semibold" style={{ color: "#004030" }}>
                        Privacy Policy
                      </h3>
                      <p className="mt-1 text-sm leading-relaxed" style={{ color: "#708993" }}>
                        We are committed to protecting your privacy. Your health data is encrypted and stored securely.
                        We never share your personal information with third parties without your explicit consent.
                      </p>
                      <Button
                        variant="link"
                        className="mt-2 h-auto p-0 transition-colors hover:opacity-80"
                        style={{ color: "#4A9782" }}
                        onClick={() => alert("Opening full privacy policy...")}
                      >
                        Read Full Privacy Policy →
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border p-4" style={{ backgroundColor: "#FFFFFF", borderColor: "#DCD0A8" }}>
                  <div className="flex items-start gap-3">
                    <Shield className="mt-1 h-5 w-5 shrink-0" style={{ color: "#4A9782" }} />
                    <div>
                      <h3 className="font-semibold" style={{ color: "#004030" }}>
                        Data Usage & Sharing
                      </h3>
                      <p className="mt-1 text-sm leading-relaxed" style={{ color: "#708993" }}>
                        Your data is used solely to provide and improve our health tracking services. We use
                        industry-standard encryption and security practices to keep your information safe.
                      </p>
                      <Button
                        variant="link"
                        className="mt-2 h-auto p-0 transition-colors hover:opacity-80"
                        style={{ color: "#4A9782" }}
                        onClick={() => alert("Opening data usage details...")}
                      >
                        Learn More About Data Usage →
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
