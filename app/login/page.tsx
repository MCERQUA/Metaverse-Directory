import type { Metadata } from "next"
import { LoginForm } from "@/components/auth/login-form"

export const metadata: Metadata = {
  title: "Login - MetaVerse Discovery",
  description: "Sign in to your MetaVerse Discovery account",
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="flex min-h-screen items-center justify-center">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
              <p className="text-slate-400">Sign in to explore virtual worlds</p>
            </div>
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  )
}
