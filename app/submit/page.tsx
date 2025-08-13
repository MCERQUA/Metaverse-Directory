import { SubmissionForm } from "@/components/forms/submission-form"

export const metadata = {
  title: "Submit Your Space - MetaVerse Discovery",
  description:
    "Share your virtual space with the metaverse community. Submit your 3D world for others to discover and explore.",
}

export default function SubmitPage() {
  return (
    <div className="min-h-screen bg-background pt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Submit Your Virtual Space
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Share your amazing virtual world with our community. Whether it's a game, social space, educational
              experience, or artistic creation, we'd love to feature it on our platform.
            </p>
          </div>

          <SubmissionForm />
        </div>
      </div>
    </div>
  )
}
