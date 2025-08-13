"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Users, Star, Play, Bookmark } from "lucide-react"

interface Space {
  id: number
  name: string
  creator: string
  category: string
  visitors: number
  rating: number
  image: string
  featured?: boolean
}

interface SpaceCardProps {
  space: Space
  priority?: boolean
}

export function SpaceCard({ space, priority = false }: SpaceCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)

  return (
    <div
      className="group relative bg-card rounded-lg overflow-hidden transition-smooth hover:scale-105 cursor-pointer border border-border/50 hover:border-primary/50"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="aspect-video relative overflow-hidden bg-muted">
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gradient-to-br from-muted via-muted/80 to-muted animate-pulse" />
        )}

        <img
          src={space.image || "/placeholder.svg"}
          alt={space.name}
          className={`w-full h-full object-cover transition-smooth group-hover:scale-110 ${
            imageLoaded ? "opacity-100" : "opacity-0"
          }`}
          loading={priority ? "eager" : "lazy"}
          onLoad={() => setImageLoaded(true)}
        />

        {space.featured && (
          <div className="absolute top-2 left-2">
            <Badge variant="secondary" className="bg-secondary/90 backdrop-blur-sm text-xs">
              Featured
            </Badge>
          </div>
        )}

        <div className="absolute top-2 right-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              setIsBookmarked(!isBookmarked)
            }}
            className={`bg-black/20 backdrop-blur-sm border border-white/20 hover:bg-black/40 transition-all ${
              isBookmarked ? "text-primary" : "text-white"
            }`}
          >
            <Bookmark className={`h-3 w-3 ${isBookmarked ? "fill-current" : ""}`} />
          </Button>
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

        {isHovered && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <Button size="sm" className="gap-2 glow-cyan">
              <Play className="h-4 w-4" />
              Enter
            </Button>
          </div>
        )}

        <div className="absolute bottom-3 left-3 right-3">
          <div className="flex items-center justify-between mb-2">
            <Badge variant="outline" className="text-xs bg-black/20 backdrop-blur-sm border-white/20 text-white">
              {space.category}
            </Badge>
            <div className="flex items-center gap-1 text-yellow-400">
              <Star className="h-3 w-3 fill-current" />
              <span className="text-xs text-white font-medium">{space.rating}</span>
            </div>
          </div>

          <h3 className="font-semibold text-white text-sm mb-1 line-clamp-1 group-hover:text-primary transition-colors">
            {space.name}
          </h3>

          <p className="text-xs text-gray-300 mb-2 line-clamp-1">by {space.creator}</p>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-gray-300">
              <Users className="h-3 w-3" />
              <span className="text-xs">{space.visitors.toLocaleString()}</span>
            </div>
            {isHovered && <div className="text-xs text-primary font-medium animate-fade-in">Click to explore</div>}
          </div>
        </div>
      </div>

      {isHovered && (
        <div className="absolute inset-0 bg-primary/5 border-2 border-primary rounded-lg glow-cyan pointer-events-none" />
      )}
    </div>
  )
}
