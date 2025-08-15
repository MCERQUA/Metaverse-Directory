"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Checkbox } from "@/components/ui/checkbox"
import { Loader2, Eye, EyeOff } from "lucide-react"
import { submitNetlifyForm } from "@/lib/netlify-forms"

export function SignupFormNetlify() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    newsletter: false,
    terms: false,
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters")
      return
    }

    if (!formData.terms) {
      setError("You must agree to the terms and conditions")
      return
    }

    setIsLoading(true)

    try {
      // Submit to Netlify Forms
      await submitNetlifyForm({
        formName: "signup",
        data: formData,
        onSuccess: () => {
          // After successful form submission
          // Note: Actual user creation would need to be handled
          // via Netlify Functions or external auth service
          
          // For now, redirect to show form was submitted
          router.push("/dashboard")
        },
        onError: (error) => {
          setError("Failed to create account. Please try again.")
        }
      })
    } catch (err) {
      setError("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const updateFormData = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white">Create Account</CardTitle>
        <CardDescription className="text-slate-400">Join the metaverse community today</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit} data-netlify="true" name="signup">
        {/* Hidden fields for Netlify Forms */}
        <input type="hidden" name="form-name" value="signup" />
        
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="username" className="text-white">
              Username
            </Label>
            <Input
              id="username"
              name="username"
              type="text"
              value={formData.username}
              onChange={(e) => updateFormData("username", e.target.value)}
              className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
              placeholder="Choose a username"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-white">
              Email
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={(e) => updateFormData("email", e.target.value)}
              className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-white">
              Password
            </Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => updateFormData("password", e.target.value)}
                className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 pr-10"
                placeholder="Create a password"
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-slate-400" />
                ) : (
                  <Eye className="h-4 w-4 text-slate-400" />
                )}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-white">
              Confirm Password
            </Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={(e) => updateFormData("confirmPassword", e.target.value)}
                className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 pr-10"
                placeholder="Confirm your password"
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4 text-slate-400" />
                ) : (
                  <Eye className="h-4 w-4 text-slate-400" />
                )}
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="newsletter"
                name="newsletter"
                checked={formData.newsletter}
                onCheckedChange={(checked) => updateFormData("newsletter", checked as boolean)}
              />
              <Label htmlFor="newsletter" className="text-sm text-slate-300">
                Subscribe to newsletter for updates
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="terms"
                name="terms"
                checked={formData.terms}
                onCheckedChange={(checked) => updateFormData("terms", checked as boolean)}
              />
              <Label htmlFor="terms" className="text-sm text-slate-300">
                I agree to the{" "}
                <Link href="/terms" className="text-cyan-400 hover:text-cyan-300 underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-cyan-400 hover:text-cyan-300 underline">
                  Privacy Policy
                </Link>
              </Label>
            </div>
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
                Creating Account...
              </>
            ) : (
              "Create Account"
            )}
          </Button>

          <div className="text-center text-sm text-slate-400">
            Already have an account?{" "}
            <Link href="/login" className="text-cyan-400 hover:text-cyan-300 underline">
              Sign in
            </Link>
          </div>
        </CardFooter>
      </form>
    </Card>
  )
}