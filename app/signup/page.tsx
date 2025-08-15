import type { Metadata } from "next"
import { SignupForm } from "@/components/auth/signup-form"

export const metadata: Metadata = {
  title: "Sign Up - MetaVerse Discovery",
  description: "Create your MetaVerse Discovery account",
}

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="flex min-h-screen items-center justify-center">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">Join MetaVerse</h1>
              <p className="text-slate-400">Create your account to start exploring</p>
            </div>
            <SignupForm />
          </div>
        </div>
      </div>
    </div>
  )
}
