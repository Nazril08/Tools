"use client"


import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Award,
  BookOpen,
  Bookmark,
  Brush,
  Camera,
  ChevronDown,
  Code,
  Crown,
  Download,
  FileText,
  Grid,
  Heart,
  Home,
  ImageIcon,
  Layers,
  LayoutGrid,
  Lightbulb,
  Menu,
  Palette,
  PanelLeft,
  Play,
  Plus,
  Search,
  Settings,
  Share2,
  Sparkles,
  Star,
  Trash,
  TrendingUp,
  Users,
  Video,
  Wand2,
  Clock,
  Eye,
  Archive,
  ArrowUpDown,
  MoreHorizontal,
  Type,
  CuboidIcon,
  X,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/components/ui/use-toast"

// Sample data for apps
const apps = [
  {
    name: "PixelMaster",
    icon: <ImageIcon className="text-violet-500" />,
    description: "Advanced image editing and composition",
    category: "Creative",
    recent: true,
    new: false,
    progress: 100,
  },
  {
    name: "VectorPro",
    icon: <Brush className="text-orange-500" />,
    description: "Professional vector graphics creation",
    category: "Creative",
    recent: true,
    new: false,
    progress: 100,
  },
  {
    name: "VideoStudio",
    icon: <Video className="text-pink-500" />,
    description: "Cinematic video editing and production",
    category: "Video",
    recent: true,
    new: false,
    progress: 100,
  },
  {
    name: "MotionFX",
    icon: <Sparkles className="text-blue-500" />,
    description: "Stunning visual effects and animations",
    category: "Video",
    recent: false,
    new: false,
    progress: 100,
  },
  {
    name: "PageCraft",
    icon: <Layers className="text-red-500" />,
    description: "Professional page design and layout",
    category: "Creative",
    recent: false,
    new: false,
    progress: 100,
  },
  {
    name: "UXFlow",
    icon: <LayoutGrid className="text-fuchsia-500" />,
    description: "Intuitive user experience design",
    category: "Design",
    recent: false,
    new: true,
    progress: 85,
  },
  {
    name: "PhotoLab",
    icon: <Camera className="text-teal-500" />,
    description: "Advanced photo editing and organization",
    category: "Photography",
    recent: false,
    new: false,
    progress: 100,
  },
  {
    name: "DocMaster",
    icon: <FileText className="text-red-600" />,
    description: "Document editing and management",
    category: "Document",
    recent: false,
    new: false,
    progress: 100,
  },
  {
    name: "WebCanvas",
    icon: <Code className="text-emerald-500" />,
    description: "Web design and development",
    category: "Web",
    recent: false,
    new: true,
    progress: 70,
  },
  {
    name: "3DStudio",
    icon: <CuboidIcon className="text-indigo-500" />,
    description: "3D modeling and rendering",
    category: "3D",
    recent: false,
    new: true,
    progress: 60,
  },
  {
    name: "FontForge",
    icon: <Type className="text-amber-500" />,
    description: "Typography and font creation",
    category: "Typography",
    recent: false,
    new: false,
    progress: 100,
  },
  {
    name: "ColorPalette",
    icon: <Palette className="text-purple-500" />,
    description: "Color scheme creation and management",
    category: "Design",
    recent: false,
    new: false,
    progress: 100,
  },
]

// Sample data for tutorials
const tutorials = [
  {
    title: "Mastering Digital Illustration",
    description: "Learn advanced techniques for creating stunning digital art",
    duration: "1h 45m",
    level: "Advanced",
    instructor: "Sarah Chen",
    category: "Illustration",
    views: "24K",
  },
  {
    title: "UI/UX Design Fundamentals",
    description: "Essential principles for creating intuitive user interfaces",
    duration: "2h 20m",
    level: "Intermediate",
    instructor: "Michael Rodriguez",
    category: "Design",
    views: "56K",
  },
  {
    title: "Video Editing Masterclass",
    description: "Professional techniques for cinematic video editing",
    duration: "3h 10m",
    level: "Advanced",
    instructor: "James Wilson",
    category: "Video",
    views: "32K",
  },
  {
    title: "Typography Essentials",
    description: "Create beautiful and effective typography for any project",
    duration: "1h 30m",
    level: "Beginner",
    instructor: "Emma Thompson",
    category: "Typography",
    views: "18K",
  },
  {
    title: "Color Theory for Designers",
    description: "Understanding color relationships and psychology",
    duration: "2h 05m",
    level: "Intermediate",
    instructor: "David Kim",
    category: "Design",
    views: "41K",
  },
]

