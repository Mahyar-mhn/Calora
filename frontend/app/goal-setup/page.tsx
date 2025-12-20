import GoalSetupForm from "@/components/goal-setup-form"

export default function GoalSetupPage() {
  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background: "#E7F2EF",
      }}
    >
      <div className="w-full max-w-md">
        <GoalSetupForm />
      </div>
    </div>
  )
}
