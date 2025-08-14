"use client"

import { useState } from "react"
import { CategoryRow } from "./category-row"
import { EnhancedCategoryRow } from "./enhanced-category-row"
import { GridSkeleton } from "./grid-skeleton"
import { CategoryFilter } from "./category-filter"

// Real spaces data
const realSpaces = [
  {
    id: 1001,
    name: "Mikes Room",
    creator: "MetaVerse Studios",
    category: "Social",
    visitors: 15234,
    rating: 4.9,
    image: "/room1-360.jpg",
    image360: "/room1-360.jpg",
    liveUrl: "https://3d-mc.netlify.app/",
    featured: true,
    isRealSpace: true,
  },
  {
    id: 1002,
    name: "Pieter.com/3d",
    creator: "@levelsio",
    category: "Art",
    visitors: 8976,
    rating: 4.8,
    image: "/pieter.jpg",
    image360: null,
    liveUrl: "https://pieter.com/3d",
    featured: true,
    isRealSpace: true,
  },
]

// Mock data for different categories
const mockSpaces = {
  trending: [
    ...realSpaces,
    {
      id: 1,
      name: "Cyber Arena",
      creator: "NeonGames",
      category: "Gaming",
      visitors: 3421,
      rating: 4.8,
      image: "/placeholder-b9erw.png",
      featured: true,
    },
    {
      id: 2,
      name: "Zen Garden",
      creator: "Mindful Spaces",
      category: "Social",
      visitors: 1876,
      rating: 4.9,
      image: "/virtual-zen-garden.png",
      featured: false,
    },
    {
      id: 3,
      name: "Mars Colony",
      creator: "SpaceBuilders",
      category: "Educational",
      visitors: 2134,
      rating: 4.7,
      image: "/mars-colony-settlement.png",
      featured: true,
    },
    {
      id: 4,
      name: "Music Festival",
      creator: "SoundWave",
      category: "Social",
      visitors: 5672,
      rating: 4.6,
      image: "/virtual-music-festival-stage.png",
      featured: false,
    },
    {
      id: 5,
      name: "Ancient Rome",
      creator: "HistoryVR",
      category: "Educational",
      visitors: 1543,
      rating: 4.8,
      image: "/ancient-rome-colosseum-virtual.png",
      featured: true,
    },
    {
      id: 6,
      name: "Art Studio",
      creator: "CreativeSpace",
      category: "Art",
      visitors: 987,
      rating: 4.9,
      image: "/artist-studio-creative-workspace.png",
      featured: false,
    },
  ],
  newArrivals: [
    {
      id: 7,
      name: "Ocean Depths",
      creator: "AquaWorld",
      category: "Educational",
      visitors: 234,
      rating: 4.5,
      image: "/underwater-ocean-exploration.png",
      featured: false,
    },
    {
      id: 8,
      name: "Pixel Playground",
      creator: "RetroGames",
      category: "Gaming",
      visitors: 1876,
      rating: 4.7,
      image: "/retro-gaming-pixel-world.png",
      featured: true,
    },
    {
      id: 9,
      name: "Sky Castle",
      creator: "CloudArchitect",
      category: "Social",
      visitors: 654,
      rating: 4.6,
      image: "/floating-castle-fantasy.png",
      featured: false,
    },
    {
      id: 10,
      name: "Lab Experiment",
      creator: "ScienceHub",
      category: "Educational",
      visitors: 432,
      rating: 4.8,
      image: "/science-lab-vr.png",
      featured: false,
    },
    {
      id: 11,
      name: "Neon Nightclub",
      creator: "PartyVerse",
      category: "Social",
      visitors: 2341,
      rating: 4.5,
      image: "/neon-nightclub-virtual-space.png",
      featured: false,
    },
    {
      id: 12,
      name: "Medieval Castle",
      creator: "HistoryBuilders",
      category: "Educational",
      visitors: 876,
      rating: 4.7,
      image: "/medieval-castle-virtual-tour.png",
      featured: false,
    },
  ],
  popular: [
    realSpaces[0], // Just Mikes Room
    {
      id: 13,
      name: "Dragon's Lair",
      creator: "FantasyRealms",
      category: "Gaming",
      visitors: 8765,
      rating: 4.9,
      image: "/dragon-lair-fantasy-gaming.png",
      featured: true,
    },
    {
      id: 14,
      name: "Coffee Shop",
      creator: "CozySpaces",
      category: "Social",
      visitors: 3421,
      rating: 4.7,
      image: "/cozy-virtual-coffee-shop.png",
      featured: false,
    },
    {
      id: 15,
      name: "Space Museum",
      creator: "CosmosEd",
      category: "Educational",
      visitors: 2876,
      rating: 4.8,
      image: "/space-museum-virtual-exhibition.png",
      featured: true,
    },
    {
      id: 16,
      name: "Neon Club",
      creator: "NightLife",
      category: "Social",
      visitors: 4532,
      rating: 4.6,
      image: "/neon-club-virtual-party.png",
      featured: false,
    },
    {
      id: 17,
      name: "Racing Circuit",
      creator: "SpeedDemon",
      category: "Gaming",
      visitors: 6789,
      rating: 4.8,
      image: "/virtual-racing-circuit.png",
      featured: true,
    },
    {
      id: 18,
      name: "Art Workshop",
      creator: "CreativeMinds",
      category: "Art",
      visitors: 1234,
      rating: 4.9,
      image: "/art-workshop-creative-space.png",
      featured: false,
    },
  ],
  staffPicks: [
    {
      id: 19,
      name: "Quantum Lab",
      creator: "ScienceFuture",
      category: "Educational",
      visitors: 1567,
      rating: 4.9,
      image: "/quantum-physics-laboratory.png",
      featured: true,
    },
    {
      id: 20,
      name: "Mystic Forest",
      creator: "NatureVR",
      category: "Social",
      visitors: 2890,
      rating: 4.8,
      image: "/mystic-forest-virtual-nature.png",
      featured: true,
    },
    {
      id: 21,
      name: "Cyberpunk Arcade",
      creator: "RetroFuture",
      category: "Gaming",
      visitors: 4321,
      rating: 4.7,
      image: "/placeholder.svg?height=360&width=640",
      featured: true,
    },
  ],
  featuredCreators: [
    realSpaces[1], // Pieter.com/3d
  ],
}

