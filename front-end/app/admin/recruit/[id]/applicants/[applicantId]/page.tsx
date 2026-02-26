"use client"

import { use, useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Download, Mail, Phone, Calendar, User } from "lucide-react"
import { adminApplicantApi, resolveAssetUrl, type ApplicantResponse } from "@/lib/api"
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

const formatDateTime = (value?: string | null) => {
  if (!value) return "-"
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return value
  return d.toLocaleString("ko-KR")
}

export default function ApplicantDetailPage({
  params,
}: {
  params: Promise<{ id: string; applicantId: string }>
}) {
  const routeParams = use(params)
  const [applicant, setApplicant] = useState<ApplicantResponse | null>(null)
  const [notes, setNotes] = useState("")
  const [status, setStatus] = useState("pending")
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")

  const loadApplicant = async () => {
    const token = localStorage.getItem(env.adminAuthStorageKey)
    if (!token || token === "mock") {
      setError("관리자 인증 토큰이 없습니다. 다시 로그인해주세요.")
      setIsLoading(false)
      return
    }
    setIsLoading(true)
    setError("")
    try {
      const data = await adminApplicantApi.getOne(token, routeParams.applicantId)
      setApplicant(data)
      setNotes(data.adminComment ?? "")
      setStatus(data.status ?? "pending")
    } catch (e) {
      setError(e instanceof Error ? e.message : "지원자 상세를 불러오지 못했습니다.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    void loadApplicant()
  }, [routeParams.applicantId])

  const saveApplicant = async (payload: { status?: string; adminComment?: string }, successText: string) => {
    const token = localStorage.getItem(env.adminAuthStorageKey)
    if (!token || token === "mock") {
      setError("관리자 인증 토큰이 없습니다. 다시 로그인해주세요.")
      return
    }
    setIsSaving(true)
    setError("")
    setSuccessMessage("")
    try {
      const updated = await adminApplicantApi.update(token, routeParams.applicantId, payload)
      setApplicant(updated)
      setNotes(updated.adminComment ?? "")
      setStatus(updated.status ?? "pending")
      setSuccessMessage(successText)
    } catch (e) {
      setError(e instanceof Error ? e.message : "저장에 실패했습니다.")
    } finally {
      setIsSaving(false)
    }
  }

  const handleStatusChange = async (newStatus: string) => {
    setStatus(newStatus)
    await saveApplicant({ status: newStatus }, "지원 상태를 저장했습니다.")
  }

  const handleNotesUpdate = async () => {
    await saveApplicant({ adminComment: notes }, "메모를 저장했습니다.")
  }

  if (isLoading) {
    return <div className="text-gray-500">지원자 상세를 불러오는 중...</div>
  }

  if (!applicant) {
    return <div className="text-gray-500">지원자 정보를 찾을 수 없습니다.</div>
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Button asChild variant="outline">
          <Link href={`/admin/recruit/${routeParams.id}/applicants`}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            지원자 목록으로 돌아가기
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-black">{applicant.name}</h1>
          <p className="text-gray-600">{applicant.recruitPosition ?? "채용공고"} 지원자</p>
        </div>
      </div>

      {error && <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
      {successMessage && (
        <div className="rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">{successMessage}</div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader><CardTitle>기본 정보</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2"><User className="w-4 h-4 text-gray-500" /><span className="font-medium">이름:</span><span>{applicant.name}</span></div>
                <div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-gray-500" /><span className="font-medium">지원일:</span><span>{formatDateTime(applicant.createdAt)}</span></div>
                <div className="flex items-center gap-2"><Mail className="w-4 h-4 text-gray-500" /><span className="font-medium">이메일:</span><span>{applicant.email}</span></div>
                <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-gray-500" /><span className="font-medium">연락처:</span><span>{applicant.phone}</span></div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>경력 및 학력</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">경력 사항</h4>
                <p className="text-gray-700 whitespace-pre-line">{applicant.experience || "-"}</p>
              </div>
              <div>
                <h4 className="font-medium mb-2">학력 사항</h4>
                <p className="text-gray-700 whitespace-pre-line">{applicant.education || "-"}</p>
              </div>
              {applicant.portfolio && (
                <div>
                  <h4 className="font-medium mb-2">포트폴리오</h4>
                  {applicant.portfolio.startsWith("http") ? (
                    <a href={applicant.portfolio} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      {applicant.portfolio}
                    </a>
                  ) : (
                    <p className="text-gray-700 whitespace-pre-line">{applicant.portfolio}</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>지원 동기</CardTitle></CardHeader>
            <CardContent><p className="text-gray-700 leading-relaxed whitespace-pre-line">{applicant.motivation || "-"}</p></CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>첨부 파일</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-2">
                {(applicant.files ?? []).length === 0 && <p className="text-sm text-gray-500">첨부 파일이 없습니다.</p>}
                {(applicant.files ?? []).map((file) => (
                  <div key={file.applicantFileId} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <span className="text-sm">{file.fileName}</span>
                    <a href={resolveAssetUrl(file.fileUrl)} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" size="sm" type="button">
                        <Download className="w-4 h-4 mr-1" />
                        다운로드
                      </Button>
                    </a>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle>지원 상태</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <span className="font-medium">현재 상태:</span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(status)}`}>
                  {getStatusText(status)}
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">상태 변경</label>
                <select
                  value={status}
                  onChange={(e) => void handleStatusChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  disabled={isSaving}
                >
                  <option value="pending">검토 대기</option>
                  <option value="reviewed">검토 완료</option>
                  <option value="interview">면접 예정</option>
                  <option value="rejected">불합격</option>
                  <option value="hired">합격</option>
                </select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>추가 정보</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div><span className="font-medium">희망 연봉:</span><span className="ml-2">{applicant.salary || "-"}</span></div>
              <div><span className="font-medium">입사 가능일:</span><span className="ml-2">{formatDateTime(applicant.availableDate)}</span></div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>메모</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                placeholder="지원자에 대한 메모를 작성하세요..."
              />
              <Button onClick={() => void handleNotesUpdate()} className="w-full" disabled={isSaving}>
                {isSaving ? "저장 중..." : "메모 저장"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
