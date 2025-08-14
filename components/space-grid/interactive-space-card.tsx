"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, Users, ExternalLink } from "lucide-react"
import dynamic from "next/dynamic"

const PanoramaViewer = dynamic(() => import("@/components/panorama-viewer"), {
  ssr: false,
  loading: () => <div className="absolute inset-0 bg-gray-900 animate-pulse" />
})

interface InteractiveSpaceCardProps {
  id: number
  name: string
  creator: string
  category: string
  visitors: number
  rating: number
  image360?: string
  thumbnail: string
  liveUrl?: string
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

  return (
    <Card className="relative overflow-hidden bg-gray-900/50 border-gray-700 hover:border-gray-600 transition-all group">
      {/* Main Card Content */}
      <div className="aspect-video relative">
        {isRealSpace && image360 ? (
          <PanoramaViewer
            id={`card-panorama-${id}`}
            imageUrl={image360}
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
            style={{ backgroundImage: thumbnail ? `url(${thumbnail})` : 'none' }}
          />
        )}
        
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

        {liveUrl && (
          <Button
            asChild
            className="w-full bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-sm transition-all"
          >
            <a href={liveUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="mr-2 h-4 w-4" />
              Enter Space
            </a>
          </Button>
        )}
      </div>
    </Card>
  )
}