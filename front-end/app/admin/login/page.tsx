"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { env } from "@/lib/env"
import { adminAuthApi } from "@/lib/api"

export default function AdminLoginPage() {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  })
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    try {
      const result = await adminAuthApi.login(credentials)
      localStorage.setItem(env.adminAuthStorageKey, result.accessToken)
      router.push("/admin")
      return
    } catch (apiError) {
      // Fall through to optional mock login when enabled (local-only convenience)
      if (!env.enableMockAdminLogin) {
        setError(apiError instanceof Error ? apiError.message : "로그인에 실패했습니다.")
        return
      }
    }

    // 개발용 mock 로그인 fallback (API 미구현/미기동 시 로컬 개발용)
    const mockLoginEnabled = env.enableMockAdminLogin
    const mockUsername = env.mockAdminUsername
    const mockPassword = env.mockAdminPassword

    if (
      mockLoginEnabled &&
      mockUsername &&
      mockPassword &&
      credentials.username === mockUsername &&
      credentials.password === mockPassword
    ) {
      localStorage.setItem(env.adminAuthStorageKey, "mock")
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

            {!env.enableMockAdminLogin && (
              <div className="text-xs text-gray-500">
                개발 중 임시 로그인 사용 시 `NEXT_PUBLIC_ENABLE_MOCK_ADMIN_LOGIN=true`와 mock 계정을 `.env.local`에 설정하세요.
              </div>
            )}

            <Button type="submit" className="w-full bg-black text-white hover:bg-gray-800">
              로그인
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
