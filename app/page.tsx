import { Header } from "@/components/navigation/header"
import { SearchBar } from "@/components/navigation/search-bar"
import { HeroCarousel } from "@/components/hero-carousel/hero-carousel"
import { SpaceGrid } from "@/components/space-grid/space-grid"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background pt-14">
      <Header />
      <main className="space-y-0">
        <SearchBar />
        <div className="-mt-2">
          <HeroCarousel />
        </div>
        <div className="-mt-4">
          <SpaceGrid />
        </div>
      </main>
    </div>
  )
}
