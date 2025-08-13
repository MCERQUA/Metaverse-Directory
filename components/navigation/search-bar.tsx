"use client"

import { Search, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"

export function SearchBar() {
  return (
    <div className="bg-black/95 backdrop-blur-md border-b border-gray-800/50">
      <div className="flex justify-center px-6 py-1">
        <div className="flex items-center gap-2 max-w-md">
          <div className="flex items-center gap-2 bg-gray-900/60 border border-gray-700/50 rounded-full px-3 py-1.5 w-80">
            <Search className="h-3 w-3 text-gray-400 flex-shrink-0" />
            <input
              type="text"
              placeholder="Search virtual spaces, creators, or categories..."
              className="bg-transparent border-none outline-none text-xs flex-1 text-white placeholder-gray-400"
            />
          </div>
          <Button
            variant="outline"
            size="sm"
            className="gap-1 border-gray-600/50 text-gray-300 hover:text-white hover:border-primary bg-transparent rounded-full px-2.5 py-1.5 h-7 text-xs"
          >
            <Filter className="h-3 w-3" />
            Filters
          </Button>
        </div>
      </div>
    </div>
  )
}