// Sample data for community posts
const communityPosts = [
  {
    title: "Minimalist Logo Design",
    author: "Alex Morgan",
    likes: 342,
    comments: 28,
    image: "/placeholder.svg?height=300&width=400",
    time: "2 days ago",
  },
  {
    title: "3D Character Concept",
    author: "Priya Sharma",
    likes: 518,
    comments: 47,
    image: "/placeholder.svg?height=300&width=400",
    time: "1 week ago",
  },
  {
    title: "UI Dashboard Redesign",
    author: "Thomas Wright",
    likes: 276,
    comments: 32,
    image: "/placeholder.svg?height=300&width=400",
    time: "3 days ago",
  },
  {
    title: "Product Photography Setup",
    author: "Olivia Chen",
    likes: 189,
    comments: 15,
    image: "/placeholder.svg?height=300&width=400",
    time: "5 days ago",
  },
]

// Sample data for sidebar navigation
const sidebarItems = [
  {
    id: "home",
    title: "Home",
    icon: <Home />,
  },
  {
    id: "tools",
    title: "Tools",
    icon: <Wand2 />,
  },
  {
    id: "ai",
    title: "AI Chat",
    icon: <Sparkles />,
  },
  {
    id: "settings",
    title: "Settings",
    icon: <Settings />,
  },
]

const toolCategories = [
  { id: "download", title: "Download" },
  { id: "image", title: "Image" },
  { id: "utilities", title: "Utilities" },
  { id: "ai", title: "AI" },
]

const allTools = [
  {
    id: "aio_downloader",
    title: "AIO Downloader",
    description: "Unduh dari berbagai sumber seperti Spotify, YouTube, Instagram, dll.",
    href: "/download/aio",
    category: "download",
  },
  {
    id: "yt_mp3",
    title: "YouTube to MP3",
    description: "Ubah video YouTube menjadi audio MP3.",
    href: "/download/yt-mp3",
    category: "download",
  },
  {
    id: "yt_mp3_advanced",
    title: "YouTube to MP3 (Advanced)",
    description: "Unduh audio dari YouTube, mendukung hingga 6 jam.",
    href: "/download/yt-mp3-advanced",
    category: "download",
  },
    {
    id: "yt_mp4",
    title: "YouTube to MP4",
    description: "Unduh video dari YouTube dengan pilihan kualitas.",
    href: "/download/yt-mp4",
    category: "download",
  },
  {
    id: "yt_mp4_advanced",
    title: "YouTube to MP4 (Advanced)",
    description: "Unduh video dari YouTube, mendukung hingga 6 jam.",
    href: "/download/yt-mp4-advanced",
    category: "download",
  },
  {
    id: "tiktok_downloader",
    title: "TikTok Downloader",
    description: "Unduh video atau audio dari TikTok.",
    href: "/download/tiktok",
    category: "download",
  },
  {
    id: "facebook_downloader",
    title: "Facebook Downloader",
    description: "Unduh video atau audio dari Facebook.",
    href: "/download/facebook",
    category: "download",
  },
  {
    id: "remove_bg",
    title: "Remove Background",
    description: "Hapus latar belakang dari sebuah gambar.",
    href: "/image/remove-background",
    category: "image",
  },
  {
    id: "image_upscaler",
    title: "Image Upscaler",
    description: "Tingkatkan resolusi gambar secara cerdas.",
    href: "/image/upscaler",
    category: "image",
  },
  {
    id: "upscale_v2",
    title: "Upscale V2",
    description: "Tingkatkan resolusi gambar ke kualitas 4K.",
    href: "/image/upscale-v2",
    category: "image",
  },
    {
    id: "cek_resi",
    title: "Cek Resi",
    description: "Lacak status pengiriman paket Anda.",
    href: "/utilities/cek-resi",
    category: "utilities",
  },
  {
    id: 'sonu-music',
    title: 'Sonu Music',
    description: 'Hasilkan musik orisinal dari teks dengan AI.',
    category: 'utilities',
    href: '/utilities/sonu-music'
  },
  {
    id: "animagine_v2",
    title: "Animagine v2",
    description: "Hasilkan gambar gaya anime dari teks.",
    href: "/ai/animagine",
    category: "ai",
  },
    {
    id: "animagine_advanced",
    title: "Animagine (Advanced)",
    description: "Hasilkan gambar dengan kontrol parameter penuh.",
    href: "/ai/animagine-advanced",
    category: "ai",
  },
  {
    id: "tiktok_transcript",
    title: "TikTok Transcript",
    description: "Dapatkan transkrip dari video TikTok.",
    href: "/ai/tiktok-transcript",
    category: "ai",
  },
]

