"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { name: "About", href: "/about" },
  { name: "Portfolio", href: "/portfolio" },
  { name: "Process", href: "/process" },
  { name: "Contact", href: "/contact" },
  { name: "Clients", href: "/clients" },
  { name: "Careers", href: "/recruit" },
  { name: "News", href: "/board" },
]

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const mobileMenuRef = useRef<HTMLDivElement | null>(null)
  const scrollYRef = useRef(0)
  const pathname = usePathname()
  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`)

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false)
      }
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    if (!mobileMenuOpen) {
      const lockedY = scrollYRef.current
      document.body.style.overflow = ""
      document.body.style.position = ""
      document.body.style.top = ""
      document.body.style.left = ""
      document.body.style.right = ""
      document.body.style.width = ""
      if (lockedY > 0) {
        window.scrollTo(0, lockedY)
      }
      return
    }
    scrollYRef.current = window.scrollY
    document.body.style.overflow = "hidden"
    document.body.style.position = "fixed"
    document.body.style.top = `-${scrollYRef.current}px`
    document.body.style.left = "0"
    document.body.style.right = "0"
    document.body.style.width = "100%"
    mobileMenuRef.current?.scrollTo({ top: 0, behavior: "auto" })
    return () => {
      document.body.style.overflow = ""
      document.body.style.position = ""
      document.body.style.top = ""
      document.body.style.left = ""
      document.body.style.right = ""
      document.body.style.width = ""
    }
  }, [mobileMenuOpen])

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 border-b transition-all duration-500",
        scrolled ? "bg-[#0a0a0a]/95 backdrop-blur-md giga-border-soft" : "border-transparent bg-transparent",
      )}
    >
      <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-5 lg:px-12">
        <Link href="/" className="relative z-10">
          <div className="flex flex-col leading-none">
            <span className="giga-display text-2xl font-light tracking-[0.15em] text-white">GIGA</span>
            <span className="text-[9px] uppercase tracking-[0.3em] text-[#c9a96e]">INTERIOR</span>
          </div>
        </Link>

        <nav className="hidden items-center gap-10 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group relative text-[11px] uppercase tracking-[0.2em] transition-colors duration-300",
                isActive(item.href) ? "text-[#c9a96e]" : "text-white/70 hover:text-white",
              )}
            >
              {item.name}
              <span
                className={cn(
                  "absolute -bottom-1 left-0 h-px bg-[#c9a96e] transition-all duration-300",
                  isActive(item.href) ? "w-full" : "w-0 group-hover:w-full",
                )}
              />
            </Link>
          ))}
        </nav>

        <Link
          href="/contact"
          className="hidden border border-[#c9a96e]/40 px-5 py-2.5 text-[10px] uppercase tracking-[0.22em] text-[#c9a96e] transition-all duration-300 hover:bg-[#c9a96e] hover:text-[#0a0a0a] lg:flex"
        >
          Free Consult
        </Link>

        <button
          type="button"
          className="z-10 inline-flex h-10 w-10 items-center justify-center text-white lg:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-nav"
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          <span className="sr-only">Toggle menu</span>
        </button>
      </div>

      <div
        id="mobile-nav"
        ref={mobileMenuRef}
        className={cn(
          "fixed inset-0 overflow-y-auto bg-[#0a0a0a] px-6 transition-all duration-300 lg:hidden",
          mobileMenuOpen ? "visible opacity-100 giga-menu-pop" : "invisible pointer-events-none opacity-0",
        )}
        style={{
          touchAction: "pan-y",
          height: "100dvh",
          paddingTop: "max(5.5rem, env(safe-area-inset-top))",
          paddingBottom: "max(1.25rem, env(safe-area-inset-bottom))",
        }}
      >
        <nav
          className={cn(
            "mx-auto flex w-full max-w-md flex-col justify-center transition-transform duration-300 ease-out",
            mobileMenuOpen ? "translate-y-0" : "-translate-y-4",
          )}
          style={{ minHeight: "calc(100dvh - max(5.5rem, env(safe-area-inset-top)) - max(1.25rem, env(safe-area-inset-bottom)))" }}
        >
          <ul className="w-full space-y-2 py-2 text-center">
            {navItems.map((item, index) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "giga-display giga-item-rise block w-full py-1 text-[clamp(1.05rem,3.1vh,1.45rem)] font-light uppercase tracking-[0.09em] transition-all duration-300",
                    mobileMenuOpen ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0",
                    isActive(item.href)
                      ? "text-[#c9a96e]"
                      : "text-white/80 hover:text-[#c9a96e] hover:translate-x-1 active:text-[#c9a96e]",
                  )}
                  style={{
                    transitionDelay: mobileMenuOpen ? `${70 + index * 45}ms` : "0ms",
                    animationDelay: mobileMenuOpen ? `${70 + index * 45}ms` : "0ms",
                  }}
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
          <div className="flex justify-center px-2 pb-2 pt-2">
            <Link
              href="/contact"
              className={cn(
                "inline-flex border border-[#c9a96e] px-8 py-3 text-xs uppercase tracking-[0.25em] text-[#c9a96e] transition-all duration-300 hover:bg-[#c9a96e] hover:text-[#0a0a0a]",
                mobileMenuOpen ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0",
              )}
              style={{ transitionDelay: mobileMenuOpen ? "420ms" : "0ms" }}
            >
              Free Consult
            </Link>
          </div>
        </nav>
      </div>
    </header>
  )
}