const categories = ["All", "Gaming", "Social", "Educational", "Art", "Business"]

export function SpaceGrid() {
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [isLoading, setIsLoading] = useState(false)

  const filterSpacesByCategory = (spaces: any[]) => {
    if (selectedCategory === "All") return spaces
    return spaces.filter((space) => space.category === selectedCategory)
  }

  const handleCategoryChange = (category: string) => {
    setIsLoading(true)
    setSelectedCategory(category)
    // Simulate loading delay
    setTimeout(() => setIsLoading(false), 800)
  }

  if (isLoading) {
    return (
      <div className="px-6 py-12">
        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
        />
        <GridSkeleton />
      </div>
    )
  }

  return (
    <div className="px-6 py-12 space-y-12">
      <CategoryFilter
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
      />

      {selectedCategory === "All" ? (
        <>
          <EnhancedCategoryRow title="Featured Creators" spaces={mockSpaces.featuredCreators} priority />
          <EnhancedCategoryRow title="Trending Now" spaces={mockSpaces.trending} priority />
          <CategoryRow title="Staff Picks" spaces={mockSpaces.staffPicks} />
          <CategoryRow title="New Arrivals" spaces={mockSpaces.newArrivals} />
          <EnhancedCategoryRow title="Most Popular" spaces={mockSpaces.popular} />
        </>
      ) : (
        <>
          <EnhancedCategoryRow title={`Trending ${selectedCategory}`} spaces={filterSpacesByCategory(mockSpaces.trending)} />
          <CategoryRow
            title={`New ${selectedCategory} Spaces`}
            spaces={filterSpacesByCategory(mockSpaces.newArrivals)}
          />
          <CategoryRow title={`Popular ${selectedCategory}`} spaces={filterSpacesByCategory(mockSpaces.popular)} />
        </>
      )}
    </div>
  )
}
