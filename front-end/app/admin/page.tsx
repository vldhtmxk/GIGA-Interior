"use client"

import { useEffect, useMemo, useState } from "react"
import { Briefcase, MessageSquare, UserCheck, Users } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  adminApplicantApi,
  adminClientApi,
  adminInquiryApi,
  adminPortfolioApi,
  adminRecruitApi,
  type ApplicantResponse,
  type InquiryResponse,
} from "@/lib/api"
import { env } from "@/lib/env"

type DashboardStats = {
  portfolioCount: number
  applicantCount: number
  inquiryCount: number
  clientCount: number
}

const initialStats: DashboardStats = {
  portfolioCount: 0,
  applicantCount: 0,
  inquiryCount: 0,
  clientCount: 0,
}

function getToken(): string {
  const token = localStorage.getItem(env.adminAuthStorageKey)
  if (!token || token === "mock") {
    throw new Error("관리자 인증 토큰이 없습니다. 다시 로그인해주세요.")
  }
  return token
}

function formatDate(value?: string | null) {
  if (!value) return "-"
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleDateString("ko-KR")
}

function toTimestamp(value?: string | null) {
  if (!value) return 0
  const time = new Date(value).getTime()
  return Number.isNaN(time) ? 0 : time
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>(initialStats)
  const [recentApplicants, setRecentApplicants] = useState<ApplicantResponse[]>([])
  const [recentInquiries, setRecentInquiries] = useState<InquiryResponse[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  const statCards = useMemo(
    () => [
      {
        title: "총 포트폴리오",
        value: stats.portfolioCount.toLocaleString("ko-KR"),
        icon: Briefcase,
        color: "text-blue-600",
      },
      {
        title: "채용 지원자",
        value: stats.applicantCount.toLocaleString("ko-KR"),
        icon: Users,
        color: "text-green-600",
      },
      {
        title: "문의",
        value: stats.inquiryCount.toLocaleString("ko-KR"),
        icon: MessageSquare,
        color: "text-purple-600",
      },
      {
        title: "고객사/파트너",
        value: stats.clientCount.toLocaleString("ko-KR"),
        icon: UserCheck,
        color: "text-orange-600",
      },
    ],
    [stats],
  )

  useEffect(() => {
    let isMounted = true

    const loadDashboard = async () => {
      setIsLoading(true)
      setError("")
      try {
        const token = getToken()

        const [portfolios, recruits, clients, inquiryList] = await Promise.all([
          adminPortfolioApi.getAll(token),
          adminRecruitApi.getAll(token),
          adminClientApi.getAll(token),
          adminInquiryApi.getAll(token, { page: 0, size: 5, sort: "latest" }),
        ])

        const applicantLists = await Promise.all(recruits.map((recruit) => adminApplicantApi.getByRecruit(token, recruit.recruitId)))
        const allApplicants = applicantLists
          .flat()
          .sort((a, b) => toTimestamp(b.createdAt) - toTimestamp(a.createdAt))

        if (!isMounted) return

        setStats({
          portfolioCount: portfolios.length,
          applicantCount: recruits.reduce((sum, recruit) => sum + (recruit.applicantCount ?? 0), 0),
          inquiryCount: inquiryList.totalElements ?? inquiryList.items.length,
          clientCount: clients.length,
        })
        setRecentApplicants(allApplicants.slice(0, 5))
        setRecentInquiries(inquiryList.items ?? [])
      } catch (e) {
        if (!isMounted) return
        setError(e instanceof Error ? e.message : "대시보드 데이터를 불러오지 못했습니다.")
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }

    void loadDashboard()

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-black">관리자 대시보드</h1>
        <p className="text-gray-600">GIGA Interior 웹사이트 관리</p>
      </div>

      {error && <div className="mb-6 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">{stat.title}</CardTitle>
                <Icon className={`w-4 h-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{isLoading ? "-" : stat.value}</div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>최근 지원자</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {isLoading && <p className="text-sm text-gray-500">불러오는 중...</p>}
              {!isLoading && recentApplicants.length === 0 && <p className="text-sm text-gray-500">최근 지원자가 없습니다.</p>}
              {!isLoading &&
                recentApplicants.map((applicant) => (
                  <div key={applicant.applicantId} className="flex justify-between items-center gap-4">
                    <div className="min-w-0">
                      <p className="font-medium truncate">{applicant.name}</p>
                      <p className="text-sm text-gray-600 truncate">{applicant.recruitPosition || "지원 포지션 미지정"}</p>
                    </div>
                    <span className="text-sm text-gray-500 shrink-0">{formatDate(applicant.createdAt)}</span>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>최근 문의</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {isLoading && <p className="text-sm text-gray-500">불러오는 중...</p>}
              {!isLoading && recentInquiries.length === 0 && <p className="text-sm text-gray-500">최근 문의가 없습니다.</p>}
              {!isLoading &&
                recentInquiries.map((inquiry) => (
                  <div key={inquiry.inquiryId} className="flex justify-between items-center gap-4">
                    <div className="min-w-0">
                      <p className="font-medium truncate">{inquiry.name}</p>
                      <p className="text-sm text-gray-600 truncate">
                        {inquiry.projectType || "프로젝트 유형 미지정"}
                        {inquiry.status ? ` · ${inquiry.status}` : ""}
                      </p>
                    </div>
                    <span className="text-sm text-gray-500 shrink-0">{formatDate(inquiry.createdAt)}</span>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
