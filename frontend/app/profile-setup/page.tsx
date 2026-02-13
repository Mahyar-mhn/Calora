import ProfileSetupForm from "@/components/profile-setup-form"
import ThemeToggle from "@/components/theme-toggle"

export default function ProfileSetupPage() {
  return (
    <div
      className="relative min-h-screen flex items-center justify-center p-4"
      style={{
        background: "#E7F2EF",
      }}
    >
      <div className="absolute right-4 top-4">
        <ThemeToggle />
      </div>
      <div className="w-full max-w-md">
        <ProfileSetupForm />
      </div>
    </div>
  )
}
