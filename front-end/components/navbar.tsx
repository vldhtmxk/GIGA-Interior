"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { name: "소개", href: "/about" },
  { name: "브랜드 스토리", href: "/brand-story" },
  { name: "포트폴리오", href: "/portfolio" },
  { name: "프로세스", href: "/process" },
  { name: "문의", href: "/contact" },
  { name: "클라이언트", href: "/clients" },
  { name: "채용", href: "/recruit" },
  { name: "소식", href: "/board" },
]

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center">
          <Link href="/" className="text-xl font-bold tracking-tight">
            GIGA Interni
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-black/80",
                pathname === item.href ? "text-black" : "text-muted-foreground",
              )}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Mobile Menu Button */}
        <button type="button" className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          <span className="sr-only">Toggle menu</span>
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden">
          <div className="fixed inset-0 z-50 bg-white">
            <div className="flex h-16 items-center justify-between px-4 border-b">
              <div className="text-xl font-bold tracking-tight">INTERIOR STUDIO</div>
              <button type="button" onClick={() => setMobileMenuOpen(false)}>
                <X className="h-6 w-6" />
                <span className="sr-only">Close menu</span>
              </button>
            </div>
            <nav className="mt-8 px-4">
              <ul className="space-y-4">
                {navItems.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "block py-2 text-base font-medium transition-colors hover:text-black/80",
                        pathname === item.href ? "text-black" : "text-muted-foreground",
                      )}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      )}
    </header>
  )
}
