import { Header } from "@/components/navigation/header"
import { HeroCarousel } from "@/components/hero-carousel/hero-carousel"
import { SpaceGrid } from "@/components/space-grid/space-grid"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroCarousel />
        <SpaceGrid />
      </main>
    </div>
  )
}
