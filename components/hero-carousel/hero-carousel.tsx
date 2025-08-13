"use client"

import type React from "react"

import { useState, useEffect, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Play, Users, ChevronLeft, ChevronRight, Pause } from "lucide-react"

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
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [isPaused, setIsPaused] = useState(false)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const carouselRef = useRef<HTMLDivElement>(null)

  const startAutoPlay = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    if (isAutoPlaying && !isPaused) {
      intervalRef.current = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % featuredSpaces.length)
      }, 6000)
    }
  }, [isAutoPlaying, isPaused])

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

  const minSwipeDistance = 50

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return

    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance

    if (isLeftSwipe) {
      nextSlide()
    } else if (isRightSwipe) {
      prevSlide()
    }
  }

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % featuredSpaces.length)
  }, [])

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + featuredSpaces.length) % featuredSpaces.length)
  }, [])

  const goToSlide = useCallback((index: number) => {
    setCurrentSlide(index)
  }, [])

  const togglePlayPause = () => {
    setIsPaused(!isPaused)
  }

  const handleMouseEnter = () => {
    setIsAutoPlaying(false)
  }

  const handleMouseLeave = () => {
    setIsAutoPlaying(true)
  }

  const currentSpace = featuredSpaces[currentSlide]

  return (
    <section
      ref={carouselRef}
      className="relative h-[70vh] md:h-[80vh] overflow-hidden mt-16"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <div className="absolute inset-0">
        {featuredSpaces.map((space, index) => (
          <div
            key={space.id}
            className={`absolute inset-0 bg-cover bg-center transition-all duration-1000 ${
              index === currentSlide ? "opacity-100 scale-100" : "opacity-0 scale-105"
            }`}
            style={{ backgroundImage: `url(${space.image})` }}
          />
        ))}
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-transparent" />

      <div className="relative z-10 container mx-auto px-4 h-full flex items-end pb-8 md:pb-16">
        <div className="max-w-2xl">
          <div className="flex items-center gap-3 mb-4">
            <Badge variant="secondary" className="text-xs md:text-sm">
              {currentSpace.category}
            </Badge>
            <div className="flex items-center gap-2 text-gray-300">
              <Users className="h-4 w-4" />
              <span className="text-sm">{currentSpace.userCount.toLocaleString()} exploring</span>
            </div>
          </div>

          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-white leading-tight">{currentSpace.name}</h2>

          <p className="text-base md:text-lg text-gray-200 mb-4 md:mb-6 leading-relaxed line-clamp-3">
            {currentSpace.description}
          </p>

          <div className="flex flex-wrap gap-2 mb-4">
            {currentSpace.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 bg-white/10 backdrop-blur-sm rounded text-xs text-white border border-white/20"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="text-gray-300 text-sm mb-6">by {currentSpace.creator}</div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <Button size="lg" className="gap-2 glow-cyan hover:glow-cyan transition-all">
              <Play className="h-5 w-5" />
              Enter Space
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20"
            >
              Learn More
            </Button>
          </div>
        </div>
      </div>

      <div className="absolute bottom-4 md:bottom-8 right-4 md:right-8 flex items-center gap-2 md:gap-4">
        {/* Play/Pause Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={togglePlayPause}
          className="bg-black/20 backdrop-blur-sm border border-white/20 hover:bg-black/40 text-white"
        >
          {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
        </Button>

        {/* Previous Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={prevSlide}
          className="bg-black/20 backdrop-blur-sm border border-white/20 hover:bg-black/40 text-white"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {/* Slide Indicators */}
        <div className="flex gap-1 md:gap-2">
          {featuredSpaces.map((_, index) => (
            <button
              key={index}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentSlide ? "bg-primary w-6 md:w-8 glow-cyan" : "bg-white/50 w-2 hover:bg-white/70"
              }`}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Next Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={nextSlide}
          className="bg-black/20 backdrop-blur-sm border border-white/20 hover:bg-black/40 text-white"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="absolute top-4 right-4 bg-black/20 backdrop-blur-sm border border-white/20 rounded px-3 py-1 text-white text-sm">
        {currentSlide + 1} / {featuredSpaces.length}
      </div>

      <div
        className="sr-only"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft") prevSlide()
          if (e.key === "ArrowRight") nextSlide()
          if (e.key === " ") {
            e.preventDefault()
            togglePlayPause()
          }
        }}
      >
        Use arrow keys to navigate, space to pause/play
      </div>
    </section>
  )
}
