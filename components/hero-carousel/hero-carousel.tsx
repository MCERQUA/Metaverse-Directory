"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Play, Users } from "lucide-react"

// Mock data for featured spaces
const featuredSpaces = [
  {
    id: 1,
    name: "Neon City Racing",
    creator: "CyberDev Studios",
    category: "Gaming",
    description:
      "Experience high-speed racing through a cyberpunk metropolis with stunning neon visuals and realistic physics.",
    userCount: 1247,
    image: "/cyberpunk-racing-neon-city.png",
    tags: ["Racing", "Cyberpunk", "Multiplayer"],
  },
  {
    id: 2,
    name: "Virtual Art Gallery",
    creator: "ArtSpace Collective",
    category: "Art",
    description: "Explore contemporary digital art in an immersive 3D gallery space with interactive exhibitions.",
    userCount: 892,
    image: "/virtual-art-gallery.png",
    tags: ["Art", "Gallery", "Interactive"],
  },
  {
    id: 3,
    name: "Space Station Alpha",
    creator: "Cosmos Interactive",
    category: "Social",
    description: "Meet friends and explore the cosmos in this detailed space station with zero-gravity physics.",
    userCount: 2156,
    image: "/futuristic-space-station-interior.png",
    tags: ["Space", "Social", "Zero-G"],
  },
  {
    id: 4,
    name: "Ancient Rome VR",
    creator: "HistoryVR",
    category: "Educational",
    description: "Walk through the streets of ancient Rome and witness history come alive in stunning detail.",
    userCount: 1543,
    image: "/ancient-rome-colosseum-virtual.png",
    tags: ["History", "Educational", "Rome"],
  },
]

export function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const startAutoPlay = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    intervalRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featuredSpaces.length)
    }, 6000)
  }, [])

  const stopAutoPlay = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  useEffect(() => {
    startAutoPlay()
    return () => stopAutoPlay()
  }, [startAutoPlay, stopAutoPlay])

  const goToSlide = useCallback((index: number) => {
    setCurrentSlide(index)
  }, [])

  const currentSpace = featuredSpaces[currentSlide]

  return (
    <section
      className="relative h-[50vh] md:h-[60vh] overflow-hidden"
      onMouseEnter={stopAutoPlay}
      onMouseLeave={startAutoPlay}
    >
      <div className="absolute inset-0">
        {featuredSpaces.map((space, index) => (
          <div
            key={space.id}
            className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
            style={{ backgroundImage: `url(${space.image})` }}
          />
        ))}
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

      <div className="relative z-10 container mx-auto px-6 h-full flex items-end pb-8">
        <div className="max-w-2xl">
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 bg-primary/20 text-primary text-sm rounded-full border border-primary/30">
              {currentSpace.category}
            </span>
            <div className="flex items-center gap-2 text-gray-300">
              <Users className="h-4 w-4" />
              <span className="text-sm">{currentSpace.userCount.toLocaleString()} exploring</span>
            </div>
          </div>

          <h2 className="text-4xl md:text-6xl font-bold mb-6 text-white leading-tight">{currentSpace.name}</h2>

          <p className="text-lg text-gray-200 mb-8 leading-relaxed max-w-xl">{currentSpace.description}</p>

          <div className="flex items-center gap-4">
            <Button
              size="lg"
              className="gap-2 bg-white/90 text-black hover:bg-white/80 text-lg px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Play className="h-5 w-5" />
              Enter Space
            </Button>
          </div>
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2">
        {featuredSpaces.map((_, index) => (
          <button
            key={index}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === currentSlide ? "bg-primary w-8" : "bg-white/50 w-2 hover:bg-white/70"
            }`}
            onClick={() => goToSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  )
}
