"use client"

import { Button } from "@/components/ui/button"
import { User, Plus, LogOut } from "lucide-react"
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
      <div className="px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/">
            <h1 className="text-xl font-bold text-white">
              Meta<span className="text-primary">Verse</span>
            </h1>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
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

        <div className="flex items-center gap-3">
          <Button
            asChild
            variant="outline"
            size="sm"
            className="gap-2 border-gray-600 text-gray-300 hover:text-white hover:border-primary bg-transparent rounded-full h-8 px-3"
          >
            <Link href="/submit">
              <Plus className="h-3 w-3" />
              <span className="hidden sm:inline text-xs">Submit</span>
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
                  <span className="hidden sm:inline text-xs">{user.username}</span>
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
    </header>
  )
}
