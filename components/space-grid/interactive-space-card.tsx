"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, Users, ExternalLink, Move3D, X } from "lucide-react"
import { CSSPanoramaViewer } from "@/components/three/css-panorama-viewer"

interface InteractiveSpaceCardProps {
  id: number
  name: string
  creator: string
  category: string
  visitors: number
  rating: number
  image360: string
  thumbnail: string
  liveUrl: string
  featured?: boolean
  isRealSpace?: boolean
}

export function InteractiveSpaceCard({
  id,
  name,
  creator,
  category,
  visitors,
  rating,
  image360,
  thumbnail,
  liveUrl,
  featured,
  isRealSpace = false,
}: InteractiveSpaceCardProps) {
  const [isPreviewMode, setIsPreviewMode] = useState(false)

  const togglePreview = () => {
    setIsPreviewMode(!isPreviewMode)
  }

  return (
    <Card className="relative overflow-hidden bg-gray-900/50 border-gray-700 hover:border-gray-600 transition-all group">
      {/* 360 Preview Overlay */}
      {isPreviewMode && (
        <div className="absolute inset-0 z-20 bg-black">
          <CSSPanoramaViewer imageUrl={image360} className="absolute inset-0" autoRotate={false} />
          
          <div className="absolute top-4 left-4 right-4 flex justify-between items-start pointer-events-none z-30">
            <div className="bg-black/70 backdrop-blur-sm rounded-lg px-3 py-2">
              <p className="text-white text-sm font-medium">360° Interactive View</p>
              <p className="text-gray-300 text-xs">Click and drag to look around</p>
            </div>
            <Button
              onClick={togglePreview}
              size="sm"
              className="pointer-events-auto bg-black/70 hover:bg-black/90 text-white border-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="absolute bottom-4 left-4 right-4 pointer-events-none z-30">
            <Button
              asChild
              className="pointer-events-auto w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0"
            >
              <a href={liveUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-2 h-4 w-4" />
                Enter Space
              </a>
            </Button>
          </div>
        </div>
      )}

      {/* Main Card Content */}
      <div className="aspect-video relative">
        <img
          src={thumbnail}
          alt={name}
          className="w-full h-full object-cover"
        />
        
        {/* Live Badge for Real Spaces */}
        {isRealSpace && (
          <div className="absolute top-2 left-2">
            <Badge className="bg-green-600 text-white border-0">
              <span className="animate-pulse mr-1">●</span> LIVE
            </Badge>
          </div>
        )}

        {/* Featured Badge */}
        {featured && (
          <div className="absolute top-2 right-2">
            <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0">
              Featured
            </Badge>
          </div>
        )}

        {/* 360 Preview Button */}
        <Button
          onClick={togglePreview}
          className="absolute bottom-2 right-2 bg-black/70 hover:bg-black/90 text-white border-0 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
          size="sm"
        >
          <Move3D className="mr-1 h-3 w-3" />
          360° View
        </Button>
      </div>

      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-semibold text-white text-lg">{name}</h3>
            <p className="text-sm text-gray-400">by {creator}</p>
          </div>
          <Badge variant="secondary" className="bg-gray-700 text-gray-300">
            {category}
          </Badge>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-400 mb-3">
          <div className="flex items-center gap-3">
            <span className="flex items-center">
              <Users className="h-3 w-3 mr-1" />
              {visitors.toLocaleString()}
            </span>
            <span className="flex items-center">
              <Star className="h-3 w-3 mr-1 text-yellow-500" />
              {rating}
            </span>
          </div>
        </div>

        <Button
          asChild
          className="w-full bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-sm transition-all"
        >
          <a href={liveUrl} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="mr-2 h-4 w-4" />
            Enter Space
          </a>
        </Button>
      </div>
    </Card>
  )
}