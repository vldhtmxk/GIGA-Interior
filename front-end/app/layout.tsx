'use client'

import type React from "react"
import { Cormorant_Garamond, Inter, Space_Grotesk } from "next/font/google"
import { usePathname } from "next/navigation"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const cormorant = Cormorant_Garamond({ subsets: ["latin"], variable: "--font-cormorant", weight: ["300", "400", "500", "600"] })
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space-grotesk" })

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const pathname = usePathname()
  const isAdmin = pathname.startsWith('/admin')

  return (
    <html lang="ko" suppressHydrationWarning>
      <body className={`${inter.variable} ${cormorant.variable} ${spaceGrotesk.variable} min-h-screen flex flex-col`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          {!isAdmin && <Navbar />}
          {children}
          {!isAdmin && <Footer />}
        </ThemeProvider>
      </body>
    </html>
  )
}
