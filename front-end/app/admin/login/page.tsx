"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function AdminLoginPage() {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  })
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // 간단한 로그인 검증 (실제로는 서버에서 처리)
    if (credentials.username === "admin" && credentials.password === "giga2024") {
      localStorage.setItem("adminAuth", "true")
      router.push("/admin")
    } else {
      setError("아이디 또는 비밀번호가 올바르지 않습니다.")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">GIGA Interior</CardTitle>
          <p className="text-gray-600">관리자 로그인</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium mb-2">
                아이디
              </label>
              <Input
                id="username"
                type="text"
                value={credentials.username}
                onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2">
                비밀번호
              </label>
              <Input
                id="password"
                type="password"
                value={credentials.password}
                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                required
              />
            </div>

            {error && <div className="text-red-600 text-sm">{error}</div>}

            <Button type="submit" className="w-full bg-black text-white hover:bg-gray-800">
              로그인
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
