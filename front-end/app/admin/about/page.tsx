"use client"

import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Edit, Trash2, Save, RefreshCcw } from "lucide-react"
import {
  adminAboutApi,
  resolveAssetUrl,
  type AboutContentResponse,
  type CompanyHistoryResponse,
  type CompanyHistoryUpsertRequest,
} from "@/lib/api"
import { env } from "@/lib/env"

type CEOFormState = {
  name: string
  title: string
  message: string
}

type HistoryFormState = {
  year: string
  title: string
  description: string
}

const emptyCEO: CEOFormState = { name: "", title: "", message: "" }
const emptyHistory: HistoryFormState = { year: "", title: "", description: "" }

const toHistoryForm = (item: CompanyHistoryResponse): HistoryFormState => ({
  year: item.year ? String(item.year) : "",
  title: item.title ?? "",
  description: item.description ?? "",
})

export default function AdminAboutPage() {
  const [data, setData] = useState<AboutContentResponse | null>(null)
  const [ceoForm, setCeoForm] = useState<CEOFormState>(emptyCEO)
  const [editingCEO, setEditingCEO] = useState(false)
  const [ceoImageFile, setCeoImageFile] = useState<File | null>(null)
  const [editingHistoryId, setEditingHistoryId] = useState<number | null>(null)
  const [historyForm, setHistoryForm] = useState<HistoryFormState>(emptyHistory)
  const [newHistory, setNewHistory] = useState<HistoryFormState | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")

  const histories = useMemo(() => data?.histories ?? [], [data])

  const getToken = () => {
    const token = localStorage.getItem(env.adminAuthStorageKey)
    if (!token || token === "mock") throw new Error("관리자 인증 토큰이 없습니다. 다시 로그인해주세요.")
    return token
  }

  const syncCeoForm = (payload: AboutContentResponse) => {
    setCeoForm({
      name: payload.ceo?.name ?? "",
      title: payload.ceo?.title ?? "",
      message: payload.ceo?.message ?? "",
    })
  }

  const loadAbout = async () => {
    setIsLoading(true)
    setError("")
    try {
      const token = getToken()
      const payload = await adminAboutApi.get(token)
      setData(payload)
      syncCeoForm(payload)
    } catch (e) {
      setError(e instanceof Error ? e.message : "회사 정보를 불러오지 못했습니다.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    void loadAbout()
  }, [])

  const handleSaveCEO = async () => {
    if (!ceoForm.name.trim() || !ceoForm.title.trim() || !ceoForm.message.trim()) {
      setError("대표 이름, 직책, 메시지를 모두 입력해주세요.")
      return
    }
    setIsSaving(true)
    setError("")
    setMessage("")
    try {
      const token = getToken()
      const ceo = await adminAboutApi.updateCeo(token, {
        name: ceoForm.name,
        title: ceoForm.title,
        message: ceoForm.message,
      })
      let finalCeo = ceo
      if (ceoImageFile) {
        finalCeo = await adminAboutApi.uploadCeoImage(token, ceoImageFile)
        setCeoImageFile(null)
      }
      setData((prev) => ({ ceo: finalCeo, histories: prev?.histories ?? [] }))
      setEditingCEO(false)
      setMessage("대표 정보를 저장했습니다.")
    } catch (e) {
      setError(e instanceof Error ? e.message : "대표 정보 저장에 실패했습니다.")
    } finally {
      setIsSaving(false)
    }
  }

  const toHistoryPayload = (form: HistoryFormState): CompanyHistoryUpsertRequest => ({
    year: Number(form.year),
    title: form.title,
    description: form.description || undefined,
  })

  const handleSaveEditingHistory = async () => {
    if (!editingHistoryId) return
    if (!historyForm.year.trim() || !historyForm.title.trim()) {
      setError("연도와 제목을 입력해주세요.")
      return
    }
    setIsSaving(true)
    setError("")
    setMessage("")
    try {
      const token = getToken()
      const saved = await adminAboutApi.updateHistory(token, editingHistoryId, toHistoryPayload(historyForm))
      setData((prev) => ({
        ceo: prev?.ceo ?? null,
        histories: (prev?.histories ?? []).map((item) => (item.historyId === saved.historyId ? saved : item)),
      }))
      setEditingHistoryId(null)
      setHistoryForm(emptyHistory)
      setMessage("연혁을 수정했습니다.")
    } catch (e) {
      setError(e instanceof Error ? e.message : "연혁 수정에 실패했습니다.")
    } finally {
      setIsSaving(false)
    }
  }

  const handleCreateHistory = async () => {
    if (!newHistory) return
    if (!newHistory.year.trim() || !newHistory.title.trim()) {
      setError("연도와 제목을 입력해주세요.")
      return
    }
    setIsSaving(true)
    setError("")
    setMessage("")
    try {
      const token = getToken()
      const saved = await adminAboutApi.createHistory(token, toHistoryPayload(newHistory))
      setData((prev) => ({
        ceo: prev?.ceo ?? null,
        histories: [saved, ...(prev?.histories ?? [])].sort((a, b) => (b.year ?? 0) - (a.year ?? 0)),
      }))
      setNewHistory(null)
      setMessage("연혁을 추가했습니다.")
    } catch (e) {
      setError(e instanceof Error ? e.message : "연혁 추가에 실패했습니다.")
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteHistory = async (historyId: number) => {
    if (!confirm("이 연혁을 삭제하시겠습니까?")) return
    setError("")
    setMessage("")
    try {
      const token = getToken()
      await adminAboutApi.removeHistory(token, historyId)
      setData((prev) => ({
        ceo: prev?.ceo ?? null,
        histories: (prev?.histories ?? []).filter((item) => item.historyId !== historyId),
      }))
      setMessage("연혁을 삭제했습니다.")
    } catch (e) {
      setError(e instanceof Error ? e.message : "연혁 삭제에 실패했습니다.")
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-black mb-2">회사 정보 관리</h1>
          <p className="text-gray-600">대표 메시지와 회사 연혁을 관리합니다</p>
        </div>
        <Button variant="outline" onClick={() => void loadAbout()}>
          <RefreshCcw className="w-4 h-4 mr-2" />
          새로고침
        </Button>
      </div>

      {error && <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
      {message && <div className="rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">{message}</div>}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            대표 정보 관리
            <Button
              onClick={() => {
                if (!editingCEO && data) syncCeoForm(data)
                setEditingCEO((prev) => !prev)
                setCeoImageFile(null)
              }}
              variant="outline"
              size="sm"
            >
              <Edit className="w-4 h-4 mr-2" />
              {editingCEO ? "취소" : "편집"}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-gray-500">로딩 중...</div>
          ) : editingCEO ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">이름</label>
                  <Input value={ceoForm.name} onChange={(e) => setCeoForm((p) => ({ ...p, name: e.target.value }))} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">직책</label>
                  <Input value={ceoForm.title} onChange={(e) => setCeoForm((p) => ({ ...p, title: e.target.value }))} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">대표 메시지</label>
                <Textarea value={ceoForm.message} onChange={(e) => setCeoForm((p) => ({ ...p, message: e.target.value }))} rows={10} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">대표 이미지</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setCeoImageFile(e.target.files?.[0] ?? null)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {ceoImageFile ? `선택됨: ${ceoImageFile.name}` : "새 이미지를 선택하지 않으면 기존 이미지를 유지합니다."}
                </p>
              </div>
              <Button onClick={() => void handleSaveCEO()} disabled={isSaving}>
                <Save className="w-4 h-4 mr-2" />
                {isSaving ? "저장 중..." : "저장"}
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-lg mb-2">{data?.ceo?.name || "미입력"}</h3>
                <p className="text-gray-600 mb-4">{data?.ceo?.title || "미입력"}</p>
                <div className="text-sm text-gray-700 whitespace-pre-line">{data?.ceo?.message || "대표 메시지가 없습니다."}</div>
              </div>
              <div className="aspect-[4/5] bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                {data?.ceo?.image ? (
                  <img src={resolveAssetUrl(data.ceo.image)} alt={data.ceo.name || "대표"} className="h-full w-full object-cover" />
                ) : (
                  <span className="text-gray-500">대표 이미지</span>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            회사 연혁 관리
            <Button onClick={() => setNewHistory({ ...emptyHistory })} size="sm">
              <Plus className="w-4 h-4 mr-2" />
              연혁 추가
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading && <div className="text-gray-500">로딩 중...</div>}

          {!isLoading && histories.map((item) => (
            <div key={item.historyId} className="border rounded-lg p-4">
              {editingHistoryId === item.historyId ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">연도</label>
                      <Input value={historyForm.year} onChange={(e) => setHistoryForm((p) => ({ ...p, year: e.target.value }))} />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm font-medium mb-2">제목</label>
                      <Input value={historyForm.title} onChange={(e) => setHistoryForm((p) => ({ ...p, title: e.target.value }))} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">설명</label>
                    <Textarea
                      value={historyForm.description}
                      onChange={(e) => setHistoryForm((p) => ({ ...p, description: e.target.value }))}
                      rows={2}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={() => void handleSaveEditingHistory()} size="sm" disabled={isSaving}>
                      <Save className="w-4 h-4 mr-2" />
                      저장
                    </Button>
                    <Button variant="outline" onClick={() => setEditingHistoryId(null)} size="sm" disabled={isSaving}>
                      취소
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex justify-between items-start">
                  <div className="flex gap-6">
                    <div className="text-2xl font-bold text-black">{item.year}</div>
                    <div>
                      <h3 className="font-semibold text-lg">{item.title}</h3>
                      <p className="text-gray-600">{item.description}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditingHistoryId(item.historyId)
                        setHistoryForm(toHistoryForm(item))
                      }}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => void handleDeleteHistory(item.historyId)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}

          {newHistory && (
            <div className="border rounded-lg p-4 bg-gray-50">
              <h3 className="font-semibold mb-4">새 연혁 추가</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">연도</label>
                    <Input value={newHistory.year} onChange={(e) => setNewHistory((p) => (p ? { ...p, year: e.target.value } : p))} placeholder="2024" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium mb-2">제목</label>
                    <Input value={newHistory.title} onChange={(e) => setNewHistory((p) => (p ? { ...p, title: e.target.value } : p))} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">설명</label>
                  <Textarea
                    value={newHistory.description}
                    onChange={(e) => setNewHistory((p) => (p ? { ...p, description: e.target.value } : p))}
                    rows={2}
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => void handleCreateHistory()} size="sm" disabled={isSaving}>
                    <Save className="w-4 h-4 mr-2" />
                    추가
                  </Button>
                  <Button variant="outline" onClick={() => setNewHistory(null)} size="sm" disabled={isSaving}>
                    취소
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
