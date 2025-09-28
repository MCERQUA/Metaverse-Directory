"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, Users, ExternalLink, Eye } from "lucide-react"
import { useState } from "react"
import dynamic from "next/dynamic"

const OptimizedPanoramaViewer = dynamic(() => import("@/components/panorama-viewer-optimized"), {
  ssr: false,
  loading: () => <div className="absolute inset-0 bg-gray-900 animate-pulse" />
})

interface InteractiveSpaceCardOptimizedProps {
  id: number
  name: string
  creator: string
  category: string
  visitors: number
  rating: number
  image360?: string | null
  thumbnail: string
  liveUrl?: string
  featured?: boolean
  isRealSpace?: boolean
}

export function InteractiveSpaceCardOptimized({
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
}: InteractiveSpaceCardOptimizedProps) {
  const [isHovered, setIsHovered] = useState(false);
  const hasPanorama = !!image360;

  return (
    <Card 
      className="relative overflow-hidden bg-gray-900/50 border-gray-700 hover:border-gray-600 transition-all group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Main Card Content */}
      <div className="aspect-video relative">
        {/* Always show static thumbnail by default */}
        <div
          className={`absolute inset-0 bg-cover bg-center transition-all duration-300 ${
            isHovered && hasPanorama ? 'opacity-0' : 'opacity-100'
          } ${!isHovered ? 'scale-100' : 'scale-105'}`}
          style={{ backgroundImage: thumbnail ? `url(${thumbnail})` : 'none' }}
        />

        {/* Only render panorama on hover if available */}
        {hasPanorama && isHovered && (
          <>
            <OptimizedPanoramaViewer
              id={`card-panorama-${name.replace(/[^a-zA-Z0-9]/g, '-')}-${id}`}
              imageUrl={image360}
              placeholder={thumbnail}
              autoRotate={-3} // Always animate when shown
              showControls={false}
              initialPitch={10}
              initialYaw={180}
              height="100%"
              className="absolute inset-0"
              lazy={false} // Load immediately when hovering
            />
          </>
        )}

        {/* 360° Indicator - always visible for panorama-enabled cards */}
        {hasPanorama && (
          <div className={`absolute bottom-2 right-2 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1 transition-all duration-300 ${
            isHovered ? 'scale-110 bg-black/80' : 'scale-100'
          }`}>
            <Eye className="h-3 w-3 text-white" />
            <span className="text-[10px] text-white font-medium">360°</span>
          </div>
        )}
        
        {/* Gradient Overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Live Badge for Real Spaces */}
        {isRealSpace && (
          <div className="absolute top-2 left-2 z-10">
            <Badge className="bg-green-600 text-white border-0 shadow-lg">
              <span className="animate-pulse mr-1">●</span> LIVE
            </Badge>
          </div>
        )}

        {/* Featured Badge */}
        {featured && (
          <div className="absolute top-2 right-2 z-10">
            <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0 shadow-lg">
              Featured
            </Badge>
          </div>
        )}
        
        {/* Quick Stats Overlay (shown on hover) */}
        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="flex items-center gap-3 text-white text-xs">
            <span className="flex items-center">
              <Users className="h-3 w-3 mr-1" />
              {visitors.toLocaleString()}
            </span>
            <span className="flex items-center">
              <Star className="h-3 w-3 mr-1 text-yellow-500" />
              {rating}
            </span>
            {hasPanorama && (
              <span className="ml-auto text-[10px] bg-white/20 px-2 py-0.5 rounded-full">
                Interactive 360°
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-white text-lg truncate">{name}</h3>
            <p className="text-sm text-gray-400 truncate">by {creator}</p>
          </div>
          <Badge variant="secondary" className="bg-gray-700 text-gray-300 ml-2 flex-shrink-0">
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
          size="sm"
          className="w-full bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-sm transition-all duration-200 group"
        >
          <a href={liveUrl} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
            Enter Space
          </a>
        </Button>
      </div>
    </Card>
  )
}