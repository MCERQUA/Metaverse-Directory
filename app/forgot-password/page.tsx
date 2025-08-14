"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, ArrowLeft, Mail } from "lucide-react"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      setIsSubmitted(true)
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="flex min-h-screen items-center justify-center">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">Reset Password</h1>
              <p className="text-slate-400">We'll send you instructions to reset your password</p>
            </div>

            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              {!isSubmitted ? (
                <>
                  <CardHeader>
                    <CardTitle className="text-white">Forgot Password</CardTitle>
                    <CardDescription className="text-slate-400">
                      Enter your email address and we'll send you a link to reset your password
                    </CardDescription>
                  </CardHeader>
                  <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
                      {error && (
                        <Alert variant="destructive">
                          <AlertDescription>{error}</AlertDescription>
                        </Alert>
                      )}

                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-white">
                          Email Address
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                          placeholder="Enter your email"
                          required
                        />
                      </div>
                    </CardContent>

                    <CardFooter className="flex flex-col space-y-4">
                      <Button
                        type="submit"
                        className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Sending...
                          </>
                        ) : (
                          <>
                            <Mail className="mr-2 h-4 w-4" />
                            Send Reset Link
                          </>
                        )}
                      </Button>

                      <Link
                        href="/login"
                        className="flex items-center text-sm text-cyan-400 hover:text-cyan-300"
                      >
                        <ArrowLeft className="mr-1 h-3 w-3" />
                        Back to login
                      </Link>
                    </CardFooter>
                  </form>
                </>
              ) : (
                <>
                  <CardHeader>
                    <CardTitle className="text-white">Check Your Email</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-lg p-4">
                      <p className="text-slate-300 text-sm">
                        We've sent password reset instructions to:
                      </p>
                      <p className="text-white font-medium mt-1">{email}</p>
                    </div>
                    <p className="text-slate-400 text-sm">
                      If you don't receive an email within 5 minutes, check your spam folder or try again.
                    </p>
                  </CardContent>
                  <CardFooter className="flex flex-col space-y-4">
                    <Button
                      onClick={() => {
                        setIsSubmitted(false)
                        setEmail("")
                      }}
                      variant="outline"
                      className="w-full border-slate-600 text-slate-300 hover:text-white hover:bg-slate-700"
                    >
                      Try Another Email
                    </Button>
                    <Link
                      href="/login"
                      className="flex items-center justify-center text-sm text-cyan-400 hover:text-cyan-300"
                    >
                      <ArrowLeft className="mr-1 h-3 w-3" />
                      Back to login
                    </Link>
                  </CardFooter>
                </>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}