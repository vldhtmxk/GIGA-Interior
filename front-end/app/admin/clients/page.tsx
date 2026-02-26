"use client"

import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, Edit, Trash2, Save, RefreshCcw } from "lucide-react"
import { adminClientApi, resolveAssetUrl, type ClientPartnerResponse, type ClientPartnerUpsertRequest } from "@/lib/api"
import { env } from "@/lib/env"

type ClientCategory = "client" | "partner"

type ClientFormState = {
  name: string
  category: ClientCategory
  description: string
}

const emptyForm: ClientFormState = {
  name: "",
  category: "client",
  description: "",
}

const normalizeCategory = (value?: string | null): ClientCategory =>
  (value?.toLowerCase() === "partner" ? "partner" : "client")

const toForm = (item: ClientPartnerResponse): ClientFormState => ({
  name: item.name ?? "",
  category: normalizeCategory(item.category),
  description: item.description ?? "",
})

const toPayload = (form: ClientFormState): ClientPartnerUpsertRequest => ({
  name: form.name,
  category: form.category,
  description: form.description || undefined,
})

export default function AdminClientsPage() {
  const [clients, setClients] = useState<ClientPartnerResponse[]>([])
  const [editingId, setEditingId] = useState<number | null>(null)
  const [form, setForm] = useState<ClientFormState>(emptyForm)
  const [showForm, setShowForm] = useState(false)
  const [activeTab, setActiveTab] = useState<ClientCategory>("client")
  const [selectedLogo, setSelectedLogo] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")

  const filteredClients = useMemo(
    () => clients.filter((item) => normalizeCategory(item.category) === activeTab),
    [clients, activeTab],
  )

  const editingClient = useMemo(
    () => clients.find((item) => item.clientId === editingId) ?? null,
    [clients, editingId],
  )

  const closeForm = () => {
    setEditingId(null)
    setForm(emptyForm)
    setSelectedLogo(null)
    setShowForm(false)
  }

  const getToken = () => {
    const token = localStorage.getItem(env.adminAuthStorageKey)
    if (!token || token === "mock") {
      throw new Error("관리자 인증 토큰이 없습니다. 다시 로그인해주세요.")
    }
    return token
  }

  const loadClients = async () => {
    setIsLoading(true)
    setError("")
    try {
      const token = getToken()
      setClients(await adminClientApi.getAll(token))
    } catch (e) {
      setError(e instanceof Error ? e.message : "고객사 목록을 불러오지 못했습니다.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    void loadClients()
  }, [])

  const handleSave = async () => {
    if (!form.name.trim()) {
      setError("회사명을 입력해주세요.")
      return
    }
    setIsSaving(true)
    setError("")
    setMessage("")
    try {
      const token = getToken()
      let saved: ClientPartnerResponse
      if (editingId) {
        saved = await adminClientApi.update(token, editingId, toPayload(form))
        setMessage("고객사/파트너 정보를 수정했습니다.")
      } else {
        saved = await adminClientApi.create(token, toPayload(form))
        setMessage("고객사/파트너를 등록했습니다.")
      }

      if (selectedLogo) {
        saved = await adminClientApi.uploadLogo(token, saved.clientId, selectedLogo)
      }

      setClients((items) => {
        const exists = items.some((item) => item.clientId === saved.clientId)
        if (!exists) return [saved, ...items]
        return items.map((item) => (item.clientId === saved.clientId ? saved : item))
      })
      closeForm()
    } catch (e) {
      setError(e instanceof Error ? e.message : "저장에 실패했습니다.")
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (clientId: number) => {
    if (!confirm("이 항목을 삭제하시겠습니까?")) return
    setError("")
    setMessage("")
    try {
      const token = getToken()
      await adminClientApi.remove(token, clientId)
      setClients((items) => items.filter((item) => item.clientId !== clientId))
      setMessage("삭제했습니다.")
    } catch (e) {
      setError(e instanceof Error ? e.message : "삭제에 실패했습니다.")
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-black mb-2">고객사/파트너 관리</h1>
          <p className="text-gray-600">고객사와 파트너사를 관리합니다</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => void loadClients()}>
            <RefreshCcw className="w-4 h-4 mr-2" />
            새로고침
          </Button>
          <Button
            onClick={() => {
              setEditingId(null)
              setForm({ ...emptyForm, category: activeTab })
              setSelectedLogo(null)
              setShowForm(true)
            }}
          >
            <Plus className="w-4 h-4 mr-2" />
            추가
          </Button>
        </div>
      </div>

      {error && <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
      {message && <div className="rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">{message}</div>}

      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
        <button
          onClick={() => setActiveTab("client")}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === "client" ? "bg-white text-black shadow-sm" : "text-gray-600"
          }`}
          type="button"
        >
          고객사
        </button>
        <button
          onClick={() => setActiveTab("partner")}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === "partner" ? "bg-white text-black shadow-sm" : "text-gray-600"
          }`}
          type="button"
        >
          파트너사
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {isLoading && <div className="text-gray-500">목록을 불러오는 중...</div>}
        {!isLoading && filteredClients.length === 0 && <div className="text-gray-500">등록된 항목이 없습니다.</div>}

        {!isLoading && filteredClients.map((client) => (
          <Card key={client.clientId}>
            <CardContent className="p-4">
              <div className="aspect-video bg-gray-100 rounded mb-4 flex items-center justify-center overflow-hidden">
                {client.logoUrl ? (
                  <img src={resolveAssetUrl(client.logoUrl)} alt={client.name} className="max-h-full max-w-full object-contain p-2" />
                ) : (
                  <span className="text-gray-500 text-sm">로고 없음</span>
                )}
              </div>
              <h3 className="font-semibold text-lg mb-1">{client.name}</h3>
              {client.description && <p className="text-sm text-gray-600 mb-3 line-clamp-2">{client.description}</p>}
              <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
                <span
                  className={`px-2 py-1 rounded ${
                    normalizeCategory(client.category) === "client"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-green-100 text-green-800"
                  }`}
                >
                  {normalizeCategory(client.category) === "client" ? "고객사" : "파트너사"}
                </span>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setEditingId(client.clientId)
                    setForm(toForm(client))
                    setSelectedLogo(null)
                    setShowForm(true)
                  }}
                  className="flex-1"
                >
                  <Edit className="w-4 h-4 mr-1" />
                  편집
                </Button>
                <Button variant="outline" size="sm" onClick={() => void handleDelete(client.clientId)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-6">{editingClient ? "편집" : "새로 추가"}</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">회사명</label>
                  <Input value={form.name} onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))} />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">카테고리</label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    value={form.category}
                    onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value as ClientCategory }))}
                  >
                    <option value="client">고객사</option>
                    <option value="partner">파트너사</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">로고 이미지</label>
                  <input
                    type="file"
                    accept="image/*,.svg"
                    onChange={(e) => setSelectedLogo(e.target.files?.[0] ?? null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {selectedLogo
                      ? `선택됨: ${selectedLogo.name}`
                      : editingClient?.logoUrl
                        ? "새 로고를 선택하지 않으면 기존 로고를 유지합니다."
                        : "로고 없이 저장 가능합니다."}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">설명 (선택사항)</label>
                  <Input
                    value={form.description}
                    onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                  />
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
