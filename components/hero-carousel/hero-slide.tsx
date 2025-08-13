"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Play, Users } from "lucide-react"

interface HeroSlideProps {
  space: {
    id: number
    name: string
    creator: string
    category: string
    description: string
    userCount: number
    image: string
    tags: string[]
  }
  isActive: boolean
}

export function HeroSlide({ space, isActive }: HeroSlideProps) {
  return (
    <div
      className={`absolute inset-0 transition-all duration-1000 ${
        isActive ? "opacity-100 scale-100" : "opacity-0 scale-105"
      }`}
    >
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${space.image})` }} />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-transparent" />

      <div className="relative z-10 container mx-auto px-4 h-full flex items-end pb-16">
        <div className="max-w-2xl">
          <div className="flex items-center gap-3 mb-4">
            <Badge variant="secondary">{space.category}</Badge>
            <div className="flex items-center gap-2 text-gray-300">
              <Users className="h-4 w-4" />
              <span className="text-sm">{space.userCount.toLocaleString()} exploring</span>
            </div>
          </div>

          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-white leading-tight">{space.name}</h2>

          <p className="text-base md:text-lg text-gray-200 mb-6 leading-relaxed">{space.description}</p>

          <div className="flex flex-wrap gap-2 mb-4">
            {space.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 bg-white/10 backdrop-blur-sm rounded text-xs text-white border border-white/20"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="text-gray-300 text-sm mb-6">by {space.creator}</div>

          <div className="flex items-center gap-4">
            <Button size="lg" className="gap-2 glow-cyan">
              <Play className="h-5 w-5" />
              Enter Space
            </Button>
            <Button variant="outline" size="lg" className="bg-white/10 backdrop-blur-sm border-white/20">
              Learn More
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
