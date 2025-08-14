"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Play, Users } from "lucide-react"
import dynamic from "next/dynamic"

const PanoramaViewer = dynamic(() => import("@/components/panorama-viewer"), {
  ssr: false,
  loading: () => <div className="absolute inset-0 bg-gray-900 animate-pulse" />
})

interface FeaturedSpace {
  id: number
  name: string
  creator: string
  category: string
  description: string
  userCount: number
  image: string
  tags: string[]
  isRealSpace?: boolean
  liveUrl?: string
}

// Mock data for featured spaces
const featuredSpaces: FeaturedSpace[] = [
  {
    id: 1001,
    name: "Mikes Room",
    creator: "MetaVerse Studios",
    category: "Social",
    description:
      "Step into a stunning 360° virtual lounge with ambient lighting, interactive elements, and immersive social experiences. Explore and connect in this live 3D space.",
    userCount: 15234,
    image: "/room1-360.jpg",
    tags: ["Live", "360°", "Social"],
    isRealSpace: true,
    liveUrl: "https://3d-mc.netlify.app/",
  },
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

  // Safety check for SSR
  if (!currentSpace) {
    return null
  }

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
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
            }`}
          >
            {space.isRealSpace && space.image === "/room1-360.jpg" ? (
              <PanoramaViewer
                id={`hero-panorama-${space.id}`}
                imageUrl={space.image}
                autoRotate={-2}
                showControls={false}
                initialPitch={10}
                initialYaw={180}
                height="100%"
                className="absolute inset-0"
              />
            ) : (
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: space?.image ? `url(${space.image})` : 'none' }}
              />
            )}
          </div>
        ))}
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

      <div className="relative z-10 container mx-auto px-6 h-full flex items-end pb-8">
        <div className="max-w-2xl">
          <div className="flex items-center gap-3 mb-4">
            {currentSpace.isRealSpace && (
              <span className="px-3 py-1 bg-green-600/30 text-green-400 text-sm rounded-full border border-green-500/50 animate-pulse">
                LIVE
              </span>
            )}
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
            {currentSpace.isRealSpace && currentSpace.liveUrl ? (
              <Button
                asChild
                size="lg"
                className="gap-2 bg-white/90 text-black hover:bg-white/80 text-lg px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <a href={currentSpace.liveUrl} target="_blank" rel="noopener noreferrer">
                  <Play className="h-5 w-5" />
                  Enter Space
                </a>
              </Button>
            ) : (
              <Button
                size="lg"
                className="gap-2 bg-white/90 text-black hover:bg-white/80 text-lg px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <Play className="h-5 w-5" />
                Enter Space
              </Button>
            )}
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
