"use client"

import { useEffect, useState, type CSSProperties, type MouseEventHandler } from "react"
import { Button } from "@/components/ui/button"
import { User } from "lucide-react"

type ProfileAvatarButtonProps = {
  onClick: () => void
  className?: string
  style?: CSSProperties
  onMouseEnter?: MouseEventHandler<HTMLButtonElement>
  onMouseLeave?: MouseEventHandler<HTMLButtonElement>
}

export default function ProfileAvatarButton({
  onClick,
  className,
  style,
  onMouseEnter,
  onMouseLeave,
}: ProfileAvatarButtonProps) {
  const [profilePicture, setProfilePicture] = useState<string | null>(null)

  useEffect(() => {
    const userStr = localStorage.getItem("calora_user")
    if (!userStr) return
    try {
      const user = JSON.parse(userStr)
      if (user?.profilePicture) {
        const resolved = user.profilePicture.startsWith("http")
          ? user.profilePicture
          : `http://localhost:8080${user.profilePicture}`
        setProfilePicture(resolved)
      }
    } catch {
      // Ignore malformed storage
    }
  }, [])

  return (
    <Button
      variant="outline"
      size="icon"
      className={`rounded-full bg-transparent overflow-hidden ${className ?? ""}`}
      style={{
        borderColor: "#4A9782",
        color: "#004030",
        ...style,
      }}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      aria-label="Open profile"
    >
      {profilePicture ? (
        <img src={profilePicture} alt="User" className="h-full w-full object-cover" />
      ) : (
        <User className="h-5 w-5" />
      )}
    </Button>
  )
}
