"use client"

import { useRef, useState } from "react"
import { SpaceCard } from "./space-card"
import { InteractiveSpaceCard } from "./interactive-space-card"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Space {
  id: number
  name: string
  creator: string
  category: string
  visitors: number
  rating: number
  image: string
  image360?: string
  liveUrl?: string
  featured?: boolean
  isRealSpace?: boolean
}

interface EnhancedCategoryRowProps {
  title: string
  spaces: Space[]
  priority?: boolean
}

export function EnhancedCategoryRow({ title, spaces, priority = false }: EnhancedCategoryRowProps) {
  const rowRef = useRef<HTMLDivElement>(null)
  const [showLeftArrow, setShowLeftArrow] = useState(false)
  const [showRightArrow, setShowRightArrow] = useState(true)

  const scroll = (direction: "left" | "right") => {
    if (rowRef.current) {
      const scrollAmount = 320
      const currentScroll = rowRef.current.scrollLeft
      const targetScroll = direction === "left" ? currentScroll - scrollAmount : currentScroll + scrollAmount

      rowRef.current.scrollTo({
        left: targetScroll,
        behavior: "smooth",
      })
    }
  }

  const handleScroll = () => {
    if (rowRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = rowRef.current
      setShowLeftArrow(scrollLeft > 0)
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10)
    }
  }

  if (spaces.length === 0) return null

  return (
    <div className="relative group">
      <h2 className="text-2xl font-bold text-white mb-4">{title}</h2>

      {/* Left Arrow */}
      {showLeftArrow && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            onClick={() => scroll("left")}
            variant="ghost"
            size="icon"
            className="h-24 w-12 rounded-r-lg bg-gradient-to-r from-black/80 to-transparent hover:from-black/90 text-white border-0"
          >
            <ChevronLeft className="h-8 w-8" />
          </Button>
        </div>
      )}

      {/* Right Arrow */}
      {showRightArrow && (
        <div className="absolute right-0 top-1/2 -translate-y-1/2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            onClick={() => scroll("right")}
            variant="ghost"
            size="icon"
            className="h-24 w-12 rounded-l-lg bg-gradient-to-l from-black/80 to-transparent hover:from-black/90 text-white border-0"
          >
            <ChevronRight className="h-8 w-8" />
          </Button>
        </div>
      )}

      {/* Spaces Row */}
      <div
        ref={rowRef}
        onScroll={handleScroll}
        className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 scroll-smooth"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {spaces.map((space) => (
          <div key={space.id} className="flex-none w-80">
            {space.isRealSpace && space.image360 && space.liveUrl ? (
              <InteractiveSpaceCard
                id={space.id}
                name={space.name}
                creator={space.creator}
                category={space.category}
                visitors={space.visitors}
                rating={space.rating}
                image360={space.image360}
                thumbnail={space.image}
                liveUrl={space.liveUrl}
                featured={space.featured}
                isRealSpace={space.isRealSpace}
              />
            ) : (
              <SpaceCard
                space={space}
                priority={priority}
              />
            )}
          </div>
        ))}
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  )
}