import GoalSetupForm from "@/components/goal-setup-form"
import ThemeToggle from "@/components/theme-toggle"

export default function GoalSetupPage() {
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
        <GoalSetupForm />
      </div>
    </div>
  )
}
