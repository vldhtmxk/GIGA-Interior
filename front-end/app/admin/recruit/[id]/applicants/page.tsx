"use client"

import { use, useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Eye, Download, Mail, Phone, RefreshCcw } from "lucide-react"
import { adminApplicantApi, adminRecruitApi, resolveAssetUrl, type ApplicantResponse, type AdminRecruitResponse } from "@/lib/api"
import { env } from "@/lib/env"

const getStatusColor = (status: string | null) => {
  switch (status) {
    case "reviewed":
      return "bg-blue-100 text-blue-800"
    case "interview":
      return "bg-purple-100 text-purple-800"
    case "rejected":
      return "bg-red-100 text-red-800"
    case "hired":
      return "bg-green-100 text-green-800"
    case "pending":
    default:
      return "bg-yellow-100 text-yellow-800"
  }
}

const getStatusText = (status: string | null) => {
  switch (status) {
    case "reviewed":
      return "검토 완료"
    case "interview":
      return "면접 예정"
    case "rejected":
      return "불합격"
    case "hired":
      return "합격"
    case "pending":
    default:
      return "검토 대기"
  }
}

const formatDate = (value?: string | null) => {
  if (!value) return "-"
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleDateString("ko-KR")
}

export default function ApplicantsPage({ params }: { params: Promise<{ id: string }> }) {
  const routeParams = use(params)
  const [applicants, setApplicants] = useState<ApplicantResponse[]>([])
  const [recruit, setRecruit] = useState<AdminRecruitResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  const loadData = async () => {
    const token = localStorage.getItem(env.adminAuthStorageKey)
    if (!token || token === "mock") {
      setError("관리자 인증 토큰이 없습니다. 다시 로그인해주세요.")
      setIsLoading(false)
      return
    }
    setError("")
    setIsLoading(true)
    try {
      const [list, recruits] = await Promise.all([
        adminApplicantApi.getByRecruit(token, routeParams.id),
        adminRecruitApi.getAll(token),
      ])
      setApplicants(list)
      setRecruit(recruits.find((item) => String(item.recruitId) === routeParams.id) ?? null)
    } catch (e) {
      setError(e instanceof Error ? e.message : "지원자 목록을 불러오지 못했습니다.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    void loadData()
  }, [routeParams.id])

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button asChild variant="outline">
            <Link href="/admin/recruit">
              <ArrowLeft className="w-4 h-4 mr-2" />
              채용 관리로 돌아가기
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-black">지원자 목록</h1>
            <p className="text-gray-600">
              {recruit?.position ?? "채용공고"} - 총 {applicants.length}명 지원
            </p>
          </div>
        </div>
        <Button variant="outline" onClick={() => void loadData()}>
          <RefreshCcw className="w-4 h-4 mr-2" />
          새로고침
        </Button>
      </div>

      {error && <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
      {isLoading && <div className="text-gray-500">지원자 목록을 불러오는 중...</div>}

      {!isLoading && applicants.length === 0 && (
        <Card>
          <CardContent className="p-6 text-gray-500">아직 지원자가 없습니다.</CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {applicants.map((applicant) => (
          <Card key={applicant.applicantId}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-4">
                    <h3 className="text-xl font-bold text-black">{applicant.name}</h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(applicant.status)}`}>
                      {getStatusText(applicant.status)}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-4">
                    <div className="flex items-center gap-2 min-w-0">
                      <Mail className="w-4 h-4" />
                      <span className="truncate">{applicant.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      {applicant.phone}
                    </div>
                    <div>경력: {applicant.experience ?? "-"}</div>
                    <div>지원일: {formatDate(applicant.createdAt)}</div>
                  </div>

                  <div className="flex gap-2 flex-wrap">
                    {applicant.files?.map((file) => (
                      <a
                        key={file.applicantFileId}
                        href={resolveAssetUrl(file.fileUrl)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex"
                      >
                        <Button variant="outline" size="sm" type="button">
                          <Download className="w-4 h-4 mr-1" />
                          {file.fileName}
                        </Button>
                      </a>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2 ml-4">
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/admin/recruit/${routeParams.id}/applicants/${applicant.applicantId}`}>
                      <Eye className="w-4 h-4 mr-1" />
                      상세보기
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
