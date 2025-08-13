import { Button } from "@/components/ui/button"
import { CheckCircle, Home, Plus } from "lucide-react"
import Link from "next/link"

export const metadata = {
  title: "Submission Successful - MetaVerse Discovery",
  description: "Your virtual space has been successfully submitted for review.",
}

export default function SubmissionSuccessPage() {
  return (
    <div className="min-h-screen bg-background pt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-8">
            <CheckCircle className="h-20 w-20 text-primary mx-auto mb-6 glow-cyan" />
            <h1 className="text-4xl font-bold mb-4 text-foreground">Submission Successful!</h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Thank you for submitting your virtual space! Our team will review your submission within 2-3 business
              days. You'll receive an email notification once your space is approved and live on the platform.
            </p>
          </div>

          <div className="bg-card border border-border rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4 text-card-foreground">What happens next?</h2>
            <div className="space-y-3 text-left">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 bg-primary rounded-full" />
                </div>
                <p className="text-sm text-muted-foreground">
                  Our moderation team reviews your submission for quality and community guidelines
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 bg-primary rounded-full" />
                </div>
                <p className="text-sm text-muted-foreground">
                  If approved, your space goes live and becomes discoverable by our community
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 bg-primary rounded-full" />
                </div>
                <p className="text-sm text-muted-foreground">
                  You'll receive analytics and feedback from visitors exploring your space
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="gap-2">
              <Link href="/">
                <Home className="h-4 w-4" />
                Back to Home
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="gap-2 bg-transparent">
              <Link href="/submit">
                <Plus className="h-4 w-4" />
                Submit Another Space
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
