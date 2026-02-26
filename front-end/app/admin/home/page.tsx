"use client"

import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Edit, Trash2, Save, RefreshCcw } from "lucide-react"
import {
  adminHomeApi,
  adminPortfolioApi,
  resolveAssetUrl,
  type HomeContentResponse,
  type MainCarouselResponse,
  type MainCarouselUpsertRequest,
  type PortfolioResponse,
} from "@/lib/api"
import { env } from "@/lib/env"

type CarouselForm = {
  title: string
  subtitle: string
  buttonText: string
  buttonLink: string
}

const emptyCarouselForm: CarouselForm = {
  title: "",
  subtitle: "",
  buttonText: "",
  buttonLink: "",
}

const toCarouselForm = (slide: MainCarouselResponse): CarouselForm => ({
  title: slide.title ?? "",
  subtitle: slide.subtitle ?? "",
  buttonText: slide.buttonText ?? "",
  buttonLink: slide.buttonLink ?? "",
})

const toCarouselPayload = (form: CarouselForm): MainCarouselUpsertRequest => ({
  title: form.title,
  subtitle: form.subtitle || undefined,
  buttonText: form.buttonText || undefined,
  buttonLink: form.buttonLink || undefined,
})

export default function AdminHomePage() {
  const [homeContent, setHomeContent] = useState<HomeContentResponse>({ carousels: [], featuredProjects: [] })
  const [portfolios, setPortfolios] = useState<PortfolioResponse[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")

  const [editingCarouselId, setEditingCarouselId] = useState<number | null>(null)
  const [carouselForm, setCarouselForm] = useState<CarouselForm>(emptyCarouselForm)
  const [newCarouselForm, setNewCarouselForm] = useState<CarouselForm | null>(null)
  const [carouselImageFiles, setCarouselImageFiles] = useState<Record<number, File | null>>({})
  const [newCarouselImageFile, setNewCarouselImageFile] = useState<File | null>(null)

  const [featuredPortfolioIds, setFeaturedPortfolioIds] = useState<(number | null)[]>([null, null, null])

  const featuredSlots = useMemo(
    () => [1, 2, 3].map((slot) => homeContent.featuredProjects.find((item) => item.slotIndex === slot) ?? null),
    [homeContent.featuredProjects],
  )

  const getToken = () => {
    const token = localStorage.getItem(env.adminAuthStorageKey)
    if (!token || token === "mock") throw new Error("관리자 인증 토큰이 없습니다. 다시 로그인해주세요.")
    return token
  }

  const syncFeaturedSelections = (content: HomeContentResponse) => {
    const next: (number | null)[] = [null, null, null]
    for (const item of content.featuredProjects) {
      const slot = (item.slotIndex ?? 0) - 1
      if (slot >= 0 && slot < 3) next[slot] = item.portfolioId
    }
    setFeaturedPortfolioIds(next)
  }

  const loadAll = async () => {
    setIsLoading(true)
    setError("")
    try {
      const token = getToken()
      const [home, portfolioRows] = await Promise.all([
        adminHomeApi.get(token),
        adminPortfolioApi.getAll(token),
      ])
      setHomeContent(home)
      setPortfolios(portfolioRows)
      syncFeaturedSelections(home)
    } catch (e) {
      setError(e instanceof Error ? e.message : "홈페이지 데이터를 불러오지 못했습니다.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    void loadAll()
  }, [])

  const handleSaveEditedCarousel = async () => {
    if (!editingCarouselId) return
    if (!carouselForm.title.trim()) {
      setError("메인 제목을 입력해주세요.")
      return
    }
    setIsSaving(true)
    setError("")
    setMessage("")
    try {
      const token = getToken()
      let saved = await adminHomeApi.updateCarousel(token, editingCarouselId, toCarouselPayload(carouselForm))
      const imageFile = carouselImageFiles[editingCarouselId] ?? null
      if (imageFile) {
        saved = await adminHomeApi.uploadCarouselImage(token, editingCarouselId, imageFile)
      }
      setHomeContent((prev) => ({
        ...prev,
        carousels: prev.carousels.map((item) => (item.carouselId === saved.carouselId ? saved : item)),
      }))
      setEditingCarouselId(null)
      setCarouselForm(emptyCarouselForm)
      setCarouselImageFiles((prev) => ({ ...prev, [editingCarouselId]: null }))
      setMessage("캐러셀 슬라이드를 수정했습니다.")
    } catch (e) {
      setError(e instanceof Error ? e.message : "캐러셀 저장에 실패했습니다.")
    } finally {
      setIsSaving(false)
    }
  }

  const handleCreateCarousel = async () => {
    if (!newCarouselForm) return
    if (!newCarouselForm.title.trim()) {
      setError("메인 제목을 입력해주세요.")
      return
    }
    setIsSaving(true)
    setError("")
    setMessage("")
    try {
      const token = getToken()
      let saved = await adminHomeApi.createCarousel(token, toCarouselPayload(newCarouselForm))
      if (newCarouselImageFile) {
        saved = await adminHomeApi.uploadCarouselImage(token, saved.carouselId, newCarouselImageFile)
      }
      setHomeContent((prev) => ({
        ...prev,
        carousels: [...prev.carousels, saved].sort((a, b) => a.carouselId - b.carouselId),
      }))
      setNewCarouselForm(null)
      setNewCarouselImageFile(null)
      setMessage("캐러셀 슬라이드를 추가했습니다.")
    } catch (e) {
      setError(e instanceof Error ? e.message : "캐러셀 추가에 실패했습니다.")
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteCarousel = async (carouselId: number) => {
    if (!confirm("이 슬라이드를 삭제하시겠습니까?")) return
    setError("")
    setMessage("")
    try {
      const token = getToken()
      await adminHomeApi.removeCarousel(token, carouselId)
      setHomeContent((prev) => ({ ...prev, carousels: prev.carousels.filter((item) => item.carouselId !== carouselId) }))
      setMessage("슬라이드를 삭제했습니다.")
    } catch (e) {
      setError(e instanceof Error ? e.message : "슬라이드 삭제에 실패했습니다.")
    }
  }

  const handleSaveFeaturedProjects = async () => {
    setIsSaving(true)
    setError("")
    setMessage("")
    try {
      const token = getToken()
      const ids = featuredPortfolioIds.filter((id): id is number => typeof id === "number")
      const updated = await adminHomeApi.updateFeaturedProjects(token, ids)
      setHomeContent((prev) => ({ ...prev, featuredProjects: updated }))
      syncFeaturedSelections({ ...homeContent, featuredProjects: updated })
      setMessage("주요 프로젝트를 저장했습니다.")
    } catch (e) {
      setError(e instanceof Error ? e.message : "주요 프로젝트 저장에 실패했습니다.")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-black mb-2">홈페이지 관리</h1>
          <p className="text-gray-600">메인 캐러셀과 주요 프로젝트를 관리합니다</p>
        </div>
        <Button variant="outline" onClick={() => void loadAll()}>
          <RefreshCcw className="w-4 h-4 mr-2" />
          새로고침
        </Button>
      </div>

      {error && <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
      {message && <div className="rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">{message}</div>}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            메인 캐러셀 관리
            <Button onClick={() => setNewCarouselForm({ ...emptyCarouselForm })} size="sm">
              <Plus className="w-4 h-4 mr-2" />
              슬라이드 추가
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {isLoading && <div className="text-gray-500">로딩 중...</div>}

          {!isLoading && homeContent.carousels.map((slide) => (
            <div key={slide.carouselId} className="border rounded-lg p-4">
              {editingCarouselId === slide.carouselId ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">메인 제목</label>
                    <Textarea value={carouselForm.title} onChange={(e) => setCarouselForm((p) => ({ ...p, title: e.target.value }))} rows={2} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">서브 제목</label>
                    <Textarea value={carouselForm.subtitle} onChange={(e) => setCarouselForm((p) => ({ ...p, subtitle: e.target.value }))} rows={2} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">버튼 텍스트</label>
                      <Input value={carouselForm.buttonText} onChange={(e) => setCarouselForm((p) => ({ ...p, buttonText: e.target.value }))} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">버튼 링크</label>
                      <Input value={carouselForm.buttonLink} onChange={(e) => setCarouselForm((p) => ({ ...p, buttonLink: e.target.value }))} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">배경 이미지</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setCarouselImageFiles((prev) => ({ ...prev, [slide.carouselId]: e.target.files?.[0] ?? null }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {carouselImageFiles[slide.carouselId]?.name ?? "새 이미지를 선택하지 않으면 기존 이미지를 유지합니다."}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={() => void handleSaveEditedCarousel()} size="sm" disabled={isSaving}>
                      <Save className="w-4 h-4 mr-2" />
                      저장
                    </Button>
                    <Button variant="outline" onClick={() => setEditingCarouselId(null)} size="sm" disabled={isSaving}>
                      취소
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    {slide.backgroundUrl && (
                      <div className="mb-3 aspect-[16/6] w-full overflow-hidden rounded border bg-gray-100">
                        <img src={resolveAssetUrl(slide.backgroundUrl)} alt={slide.title} className="h-full w-full object-cover" />
                      </div>
                    )}
                    <h3 className="font-semibold text-lg">{slide.title}</h3>
                    <p className="text-gray-600 mb-2">{slide.subtitle ?? "-"}</p>
                    <div className="text-sm text-gray-500">
                      <span className="bg-gray-100 px-2 py-1 rounded mr-2">{slide.buttonText ?? "버튼 없음"}</span>
                      <span>→ {slide.buttonLink ?? "-"}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditingCarouselId(slide.carouselId)
                        setCarouselForm(toCarouselForm(slide))
                      }}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => void handleDeleteCarousel(slide.carouselId)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}

          {newCarouselForm && (
            <div className="border rounded-lg p-4 bg-gray-50">
              <h3 className="font-semibold mb-4">새 슬라이드 추가</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">메인 제목</label>
                  <Textarea value={newCarouselForm.title} onChange={(e) => setNewCarouselForm((p) => (p ? { ...p, title: e.target.value } : p))} rows={2} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">서브 제목</label>
                  <Textarea value={newCarouselForm.subtitle} onChange={(e) => setNewCarouselForm((p) => (p ? { ...p, subtitle: e.target.value } : p))} rows={2} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">버튼 텍스트</label>
                    <Input value={newCarouselForm.buttonText} onChange={(e) => setNewCarouselForm((p) => (p ? { ...p, buttonText: e.target.value } : p))} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">버튼 링크</label>
                    <Input value={newCarouselForm.buttonLink} onChange={(e) => setNewCarouselForm((p) => (p ? { ...p, buttonLink: e.target.value } : p))} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">배경 이미지</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setNewCarouselImageFile(e.target.files?.[0] ?? null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                  <p className="text-xs text-gray-500 mt-1">{newCarouselImageFile?.name ?? "이미지는 저장 후에도 업로드 가능합니다."}</p>
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => void handleCreateCarousel()} size="sm" disabled={isSaving}>
                    <Save className="w-4 h-4 mr-2" />
                    추가
                  </Button>
                  <Button variant="outline" onClick={() => setNewCarouselForm(null)} size="sm" disabled={isSaving}>
                    취소
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>주요 프로젝트 관리</CardTitle>
          <p className="text-sm text-gray-600">포트폴리오에서 최대 3개의 프로젝트를 선택하여 홈페이지에 표시합니다</p>
        </CardHeader>
        <CardContent className="space-y-4">
          {[0, 1, 2].map((index) => {
            const selected = featuredSlots[index]
            return (
              <div key={index} className="border rounded-lg p-4">
                <label className="block text-sm font-medium mb-2">슬롯 {index + 1}</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={featuredPortfolioIds[index] ?? ""}
                  onChange={(e) => {
                    const value = e.target.value ? Number(e.target.value) : null
                    setFeaturedPortfolioIds((prev) => {
                      const next = [...prev]
                      next[index] = value
                      return next
                    })
                  }}
                >
                  <option value="">선택 안 함</option>
                  {portfolios.map((p) => (
                    <option key={p.portfolioId} value={p.portfolioId}>
                      {p.title}
                    </option>
                  ))}
                </select>
                {selected && (
                  <div className="mt-3 flex items-center gap-3 rounded border bg-gray-50 p-3">
                    <div className="h-16 w-24 overflow-hidden rounded border bg-white">
                      {selected.thumbnailUrl ? (
                        <img src={resolveAssetUrl(selected.thumbnailUrl)} alt={selected.title} className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full items-center justify-center text-xs text-gray-500">이미지 없음</div>
                      )}
                    </div>
                    <div>
                      <div className="font-medium">{selected.title}</div>
                      <div className="text-sm text-gray-500">{selected.category ?? "미분류"}</div>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
          <div className="flex justify-end">
            <Button onClick={() => void handleSaveFeaturedProjects()} disabled={isSaving}>
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? "저장 중..." : "주요 프로젝트 저장"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
