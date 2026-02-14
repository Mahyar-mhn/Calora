"use client"

import { useEffect, useMemo, useState } from "react"
import { useMenuInteractions } from "@/hooks/use-menu-interactions"
import { API_BASE } from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  Menu,
  Home,
  Utensils,
  Cookie,
  Activity,
  History,
  Compass,
  Heart,
  MessageCircle,
  Send,
  UserPlus,
  UserCheck,
  Flame,
  Dumbbell,
  Apple,
  Users,
  Search,
} from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import ProfileAvatarButton from "./profile-avatar-button"

type ExploreUser = {
  id: number
  name: string
  email?: string
  handle: string
  title: string
  avatarColor: string
  followers: number
  following: number
  profilePicture?: string | null
  posts?: number
}

type ExploreComment = {
  id: number
  userId: number
  text: string
  createdAt: string
}

type ExplorePost = {
  id: number
  userId: number
  type: "activity" | "meal"
  title: string
  summary: string
  calories: number
  protein?: number
  carbs?: number
  fats?: number
  duration?: number
  createdAt: string
  likes: number[]
  reactions: Record<string, number[]>
  comments: ExploreComment[]
}

type ExploreMessage = {
  id: number
  fromUserId: number
  toUserId: number
  text: string
  createdAt: string
}

type ExploreThread = {
  withUserId: number
  withName: string
  withHandle: string
  withTitle: string
  withAvatarColor: string
  profilePicture?: string | null
  lastMessage: string
  lastAt: string
}

type RecentMeal = {
  id?: number
  name: string
  calories: number
  protein: number
  carbs: number
  fats: number
  date?: string
}

type RecentActivity = {
  id?: number
  type: string
  duration: number
  caloriesBurned: number
  date?: string
}

const reactionOptions = ["\uD83D\uDD25", "\uD83D\uDCAA", "\uD83E\uDD57", "\uD83C\uDFC3", "\uD83D\uDC4F"]

