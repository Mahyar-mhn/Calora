import type React from "react"
import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Calora - Intelligent Calorie & Health Management",
  description: "Privacy-first health tracking platform for nutrition and activity monitoring",
  generator: "Calora",
  icons: {
    icon: [
      {
        url: "/images/logo.png",
        type: "image/png",
      },
    ],
    apple: "/images/logo.png",
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased min-h-dvh w-full text-base`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
