import SignUpForm from "@/components/signup-form"
import { Suspense } from "react"
import Link from "next/link"

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: "#E7F2EF" }}>
      <div className="w-full max-w-md space-y-4">
        <Link
          href="/"
          className="inline-flex rounded-lg border border-[#A1C2BD] bg-[#FFF9E5] px-4 py-2 text-sm font-semibold text-[#004030] transition-colors hover:bg-[#E7F2EF]"
        >
          Back to Home
        </Link>
        <Suspense fallback={null}>
          <SignUpForm />
        </Suspense>
      </div>
    </div>
  )
}
