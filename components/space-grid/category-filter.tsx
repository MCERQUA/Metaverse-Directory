"use client"

import { Button } from "@/components/ui/button"

interface CategoryFilterProps {
  categories: string[]
  selectedCategory: string
  onCategoryChange: (category: string) => void
}

export function CategoryFilter({ categories, selectedCategory, onCategoryChange }: CategoryFilterProps) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-hide">
      {categories.map((category) => (
        <Button
          key={category}
          variant={selectedCategory === category ? "default" : "outline"}
          size="sm"
          onClick={() => onCategoryChange(category)}
          className={`flex-shrink-0 transition-all ${
            selectedCategory === category
              ? "bg-primary text-primary-foreground glow-cyan"
              : "bg-transparent border-border hover:border-primary/50 hover:text-primary"
          }`}
        >
          {category}
        </Button>
      ))}

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  )
}
