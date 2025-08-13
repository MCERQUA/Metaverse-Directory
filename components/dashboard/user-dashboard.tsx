"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Header } from "@/components/navigation/header"
import { Plus, Settings, Star, Users, Calendar, ExternalLink } from "lucide-react"
import Link from "next/link"

export function UserDashboard() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState("spaces")

  // Mock user spaces data
  const userSpaces = [
    {
      id: "1",
      name: "Neon Arcade",
      category: "Gaming",
      status: "Published",
      views: 1234,
      likes: 89,
      createdAt: "2024-01-15",
      thumbnail: "/neon-nightclub-virtual-space.png",
    },
    {
      id: "2",
      name: "Art Gallery VR",
      category: "Art",
      status: "Under Review",
      views: 0,
      likes: 0,
      createdAt: "2024-01-20",
      thumbnail: "/virtual-art-gallery.png",
    },
  ]

  const stats = {
    totalSpaces: userSpaces.length,
    totalViews: userSpaces.reduce((sum, space) => sum + space.views, 0),
    totalLikes: userSpaces.reduce((sum, space) => sum + space.likes, 0),
    publishedSpaces: userSpaces.filter((space) => space.status === "Published").length,
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Welcome back, {user?.username}!</h1>
          <p className="text-slate-400">Manage your virtual spaces and track your community engagement</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">Total Spaces</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.totalSpaces}</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">Total Views</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.totalViews.toLocaleString()}</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">Total Likes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.totalLikes}</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">Published</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.publishedSpaces}</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-slate-800/50 border-slate-700">
            <TabsTrigger value="spaces" className="data-[state=active]:bg-slate-700">
              My Spaces
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-slate-700">
              Analytics
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-slate-700">
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="spaces" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-white">Your Virtual Spaces</h2>
              <Button
                asChild
                className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600"
              >
                <Link href="/submit">
                  <Plus className="mr-2 h-4 w-4" />
                  Add New Space
                </Link>
              </Button>
            </div>

            {userSpaces.length === 0 ? (
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="text-center py-12">
                  <div className="text-slate-400 mb-4">
                    <Plus className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p className="text-lg mb-2">No spaces yet</p>
                    <p className="text-sm">Create your first virtual space to get started</p>
                  </div>
                  <Button
                    asChild
                    className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600"
                  >
                    <Link href="/submit">Create Your First Space</Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userSpaces.map((space) => (
                  <Card key={space.id} className="bg-slate-800/50 border-slate-700 overflow-hidden">
                    <div className="aspect-video relative">
                      <img
                        src={space.thumbnail || "/placeholder.svg"}
                        alt={space.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 right-2">
                        <Badge
                          variant={space.status === "Published" ? "default" : "secondary"}
                          className={
                            space.status === "Published"
                              ? "bg-green-600 hover:bg-green-700"
                              : "bg-yellow-600 hover:bg-yellow-700"
                          }
                        >
                          {space.status}
                        </Badge>
                      </div>
                    </div>

                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-white text-lg">{space.name}</CardTitle>
                          <CardDescription className="text-slate-400">{space.category}</CardDescription>
                        </div>
                        <Button variant="ghost" size="sm">
                          <Settings className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>

                    <CardContent>
                      <div className="flex justify-between text-sm text-slate-400 mb-4">
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-1" />
                          {space.views} views
                        </div>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 mr-1" />
                          {space.likes} likes
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {new Date(space.createdAt).toLocaleDateString()}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700 bg-transparent"
                        >
                          Edit
                        </Button>
                        {space.status === "Published" && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-slate-600 text-slate-300 hover:bg-slate-700 bg-transparent"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Analytics Dashboard</CardTitle>
                <CardDescription className="text-slate-400">
                  Track your spaces' performance and engagement
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-slate-400">
                  <div className="text-lg mb-2">Analytics Coming Soon</div>
                  <p className="text-sm">Detailed analytics and insights will be available here</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Account Settings</CardTitle>
                <CardDescription className="text-slate-400">
                  Manage your account preferences and profile
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-slate-400">
                  <div className="text-lg mb-2">Settings Panel Coming Soon</div>
                  <p className="text-sm">Account management features will be available here</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
