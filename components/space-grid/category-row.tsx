"use client"

import { useState } from "react"
import { SpaceCard } from "./space-card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

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

interface CategoryRowProps {
  title: string
  spaces: Space[]
  priority?: boolean
}

export function CategoryRow({ title, spaces, priority = false }: CategoryRowProps) {
  const [scrollPosition, setScrollPosition] = useState(0)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  if (spaces.length === 0) {
    return null
  }

  const handleScroll = (direction: "left" | "right") => {
    const container = document.getElementById(`row-${title.replace(/\s+/g, "-").toLowerCase()}`)
    if (!container) return

    const scrollAmount = window.innerWidth < 768 ? 160 : 320
    const newPosition = direction === "left" ? scrollPosition - scrollAmount : scrollPosition + scrollAmount

    container.scrollTo({
      left: newPosition,
      behavior: "smooth",
    })

    setScrollPosition(newPosition)
    setCanScrollLeft(newPosition > 0)
    setCanScrollRight(newPosition < container.scrollWidth - container.clientWidth - 10)
  }

  return (
    <section className="relative group">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-foreground">{title}</h2>
        {spaces.length > 6 && (
          <div className="hidden md:flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleScroll("left")}
              disabled={!canScrollLeft}
              className="bg-card/80 backdrop-blur-sm border border-border hover:bg-card"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleScroll("right")}
              disabled={!canScrollRight}
              className="bg-card/80 backdrop-blur-sm border border-border hover:bg-card"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      <div
        id={`row-${title.replace(/\s+/g, "-").toLowerCase()}`}
        className="flex gap-3 md:gap-4 overflow-x-auto scrollbar-hide pb-4 md:pb-0 px-1"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {spaces.map((space, index) => (
          <div key={space.id} className="flex-shrink-0 w-[calc(50vw-24px)] sm:w-44 md:w-72">
            <SpaceCard space={space} priority={priority && index < 3} />
          </div>
        ))}
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  )
}
