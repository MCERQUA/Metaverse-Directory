"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Users, Star, Play, Bookmark } from "lucide-react"
import { ScenePreview } from "@/components/three/scene-preview"

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
  const [show3D, setShow3D] = useState(false)

  const getSceneType = (category: string) => {
    const categoryMap: { [key: string]: "gaming" | "art" | "social" | "educational" | "business" | "other" } = {
      Gaming: "gaming",
      Art: "art",
      Social: "social",
      Educational: "educational",
      Business: "business",
    }
    return categoryMap[category] || "other"
  }

  return (
    <div
      className="netflix-card group relative cursor-pointer"
      onMouseEnter={() => {
        setIsHovered(true)
        setTimeout(() => setShow3D(true), 300)
      }}
      onMouseLeave={() => {
        setIsHovered(false)
        setShow3D(false)
      }}
    >
      <div className="aspect-video relative overflow-hidden bg-gray-900 rounded-xl">
        {!imageLoaded && <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 animate-pulse" />}

        <img
          src={space.image || "/placeholder.svg"}
          alt={space.name}
          className={`w-full h-full object-cover transition-all duration-300 ${
            imageLoaded ? "opacity-100" : "opacity-0"
          } ${show3D ? "opacity-30" : "group-hover:scale-110"}`}
          loading={priority ? "eager" : "lazy"}
          onLoad={() => setImageLoaded(true)}
        />

        {show3D && (
          <div className="absolute inset-0 z-10">
            <ScenePreview
              spaceType={getSceneType(space.category)}
              className="w-full h-full"
              autoRotate={true}
              interactive={false}
            />
          </div>
        )}

        {space.featured && (
          <div className="absolute top-3 left-3 z-20">
            <Badge className="bg-primary text-black text-xs font-medium rounded-full">Featured</Badge>
          </div>
        )}

        <div className="absolute top-3 right-3 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              setIsBookmarked(!isBookmarked)
            }}
            className={`bg-black/50 backdrop-blur-sm hover:bg-black/70 transition-all rounded-full ${
              isBookmarked ? "text-primary" : "text-white"
            }`}
          >
            <Bookmark className={`h-4 w-4 ${isBookmarked ? "fill-current" : ""}`} />
          </Button>
        </div>

        <div className="absolute inset-0 gradient-overlay" />

        {isHovered && (
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center z-30">
            <Button size="sm" className="gap-2 bg-white text-black hover:bg-gray-200 rounded-full">
              <Play className="h-4 w-4" />
              {show3D ? "Enter 3D" : "Play"}
            </Button>
          </div>
        )}

        <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
          <div className="flex items-center justify-between mb-2">
            <Badge variant="secondary" className="text-xs bg-gray-800/80 text-gray-300 rounded-full">
              {space.category}
            </Badge>
            <div className="flex items-center gap-1 text-yellow-400">
              <Star className="h-3 w-3 fill-current" />
              <span className="text-xs font-medium">{space.rating}</span>
            </div>
          </div>

          <h3 className="font-semibold text-white text-sm mb-1 group-hover:text-primary transition-colors">
            {space.name}
          </h3>

          <p className="text-xs text-gray-400 mb-2">by {space.creator}</p>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-gray-400">
              <Users className="h-3 w-3" />
              <span className="text-xs">{space.visitors.toLocaleString()}</span>
            </div>
            {show3D && <div className="text-xs text-primary font-medium">3D Active</div>}
          </div>
        </div>
      </div>
    </div>
  )
}
