"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, Edit, Trash2, Save, Users, Eye, RefreshCcw } from "lucide-react"
import { adminRecruitApi, resolveAssetUrl, type AdminRecruitResponse, type AdminRecruitUpsertRequest } from "@/lib/api"
import { env } from "@/lib/env"

type RecruitFormState = {
  position: string
  department: string
  empType: string
  careerLevel: string
  location: string
  deadline: string
  description: string
  isVisible: number
}

const emptyForm: RecruitFormState = {
  position: "",
  department: "",
  empType: "",
  careerLevel: "",
  location: "",
  deadline: "",
  description: "",
  isVisible: 1,
}

const formatDate = (value?: string | null) => {
  if (!value) return "-"
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleDateString("ko-KR")
}

const toDateInputValue = (value?: string | null) => {
  if (!value) return ""
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value.slice(0, 10)
  return date.toISOString().slice(0, 10)
}

const toForm = (job: AdminRecruitResponse): RecruitFormState => ({
  position: job.position ?? "",
  department: job.department ?? "",
  empType: job.empType ?? "",
  careerLevel: job.careerLevel ?? "",
  location: job.location ?? "",
  deadline: toDateInputValue(job.deadline),
  description: job.description ?? "",
  isVisible: job.isVisible ?? 1,
})

const toPayload = (form: RecruitFormState): AdminRecruitUpsertRequest => ({
  position: form.position,
  department: form.department,
  empType: form.empType,
  careerLevel: form.careerLevel,
  location: form.location,
  deadline: form.deadline || undefined,
  description: form.description,
  isVisible: form.isVisible,
})

