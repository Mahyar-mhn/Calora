"use client"

import { useEffect, useRef } from "react"

export function useMenuInteractions(
  isMenuOpen: boolean,
  setIsMenuOpen: (open: boolean) => void,
) {
  const menuButtonRef = useRef<HTMLButtonElement | null>(null)
  const menuPanelRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!isMenuOpen) return

    const handleOutsideClick = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node
      if (menuPanelRef.current?.contains(target)) return
      if (menuButtonRef.current?.contains(target)) return
      setIsMenuOpen(false)
    }

    document.addEventListener("mousedown", handleOutsideClick)
    document.addEventListener("touchstart", handleOutsideClick)

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick)
      document.removeEventListener("touchstart", handleOutsideClick)
    }
  }, [isMenuOpen, setIsMenuOpen])

  return { menuButtonRef, menuPanelRef }
}
