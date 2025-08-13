"use client"

import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Play, Pause } from "lucide-react"

interface CarouselControlsProps {
  currentSlide: number
  totalSlides: number
  isPaused: boolean
  onPrevious: () => void
  onNext: () => void
  onGoToSlide: (index: number) => void
  onTogglePlayPause: () => void
}

export function CarouselControls({
  currentSlide,
  totalSlides,
  isPaused,
  onPrevious,
  onNext,
  onGoToSlide,
  onTogglePlayPause,
}: CarouselControlsProps) {
  return (
    <div className="absolute bottom-4 md:bottom-8 right-4 md:right-8 flex items-center gap-2 md:gap-4">
      {/* Play/Pause Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={onTogglePlayPause}
        className="bg-black/20 backdrop-blur-sm border border-white/20 hover:bg-black/40 text-white"
        aria-label={isPaused ? "Play slideshow" : "Pause slideshow"}
      >
        {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
      </Button>

      {/* Previous Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={onPrevious}
        className="bg-black/20 backdrop-blur-sm border border-white/20 hover:bg-black/40 text-white"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {/* Slide Indicators */}
      <div className="flex gap-1 md:gap-2" role="tablist" aria-label="Slide navigation">
        {Array.from({ length: totalSlides }).map((_, index) => (
          <button
            key={index}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === currentSlide ? "bg-primary w-6 md:w-8 glow-cyan" : "bg-white/50 w-2 hover:bg-white/70"
            }`}
            onClick={() => onGoToSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
            role="tab"
            aria-selected={index === currentSlide}
          />
        ))}
      </div>

      {/* Next Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={onNext}
        className="bg-black/20 backdrop-blur-sm border border-white/20 hover:bg-black/40 text-white"
        aria-label="Next slide"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  )
}
