"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Upload, AlertCircle, Loader2 } from "lucide-react"

interface FormData {
  spaceName: string
  creatorName: string
  email: string
  spaceUrl: string
  category: string
  description: string
  thumbnailImage: File | null
  featuredRequest: boolean
  featuredExplanation: string
  termsAgreement: boolean
}

interface FormErrors {
  [key: string]: string
}

export function SubmissionForm() {
  const [formData, setFormData] = useState<FormData>({
    spaceName: "",
    creatorName: "",
    email: "",
    spaceUrl: "",
    category: "",
    description: "",
    thumbnailImage: null,
    featuredRequest: false,
    featuredExplanation: "",
    termsAgreement: false,
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState("")

  const categories = ["Gaming", "Social", "Educational", "Art", "Business", "Other"]

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    // Required field validations
    if (!formData.spaceName.trim()) {
      newErrors.spaceName = "Space name is required"
    } else if (formData.spaceName.length > 50) {
      newErrors.spaceName = "Space name must be 50 characters or less"
    }

    if (!formData.creatorName.trim()) {
      newErrors.creatorName = "Creator name is required"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    if (!formData.spaceUrl.trim()) {
      newErrors.spaceUrl = "Space URL is required"
    } else {
      try {
        new URL(formData.spaceUrl)
      } catch {
        newErrors.spaceUrl = "Please enter a valid URL"
      }
    }

    if (!formData.category) {
      newErrors.category = "Please select a category"
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required"
    } else if (formData.description.length > 500) {
      newErrors.description = "Description must be 500 characters or less"
    }

    if (formData.thumbnailImage && formData.thumbnailImage.size > 2 * 1024 * 1024) {
      newErrors.thumbnailImage = "Image must be smaller than 2MB"
    }

    if (formData.featuredRequest && !formData.featuredExplanation.trim()) {
      newErrors.featuredExplanation = "Please explain why your space should be featured"
    }

    if (!formData.termsAgreement) {
      newErrors.termsAgreement = "You must agree to the terms and conditions"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitError("")

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      const formDataToSubmit = new FormData()
      formDataToSubmit.append("form-name", "space-submission")
      formDataToSubmit.append("spaceName", formData.spaceName)
      formDataToSubmit.append("creatorName", formData.creatorName)
      formDataToSubmit.append("email", formData.email)
      formDataToSubmit.append("spaceUrl", formData.spaceUrl)
      formDataToSubmit.append("category", formData.category)
      formDataToSubmit.append("description", formData.description)
      formDataToSubmit.append("featuredRequest", formData.featuredRequest.toString())
      formDataToSubmit.append("featuredExplanation", formData.featuredExplanation)
      formDataToSubmit.append("termsAgreement", formData.termsAgreement.toString())

      if (formData.thumbnailImage) {
        formDataToSubmit.append("thumbnailImage", formData.thumbnailImage)
      }

      const response = await fetch("/", {
        method: "POST",
        body: formDataToSubmit,
      })

      if (response.ok) {
        window.location.href = "/submit/success"
      } else {
        throw new Error("Submission failed")
      }
    } catch (error) {
      setSubmitError("There was an error submitting your form. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setFormData({ ...formData, thumbnailImage: file })
  }

  return (
    <Card className="border-border/50">
      <CardHeader>
        <CardTitle>Space Details</CardTitle>
        <CardDescription>
          Fill out the information below to submit your virtual space for review. Fields marked with * are required.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} data-netlify="true" name="space-submission" className="space-y-6">
          {/* Netlify honeypot field */}
          <input type="hidden" name="form-name" value="space-submission" />
          <div style={{ display: "none" }}>
            <label>
              Don't fill this out if you're human: <input name="bot-field" />
            </label>
          </div>

          {submitError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{submitError}</AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="spaceName">
                Space Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="spaceName"
                name="spaceName"
                value={formData.spaceName}
                onChange={(e) => setFormData({ ...formData, spaceName: e.target.value })}
                placeholder="Enter your space name"
                maxLength={50}
                className={errors.spaceName ? "border-destructive" : ""}
              />
              {errors.spaceName && <p className="text-sm text-destructive">{errors.spaceName}</p>}
              <p className="text-xs text-muted-foreground">{formData.spaceName.length}/50 characters</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="creatorName">
                Creator Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="creatorName"
                name="creatorName"
                value={formData.creatorName}
                onChange={(e) => setFormData({ ...formData, creatorName: e.target.value })}
                placeholder="Your name or studio name"
                className={errors.creatorName ? "border-destructive" : ""}
              />
              {errors.creatorName && <p className="text-sm text-destructive">{errors.creatorName}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="email">
                Email <span className="text-destructive">*</span>
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="your@email.com"
                className={errors.email ? "border-destructive" : ""}
              />
              {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">
                Category <span className="text-destructive">*</span>
              </Label>
              <Select
                name="category"
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger className={errors.category ? "border-destructive" : ""}>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && <p className="text-sm text-destructive">{errors.category}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="spaceUrl">
              Space URL <span className="text-destructive">*</span>
            </Label>
            <Input
              id="spaceUrl"
              name="spaceUrl"
              type="url"
              value={formData.spaceUrl}
              onChange={(e) => setFormData({ ...formData, spaceUrl: e.target.value })}
              placeholder="https://your-space-url.com"
              className={errors.spaceUrl ? "border-destructive" : ""}
            />
            {errors.spaceUrl && <p className="text-sm text-destructive">{errors.spaceUrl}</p>}
            <p className="text-xs text-muted-foreground">
              Link to your virtual space (supports VRChat, Horizon Worlds, Mozilla Hubs, and more)
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">
              Description <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe your virtual space, what makes it special, and what visitors can expect..."
              maxLength={500}
              rows={4}
              className={errors.description ? "border-destructive" : ""}
            />
            {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
            <p className="text-xs text-muted-foreground">{formData.description.length}/500 characters</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="thumbnailImage">Thumbnail Image</Label>
            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
              <input
                id="thumbnailImage"
                name="thumbnailImage"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileChange}
                className="hidden"
              />
              <label htmlFor="thumbnailImage" className="cursor-pointer">
                <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground mb-1">
                  {formData.thumbnailImage ? formData.thumbnailImage.name : "Click to upload thumbnail image"}
                </p>
                <p className="text-xs text-muted-foreground">JPG, PNG, or WebP • Max 2MB</p>
              </label>
            </div>
            {errors.thumbnailImage && <p className="text-sm text-destructive">{errors.thumbnailImage}</p>}
          </div>

          <div className="space-y-4 border border-border rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="featuredRequest"
                name="featuredRequest"
                checked={formData.featuredRequest}
                onCheckedChange={(checked) => setFormData({ ...formData, featuredRequest: checked as boolean })}
              />
              <Label htmlFor="featuredRequest" className="text-sm font-medium">
                Request to be featured
              </Label>
            </div>

            {formData.featuredRequest && (
              <div className="space-y-2">
                <Label htmlFor="featuredExplanation" className="text-sm">
                  Why should your space be featured? <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="featuredExplanation"
                  name="featuredExplanation"
                  value={formData.featuredExplanation}
                  onChange={(e) => setFormData({ ...formData, featuredExplanation: e.target.value })}
                  placeholder="Tell us what makes your space unique and worthy of featuring..."
                  rows={3}
                  className={errors.featuredExplanation ? "border-destructive" : ""}
                />
                {errors.featuredExplanation && <p className="text-sm text-destructive">{errors.featuredExplanation}</p>}
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex items-start space-x-2">
              <Checkbox
                id="termsAgreement"
                name="termsAgreement"
                checked={formData.termsAgreement}
                onCheckedChange={(checked) => setFormData({ ...formData, termsAgreement: checked as boolean })}
                className={errors.termsAgreement ? "border-destructive" : ""}
              />
              <Label htmlFor="termsAgreement" className="text-sm leading-relaxed">
                I agree to the{" "}
                <a href="#" className="text-primary hover:underline">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="text-primary hover:underline">
                  Privacy Policy
                </a>
                , and confirm that I have the rights to submit this content. <span className="text-destructive">*</span>
              </Label>
            </div>
            {errors.termsAgreement && <p className="text-sm text-destructive">{errors.termsAgreement}</p>}
          </div>

          <Button type="submit" size="lg" className="w-full gap-2" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit Space for Review"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
