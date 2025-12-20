export default function ProfileSetupPage() {
  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background: "#E7F2EF",
      }}
    >
      <div className="w-full max-w-md">
        <ProfileSetupForm />
      </div>
    </div>
  )
}

import ProfileSetupForm from "@/components/profile-setup-form"
