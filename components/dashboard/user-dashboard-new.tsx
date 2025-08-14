"use client"

import { useState, useRef, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Header } from "@/components/navigation/header"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Plus, 
  Settings, 
  Camera, 
  Upload, 
  User, 
  ExternalLink,
  Save,
  Loader2,
  Image as ImageIcon
} from "lucide-react"
import Link from "next/link"
import { uploadImage } from "@/lib/supabase"

export function UserDashboard() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState("profile")
  const [isUploading, setIsUploading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  
  // Profile state
  const [profileImage, setProfileImage] = useState("/placeholder.svg")
  const [headerImage, setHeaderImage] = useState("/placeholder.svg")
  const [displayName, setDisplayName] = useState(user?.username || "")
  const [bio, setBio] = useState("")
  
  // File input refs
  const profileInputRef = useRef<HTMLInputElement>(null)
  const headerInputRef = useRef<HTMLInputElement>(null)

  // Mock user spaces data
  const userSpaces = [
    {
      id: "1",
      name: "Mikes Room",
      category: "Social",
      status: "Published",
      createdAt: "2024-01-15",
      thumbnail: "/room1-360.jpg",
      liveUrl: "https://3d-mc.netlify.app/",
    }
  ]

  // Load saved profile data from localStorage
  useEffect(() => {
    const savedProfile = localStorage.getItem(`profile_${user?.id}`)
    if (savedProfile) {
      const data = JSON.parse(savedProfile)
      setProfileImage(data.profileImage || "/placeholder.svg")
      setHeaderImage(data.headerImage || "/placeholder.svg")
      setDisplayName(data.displayName || user?.username || "")
      setBio(data.bio || "")
    }
  }, [user])

  const handleProfileImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !user) return

    setIsUploading(true)
    setError("")
    
    try {
      // For demo, we'll use local storage URL
      const reader = new FileReader()
      reader.onloadend = () => {
        setProfileImage(reader.result as string)
      }
      reader.readAsDataURL(file)
      
      // In production, you would upload to Supabase:
      // const { url, error } = await uploadImage('profiles', 'avatar', file, user.id)
      // if (error) throw error
      // setProfileImage(url!)
      
      setMessage("Profile image updated successfully!")
      setTimeout(() => setMessage(""), 3000)
    } catch (err) {
      setError("Failed to upload profile image")
    } finally {
      setIsUploading(false)
    }
  }

  const handleHeaderImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !user) return

    setIsUploading(true)
    setError("")
    
    try {
      // For demo, we'll use local storage URL
      const reader = new FileReader()
      reader.onloadend = () => {
        setHeaderImage(reader.result as string)
      }
      reader.readAsDataURL(file)
      
      // In production, you would upload to Supabase:
      // const { url, error } = await uploadImage('profiles', 'header', file, user.id)
      // if (error) throw error
      // setHeaderImage(url!)
      
      setMessage("Header image updated successfully!")
      setTimeout(() => setMessage(""), 3000)
    } catch (err) {
      setError("Failed to upload header image")
    } finally {
      setIsUploading(false)
    }
  }

  const handleSaveProfile = () => {
    if (!user) return
    
    setIsSaving(true)
    
    // Save to localStorage for demo
    const profileData = {
      profileImage,
      headerImage,
      displayName,
      bio
    }
    localStorage.setItem(`profile_${user.id}`, JSON.stringify(profileData))
    
    setTimeout(() => {
      setIsSaving(false)
      setMessage("Profile saved successfully!")
      setTimeout(() => setMessage(""), 3000)
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-950 to-black">
      <Header />

      <div className="container mx-auto px-4 pt-20 pb-8">
        {/* Profile Header Section */}
        <div className="relative mb-8">
          {/* Header Image */}
          <div className="relative h-48 md:h-64 rounded-xl overflow-hidden bg-gray-800">
            <img
              src={headerImage}
              alt="Profile header"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            
            {/* Header Upload Button */}
            <Button
              onClick={() => headerInputRef.current?.click()}
              className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white backdrop-blur-sm"
              size="sm"
              disabled={isUploading}
            >
              {isUploading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Camera className="h-4 w-4 mr-2" />
                  Change Cover
                </>
              )}
            </Button>
            <input
              ref={headerInputRef}
              type="file"
              accept="image/*"
              onChange={handleHeaderImageUpload}
              className="hidden"
            />
          </div>

          {/* Profile Image and Info */}
          <div className="flex flex-col md:flex-row items-start md:items-end -mt-16 md:-mt-20 px-6">
            <div className="relative group">
              {/* Circular Profile Image */}
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-gray-900 overflow-hidden bg-gray-800">
                <img
                  src={profileImage}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Profile Upload Overlay */}
              <Button
                onClick={() => profileInputRef.current?.click()}
                className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                disabled={isUploading}
              >
                {isUploading ? (
                  <Loader2 className="h-6 w-6 animate-spin text-white" />
                ) : (
                  <Camera className="h-6 w-6 text-white" />
                )}
              </Button>
              <input
                ref={profileInputRef}
                type="file"
                accept="image/*"
                onChange={handleProfileImageUpload}
                className="hidden"
              />
            </div>

            <div className="mt-4 md:mt-0 md:ml-6 flex-1">
              <h1 className="text-3xl font-bold text-white">{displayName}</h1>
              <p className="text-gray-400">@{user?.username}</p>
            </div>
          </div>
        </div>

        {/* Alerts */}
        {message && (
          <Alert className="mb-6 bg-green-900/20 border-green-700">
            <AlertDescription className="text-green-400">{message}</AlertDescription>
          </Alert>
        )}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-gray-800/30 border-gray-700/50 backdrop-blur-sm">
            <TabsTrigger value="profile" className="data-[state=active]:bg-gray-700/50">
              Profile
            </TabsTrigger>
            <TabsTrigger value="spaces" className="data-[state=active]:bg-gray-700/50">
              My Spaces
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-gray-700/50">
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <Card className="bg-gray-800/30 border-gray-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Edit Profile</CardTitle>
                <CardDescription className="text-gray-400">
                  Update your profile information and images
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="displayName" className="text-white">Display Name</Label>
                  <Input
                    id="displayName"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="bg-gray-700/50 border-gray-600 text-white"
                    placeholder="Enter your display name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio" className="text-white">Bio</Label>
                  <textarea
                    id="bio"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="w-full min-h-[100px] bg-gray-700/50 border border-gray-600 rounded-md px-3 py-2 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Tell us about yourself..."
                  />
                </div>

                <Button
                  onClick={handleSaveProfile}
                  className="bg-primary hover:bg-primary/90 text-black"
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="spaces" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-white">Your Virtual Spaces</h2>
              <Button
                asChild
                className="bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-sm transition-all"
              >
                <Link href="/submit">
                  <Plus className="mr-2 h-4 w-4" />
                  Add New Space
                </Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userSpaces.map((space) => (
                <Card key={space.id} className="bg-gray-800/30 border-gray-700/50 backdrop-blur-sm overflow-hidden">
                  <div className="aspect-video relative">
                    <img
                      src={space.thumbnail}
                      alt={space.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2">
                      <Badge className="bg-green-600 hover:bg-green-700">
                        {space.status}
                      </Badge>
                    </div>
                  </div>

                  <CardHeader>
                    <CardTitle className="text-white text-lg">{space.name}</CardTitle>
                    <CardDescription className="text-slate-400">{space.category}</CardDescription>
                  </CardHeader>

                  <CardContent>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 border-gray-600/50 text-gray-300 hover:bg-gray-700/50 bg-transparent"
                      >
                        <Settings className="mr-2 h-4 w-4" />
                        Edit
                      </Button>
                      <Button
                        asChild
                        variant="outline"
                        size="sm"
                        className="border-gray-600/50 text-gray-300 hover:bg-gray-700/50 bg-transparent"
                      >
                        <a href={space.liveUrl} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card className="bg-gray-800/30 border-gray-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Account Settings</CardTitle>
                <CardDescription className="text-gray-400">
                  Manage your account preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-white">Email</Label>
                  <Input
                    value={user?.email || ""}
                    disabled
                    className="bg-gray-700/30 border-gray-600 text-gray-400"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-white">Username</Label>
                  <Input
                    value={user?.username || ""}
                    disabled
                    className="bg-gray-700/30 border-gray-600 text-gray-400"
                  />
                </div>

                <div className="pt-4">
                  <Button variant="destructive" className="bg-red-600 hover:bg-red-700">
                    Delete Account
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}