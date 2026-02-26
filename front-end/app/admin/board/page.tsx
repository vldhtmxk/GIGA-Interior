"use client"

import type { ComponentType } from "react"
import { useEffect, useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { RefreshCcw, Mail, Phone, User, FolderOpen, Download, ChevronLeft, ChevronRight } from "lucide-react"
import {
  adminInquiryApi,
  type AdminInquiryListResponse,
  type InquiryResponse,
  type InquiryMemoHistoryResponse,
} from "@/lib/api"
import { env } from "@/lib/env"

export default function AdminBoardPage() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [inquiries, setInquiries] = useState<InquiryResponse[]>([])
  const [selectedInquiry, setSelectedInquiry] = useState<InquiryResponse | null>(null)
  const [memoHistories, setMemoHistories] = useState<InquiryMemoHistoryResponse[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDetailLoading, setIsDetailLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isSendingReply, setIsSendingReply] = useState(false)
  const [isDownloadingCsv, setIsDownloadingCsv] = useState(false)
  const [error, setError] = useState("")
  const [saveMessage, setSaveMessage] = useState("")
  const [draftStatus, setDraftStatus] = useState("NEW")
  const [draftMemo, setDraftMemo] = useState("")
  const [statusFilter, setStatusFilter] = useState<"ALL" | "NEW" | "IN_PROGRESS" | "HOLD" | "DONE">("ALL")
  const [searchQuery, setSearchQuery] = useState("")
  const [sortOrder, setSortOrder] = useState<"LATEST" | "OLDEST">("LATEST")
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedPrevId, setSelectedPrevId] = useState<number | null>(null)
  const [selectedNextId, setSelectedNextId] = useState<number | null>(null)
  const [replySubject, setReplySubject] = useState("")
  const [replyBody, setReplyBody] = useState("")
  const [markDoneOnReply, setMarkDoneOnReply] = useState(true)
  const [totalPages, setTotalPages] = useState(1)
  const [totalElements, setTotalElements] = useState(0)
  const [statusCounts, setStatusCounts] = useState<Record<string, number>>({
    ALL: 0,
    NEW: 0,
    IN_PROGRESS: 0,
    HOLD: 0,
    DONE: 0,
  })
  const pageSize = 8

  useEffect(() => {
    const spStatus = searchParams.get("status")
    const spQ = searchParams.get("q")
    const spSort = searchParams.get("sort")
    const spPage = searchParams.get("page")
    const spInquiryId = searchParams.get("inquiryId")

    if (spStatus && ["ALL", "NEW", "IN_PROGRESS", "HOLD", "DONE"].includes(spStatus)) {
      setStatusFilter(spStatus as typeof statusFilter)
    }
    if (spQ) setSearchQuery(spQ)
    if (spSort === "oldest") setSortOrder("OLDEST")
    if (spSort === "latest") setSortOrder("LATEST")
    if (spPage && !Number.isNaN(Number(spPage))) setCurrentPage(Math.max(1, Number(spPage)))
    if (spInquiryId && !Number.isNaN(Number(spInquiryId))) {
      const id = Number(spInquiryId)
      setSelectedInquiry((prev) => prev && prev.inquiryId === id ? prev : ({ inquiryId: id } as InquiryResponse))
    }
    // initialize once from URL
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const loadInquiries = async (options?: { preserveSelection?: boolean }) => {
    const token = localStorage.getItem(env.adminAuthStorageKey)
    if (!token || token === "mock") {
      setError("관리자 인증 토큰이 없습니다. 다시 로그인해주세요.")
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setError("")

    try {
      const data = await adminInquiryApi.getAll(token, {
        page: currentPage,
        size: pageSize,
        status: statusFilter,
        q: searchQuery.trim() || undefined,
        sort: sortOrder === "LATEST" ? "latest" : "oldest",
      })
      applyListResponse(data, options?.preserveSelection ?? true)
    } catch (e) {
      setError(e instanceof Error ? e.message : "문의 목록을 불러오지 못했습니다.")
    } finally {
      setIsLoading(false)
    }
  }

  const applyListResponse = (data: AdminInquiryListResponse, preserveSelection: boolean) => {
      setInquiries(data.items)
      setTotalPages(Math.max(1, data.totalPages || 1))
      setTotalElements(data.totalElements ?? data.items.length)
      setStatusCounts({
        ALL: data.statusCounts?.ALL ?? 0,
        NEW: data.statusCounts?.NEW ?? 0,
        IN_PROGRESS: data.statusCounts?.IN_PROGRESS ?? 0,
        HOLD: data.statusCounts?.HOLD ?? 0,
        DONE: data.statusCounts?.DONE ?? 0,
      })
      setSelectedInquiry((prev) => {
        if (!preserveSelection || !prev) return data.items[0] ?? null
        return data.items.find((item) => item.inquiryId === prev.inquiryId) ?? data.items[0] ?? null
      })
  }

  useEffect(() => {
    void loadInquiries()
  }, [currentPage, statusFilter, sortOrder])

  useEffect(() => {
    const timer = setTimeout(() => {
      void loadInquiries()
    }, 250)
    return () => clearTimeout(timer)
  }, [searchQuery])

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString())
    if (statusFilter !== "ALL") params.set("status", statusFilter)
    else params.delete("status")
    if (searchQuery.trim()) params.set("q", searchQuery.trim())
    else params.delete("q")
    params.set("sort", sortOrder === "LATEST" ? "latest" : "oldest")
    params.set("page", String(currentPage))
    if (selectedInquiry?.inquiryId) params.set("inquiryId", String(selectedInquiry.inquiryId))
    else params.delete("inquiryId")
    const qs = params.toString()
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
  }, [statusFilter, searchQuery, sortOrder, currentPage, selectedInquiry?.inquiryId, pathname, router, searchParams])

  useEffect(() => {
    setDraftStatus(selectedInquiry?.status ?? "NEW")
    setDraftMemo(selectedInquiry?.adminMemo ?? "")
    setSaveMessage("")
  }, [selectedInquiry?.inquiryId])

  useEffect(() => {
    const token = localStorage.getItem(env.adminAuthStorageKey)
    if (!token || token === "mock" || !selectedInquiry) {
      setMemoHistories([])
      return
    }

    let cancelled = false
    setIsDetailLoading(true)
    void adminInquiryApi
      .getOne(token, selectedInquiry.inquiryId)
      .then((detail) => {
        if (cancelled) return
        setSelectedInquiry(detail.inquiry)
        setMemoHistories(detail.memoHistories ?? [])
        setSelectedPrevId(detail.previousInquiryId)
        setSelectedNextId(detail.nextInquiryId)
        setReplySubject((prev) => prev || `[GIGA Interior] 문의 답변드립니다 (${detail.inquiry.name})`)
      })
      .catch((e) => {
        if (cancelled) return
        setMemoHistories([])
        setSelectedPrevId(null)
        setSelectedNextId(null)
        setError(e instanceof Error ? e.message : "문의 상세를 불러오지 못했습니다.")
      })
      .finally(() => {
        if (!cancelled) setIsDetailLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [selectedInquiry?.inquiryId])

  const formatDate = (value: string | null) => {
    if (!value) return "-"
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return value
    return new Intl.DateTimeFormat("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  const getStatusLabel = (status: string | null) => {
    switch (status) {
      case "IN_PROGRESS":
        return "처리중"
      case "HOLD":
        return "보류"
      case "DONE":
        return "완료"
      case "NEW":
      default:
        return "신규"
    }
  }

  const getStatusBadgeClass = (status: string | null) => {
    switch (status) {
      case "IN_PROGRESS":
        return "bg-blue-100 text-blue-800"
      case "HOLD":
        return "bg-amber-100 text-amber-800"
      case "DONE":
        return "bg-green-100 text-green-800"
      case "NEW":
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const safeCurrentPage = Math.min(currentPage, totalPages)
  const selectedIndexInPage = selectedInquiry
    ? inquiries.findIndex((item) => item.inquiryId === selectedInquiry.inquiryId)
    : -1
  const prevInquiry = selectedIndexInPage > 0 ? inquiries[selectedIndexInPage - 1] : null
  const nextInquiry =
    selectedIndexInPage >= 0 && selectedIndexInPage < inquiries.length - 1
      ? inquiries[selectedIndexInPage + 1]
      : null

  useEffect(() => {
    setCurrentPage(1)
  }, [statusFilter, searchQuery, sortOrder])

  useEffect(() => {
    if (!selectedInquiry) {
      setReplySubject("")
      setReplyBody("")
      setMarkDoneOnReply(true)
      return
    }
    setReplyBody((prev) =>
      prev ||
      `안녕하세요, ${selectedInquiry.name}님.\n\n문의주신 내용 확인했습니다.\n빠른 시일 내에 상세 안내드리겠습니다.\n\n감사합니다.\nGIGA Interior 드림`,
    )
  }, [selectedInquiry?.inquiryId])

  const handleSaveAdminFields = async () => {
    const token = localStorage.getItem(env.adminAuthStorageKey)
    if (!token || token === "mock" || !selectedInquiry) {
      setError("관리자 인증이 필요합니다. 다시 로그인해주세요.")
      return
    }

    setIsSaving(true)
    setSaveMessage("")
    setError("")

    try {
      const updated = await adminInquiryApi.update(token, selectedInquiry.inquiryId, {
        status: draftStatus,
        adminMemo: draftMemo,
      })

      setSelectedInquiry(updated)
      setInquiries((items) => items.map((item) => (item.inquiryId === updated.inquiryId ? updated : item)))
      if (updated.adminMemo !== selectedInquiry.adminMemo) {
        const detail = await adminInquiryApi.getOne(token, updated.inquiryId)
        setMemoHistories(detail.memoHistories ?? [])
      }
      // refresh list metadata/counts and current page item snapshot
      void loadInquiries({ preserveSelection: true })
      setSaveMessage("저장되었습니다.")
    } catch (e) {
      setError(e instanceof Error ? e.message : "문의 정보를 저장하지 못했습니다.")
    } finally {
      setIsSaving(false)
    }
  }

  const handleDownloadCsv = async () => {
    const token = localStorage.getItem(env.adminAuthStorageKey)
    if (!token || token === "mock") {
      setError("관리자 인증이 필요합니다. 다시 로그인해주세요.")
      return
    }
    setIsDownloadingCsv(true)
    setError("")
    try {
      const blob = await adminInquiryApi.downloadCsv(token)
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `inquiries-${new Date().toISOString().slice(0, 10)}.csv`
      a.click()
      URL.revokeObjectURL(url)
    } catch (e) {
      setError(e instanceof Error ? e.message : "CSV 다운로드에 실패했습니다.")
    } finally {
      setIsDownloadingCsv(false)
    }
  }

  const goToInquiryById = async (inquiryId: number | null) => {
    if (!inquiryId) return
    const existing = inquiries.find((item) => item.inquiryId === inquiryId)
    if (existing) {
      setSelectedInquiry(existing)
      return
    }
    const token = localStorage.getItem(env.adminAuthStorageKey)
    if (!token || token === "mock") return
    try {
      setIsDetailLoading(true)
      const detail = await adminInquiryApi.getOne(token, inquiryId)
      setSelectedInquiry(detail.inquiry)
      setMemoHistories(detail.memoHistories ?? [])
      setSelectedPrevId(detail.previousInquiryId)
      setSelectedNextId(detail.nextInquiryId)
    } catch (e) {
      setError(e instanceof Error ? e.message : "문의 상세를 불러오지 못했습니다.")
    } finally {
      setIsDetailLoading(false)
    }
  }

  const handleSendReplyEmail = async () => {
    const token = localStorage.getItem(env.adminAuthStorageKey)
    if (!token || token === "mock" || !selectedInquiry) {
      setError("관리자 인증이 필요합니다. 다시 로그인해주세요.")
      return
    }
    setIsSendingReply(true)
    setError("")
    setSaveMessage("")
    try {
      const updated = await adminInquiryApi.replyEmail(token, selectedInquiry.inquiryId, {
        subject: replySubject,
        body: replyBody,
        markDone: markDoneOnReply,
      })
      setSelectedInquiry(updated)
      setInquiries((items) => items.map((item) => (item.inquiryId === updated.inquiryId ? updated : item)))
      await loadInquiries({ preserveSelection: true })
      setSaveMessage("답변 메일을 발송했습니다.")
    } catch (e) {
      setError(e instanceof Error ? e.message : "답변 메일 발송에 실패했습니다.")
    } finally {
      setIsSendingReply(false)
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold text-black mb-2">문의 관리</h1>
          <p className="text-gray-600">홈페이지 문의 내역을 조회합니다</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => void handleDownloadCsv()} disabled={isDownloadingCsv || isLoading}>
            <Download className="w-4 h-4 mr-2" />
            {isDownloadingCsv ? "내보내는 중..." : "CSV 다운로드"}
          </Button>
          <Button onClick={() => void loadInquiries()} disabled={isLoading}>
            <RefreshCcw className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
            새로고침
          </Button>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-[1.1fr_0.9fr] gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>문의 목록</CardTitle>
            <Badge variant="secondary">{totalElements}건</Badge>
          </CardHeader>
          <CardContent className="space-y-3">
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="이름 / 이메일 / 전화 / 문의내용 검색"
            />

            <div className="flex flex-wrap gap-2 pb-2">
              {[
                { value: "ALL", label: "전체" },
                { value: "NEW", label: "신규" },
                { value: "IN_PROGRESS", label: "처리중" },
                { value: "HOLD", label: "보류" },
                { value: "DONE", label: "완료" },
              ].map((filter) => (
                <button
                  key={filter.value}
                  type="button"
                  onClick={() => setStatusFilter(filter.value as typeof statusFilter)}
                  className={`px-3 py-1.5 rounded-full text-sm border transition ${
                    statusFilter === filter.value
                      ? "bg-black text-white border-black"
                      : "bg-white text-gray-700 border-gray-200 hover:border-gray-300"
                  }`}
                >
                  {filter.label} ({statusCounts[filter.value] ?? 0})
                </button>
              ))}
            </div>

            <div className="flex items-center justify-between gap-3">
              <div className="text-xs text-gray-500">
                페이지 {safeCurrentPage} / {totalPages}
              </div>
              <select
                className="rounded-md border border-gray-300 px-3 py-1.5 text-sm"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as "LATEST" | "OLDEST")}
              >
                <option value="LATEST">최신순</option>
                <option value="OLDEST">오래된순</option>
              </select>
            </div>

            {isLoading ? (
              <p className="text-sm text-gray-500">문의 목록을 불러오는 중...</p>
            ) : inquiries.length === 0 ? (
              <p className="text-sm text-gray-500">
                {searchQuery || statusFilter !== "ALL" ? "조건에 맞는 문의가 없습니다." : "등록된 문의가 없습니다."}
              </p>
            ) : (
              inquiries.map((inquiry) => (
                <button
                  key={inquiry.inquiryId}
                  type="button"
                  onClick={() => setSelectedInquiry(inquiry)}
                  className={`w-full text-left border rounded-lg p-4 transition ${
                    selectedInquiry?.inquiryId === inquiry.inquiryId
                      ? "border-black bg-gray-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <div className="font-medium text-black truncate">{inquiry.name}</div>
                    <span className="text-xs text-gray-500 shrink-0">{formatDate(inquiry.createdAt)}</span>
                  </div>
                  <div className="mb-2">
                    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(inquiry.status)}`}>
                      {getStatusLabel(inquiry.status)}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 truncate">
                    {inquiry.projectType ?? "프로젝트 유형 미입력"} / {inquiry.budgetRange ?? "예산 미입력"}
                  </div>
                  <p className="text-sm text-gray-500 mt-2 line-clamp-2">{inquiry.message ?? "-"}</p>
                </button>
              ))
            )}

            {totalElements > 0 && (
              <div className="flex justify-between items-center pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={safeCurrentPage <= 1}
                >
                  이전 페이지
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={safeCurrentPage >= totalPages}
                >
                  다음 페이지
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>문의 상세</CardTitle>
          </CardHeader>
          <CardContent>
            {!selectedInquiry ? (
              <p className="text-sm text-gray-500">왼쪽에서 문의를 선택하세요.</p>
            ) : (
              <div className="space-y-5">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusBadgeClass(selectedInquiry.status)}>{getStatusLabel(selectedInquiry.status)}</Badge>
                    {isDetailLoading && <span className="text-xs text-gray-500">상세 불러오는 중...</span>}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" disabled={!selectedPrevId && !prevInquiry} onClick={() => void goToInquiryById(selectedPrevId ?? prevInquiry?.inquiryId ?? null)}>
                      <ChevronLeft className="w-4 h-4 mr-1" />
                      이전
                    </Button>
                    <Button variant="outline" size="sm" disabled={!selectedNextId && !nextInquiry} onClick={() => void goToInquiryById(selectedNextId ?? nextInquiry?.inquiryId ?? null)}>
                      다음
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  <InfoRow icon={User} label="이름" value={selectedInquiry.name} />
                  <InfoRow icon={Mail} label="이메일" value={selectedInquiry.email ?? "-"} />
                  <InfoRow icon={Phone} label="전화번호" value={selectedInquiry.phone ?? "-"} />
                  <InfoRow icon={FolderOpen} label="프로젝트 유형" value={selectedInquiry.projectType ?? "-"} />
                </div>

                <div className="rounded-lg bg-gray-50 p-4 space-y-2">
                  <div className="text-sm text-gray-500">예산 범위</div>
                  <div className="font-medium">{selectedInquiry.budgetRange ?? "-"}</div>
                </div>

                <div className="rounded-lg border p-4 space-y-2">
                  <div className="text-sm text-gray-500">문의 내용</div>
                  <p className="whitespace-pre-wrap text-sm leading-6">{selectedInquiry.message ?? "-"}</p>
                </div>

                <div className="rounded-lg border p-4 space-y-4">
                  <div className="font-medium">관리자 처리</div>

                  <div className="space-y-2">
                    <label className="text-sm text-gray-600">상태</label>
                    <select
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                      value={draftStatus}
                      onChange={(e) => setDraftStatus(e.target.value)}
                    >
                      <option value="NEW">신규</option>
                      <option value="IN_PROGRESS">처리중</option>
                      <option value="HOLD">보류</option>
                      <option value="DONE">완료</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm text-gray-600">관리자 메모</label>
                    <Textarea
                      value={draftMemo}
                      onChange={(e) => setDraftMemo(e.target.value)}
                      rows={4}
                      placeholder="상담 진행 내용, 회신 예정일, 내부 메모 등을 기록하세요."
                    />
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <div className="text-xs text-gray-500">
                      상태: {getStatusLabel(selectedInquiry.status)}
                      {selectedInquiry.repliedAt ? ` / 완료일: ${formatDate(selectedInquiry.repliedAt)}` : ""}
                      {selectedInquiry.repliedBy ? ` / 처리자: ${selectedInquiry.repliedBy}` : ""}
                    </div>
                    <Button onClick={() => void handleSaveAdminFields()} disabled={isSaving}>
                      {isSaving ? "저장 중..." : "상태/메모 저장"}
                    </Button>
                  </div>

                  {saveMessage && <p className="text-sm text-green-700">{saveMessage}</p>}
                </div>

                <div className="rounded-lg border p-4 space-y-3">
                  <div className="font-medium">답변 메일 발송</div>
                  <Input
                    value={replySubject}
                    onChange={(e) => setReplySubject(e.target.value)}
                    placeholder="메일 제목"
                  />
                  <Textarea
                    value={replyBody}
                    onChange={(e) => setReplyBody(e.target.value)}
                    rows={6}
                    placeholder="문의자에게 보낼 답변 메일 내용을 입력하세요."
                  />
                  <label className="flex items-center gap-2 text-sm text-gray-600">
                    <input
                      type="checkbox"
                      checked={markDoneOnReply}
                      onChange={(e) => setMarkDoneOnReply(e.target.checked)}
                    />
                    메일 발송 후 상태를 완료(DONE)로 변경
                  </label>
                  <div className="flex justify-end">
                    <Button onClick={() => void handleSendReplyEmail()} disabled={isSendingReply || !selectedInquiry.email}>
                      {isSendingReply ? "발송 중..." : "답변 메일 발송"}
                    </Button>
                  </div>
                  {!selectedInquiry.email && (
                    <p className="text-xs text-amber-700">문의자 이메일이 없어 메일 발송이 불가합니다.</p>
                  )}
                </div>

                <div className="rounded-lg border p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">메모 수정 이력</div>
                    <Badge variant="outline">{memoHistories.length}건</Badge>
                  </div>
                  {memoHistories.length === 0 ? (
                    <p className="text-sm text-gray-500">메모 수정 이력이 없습니다.</p>
                  ) : (
                    <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                      {memoHistories.map((history) => (
                        <div key={history.memoHistoryId} className="rounded-md border p-3">
                          <div className="text-xs text-gray-500 mb-2">
                            {history.adminName} / {formatDate(history.createdAt)}
                          </div>
                          <div className="grid gap-2">
                            <div>
                              <div className="text-xs text-gray-400">이전</div>
                              <p className="text-sm whitespace-pre-wrap text-gray-600">{history.previousMemo || "-"}</p>
                            </div>
                            <div>
                              <div className="text-xs text-gray-400">변경 후</div>
                              <p className="text-sm whitespace-pre-wrap">{history.nextMemo || "-"}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="text-xs text-gray-500">
                  접수일: {formatDate(selectedInquiry.createdAt)} / 수정일: {formatDate(selectedInquiry.updatedAt)}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: ComponentType<{ className?: string }>
  label: string
  value: string
}) {
  return (
    <div className="flex items-start gap-3 rounded-lg border p-3">
      <Icon className="w-4 h-4 mt-0.5 text-gray-500" />
      <div className="min-w-0">
        <div className="text-xs text-gray-500">{label}</div>
        <div className="text-sm text-black break-all">{value}</div>
      </div>
    </div>
  )
}