const timeAgo = (iso: string) => {
  const timestamp = new Date(iso).getTime()
  if (Number.isNaN(timestamp)) return "Just now"
  const diffMs = Date.now() - timestamp
  const minutes = Math.floor(diffMs / 60000)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

const getInitials = (name: string) =>
  name
    .split(" ")
    .map((chunk) => chunk[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()

export default function ExploreView() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { menuButtonRef, menuPanelRef } = useMenuInteractions(isMenuOpen, setIsMenuOpen)
  const router = useRouter()

  const [users, setUsers] = useState<ExploreUser[]>([])
  const [posts, setPosts] = useState<ExplorePost[]>([])
  const [following, setFollowing] = useState<number[]>([])
  const [currentUserId, setCurrentUserId] = useState<number | null>(null)
  const [currentUser, setCurrentUser] = useState<ExploreUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)

  const [postType, setPostType] = useState<"meal" | "activity">("activity")
  const [postTitle, setPostTitle] = useState("")
  const [postSummary, setPostSummary] = useState("")
  const [postCalories, setPostCalories] = useState("")
  const [postProtein, setPostProtein] = useState("")
  const [postCarbs, setPostCarbs] = useState("")
  const [postFats, setPostFats] = useState("")
  const [postDuration, setPostDuration] = useState("")

  const [commentDrafts, setCommentDrafts] = useState<Record<number, string>>({})
  const [openComments, setOpenComments] = useState<Record<number, boolean>>({})

  const [chatUser, setChatUser] = useState<ExploreUser | null>(null)
  const [chatMessage, setChatMessage] = useState("")
  const [chatMessages, setChatMessages] = useState<ExploreMessage[]>([])

  const [directThreads, setDirectThreads] = useState<ExploreThread[]>([])
  const [directUser, setDirectUser] = useState<ExploreUser | null>(null)
  const [directMessages, setDirectMessages] = useState<ExploreMessage[]>([])
  const [directMessage, setDirectMessage] = useState("")

  const [recentMeals, setRecentMeals] = useState<RecentMeal[]>([])
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([])
  const [searchEmail, setSearchEmail] = useState("")
  const [searchResults, setSearchResults] = useState<ExploreUser[]>([])
  const [hasSearched, setHasSearched] = useState(false)
  const [isSearchingUsers, setIsSearchingUsers] = useState(false)
  const [searchError, setSearchError] = useState<string | null>(null)

  const handleNavigation = (path: string) => {
    router.push(path)
    setIsMenuOpen(false)
  }

  useEffect(() => {
    const userStr = localStorage.getItem("calora_user")
    if (!userStr) {
      setLoadError("Please log in to view Explore.")
      setIsLoading(false)
      return
    }
    try {
      const userData = JSON.parse(userStr)
      if (!userData?.id) {
        setLoadError("Missing user information. Please log in again.")
        setIsLoading(false)
        return
      }
      setCurrentUserId(Number(userData.id))
    } catch (err) {
      console.error("Failed to read user", err)
      setLoadError("Unable to read user info. Please log in again.")
      setIsLoading(false)
    }
  }, [])

  const loadUsers = async () => {
    const res = await fetch(`${API_BASE}/explore/users`)
    if (!res.ok) {
      throw new Error("Failed to load explore users")
    }
    const data = await res.json()
    const list = Array.isArray(data) ? data : []
    setUsers(list)
    return list as ExploreUser[]
  }

  const loadPosts = async (userId?: number) => {
    const url = userId ? `${API_BASE}/explore/posts?userId=${userId}` : `${API_BASE}/explore/posts`
    const res = await fetch(url)
    if (!res.ok) {
      throw new Error("Failed to load explore posts")
    }
    const data = await res.json()
    const list = Array.isArray(data) ? data : []
    setPosts(list)
    return list as ExplorePost[]
  }

  const loadFollowing = async (userId: number) => {
    const res = await fetch(`${API_BASE}/explore/users/${userId}/following`)
    if (!res.ok) {
      throw new Error("Failed to load following list")
    }
    const data = await res.json()
    const list = Array.isArray(data) ? data : []
    setFollowing(list.map((user: ExploreUser) => user.id))
    return list as ExploreUser[]
  }

  const loadThreads = async (userId: number) => {
    const res = await fetch(`${API_BASE}/explore/messages/threads?userId=${userId}`)
    if (!res.ok) {
      throw new Error("Failed to load direct message threads")
    }
    const data = await res.json()
    const list = Array.isArray(data) ? data : []
    setDirectThreads(list)
    return list as ExploreThread[]
  }

  useEffect(() => {
    if (!currentUserId) return
    const loadExplore = async () => {
      setIsLoading(true)
      setLoadError(null)
      try {
        const [usersData] = await Promise.all([
          loadUsers(),
          loadPosts(),
          loadFollowing(currentUserId),
          loadThreads(currentUserId),
        ])
        const current = usersData.find((user) => user.id === currentUserId) ?? null
        setCurrentUser(current)
      } catch (err) {
        console.error("Explore load failed", err)
        setLoadError("Unable to load explore data right now.")
      } finally {
        setIsLoading(false)
      }
    }
    loadExplore()
  }, [currentUserId])

  useEffect(() => {
    if (!currentUserId) return
    setCurrentUser(users.find((user) => user.id === currentUserId) ?? null)
  }, [users, currentUserId])

  useEffect(() => {
    const loadRecentData = async () => {
      if (!currentUserId) return
      const userId = currentUserId
      const endDate = new Date()
      const startDate = new Date()
      startDate.setDate(endDate.getDate() - 6)

      const from = startDate.toISOString().slice(0, 10)
      const to = endDate.toISOString().slice(0, 10)

      try {
        const [mealsRes, activitiesRes] = await Promise.all([
          fetch(`${API_BASE}/meals/user/${userId}/range?from=${from}&to=${to}`),
          fetch(`${API_BASE}/activities/user/${userId}/range?from=${from}&to=${to}`),
        ])

        const meals = mealsRes.ok ? await mealsRes.json() : []
        const activities = activitiesRes.ok ? await activitiesRes.json() : []

        if (Array.isArray(meals)) {
          setRecentMeals(
            meals.slice(0, 3).map((meal: any) => ({
              id: meal.id,
              name: meal.name ?? "Meal",
              calories: meal.calories ?? 0,
              protein: meal.protein ?? 0,
              carbs: meal.carbs ?? 0,
              fats: meal.fats ?? 0,
              date: meal.date,
            })),
          )
        }

        if (Array.isArray(activities)) {
          setRecentActivities(
            activities.slice(0, 3).map((activity: any) => ({
              id: activity.id,
              type: activity.type ?? "Activity",
              duration: activity.duration ?? 0,
              caloriesBurned: activity.caloriesBurned ?? 0,
              date: activity.date,
            })),
          )
        }
      } catch (err) {
        console.error("Failed to load recent share data", err)
      }
    }

    loadRecentData()
  }, [currentUserId])

  const sortedPosts = useMemo(
    () => [...posts].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [posts],
  )

  const postsByUser = useMemo(() => {
    return posts.reduce<Record<number, number>>((acc, post) => {
      acc[post.userId] = (acc[post.userId] ?? 0) + 1
      return acc
    }, {})
  }, [posts])

  const isFollowing = (userId: number) => following.includes(userId)

  const peopleToShow = useMemo(() => {
    const source = hasSearched ? searchResults : users
    const filtered = source.filter((user) => user.id !== currentUserId)
    return filtered.slice(0, hasSearched ? 10 : 5)
  }, [hasSearched, searchResults, users, currentUserId])

  const toggleFollow = async (userId: number) => {
    if (!currentUserId) return
    try {
      if (isFollowing(userId)) {
        await fetch(`${API_BASE}/explore/follows?followerId=${currentUserId}&followingId=${userId}`, {
          method: "DELETE",
        })
      } else {
        await fetch(`${API_BASE}/explore/follows`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ followerId: currentUserId, followingId: userId }),
        })
      }
      await Promise.all([loadUsers(), loadFollowing(currentUserId)])
    } catch (err) {
      console.error("Failed to update follow", err)
    }
  }

  const handleSearchUsers = async () => {
    const query = searchEmail.trim()
    if (!query) {
      setHasSearched(false)
      setSearchResults([])
      setSearchError(null)
      return
    }

    setIsSearchingUsers(true)
    setSearchError(null)

    try {
      const requester = currentUserId ? `&requesterId=${currentUserId}` : ""
      const res = await fetch(`${API_BASE}/explore/users/search?email=${encodeURIComponent(query)}${requester}`)
      if (!res.ok) {
        throw new Error("Failed to search users")
      }
      const data = await res.json()
      const list = Array.isArray(data) ? (data as ExploreUser[]) : []
      setSearchResults(list)
      setHasSearched(true)
      if (list.length === 0) {
        setSearchError("No users found with this email.")
      }
    } catch (err) {
      console.error("Failed to search users by email", err)
      setSearchResults([])
      setHasSearched(true)
      setSearchError("Unable to search users right now.")
    } finally {
      setIsSearchingUsers(false)
    }
  }

  const toggleLike = async (postId: number) => {
    if (!currentUserId) return
    try {
      const res = await fetch(`${API_BASE}/explore/posts/${postId}/like?userId=${currentUserId}`, {
        method: "POST",
      })
      if (res.ok) {
        await loadPosts()
      }
    } catch (err) {
      console.error("Failed to toggle like", err)
    }
  }

  const toggleReaction = async (postId: number, emoji: string) => {
    if (!currentUserId) return
    try {
      const res = await fetch(`${API_BASE}/explore/posts/${postId}/reaction`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: currentUserId, emoji }),
      })
      if (res.ok) {
        await loadPosts()
      }
    } catch (err) {
      console.error("Failed to toggle reaction", err)
    }
  }

  const toggleComments = (postId: number) => {
    setOpenComments((prev) => ({ ...prev, [postId]: !prev[postId] }))
  }

  const handleAddComment = async (postId: number) => {
    if (!currentUserId) return
    const text = (commentDrafts[postId] ?? "").trim()
    if (!text) return
    try {
      const res = await fetch(`${API_BASE}/explore/posts/${postId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: currentUserId, text }),
      })
      if (res.ok) {
        setCommentDrafts((prev) => ({ ...prev, [postId]: "" }))
        await loadPosts()
      }
    } catch (err) {
      console.error("Failed to add comment", err)
    }
  }

  const handleCreatePost = async () => {
    if (!currentUserId) return
    if (!postTitle.trim() || !postSummary.trim()) {
      alert("Please add a title and description for your post.")
      return
    }
    const calories = Number.parseInt(postCalories) || 0
    const duration = Number.parseInt(postDuration) || 0
    const protein = Number.parseInt(postProtein) || 0
    const carbs = Number.parseInt(postCarbs) || 0
    const fats = Number.parseInt(postFats) || 0

    try {
      const res = await fetch(`${API_BASE}/explore/posts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: currentUserId,
          type: postType,
          title: postTitle.trim(),
          summary: postSummary.trim(),
          calories: calories,
          protein: postType === "meal" ? protein : undefined,
          carbs: postType === "meal" ? carbs : undefined,
          fats: postType === "meal" ? fats : undefined,
          duration: postType === "activity" ? duration : undefined,
        }),
      })

      if (res.ok) {
        setPostTitle("")
        setPostSummary("")
        setPostCalories("")
        setPostProtein("")
        setPostCarbs("")
        setPostFats("")
        setPostDuration("")
        await loadPosts()
      } else {
        const text = await res.text()
        console.error("Failed to create post", text)
        alert("Unable to post right now.")
      }
    } catch (err) {
      console.error("Failed to create post", err)
      alert("Unable to post right now.")
    }
  }

  const handleShareMeal = (meal: RecentMeal) => {
    setPostType("meal")
    setPostTitle(meal.name)
    setPostSummary("Sharing my recent meal from Calora.")
    setPostCalories(String(meal.calories))
    setPostProtein(String(meal.protein))
    setPostCarbs(String(meal.carbs))
    setPostFats(String(meal.fats))
  }

  const handleShareActivity = (activity: RecentActivity) => {
    setPostType("activity")
    setPostTitle(activity.type)
    setPostSummary("Sharing my recent activity from Calora.")
    setPostCalories(String(activity.caloriesBurned))
    setPostDuration(String(activity.duration))
  }

  const loadConversation = async (targetId: number) => {
    if (!currentUserId) return
    try {
      const res = await fetch(`${API_BASE}/explore/messages?userId=${currentUserId}&with=${targetId}`)
      if (!res.ok) return
      const data = await res.json()
      setChatMessages(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error("Failed to load messages", err)
    }
  }

  const openChat = (user: ExploreUser) => {
    setChatUser(user)
    loadConversation(user.id)
  }

  const loadDirectConversation = async (targetId: number) => {
    if (!currentUserId) return
    try {
      const res = await fetch(`${API_BASE}/explore/messages?userId=${currentUserId}&with=${targetId}`)
      if (!res.ok) return
      const data = await res.json()
      setDirectMessages(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error("Failed to load direct messages", err)
    }
  }

  const handleSelectThread = async (thread: ExploreThread) => {
    const fallbackUser: ExploreUser = {
      id: thread.withUserId,
      name: thread.withName,
      handle: thread.withHandle,
      title: thread.withTitle,
      avatarColor: thread.withAvatarColor || "#4A9782",
      followers: 0,
      following: 0,
      profilePicture: thread.profilePicture ?? null,
    }
    const resolved = users.find((user) => user.id === thread.withUserId) ?? fallbackUser
    setDirectUser(resolved)
    await loadDirectConversation(thread.withUserId)
  }

  const sendMessage = async () => {
    if (!chatUser || !currentUserId) return
    const text = chatMessage.trim()
    if (!text) return
    try {
      const res = await fetch(`${API_BASE}/explore/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fromUserId: currentUserId,
          toUserId: chatUser.id,
          text,
        }),
      })
      if (res.ok) {
        setChatMessage("")
        await Promise.all([loadConversation(chatUser.id), loadThreads(currentUserId)])
      }
    } catch (err) {
      console.error("Failed to send message", err)
    }
  }

  const conversationMessages = chatMessages

  const sendDirectMessage = async () => {
    if (!directUser || !currentUserId) return
    const text = directMessage.trim()
    if (!text) return
    try {
      const res = await fetch(`${API_BASE}/explore/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fromUserId: currentUserId,
          toUserId: directUser.id,
          text,
        }),
      })
      if (res.ok) {
        setDirectMessage("")
        await Promise.all([loadDirectConversation(directUser.id), loadThreads(currentUserId)])
      }
    } catch (err) {
      console.error("Failed to send direct message", err)
    }
  }

  const trendingPosts = useMemo(() => {
    return [...posts]
      .sort((a, b) => {
        const scoreA =
          a.likes.length +
          Object.values(a.reactions).reduce((sum, list) => sum + list.length, 0) +
          a.comments.length
        const scoreB =
          b.likes.length +
          Object.values(b.reactions).reduce((sum, list) => sum + list.length, 0) +
          b.comments.length
        return scoreB - scoreA
      })
      .slice(0, 3)
  }, [posts])

  if (isLoading) {
    return null
  }

  if (loadError) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6" style={{ backgroundColor: "#E7F2EF" }}>
        <div className="max-w-lg text-center">
          <h2 className="text-2xl font-bold" style={{ color: "#004030" }}>
            Explore is unavailable
          </h2>
          <p className="mt-2 text-sm" style={{ color: "#708993" }}>
            {loadError}
          </p>
        </div>
      </div>
    )
  }

  if (!currentUser) {
    return null
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#E7F2EF" }}>
      {/* Header */}
      <header className="border-b" style={{ backgroundColor: "#FFF9E5", borderColor: "#DCD0A8" }}>
        <div className="mx-auto w-full max-w-[1600px] px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                className="rounded-lg bg-transparent"
                style={{
                  borderColor: "#4A9782",
                  color: "#004030",
                }}
                ref={menuButtonRef}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <Menu className={`h-5 w-5 transition-transform duration-300 ${isMenuOpen ? "rotate-180" : "rotate-0"}`} />
              </Button>
              <button
                onClick={() => router.push("/dashboard")}
                className="cursor-pointer transition-opacity hover:opacity-80"
                aria-label="Go to Dashboard"
              >
                <Image src="/images/logo.png" alt="Calora Logo" width={40} height={40} className="h-10 w-10" />
              </button>
              <h1 className="text-2xl font-bold" style={{ color: "#004030" }}>
                Explore
              </h1>
            </div>
            <ProfileAvatarButton onClick={() => router.push("/profile")} />
          </div>
        </div>
      </header>

      {/* Navigation menu dropdown */}
      {isMenuOpen && (
        <div className="relative z-50">
          <div
            className="absolute left-4 top-2 z-50 w-[min(20rem,calc(100vw-2rem))] origin-top-left rounded-lg border shadow-lg animate-in fade-in-0 zoom-in-95 duration-200 sm:left-6"
            ref={menuPanelRef}
            style={{ backgroundColor: "#FFF9E5", borderColor: "#DCD0A8" }}
          >
            <nav className="p-2">
              <button
                className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left transition-colors hover:bg-opacity-50"
                style={{ color: "#004030" }}
                onClick={() => handleNavigation("/dashboard")}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#E7F2EF"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent"
                }}
              >
                <Home className="h-5 w-5" />
                <span className="font-medium">Dashboard</span>
              </button>
              <button
                className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left transition-colors hover:bg-opacity-50"
                style={{ color: "#004030" }}
                onClick={() => handleNavigation("/explore")}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#E7F2EF"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent"
                }}
              >
                <Compass className="h-5 w-5" />
                <span className="font-medium">Explore</span>
              </button>
              <button
                className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left transition-colors hover:bg-opacity-50"
                style={{ color: "#004030" }}
                onClick={() => handleNavigation("/meal-food")}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#E7F2EF"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent"
                }}
              >
                <Utensils className="h-5 w-5" />
                <span className="font-medium">Meal & Food</span>
              </button>
              <button
                className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left transition-colors hover:bg-opacity-50"
                style={{ color: "#004030" }}
                onClick={() => handleNavigation("/food-modal")}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#E7F2EF"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent"
                }}
              >
                <Cookie className="h-5 w-5" />
                <span className="font-medium">Food Modal</span>
              </button>
              <button
                className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left transition-colors hover:bg-opacity-50"
                style={{ color: "#004030" }}
                onClick={() => handleNavigation("/activity-tracking")}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#E7F2EF"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent"
                }}
              >
                <Activity className="h-5 w-5" />
                <span className="font-medium">Activity Tracking</span>
              </button>
              <button
                className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left transition-colors hover:bg-opacity-50"
                style={{ color: "#004030" }}
                onClick={() => handleNavigation("/history")}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#E7F2EF"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent"
                }}
              >
                <History className="h-5 w-5" />
                <span className="font-medium">History</span>
              </button>
            </nav>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="mx-auto w-full max-w-[1600px] px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr),minmax(0,1fr)]">
          <div className="space-y-6">
            <Card style={{ backgroundColor: "#FFF9E5", borderColor: "#DCD0A8" }}>
              <CardHeader>
                <CardTitle style={{ color: "#004030" }}>Share an Update</CardTitle>
                <CardDescription style={{ color: "#708993" }}>
                  Post a recent activity or meal to your community.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2 sm:grid-cols-2">
                  <Button
                    variant="outline"
                    className="transition-all"
                    style={{
                      borderColor: postType === "activity" ? "#4A9782" : "#A1C2BD",
                      color: "#004030",
                      backgroundColor: postType === "activity" ? "#E7F2EF" : "transparent",
                    }}
                    onClick={() => setPostType("activity")}
                  >
                    <Dumbbell className="mr-2 h-4 w-4" />
                    Share Activity
                  </Button>
                  <Button
                    variant="outline"
                    className="transition-all"
                    style={{
                      borderColor: postType === "meal" ? "#4A9782" : "#A1C2BD",
                      color: "#004030",
                      backgroundColor: postType === "meal" ? "#E7F2EF" : "transparent",
                    }}
                    onClick={() => setPostType("meal")}
                  >
                    <Apple className="mr-2 h-4 w-4" />
                    Share Meal
                  </Button>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="post-title" style={{ color: "#004030" }}>
                      Title
                    </Label>
                    <Input
                      id="post-title"
                      value={postTitle}
                      onChange={(e) => setPostTitle(e.target.value)}
                      placeholder={postType === "meal" ? "Meal name" : "Activity title"}
                      style={{ borderColor: "#A1C2BD", backgroundColor: "#FFFFFF", color: "#004030" }}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="post-calories" style={{ color: "#004030" }}>
                      {postType === "meal" ? "Calories" : "Calories Burned"}
                    </Label>
                    <Input
                      id="post-calories"
                      type="number"
                      value={postCalories}
                      onChange={(e) => setPostCalories(e.target.value)}
                      placeholder="0"
                      style={{ borderColor: "#A1C2BD", backgroundColor: "#FFFFFF", color: "#004030" }}
                    />
                  </div>
                </div>

                {postType === "activity" ? (
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="post-duration" style={{ color: "#004030" }}>
                        Duration (minutes)
                      </Label>
                      <Input
                        id="post-duration"
                        type="number"
                        value={postDuration}
                        onChange={(e) => setPostDuration(e.target.value)}
                        placeholder="0"
                        style={{ borderColor: "#A1C2BD", backgroundColor: "#FFFFFF", color: "#004030" }}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                      <Label htmlFor="post-protein" style={{ color: "#004030" }}>
                        Protein (g)
                      </Label>
                      <Input
                        id="post-protein"
                        type="number"
                        value={postProtein}
                        onChange={(e) => setPostProtein(e.target.value)}
                        placeholder="0"
                        style={{ borderColor: "#A1C2BD", backgroundColor: "#FFFFFF", color: "#004030" }}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="post-carbs" style={{ color: "#004030" }}>
                        Carbs (g)
                      </Label>
                      <Input
                        id="post-carbs"
                        type="number"
                        value={postCarbs}
                        onChange={(e) => setPostCarbs(e.target.value)}
                        placeholder="0"
                        style={{ borderColor: "#A1C2BD", backgroundColor: "#FFFFFF", color: "#004030" }}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="post-fats" style={{ color: "#004030" }}>
                        Fats (g)
                      </Label>
                      <Input
                        id="post-fats"
                        type="number"
                        value={postFats}
                        onChange={(e) => setPostFats(e.target.value)}
                        placeholder="0"
                        style={{ borderColor: "#A1C2BD", backgroundColor: "#FFFFFF", color: "#004030" }}
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="post-summary" style={{ color: "#004030" }}>
                    Description
                  </Label>
                  <Textarea
                    id="post-summary"
                    value={postSummary}
                    onChange={(e) => setPostSummary(e.target.value)}
                    placeholder="Share how it went or what you ate..."
                    rows={3}
                    style={{ borderColor: "#A1C2BD", backgroundColor: "#FFFFFF", color: "#004030" }}
                  />
                </div>

                {(recentMeals.length > 0 || recentActivities.length > 0) && (
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-lg border p-3" style={{ borderColor: "#DCD0A8", backgroundColor: "#FFFFFF" }}>
                      <p className="text-sm font-semibold" style={{ color: "#004030" }}>
                        Share a Recent Meal
                      </p>
                      <div className="mt-2 space-y-2">
                        {recentMeals.map((meal) => (
                          <div
                            key={meal.id ?? meal.name}
                            className="flex items-center justify-between rounded-md border px-3 py-2"
                            style={{ borderColor: "#A1C2BD" }}
                          >
                            <div>
                              <p className="text-sm font-medium" style={{ color: "#004030" }}>
                                {meal.name}
                              </p>
                              <p className="text-xs" style={{ color: "#708993" }}>
                                {meal.calories} cal | P {meal.protein}g | C {meal.carbs}g | F {meal.fats}g
                              </p>
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              className="bg-transparent"
                              style={{ borderColor: "#4A9782", color: "#004030" }}
                              onClick={() => handleShareMeal(meal)}
                            >
                              Share
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="rounded-lg border p-3" style={{ borderColor: "#DCD0A8", backgroundColor: "#FFFFFF" }}>
                      <p className="text-sm font-semibold" style={{ color: "#004030" }}>
                        Share a Recent Activity
                      </p>
                      <div className="mt-2 space-y-2">
                        {recentActivities.map((activity) => (
                          <div
                            key={activity.id ?? activity.type}
                            className="flex items-center justify-between rounded-md border px-3 py-2"
                            style={{ borderColor: "#A1C2BD" }}
                          >
                            <div>
                              <p className="text-sm font-medium" style={{ color: "#004030" }}>
                                {activity.type}
                              </p>
                              <p className="text-xs" style={{ color: "#708993" }}>
                                {activity.duration} min | {activity.caloriesBurned} cal
                              </p>
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              className="bg-transparent"
                              style={{ borderColor: "#4A9782", color: "#004030" }}
                              onClick={() => handleShareActivity(activity)}
                            >
                              Share
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                <Button
                  className="w-full transition-all"
                  style={{ backgroundColor: "#4A9782", color: "#FFF9E5" }}
                  onClick={handleCreatePost}
                >
                  <Compass className="mr-2 h-5 w-5" />
                  Post to Explore
                </Button>
              </CardContent>
            </Card>

            <div className="space-y-4">
              {sortedPosts.map((post) => {
                const user = users.find((item) => item.id === post.userId)
                if (!user) return null
                const liked = post.likes.includes(currentUser.id)
                const reactionCounts = Object.entries(post.reactions)
                return (
                  <Card key={post.id} style={{ backgroundColor: "#FFF9E5", borderColor: "#DCD0A8" }}>
                    <CardHeader className="space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div
                            className="flex h-12 w-12 items-center justify-center rounded-full text-sm font-semibold"
                            style={{ backgroundColor: user.avatarColor, color: "#004030" }}
                          >
                            {getInitials(user.name)}
                          </div>
                          <div>
                            <p className="font-semibold" style={{ color: "#004030" }}>
                              {user.name}
                            </p>
                            <div className="flex items-center gap-2 text-xs" style={{ color: "#708993" }}>
                              <span>{user.handle}</span>
                              <span>|</span>
                              <span>{timeAgo(post.createdAt)}</span>
                            </div>
                          </div>
                        </div>
                        {user.id !== currentUser.id && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="bg-transparent"
                            style={{
                              borderColor: isFollowing(user.id) ? "#4A9782" : "#A1C2BD",
                              color: "#004030",
                            }}
                            onClick={() => toggleFollow(user.id)}
                          >
                            {isFollowing(user.id) ? (
                              <>
                                <UserCheck className="mr-1 h-4 w-4" />
                                Following
                              </>
                            ) : (
                              <>
                                <UserPlus className="mr-1 h-4 w-4" />
                                Follow
                              </>
                            )}
                          </Button>
                        )}
                      </div>

                      <div className="space-y-2">
                        <p className="text-lg font-semibold" style={{ color: "#004030" }}>
                          {post.title}
                        </p>
                        <p className="text-sm" style={{ color: "#708993" }}>
                          {post.summary}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <span
                          className="rounded-full px-3 py-1 text-xs font-semibold"
                          style={{ backgroundColor: "#E7F2EF", color: "#004030" }}
                        >
                          {post.type === "meal" ? "Meal Share" : "Activity Share"}
                        </span>
                        <span
                          className="rounded-full px-3 py-1 text-xs font-semibold"
                          style={{ backgroundColor: "#FFF9E5", border: "1px solid #DCD0A8", color: "#004030" }}
                        >
                          {post.calories} cal
                        </span>
                        {post.type === "activity" && (
                          <span
                            className="rounded-full px-3 py-1 text-xs font-semibold"
                            style={{ backgroundColor: "#FFF9E5", border: "1px solid #DCD0A8", color: "#004030" }}
                          >
                            {post.duration ?? 0} min
                          </span>
                        )}
                        {post.type === "meal" && (
                          <>
                            <span
                              className="rounded-full px-3 py-1 text-xs font-semibold"
                              style={{ backgroundColor: "#FFF9E5", border: "1px solid #DCD0A8", color: "#004030" }}
                            >
                              P {post.protein ?? 0}g
                            </span>
                            <span
                              className="rounded-full px-3 py-1 text-xs font-semibold"
                              style={{ backgroundColor: "#FFF9E5", border: "1px solid #DCD0A8", color: "#004030" }}
                            >
                              C {post.carbs ?? 0}g
                            </span>
                            <span
                              className="rounded-full px-3 py-1 text-xs font-semibold"
                              style={{ backgroundColor: "#FFF9E5", border: "1px solid #DCD0A8", color: "#004030" }}
                            >
                              F {post.fats ?? 0}g
                            </span>
                          </>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex flex-wrap items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="bg-transparent"
                          style={{ borderColor: "#DCD0A8", color: liked ? "#D96464" : "#004030" }}
                          onClick={() => toggleLike(post.id)}
                        >
                          <Heart
                            className="mr-2 h-4 w-4"
                            style={{ color: liked ? "#D96464" : "#004030", fill: liked ? "#D96464" : "none" }}
                          />
                          {post.likes.length} Likes
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="bg-transparent"
                          style={{ borderColor: "#DCD0A8", color: "#004030" }}
                          onClick={() => toggleComments(post.id)}
                        >
                          <MessageCircle className="mr-2 h-4 w-4" />
                          {post.comments.length} Comments
                        </Button>
                        {user.id !== currentUser.id && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="bg-transparent"
                            style={{ borderColor: "#DCD0A8", color: "#004030" }}
                            onClick={() => openChat(user)}
                          >
                            <Send className="mr-2 h-4 w-4" />
                            Direct
                          </Button>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        {reactionOptions.map((emoji) => {
                          const reacted = post.reactions[emoji]?.includes(currentUser.id)
                          return (
                            <button
                              key={`${post.id}-${emoji}`}
                              type="button"
                              className="rounded-full border px-3 py-1 text-sm transition-all"
                              style={{
                                borderColor: reacted ? "#4A9782" : "#DCD0A8",
                                backgroundColor: reacted ? "#E7F2EF" : "#FFFFFF",
                              }}
                              onClick={() => toggleReaction(post.id, emoji)}
                            >
                              {emoji}
                            </button>
                          )
                        })}
                        {reactionCounts.length > 0 && (
                          <div className="flex flex-wrap gap-2 text-xs" style={{ color: "#004030" }}>
                            {reactionCounts.map(([emoji, list]) => (
                              <span
                                key={`${post.id}-${emoji}-count`}
                                className="rounded-full px-3 py-1"
                                style={{ backgroundColor: "#E7F2EF" }}
                              >
                                {emoji} {list.length}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {openComments[post.id] && (
                        <div className="space-y-3 rounded-lg border p-3" style={{ borderColor: "#DCD0A8" }}>
                          {post.comments.length > 0 ? (
                            post.comments.map((comment) => {
                              const commentUser = users.find((item) => item.id === comment.userId)
                              return (
                                <div key={comment.id} className="text-sm">
                                  <span className="font-semibold" style={{ color: "#004030" }}>
                                    {commentUser?.name ?? "Community"}
                                  </span>
                                  <span className="ml-2" style={{ color: "#708993" }}>
                                    {comment.text}
                                  </span>
                                </div>
                              )
                            })
                          ) : (
                            <p className="text-sm" style={{ color: "#708993" }}>
                              Be the first to comment.
                            </p>
                          )}
                          <div className="flex flex-col gap-2 sm:flex-row">
                            <Input
                              value={commentDrafts[post.id] ?? ""}
                              onChange={(e) =>
                                setCommentDrafts((prev) => ({ ...prev, [post.id]: e.target.value }))
                              }
                              placeholder="Write a comment..."
                              style={{ borderColor: "#A1C2BD", backgroundColor: "#FFFFFF", color: "#004030" }}
                            />
                            <Button
                              className="transition-all"
                              style={{ backgroundColor: "#4A9782", color: "#FFF9E5" }}
                              onClick={() => handleAddComment(post.id)}
                            >
                              Post
                            </Button>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>

          <div className="space-y-6">
            <Card style={{ backgroundColor: "#FFF9E5", borderColor: "#DCD0A8" }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2" style={{ color: "#004030" }}>
                  <Users className="h-5 w-5" style={{ color: "#4A9782" }} />
                  Suggested People
                </CardTitle>
                <CardDescription style={{ color: "#708993" }}>Follow and connect with the community.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2 rounded-lg border p-3" style={{ borderColor: "#DCD0A8", backgroundColor: "#FFFFFF" }}>
                  <Label htmlFor="searchByEmail" style={{ color: "#004030" }}>
                    Search by Email
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id="searchByEmail"
                      value={searchEmail}
                      onChange={(e) => setSearchEmail(e.target.value)}
                      placeholder="example@email.com"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault()
                          handleSearchUsers()
                        }
                      }}
                      style={{ borderColor: "#A1C2BD", backgroundColor: "#FFFFFF", color: "#004030" }}
                    />
                    <Button
                      className="transition-all"
                      style={{ backgroundColor: "#4A9782", color: "#FFF9E5" }}
                      onClick={handleSearchUsers}
                      disabled={isSearchingUsers}
                    >
                      <Search className="mr-1 h-4 w-4" />
                      {isSearchingUsers ? "Searching..." : "Search"}
                    </Button>
                    {hasSearched && (
                      <Button
                        variant="outline"
                        className="bg-transparent"
                        style={{ borderColor: "#A1C2BD", color: "#004030" }}
                        onClick={() => {
                          setSearchEmail("")
                          setSearchResults([])
                          setHasSearched(false)
                          setSearchError(null)
                        }}
                      >
                        Clear
                      </Button>
                    )}
                  </div>
                  {searchError && (
                    <p className="text-xs" style={{ color: "#708993" }}>
                      {searchError}
                    </p>
                  )}
                </div>
                {peopleToShow.map((user) => {
                    const followerCount = user.followers + (isFollowing(user.id) ? 1 : 0)
                    const postCount = postsByUser[user.id] ?? 0
                    return (
                      <div
                        key={user.id}
                        className="flex items-center justify-between rounded-lg border p-3"
                        style={{ borderColor: "#DCD0A8", backgroundColor: "#FFFFFF" }}
                      >
                        <div>
                          <p className="font-semibold" style={{ color: "#004030" }}>
                            {user.name}
                          </p>
                          {user.email && (
                            <p className="text-xs" style={{ color: "#708993" }}>
                              {user.email}
                            </p>
                          )}
                          <p className="text-xs" style={{ color: "#708993" }}>
                            {user.title} | {followerCount} {followerCount === 1 ? "follower" : "followers"} | {postCount} {postCount === 1 ? "post" : "posts"}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="bg-transparent"
                            style={{ borderColor: "#A1C2BD", color: "#004030" }}
                            onClick={() => toggleFollow(user.id)}
                          >
                            {isFollowing(user.id) ? "Following" : "Follow"}
                          </Button>
                          <Button
                            size="sm"
                            className="transition-all"
                            style={{ backgroundColor: "#4A9782", color: "#FFF9E5" }}
                            onClick={() => openChat(user)}
                          >
                            Chat
                          </Button>
                        </div>
                      </div>
                    )
                  })}
                {peopleToShow.length === 0 && (
                  <p className="text-sm" style={{ color: "#708993" }}>
                    No users to show yet. Try searching by email.
                  </p>
                )}
              </CardContent>
            </Card>

            <Card style={{ backgroundColor: "#FFF9E5", borderColor: "#DCD0A8" }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2" style={{ color: "#004030" }}>
                  <Flame className="h-5 w-5" style={{ color: "#FFC50F" }} />
                  Trending Posts
                </CardTitle>
                <CardDescription style={{ color: "#708993" }}>Most active discussions right now.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {trendingPosts.map((post) => {
                  const user = users.find((item) => item.id === post.userId)
                  if (!user) return null
                  return (
                    <div
                      key={post.id}
                      className="rounded-lg border p-3"
                      style={{ borderColor: "#DCD0A8", backgroundColor: "#FFFFFF" }}
                    >
                      <p className="text-sm font-semibold" style={{ color: "#004030" }}>
                        {post.title}
                      </p>
                      <p className="text-xs" style={{ color: "#708993" }}>
                        {user.name} | {post.likes.length + post.comments.length} interactions
                      </p>
                    </div>
                  )
                })}
                {trendingPosts.length === 0 && (
                  <p className="text-sm" style={{ color: "#708993" }}>
                    No trending posts yet. Start the conversation!
                  </p>
                )}
              </CardContent>
            </Card>

            <Card style={{ backgroundColor: "#FFF9E5", borderColor: "#DCD0A8" }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2" style={{ color: "#004030" }}>
                  <Send className="h-5 w-5" style={{ color: "#4A9782" }} />
                  Direct Messages
                </CardTitle>
                <CardDescription style={{ color: "#708993" }}>
                  Chat with people you have messaged.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="max-h-56 space-y-3 overflow-y-auto rounded-lg border p-3" style={{ borderColor: "#DCD0A8" }}>
                  {directThreads.length > 0 ? (
                    directThreads.map((thread) => {
                      const isActive = directUser?.id === thread.withUserId
                      return (
                        <button
                          key={thread.withUserId}
                          type="button"
                          className="flex w-full flex-col rounded-lg border p-3 text-left transition-colors"
                          style={{
                            borderColor: isActive ? "#4A9782" : "#E7F2EF",
                            backgroundColor: isActive ? "#E7F2EF" : "#FFFFFF",
                          }}
                          onClick={() => handleSelectThread(thread)}
                        >
                          <span className="text-sm font-semibold" style={{ color: "#004030" }}>
                            {thread.withName}
                          </span>
                          <span className="text-xs" style={{ color: "#708993" }}>
                            {thread.lastMessage}
                          </span>
                        </button>
                      )
                    })
                  ) : (
                    <p className="text-sm" style={{ color: "#708993" }}>
                      No direct messages yet. Start a chat from a post.
                    </p>
                  )}
                </div>

                {directUser ? (
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-semibold" style={{ color: "#004030" }}>
                        {directUser.name}
                      </p>
                      <p className="text-xs" style={{ color: "#708993" }}>
                        {directUser.handle} • {directUser.title}
                      </p>
                    </div>
                    <div className="max-h-48 space-y-2 overflow-y-auto rounded-lg border p-3" style={{ borderColor: "#DCD0A8" }}>
                      {directMessages.length > 0 ? (
                        directMessages.map((message) => (
                          <div
                            key={message.id}
                            className={`max-w-[80%] rounded-lg px-3 py-2 text-xs ${message.fromUserId === currentUser.id ? "ml-auto" : ""}`}
                            style={{
                              backgroundColor: message.fromUserId === currentUser.id ? "#4A9782" : "#E7F2EF",
                              color: message.fromUserId === currentUser.id ? "#FFF9E5" : "#004030",
                            }}
                          >
                            {message.text}
                          </div>
                        ))
                      ) : (
                        <p className="text-xs" style={{ color: "#708993" }}>
                          No messages yet. Say hello!
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col gap-2 sm:flex-row">
                      <Input
                        value={directMessage}
                        onChange={(e) => setDirectMessage(e.target.value)}
                        placeholder="Type a reply..."
                        style={{ borderColor: "#A1C2BD", backgroundColor: "#FFFFFF", color: "#004030" }}
                      />
                      <Button
                        className="transition-all"
                        style={{ backgroundColor: "#4A9782", color: "#FFF9E5" }}
                        onClick={sendDirectMessage}
                      >
                        Send
                      </Button>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm" style={{ color: "#708993" }}>
                    Select a conversation to view and reply.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Dialog
        open={!!chatUser}
        onOpenChange={(open) => {
          if (!open) {
            setChatUser(null)
            setChatMessages([])
          }
        }}
      >
        <DialogContent className="sm:max-w-lg" style={{ backgroundColor: "#FFF9E5", borderColor: "#DCD0A8" }}>
          <DialogHeader>
            <DialogTitle style={{ color: "#004030" }}>
              Direct Chat {chatUser ? `with ${chatUser.name}` : ""}
            </DialogTitle>
          </DialogHeader>
          <div className="flex max-h-80 flex-col gap-3 overflow-y-auto rounded-lg border p-4" style={{ borderColor: "#DCD0A8" }}>
            {conversationMessages.length > 0 ? (
              conversationMessages.map((message) => (
                <div
                  key={message.id}
                  className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                    message.fromUserId === currentUser.id ? "self-end" : "self-start"
                  }`}
                  style={{
                    backgroundColor: message.fromUserId === currentUser.id ? "#4A9782" : "#E7F2EF",
                    color: message.fromUserId === currentUser.id ? "#FFF9E5" : "#004030",
                  }}
                >
                  {message.text}
                </div>
              ))
            ) : (
              <p className="text-sm" style={{ color: "#708993" }}>
                Say hello and start a new conversation.
              </p>
            )}
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Input
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              placeholder="Type a message..."
              style={{ borderColor: "#A1C2BD", backgroundColor: "#FFFFFF", color: "#004030" }}
            />
            <Button
              className="transition-all"
              style={{ backgroundColor: "#4A9782", color: "#FFF9E5" }}
              onClick={sendMessage}
            >
              Send
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}