export function YeyoCreative() {
  const { toast } = useToast()
  const [progress, setProgress] = useState(0)
  const [activeTab, setActiveTab] = useState("home")
  const [activeToolCategory, setActiveToolCategory] = useState("download")
  const [isToolsExpanded, setIsToolsExpanded] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({})
  const [favoriteTools, setFavoriteTools] = useState<string[]>([])

  useEffect(() => {
    const savedFavorites = localStorage.getItem("favoriteTools")
    if (savedFavorites) {
      setFavoriteTools(JSON.parse(savedFavorites))
    }
  }, [])
  
  const toggleFavorite = (toolId: string) => {
    const newFavorites = favoriteTools.includes(toolId)
      ? favoriteTools.filter((id) => id !== toolId)
      : [...favoriteTools, toolId]
    setFavoriteTools(newFavorites)
    localStorage.setItem("favoriteTools", JSON.stringify(newFavorites))
  }

  // Simulate progress loading
  useEffect(() => {
    const timer = setTimeout(() => setProgress(100), 1000)
    return () => clearTimeout(timer)
  }, [])

  const toggleExpanded = (title: string) => {
    setExpandedItems((prev) => ({
      ...prev,
      [title]: !prev[title],
    }))
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      {/* Animated gradient background */}
      <motion.div
        className="absolute inset-0 -z-10 opacity-20"
        animate={{
          background: [
            "radial-gradient(circle at 50% 50%, rgba(120, 41, 190, 0.5) 0%, rgba(53, 71, 125, 0.5) 50%, rgba(0, 0, 0, 0) 100%)",
            "radial-gradient(circle at 30% 70%, rgba(233, 30, 99, 0.5) 0%, rgba(81, 45, 168, 0.5) 50%, rgba(0, 0, 0, 0) 100%)",
            "radial-gradient(circle at 70% 30%, rgba(76, 175, 80, 0.5) 0%, rgba(32, 119, 188, 0.5) 50%, rgba(0, 0, 0, 0) 100%)",
            "radial-gradient(circle at 50% 50%, rgba(120, 41, 190, 0.5) 0%, rgba(53, 71, 125, 0.5) 50%, rgba(0, 0, 0, 0) 100%)",
          ],
        }}
        transition={{ duration: 30, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
      />

      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 md:hidden" onClick={() => setMobileMenuOpen(false)} />
      )}

      {/* Sidebar - Mobile */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 transform bg-background transition-transform duration-300 ease-in-out md:hidden",
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-full flex-col border-r">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <div className="flex aspect-square size-10 items-center justify-center rounded-2xl overflow-hidden">
                <Image
                  src="/image.png"
                  alt="Logo"
                  width={40}
                  height={40}
                  className="rounded-2xl object-cover"
                />
              </div>
              <div>
                <h2 className="font-semibold">yeyo</h2>
                
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(false)}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="px-3 py-2">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Search..." className="w-full rounded-2xl bg-muted pl-9 pr-4 py-2" />
            </div>
          </div>

          <ScrollArea className="flex-1 px-3 py-2">
            <div className="space-y-1">
              {sidebarItems.map((item) => {
                const isTools = item.id === "tools";
                const content = (
                  <button
                    className={cn(
                      "flex w-full items-center justify-between rounded-2xl px-3 py-2 text-sm font-medium",
                      activeTab === item.id ? "bg-primary/10 text-primary" : "hover:bg-muted",
                    )}
                    onClick={() => {
                      setActiveTab(item.id)
                      if (isTools) {
                        setIsToolsExpanded(!isToolsExpanded)
                      }
                    }}
                  >
                    <div className="flex items-center gap-3">
                      {item.icon}
                      <span>{item.title}</span>
                    </div>
                    {isTools && <ChevronDown className={cn("h-4 w-4 transition-transform", isToolsExpanded && "rotate-180")} />}
                  </button>
                );

                return (
                  <div key={item.id}>
                    {isTools ? (
                      content
                    ) : (
                      <Link href={item.id === 'ai' ? '/ai/chat' : (item.id === 'home' ? '/' : `/${item.id}`)}>
                        {content}
                      </Link>
                    )}
                    {isTools && isToolsExpanded && (
                      <div className="ml-4 mt-1 space-y-1 border-l pl-4">
                        {toolCategories.map((category) => (
                          <button
                            key={category.id}
                            className={cn(
                              "flex w-full items-center rounded-2xl px-3 py-2 text-sm font-medium",
                              activeToolCategory === category.id ? "bg-muted text-primary" : "hover:bg-muted/50",
                            )}
                            onClick={() => {
                              setActiveToolCategory(category.id)
                              setMobileMenuOpen(false)
                            }}
                          >
                            {category.title}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </ScrollArea>

          <div className="border-t p-3">
            <div className="space-y-1">
              <button className="flex w-full items-center justify-between rounded-2xl px-3 py-2 text-sm font-medium hover:bg-muted">
                <div className="flex items-center gap-3">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src="/nazril.png" alt="User" />
                    <AvatarFallback>N</AvatarFallback>
                  </Avatar>
                  <span>Nazril</span>
                </div>
                <Badge variant="outline" className="ml-auto">
                  Pro
                </Badge>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar - Desktop */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-30 hidden w-64 transform border-r bg-background transition-transform duration-300 ease-in-out lg:block",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-full flex-col">
          <div className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex aspect-square size-10 items-center justify-center rounded-2xl overflow-hidden">
                <Image
                  src="/image.png"
                  alt="Logo"
                  width={40}
                  height={40}
                  className="rounded-2xl object-cover"
                />
              </div>
              <div>
                <h2 className="font-semibold">yeyo</h2>
                
              </div>
            </div>
          </div>

          <div className="px-3 py-2">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Search..." className="w-full rounded-2xl bg-muted pl-9 pr-4 py-2" />
            </div>
          </div>

          <ScrollArea className="flex-1 px-3 py-2">
            <div className="space-y-1">
               {sidebarItems.map((item) => {
                const isTools = item.id === "tools";
                const content = (
                  <button
                    className={cn(
                      "flex w-full items-center justify-between rounded-2xl px-3 py-2 text-sm font-medium",
                      activeTab === item.id ? "bg-primary/10 text-primary" : "hover:bg-muted",
                    )}
                    onClick={() => {
                      setActiveTab(item.id)
                      if (isTools) {
                        setIsToolsExpanded(!isToolsExpanded)
                      }
                    }}
                  >
                    <div className="flex items-center gap-3">
                      {item.icon}
                      <span>{item.title}</span>
                    </div>
                    {isTools && <ChevronDown className={cn("h-4 w-4 transition-transform", isToolsExpanded && "rotate-180")} />}
                  </button>
                );

                return (
                  <div key={item.id}>
                    {isTools ? (
                      content
                    ) : (
                      <Link href={item.id === 'ai' ? '/ai/chat' : (item.id === 'home' ? '/' : `/${item.id}`)}>
                        {content}
                      </Link>
                    )}
                     {isTools && isToolsExpanded && (
                      <div className="ml-4 mt-1 space-y-1 border-l pl-4">
                        {toolCategories.map((category) => (
                          <button
                            key={category.id}
                            className={cn(
                              "flex w-full items-center rounded-2xl px-3 py-2 text-sm font-medium",
                              activeToolCategory === category.id ? "bg-muted text-primary" : "hover:bg-muted/50",
                            )}
                            onClick={() => setActiveToolCategory(category.id)}
                          >
                            {category.title}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </ScrollArea>

          <div className="border-t p-3">
            <div className="space-y-1">
              <button className="flex w-full items-center justify-between rounded-2xl px-3 py-2 text-sm font-medium hover:bg-muted">
                <div className="flex items-center gap-3">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src="/nazril.png" alt="User" />
                    <AvatarFallback>N</AvatarFallback>
                  </Avatar>
                  <span>Nazril</span>
                </div>
                <Badge variant="outline" className="ml-auto">
                  Pro
                </Badge>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={cn("min-h-screen transition-all duration-300 ease-in-out", sidebarOpen ? "lg:pl-64" : "lg:pl-0")}>
        <header className="sticky top-0 z-10 flex h-14 sm:h-16 items-center gap-2 sm:gap-3 border-b bg-background/95 px-3 sm:px-4 backdrop-blur">
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setMobileMenuOpen(true)}>
            <Menu className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="hidden lg:flex" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <PanelLeft className="h-5 w-5" />
          </Button>
          <div className="flex flex-1 items-center justify-between">
            <h1 className="text-lg sm:text-xl font-semibold truncate">yeyo</h1>
            <div className="flex items-center gap-1 sm:gap-3">
              <Avatar className="h-8 w-8 sm:h-9 sm:w-9 border-2 border-primary">
                <AvatarImage src="/nazril.png" alt="User" />
                <AvatarFallback>N</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        <main className="flex-1 p-3 sm:p-4 lg:p-6">
          <Tabs defaultValue="home" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <TabsContent value="home" className="space-y-8 mt-0">
                  <section>
                    <h3 className="text-xl font-semibold mb-4">Favorite Tools</h3>
                    {favoriteTools.length > 0 ? (
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {allTools
                          .filter((tool) => favoriteTools.includes(tool.id))
                          .map((tool) => (
                            <motion.div key={tool.id} whileHover={{ scale: 1.02, y: -5 }} whileTap={{ scale: 0.98 }}>
                              <Card className="h-full flex flex-col justify-between overflow-hidden rounded-2xl sm:rounded-3xl border hover:border-primary/50 transition-all duration-300">
                                <CardHeader className="flex-row items-start justify-between">
                                  <div>
                                    <CardTitle>{tool.title}</CardTitle>
                                    <CardDescription>{tool.description}</CardDescription>
                                  </div>
                                  <Button variant="ghost" size="icon" onClick={() => toggleFavorite(tool.id)}>
                                    <Star className={cn("h-5 w-5", favoriteTools.includes(tool.id) ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground")} />
                                  </Button>
                                </CardHeader>
                                <CardFooter>
                                  <Link href={tool.href} className="w-full">
                                    <Button className="w-full rounded-2xl">Buka</Button>
                                  </Link>
                                </CardFooter>
                              </Card>
                            </motion.div>
                          ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground">No favorite tools yet. Click the star on any tool to add it here.</p>
                    )}
                  </section>
                </TabsContent>

                <TabsContent value="tools" className="space-y-4 mt-0">
                  {/* Render content based on activeToolCategory */}
                  <div className={activeToolCategory === 'download' ? '' : 'hidden'}>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                      {allTools
                        .filter((tool) => tool.category === "download")
                        .map((tool) => (
                          <motion.div key={tool.id} whileHover={{ scale: 1.02, y: -5 }} whileTap={{ scale: 0.98 }}>
                            <Card className="h-full flex flex-col justify-between overflow-hidden rounded-2xl sm:rounded-3xl border hover:border-primary/50 transition-all duration-300">
                              <CardHeader className="flex-row items-start justify-between">
                                <div>
                                  <CardTitle>{tool.title}</CardTitle>
                                  <CardDescription>{tool.description}</CardDescription>
                                </div>
                                <Button variant="ghost" size="icon" onClick={() => toggleFavorite(tool.id)}>
                                  <Star className={cn("h-5 w-5", favoriteTools.includes(tool.id) ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground")} />
                                </Button>
                              </CardHeader>
                              <CardFooter>
                                <Link href={tool.href} className="w-full">
                                  <Button className="w-full rounded-2xl">Buka</Button>
                                </Link>
                              </CardFooter>
                            </Card>
                          </motion.div>
                        ))}
                    </div>
                  </div>
                  <div className={activeToolCategory === 'image' ? '' : 'hidden'}>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                      {allTools
                        .filter((tool) => tool.category === "image")
                        .map((tool) => (
                          <motion.div key={tool.id} whileHover={{ scale: 1.02, y: -5 }} whileTap={{ scale: 0.98 }}>
                            <Card className="h-full flex flex-col justify-between overflow-hidden rounded-2xl sm:rounded-3xl border hover:border-primary/50 transition-all duration-300">
                              <CardHeader className="flex-row items-start justify-between">
                                <div>
                                  <CardTitle>{tool.title}</CardTitle>
                                  <CardDescription>{tool.description}</CardDescription>
                                </div>
                                <Button variant="ghost" size="icon" onClick={() => toggleFavorite(tool.id)}>
                                  <Star className={cn("h-5 w-5", favoriteTools.includes(tool.id) ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground")} />
                                </Button>
                              </CardHeader>
                              <CardFooter>
                                <Link href={tool.href} className="w-full">
                                  <Button className="w-full rounded-2xl">Buka</Button>
                                </Link>
                              </CardFooter>
                            </Card>
                          </motion.div>
                        ))}
                    </div>
                  </div>
                  <div className={activeToolCategory === 'utilities' ? '' : 'hidden'}>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                      {allTools
                        .filter((tool) => tool.category === "utilities")
                        .map((tool) => (
                          <motion.div key={tool.id} whileHover={{ scale: 1.02, y: -5 }} whileTap={{ scale: 0.98 }}>
                            <Card className="h-full flex flex-col justify-between overflow-hidden rounded-2xl sm:rounded-3xl border hover:border-primary/50 transition-all duration-300">
                              <CardHeader className="flex-row items-start justify-between">
                                <div>
                                  <CardTitle>{tool.title}</CardTitle>
                                  <CardDescription>{tool.description}</CardDescription>
                                </div>
                                <Button variant="ghost" size="icon" onClick={() => toggleFavorite(tool.id)}>
                                  <Star className={cn("h-5 w-5", favoriteTools.includes(tool.id) ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground")} />
                                </Button>
                              </CardHeader>
                              <CardFooter>
                                <Link href={tool.href} className="w-full">
                                  <Button className="w-full rounded-2xl">Buka</Button>
                                </Link>
                              </CardFooter>
                            </Card>
                          </motion.div>
                        ))}
                    </div>
                  </div>
                  <div className={activeToolCategory === 'ai' ? '' : 'hidden'}>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                      {allTools
                        .filter((tool) => tool.category === "ai")
                        .map((tool) => (
                          <motion.div key={tool.id} whileHover={{ scale: 1.02, y: -5 }} whileTap={{ scale: 0.98 }}>
                            <Card className="h-full flex flex-col justify-between overflow-hidden rounded-2xl sm:rounded-3xl border hover:border-primary/50 transition-all duration-300">
                              <CardHeader className="flex-row items-start justify-between">
                                <div>
                                  <CardTitle>{tool.title}</CardTitle>
                                  <CardDescription>{tool.description}</CardDescription>
                                </div>
                                <Button variant="ghost" size="icon" onClick={() => toggleFavorite(tool.id)}>
                                  <Star className={cn("h-5 w-5", favoriteTools.includes(tool.id) ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground")} />
                                </Button>
                              </CardHeader>
                              <CardFooter>
                                <Link href={tool.href} className="w-full">
                                  <Button className="w-full rounded-2xl">Buka</Button>
                                </Link>
                              </CardFooter>
                            </Card>
                          </motion.div>
                        ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="settings" className="space-y-8 mt-0">
                  <p className="text-muted-foreground">The settings page has been moved. Please access it from the sidebar.</p>
                </TabsContent>
              </motion.div>
            </AnimatePresence>
          </Tabs>
          <Toaster />
        </main>
      </div>
    </div>
  )
}