export default function AdminRecruitPage() {
  const [jobPostings, setJobPostings] = useState<AdminRecruitResponse[]>([])
  const [editingJobId, setEditingJobId] = useState<number | null>(null)
  const [form, setForm] = useState<RecruitFormState>(emptyForm)
  const [showForm, setShowForm] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState("")
  const [savingMessage, setSavingMessage] = useState("")
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null)

  const editingJob = useMemo(
    () => jobPostings.find((item) => item.recruitId === editingJobId) ?? null,
    [editingJobId, jobPostings],
  )

  const closeForm = () => {
    setEditingJobId(null)
    setForm(emptyForm)
    setShowForm(false)
    setSelectedImageFile(null)
  }

  const openCreateForm = () => {
    setEditingJobId(null)
    setForm(emptyForm)
    setShowForm(true)
    setSavingMessage("")
    setSelectedImageFile(null)
  }

  const openEditForm = (job: AdminRecruitResponse) => {
    setEditingJobId(job.recruitId)
    setForm(toForm(job))
    setShowForm(true)
    setSavingMessage("")
    setSelectedImageFile(null)
  }

  const loadJobs = async () => {
    const token = localStorage.getItem(env.adminAuthStorageKey)
    if (!token || token === "mock") {
      setError("관리자 인증 토큰이 없습니다. 다시 로그인해주세요.")
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setError("")
    try {
      const data = await adminRecruitApi.getAll(token)
      setJobPostings(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : "채용 공고 목록을 불러오지 못했습니다.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    void loadJobs()
  }, [])

  const handleSave = async () => {
    if (!form.position.trim()) {
      setError("직책명을 입력해주세요.")
      return
    }
    const token = localStorage.getItem(env.adminAuthStorageKey)
    if (!token || token === "mock") {
      setError("관리자 인증 토큰이 없습니다. 다시 로그인해주세요.")
      return
    }

    setIsSaving(true)
    setError("")
    setSavingMessage("")
    try {
      let saved: AdminRecruitResponse
      if (editingJobId) {
        saved = await adminRecruitApi.update(token, editingJobId, toPayload(form))
        setSavingMessage("채용 공고를 수정했습니다.")
      } else {
        saved = await adminRecruitApi.create(token, toPayload(form))
        setSavingMessage("채용 공고를 등록했습니다.")
      }

      if (selectedImageFile) {
        saved = await adminRecruitApi.uploadImage(token, saved.recruitId, selectedImageFile)
      }

      setJobPostings((items) => {
        const exists = items.some((item) => item.recruitId === saved.recruitId)
        if (!exists) return [saved, ...items]
        return items.map((item) => (item.recruitId === saved.recruitId ? saved : item))
      })

      closeForm()
    } catch (e) {
      setError(e instanceof Error ? e.message : "저장에 실패했습니다.")
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("이 채용 공고를 삭제하시겠습니까?")) return
    const token = localStorage.getItem(env.adminAuthStorageKey)
    if (!token || token === "mock") {
      setError("관리자 인증 토큰이 없습니다. 다시 로그인해주세요.")
      return
    }

    setError("")
    try {
      await adminRecruitApi.remove(token, id)
      setJobPostings((items) => items.filter((item) => item.recruitId !== id))
    } catch (e) {
      setError(e instanceof Error ? e.message : "삭제에 실패했습니다.")
    }
  }

  const onFormChange = <K extends keyof RecruitFormState>(key: K, value: RecruitFormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-black mb-2">채용 관리</h1>
          <p className="text-gray-600">채용 공고와 지원자를 관리합니다</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => void loadJobs()}>
            <RefreshCcw className="w-4 h-4 mr-2" />
            새로고침
          </Button>
          <Button onClick={openCreateForm}>
            <Plus className="w-4 h-4 mr-2" />
            채용 공고 추가
          </Button>
        </div>
      </div>

      {error && <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
      {savingMessage && (
        <div className="rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">{savingMessage}</div>
      )}

      <div className="space-y-4">
        {isLoading && (
          <Card>
            <CardContent className="p-6 text-gray-500">채용 공고 목록을 불러오는 중...</CardContent>
          </Card>
        )}

        {!isLoading && jobPostings.length === 0 && (
          <Card>
            <CardContent className="p-6 text-gray-500">등록된 채용 공고가 없습니다.</CardContent>
          </Card>
        )}

        {!isLoading &&
          jobPostings.map((job) => (
            <Card key={job.recruitId}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-4 flex-wrap">
                      <span className="px-3 py-1 bg-black text-white rounded-full text-sm font-medium">
                        {job.department || "미분류"}
                      </span>
                      <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                        {job.empType || "미정"}
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-sm ${
                          job.isVisible === 1 ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {job.isVisible === 1 ? "노출중" : "숨김"}
                      </span>
                      <span className="flex items-center gap-1 text-sm text-gray-600">
                        <Users className="w-4 h-4" />
                        {job.applicantCount ?? 0}명 지원
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-black mb-2">{job.position}</h3>
                    {job.imageUrl && (
                      <div className="mb-4">
                        <img
                          src={resolveAssetUrl(job.imageUrl)}
                          alt={job.position}
                          className="h-28 w-44 rounded-md object-cover border"
                        />
                      </div>
                    )}
                    <p className="text-gray-600 mb-4">{job.description || "설명 없음"}</p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-500">
                      <div>경력: {job.careerLevel || "협의"}</div>
                      <div>위치: {job.location || "미정"}</div>
                      <div>마감: {formatDate(job.deadline)}</div>
                    </div>
                  </div>

                  <div className="flex gap-2 ml-4">
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/admin/recruit/${job.recruitId}/applicants`}>
                        <Eye className="w-4 h-4 mr-1" />
                        지원자 보기
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => openEditForm(job)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => void handleDelete(job.recruitId)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-6">{editingJob ? "채용 공고 편집" : "새 채용 공고 추가"}</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">직책명</label>
                  <Input value={form.position} onChange={(e) => onFormChange("position", e.target.value)} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">부서</label>
                    <Input value={form.department} onChange={(e) => onFormChange("department", e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">고용형태</label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      value={form.empType}
                      onChange={(e) => onFormChange("empType", e.target.value)}
                    >
                      <option value="">선택하세요</option>
                      <option value="정규직">정규직</option>
                      <option value="계약직">계약직</option>
                      <option value="인턴">인턴</option>
                      <option value="일용직">일용직</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">경력</label>
                    <Input
                      value={form.careerLevel}
                      onChange={(e) => onFormChange("careerLevel", e.target.value)}
                      placeholder="신입/경력 3년 이상"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">근무지</label>
                    <Input
                      value={form.location}
                      onChange={(e) => onFormChange("location", e.target.value)}
                      placeholder="서울 강남구"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">마감일</label>
                    <Input type="date" value={form.deadline} onChange={(e) => onFormChange("deadline", e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">노출 여부</label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      value={String(form.isVisible)}
                      onChange={(e) => onFormChange("isVisible", Number(e.target.value))}
                    >
                      <option value="1">노출</option>
                      <option value="0">숨김</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">상세 설명</label>
                  <Textarea
                    value={form.description}
                    onChange={(e) => onFormChange("description", e.target.value)}
                    rows={5}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">채용공고 이미지 (선택)</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setSelectedImageFile(e.target.files?.[0] ?? null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {selectedImageFile
                      ? `선택됨: ${selectedImageFile.name}`
                      : editingJob?.imageUrl
                        ? "새 이미지를 선택하지 않으면 기존 이미지를 유지합니다."
                        : "이미지를 선택하지 않으면 이미지 없이 노출됩니다."}
                  </p>
                  {editingJob?.imageUrl && (
                    <img
                      src={resolveAssetUrl(editingJob.imageUrl)}
                      alt="현재 채용공고 이미지"
                      className="mt-2 h-28 w-44 rounded-md object-cover border"
                    />
                  )}
                </div>
              </div>

              <div className="flex gap-4 mt-6">
                <Button onClick={() => void handleSave()} className="flex-1" disabled={isSaving}>
                  <Save className="w-4 h-4 mr-2" />
                  {isSaving ? "저장 중..." : "저장"}
                </Button>
                <Button variant="outline" onClick={closeForm} className="flex-1" disabled={isSaving}>
                  취소
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
