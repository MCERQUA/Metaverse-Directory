"use client"

import { Button } from "@/components/ui/button"
import { User, Plus, LogOut, Search, Filter } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function Header() {
  const { user, logout } = useAuth()

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-md">
      {/* Desktop Header */}
      <div className="hidden md:block">
        <div className="px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/">
              <h1 className="text-xl font-bold text-white">
                Meta<span className="text-primary">Verse</span>
              </h1>
            </Link>
            <nav className="flex items-center gap-6">
              <a href="#" className="text-sm text-gray-300 hover:text-white transition-colors">
                Trending
              </a>
              <a href="#" className="text-sm text-gray-300 hover:text-white transition-colors">
                New Arrivals
              </a>
              <a href="#" className="text-sm text-gray-300 hover:text-white transition-colors">
                Categories
              </a>
            </nav>
          </div>

          <div className="flex items-center gap-2 max-w-sm mx-4">
            <div className="flex items-center gap-2 bg-gray-900/60 border border-gray-700/50 rounded-full px-3 py-1.5 w-full min-w-[280px]">
              <Search className="h-3 w-3 text-gray-400 flex-shrink-0" />
              <input
                type="text"
                placeholder="Search spaces, creators..."
                className="bg-transparent border-none outline-none text-xs flex-1 text-white placeholder-gray-400"
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              className="gap-1 border-gray-600/50 text-gray-300 hover:text-white hover:border-primary bg-transparent rounded-full px-2.5 py-1.5 h-7 text-xs flex-shrink-0"
            >
              <Filter className="h-3 w-3" />
            </Button>
          </div>

          <div className="flex items-center gap-3">
            <Button
              asChild
              variant="outline"
              size="sm"
              className="gap-2 border-gray-600 text-gray-300 hover:text-white hover:border-primary bg-transparent rounded-full h-8 px-3"
            >
              <Link href="/submit">
                <Plus className="h-3 w-3" />
                <span className="text-xs">Submit</span>
              </Link>
            </Button>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-2 text-gray-300 hover:text-white rounded-full h-8 px-3"
                  >
                    <User className="h-3 w-3" />
                    <span className="text-xs">{user.username}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 bg-gray-900 border-gray-700">
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard">Dashboard</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/submit">Submit Space</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="text-red-400">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-2">
                <Button
                  asChild
                  size="sm"
                  className="bg-gradient-to-r from-red-600 to-red-500 text-white hover:from-red-700 hover:to-red-600 rounded-full font-medium h-8 px-4 text-xs"
                >
                  <Link href="/login">Sign In</Link>
                </Button>
                <Button
                  asChild
                  size="sm"
                  className="bg-primary text-black hover:bg-primary/90 rounded-full h-8 px-4 text-xs"
                >
                  <Link href="/signup">Sign Up</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Header */}
      <div className="md:hidden">
        {/* Top row with logo and buttons */}
        <div className="px-4 h-14 flex items-center justify-between">
          <Link href="/">
            <h1 className="text-lg font-bold text-white">
              Meta<span className="text-primary">Verse</span>
            </h1>
          </Link>

          <div className="flex items-center gap-2 ml-auto">
            <Button
              asChild
              variant="outline"
              size="sm"
              className="gap-1 border-gray-600 text-gray-300 hover:text-white hover:border-primary bg-transparent rounded-full h-8 px-2 flex-shrink-0"
            >
              <Link href="/submit">
                <Plus className="h-3 w-3" />
              </Link>
            </Button>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-1 text-gray-300 hover:text-white rounded-full h-8 px-2 flex-shrink-0"
                  >
                    <User className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 bg-gray-900 border-gray-700">
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard">Dashboard</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/submit">Submit Space</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="text-red-400">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-1 flex-shrink-0">
                <Button
                  asChild
                  size="sm"
                  className="bg-gradient-to-r from-red-600 to-red-500 text-white hover:from-red-700 hover:to-red-600 rounded-full font-medium h-8 px-2.5 text-xs"
                >
                  <Link href="/login">Sign In</Link>
                </Button>
                <Button
                  asChild
                  size="sm"
                  className="bg-primary text-black hover:bg-primary/90 rounded-full h-8 px-2.5 text-xs"
                >
                  <Link href="/signup">Sign Up</Link>
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile navigation */}
        <div className="px-4 pb-2">
          <nav className="flex items-center gap-4 mb-3 overflow-hidden">
            <a href="#" className="text-sm text-gray-300 hover:text-white transition-colors whitespace-nowrap">
              Trending
            </a>
            <a href="#" className="text-sm text-gray-300 hover:text-white transition-colors whitespace-nowrap">
              New Arrivals
            </a>
            <a href="#" className="text-sm text-gray-300 hover:text-white transition-colors whitespace-nowrap">
              Categories
            </a>
          </nav>

          {/* Mobile search bar */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 bg-gray-900/60 border border-gray-700/50 rounded-full px-3 py-1.5 flex-1">
              <Search className="h-3 w-3 text-gray-400 flex-shrink-0" />
              <input
                type="text"
                placeholder="Search spaces, creators..."
                className="bg-transparent border-none outline-none text-xs flex-1 text-white placeholder-gray-400"
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              className="gap-1 border-gray-600/50 text-gray-300 hover:text-white hover:border-primary bg-transparent rounded-full px-2.5 py-1.5 h-7 text-xs flex-shrink-0"
            >
              <Filter className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
