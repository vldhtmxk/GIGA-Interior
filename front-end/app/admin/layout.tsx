"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home, Users, Briefcase, MessageSquare, UserCheck, Settings, LogOut, Menu, X } from "lucide-react"
import { env } from "@/lib/env"
import { adminAuthApi } from "@/lib/api"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const auth = localStorage.getItem(env.adminAuthStorageKey)
    if (pathname === "/admin/login") return

    if (!auth) {
      router.push("/admin/login")
      return
    }

    if (auth === "mock") {
      setIsAuthenticated(true)
      return
    }

    let cancelled = false

    void adminAuthApi
      .me(auth)
      .then(() => {
        if (!cancelled) {
          setIsAuthenticated(true)
        }
      })
      .catch(() => {
        localStorage.removeItem(env.adminAuthStorageKey)
        if (!cancelled) {
          setIsAuthenticated(false)
          router.push("/admin/login")
        }
      })

    return () => {
      cancelled = true
    }
  }, [pathname, router])

  const handleLogout = () => {
    const token = localStorage.getItem(env.adminAuthStorageKey)
    localStorage.removeItem(env.adminAuthStorageKey)
    if (token && token !== "mock") {
      void fetch(`${env.apiBaseUrl}/api/admin/auth/logout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).catch(() => undefined)
    }
    router.push("/admin/login")
  }

  if (pathname === "/admin/login") {
    return children
  }

  if (!isAuthenticated) {
    return <div>Loading...</div>
  }

  const navigation = [
    { name: "대시보드", href: "/admin", icon: Home },
    { name: "홈페이지 관리", href: "/admin/home", icon: Settings },
    { name: "회사 정보", href: "/admin/about", icon: Users },
    { name: "포트폴리오", href: "/admin/portfolio", icon: Briefcase },
    { name: "고객사/파트너", href: "/admin/clients", icon: UserCheck },
    { name: "채용 관리", href: "/admin/recruit", icon: Users },
    { name: "문의", href: "/admin/board", icon: MessageSquare },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button variant="outline" size="sm" onClick={() => setSidebarOpen(!sidebarOpen)}>
          {sidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </Button>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div className="flex flex-col h-full">
          <div className="p-6 border-b">
            <h1 className="text-xl font-bold">GIGA Interior</h1>
            <p className="text-sm text-gray-600">관리자 패널</p>
          </div>

          <nav className="flex-1 p-4 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                    isActive ? "bg-black text-white" : "text-gray-700 hover:bg-gray-100"
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <Icon className="w-5 h-5" />
                  {item.name}
                </Link>
              )
            })}
          </nav>

          <div className="p-4 border-t">
            <Button variant="outline" className="w-full" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              로그아웃
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:ml-64">
        <main className="p-6">{children}</main>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}
    </div>
  )
}
