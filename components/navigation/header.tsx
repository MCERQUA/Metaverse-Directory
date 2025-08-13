import { Button } from "@/components/ui/button"
import { Search, User, Plus } from "lucide-react"
import Link from "next/link"

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              MetaVerse
            </h1>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <a href="#" className="text-sm font-medium hover:text-primary transition-colors">
              Trending
            </a>
            <a href="#" className="text-sm font-medium hover:text-primary transition-colors">
              New Arrivals
            </a>
            <a href="#" className="text-sm font-medium hover:text-primary transition-colors">
              Categories
            </a>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 bg-card border border-border rounded-lg px-3 py-2 w-64">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search virtual spaces..."
              className="bg-transparent border-none outline-none text-sm flex-1"
            />
          </div>

          <Button asChild variant="outline" size="sm" className="gap-2 bg-transparent">
            <Link href="/submit">
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Submit Space</span>
            </Link>
          </Button>

          <Button variant="ghost" size="sm">
            <User className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  )
}
