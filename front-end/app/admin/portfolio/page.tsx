"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, Edit, Trash2, Save, Eye, RefreshCcw, X } from "lucide-react"
import { adminPortfolioApi, resolveAssetUrl, type PortfolioResponse, type PortfolioUpsertRequest } from "@/lib/api"
import { env } from "@/lib/env"

type PortfolioFormState = {
  title: string
  category: string
  location: string
  year: string
  clientName: string
  area: string
  duration: string
  description: string
  concept: string
  feature: string
  materials: string
}

const emptyForm: PortfolioFormState = {
  title: "",
  category: "",
  location: "",
  year: "",
  clientName: "",
  area: "",
  duration: "",
  description: "",
  concept: "",
  feature: "",
  materials: "",
}

const categories = [
  { value: "office", label: "오피스" },
  { value: "showroom", label: "쇼룸" },
  { value: "studio", label: "스튜디오" },
  { value: "cafe", label: "카페" },
  { value: "residential", label: "주거" },
  { value: "commercial", label: "상업" },
]

const allowedImageExtensions = new Set(["jpg", "jpeg", "png", "webp", "gif"])

const toForm = (p: PortfolioResponse): PortfolioFormState => ({
  title: p.title ?? "",
  category: p.category ?? "",
  location: p.location ?? "",
  year: p.year ? String(p.year) : "",
  clientName: p.clientName ?? "",
  area: p.area ?? "",
  duration: p.duration ? String(p.duration) : "",
  description: p.description ?? "",
  concept: p.concept ?? "",
  feature: p.feature ?? "",
  materials: p.materials ?? "",
})

const toPayload = (f: PortfolioFormState): PortfolioUpsertRequest => ({
  title: f.title,
  category: f.category || undefined,
  location: f.location || undefined,
  year: f.year ? Number(f.year) : undefined,
  clientName: f.clientName || undefined,
  area: f.area || undefined,
  duration: f.duration || undefined,
  description: f.description || undefined,
  concept: f.concept || undefined,
  feature: f.feature || undefined,
  materials: f.materials || undefined,
})

export default function AdminPortfolioPage() {
  const [portfolios, setPortfolios] = useState<PortfolioResponse[]>([])
  const [editingId, setEditingId] = useState<number | null>(null)
  const [form, setForm] = useState<PortfolioFormState>(emptyForm)
  const [showForm, setShowForm] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")
  const [selectedImages, setSelectedImages] = useState<File[]>([])
  const [deletingImageId, setDeletingImageId] = useState<number | null>(null)
  const [imageSelectionError, setImageSelectionError] = useState("")
  const [selectedImagePreviews, setSelectedImagePreviews] = useState<
    { file: File; index: number; previewUrl: string }[]
  >([])

  const editingPortfolio = useMemo(() => portfolios.find((p) => p.portfolioId === editingId) ?? null, [editingId, portfolios])

  useEffect(() => {
    const previews = selectedImages.map((file, index) => ({
      file,
      index,
      previewUrl: URL.createObjectURL(file),
    }))
    setSelectedImagePreviews(previews)

    return () => {
      previews.forEach((item) => URL.revokeObjectURL(item.previewUrl))
    }
  }, [selectedImages])

  const closeForm = () => {
    setEditingId(null)
    setForm(emptyForm)
    setShowForm(false)
    setSelectedImages([])
    setImageSelectionError("")
  }

  const loadPortfolios = async () => {
    const token = localStorage.getItem(env.adminAuthStorageKey)
    if (!token || token === "mock") {
      setError("관리자 인증 토큰이 없습니다. 다시 로그인해주세요.")
      setIsLoading(false)
      return
    }
    setIsLoading(true)
    setError("")
    try {
      setPortfolios(await adminPortfolioApi.getAll(token))
    } catch (e) {
      setError(e instanceof Error ? e.message : "포트폴리오 목록을 불러오지 못했습니다.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    void loadPortfolios()
  }, [])

  const handleSave = async () => {
    if (!form.title.trim()) {
      setError("프로젝트 제목을 입력해주세요.")
      return
    }
    const token = localStorage.getItem(env.adminAuthStorageKey)
    if (!token || token === "mock") {
      setError("관리자 인증 토큰이 없습니다. 다시 로그인해주세요.")
      return
    }
    setIsSaving(true)
    setError("")
    setMessage("")
    try {
      let saved: PortfolioResponse
      if (editingId) {
        saved = await adminPortfolioApi.update(token, editingId, toPayload(form))
        setMessage("포트폴리오를 수정했습니다.")
      } else {
        saved = await adminPortfolioApi.create(token, toPayload(form))
        setMessage("포트폴리오를 등록했습니다.")
      }
      if (selectedImages.length > 0) {
        saved = await adminPortfolioApi.uploadImages(token, saved.portfolioId, selectedImages)
      }

      setPortfolios((items) => {
        const exists = items.some((item) => item.portfolioId === saved.portfolioId)
        if (!exists) return [saved, ...items]
        return items.map((item) => (item.portfolioId === saved.portfolioId ? saved : item))
      })
      await loadPortfolios()
      closeForm()
    } catch (e) {
      setError(e instanceof Error ? e.message : "저장에 실패했습니다.")
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("이 포트폴리오를 삭제하시겠습니까?")) return
    const token = localStorage.getItem(env.adminAuthStorageKey)
    if (!token || token === "mock") {
      setError("관리자 인증 토큰이 없습니다. 다시 로그인해주세요.")
      return
    }
    setError("")
    try {
      await adminPortfolioApi.remove(token, id)
      setPortfolios((items) => items.filter((item) => item.portfolioId !== id))
    } catch (e) {
      setError(e instanceof Error ? e.message : "삭제에 실패했습니다.")
    }
  }

  const onChange = <K extends keyof PortfolioFormState>(key: K, value: PortfolioFormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const handleImageSelection = (files: FileList | null) => {
    if (!files?.length) return
    const incoming = Array.from(files)
    const validFiles: File[] = []
    const invalidFiles: string[] = []

    for (const file of incoming) {
      const ext = file.name.includes(".") ? file.name.split(".").pop()?.toLowerCase() ?? "" : ""
      if (!allowedImageExtensions.has(ext)) {
        invalidFiles.push(file.name)
        continue
      }
      validFiles.push(file)
    }

    if (invalidFiles.length > 0) {
      setImageSelectionError(
        `지원 형식만 업로드할 수 있습니다 (jpg, jpeg, png, webp, gif). 제외됨: ${invalidFiles.join(", ")}`,
      )
    } else {
      setImageSelectionError("")
    }

    if (validFiles.length === 0) return

    setSelectedImages((prev) => {
      const next = [...prev]
      for (const file of validFiles) {
        const exists = next.some(
          (item) =>
            item.name === file.name &&
            item.size === file.size &&
            item.lastModified === file.lastModified,
        )
        if (!exists) next.push(file)
      }
      return next
    })
  }

  const removeSelectedImage = (targetIndex: number) => {
    setSelectedImages((prev) => prev.filter((_, index) => index !== targetIndex))
  }

  const handleDeleteExistingImage = async (portfolioId: number, portfolioImageId: number) => {
    if (!confirm("이 이미지를 삭제하시겠습니까?")) return
    const token = localStorage.getItem(env.adminAuthStorageKey)
    if (!token || token === "mock") {
      setError("관리자 인증 토큰이 없습니다. 다시 로그인해주세요.")
      return
    }

    setDeletingImageId(portfolioImageId)
    setError("")
    setMessage("")
    try {
      const updated = await adminPortfolioApi.removeImage(token, portfolioId, portfolioImageId)
      setPortfolios((items) => items.map((item) => (item.portfolioId === updated.portfolioId ? updated : item)))
      setMessage("이미지를 삭제했습니다.")
    } catch (e) {
      setError(e instanceof Error ? e.message : "이미지 삭제에 실패했습니다.")
    } finally {
      setDeletingImageId(null)
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-black mb-2">포트폴리오 관리</h1>
          <p className="text-gray-600">프로젝트를 추가, 수정, 삭제할 수 있습니다</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => void loadPortfolios()}>
            <RefreshCcw className="w-4 h-4 mr-2" />
            새로고침
          </Button>
          <Button onClick={() => { setShowForm(true); setEditingId(null); setForm(emptyForm); setSelectedImages([]) }}>
            <Plus className="w-4 h-4 mr-2" />
            포트폴리오 추가
          </Button>
        </div>
      </div>

      {error && <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
      {message && <div className="rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">{message}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading && <div className="text-gray-500">포트폴리오 목록을 불러오는 중...</div>}
        {!isLoading && portfolios.length === 0 && <div className="text-gray-500">등록된 포트폴리오가 없습니다.</div>}

        {!isLoading && portfolios.map((portfolio) => (
          <Card key={portfolio.portfolioId}>
            <CardContent className="p-4">
              <div className="aspect-video bg-gray-100 rounded mb-4 flex items-center justify-center overflow-hidden">
                {(portfolio.thumbnailUrl || portfolio.images?.[0]?.imageUrl) ? (
                  <img
                    src={resolveAssetUrl(portfolio.thumbnailUrl) || resolveAssetUrl(portfolio.images?.[0]?.imageUrl)}
                    alt={portfolio.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-gray-500 text-sm">프로젝트 이미지 없음</span>
                )}
              </div>
              <h3 className="font-semibold text-lg mb-2">{portfolio.title}</h3>
              <p className="text-sm text-gray-600 mb-2">{portfolio.description ?? "설명 없음"}</p>
              <div className="flex items-center gap-2 text-xs text-gray-500 mb-4 flex-wrap">
                <span className="bg-gray-100 px-2 py-1 rounded">
                  {categories.find((c) => c.value === (portfolio.category ?? ""))?.label ?? portfolio.category ?? "미분류"}
                </span>
                <span>{portfolio.year ?? "-"}</span>
              </div>
              <div className="flex gap-2">
                <Button asChild variant="outline" size="sm" className="flex-1">
                  <Link href={`/portfolio/${portfolio.portfolioId}`}>
                    <Eye className="w-4 h-4 mr-1" />
                    보기
                  </Link>
                </Button>
                <Button variant="outline" size="sm" onClick={() => { setEditingId(portfolio.portfolioId); setForm(toForm(portfolio)); setShowForm(true); setSelectedImages([]) }}>
                  <Edit className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={() => void handleDelete(portfolio.portfolioId)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-6">{editingPortfolio ? "포트폴리오 편집" : "새 포트폴리오 추가"}</h2>

              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">프로젝트 제목</label>
                    <Input value={form.title} onChange={(e) => onChange("title", e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">카테고리</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-md" value={form.category} onChange={(e) => onChange("category", e.target.value)}>
                      <option value="">카테고리 선택</option>
                      {categories.map((cat) => <option key={cat.value} value={cat.value}>{cat.label}</option>)}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div><label className="block text-sm font-medium mb-2">위치</label><Input value={form.location} onChange={(e) => onChange("location", e.target.value)} /></div>
                  <div><label className="block text-sm font-medium mb-2">완공년도</label><Input value={form.year} onChange={(e) => onChange("year", e.target.value)} /></div>
                  <div><label className="block text-sm font-medium mb-2">클라이언트</label><Input value={form.clientName} onChange={(e) => onChange("clientName", e.target.value)} /></div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div><label className="block text-sm font-medium mb-2">면적</label><Input value={form.area} onChange={(e) => onChange("area", e.target.value)} /></div>
                  <div><label className="block text-sm font-medium mb-2">시공기간</label><Input value={form.duration} onChange={(e) => onChange("duration", e.target.value)} placeholder="6개월" /></div>
                </div>

                <div><label className="block text-sm font-medium mb-2">프로젝트 설명</label><Textarea value={form.description} onChange={(e) => onChange("description", e.target.value)} rows={3} /></div>
                <div><label className="block text-sm font-medium mb-2">디자인 컨셉</label><Textarea value={form.concept} onChange={(e) => onChange("concept", e.target.value)} rows={4} /></div>
                <div><label className="block text-sm font-medium mb-2">주요 특징</label><Textarea value={form.feature} onChange={(e) => onChange("feature", e.target.value)} rows={3} /></div>
                <div><label className="block text-sm font-medium mb-2">사용 자재 (쉼표 구분)</label><Textarea value={form.materials} onChange={(e) => onChange("materials", e.target.value)} rows={2} /></div>

                <div>
                  <label className="block text-sm font-medium mb-2">프로젝트 이미지 (여러 장 가능)</label>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => {
                      handleImageSelection(e.target.files)
                      e.currentTarget.value = ""
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {selectedImages.length > 0
                      ? `${selectedImages.length}개 파일 선택됨 (개별 삭제 가능)`
                      : editingPortfolio?.images?.length
                        ? "새 이미지를 선택하지 않으면 기존 이미지를 유지합니다."
                        : "이미지 없이 저장 가능합니다."}
                  </p>
                  {imageSelectionError && (
                    <div className="mt-2 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                      {imageSelectionError}
                    </div>
                  )}
                  {selectedImages.length > 0 && (
                    <div className="mt-3">
                      <div className="mb-2 flex items-center justify-between">
                        <p className="text-xs text-gray-600">업로드 예정 이미지</p>
                        <Button type="button" variant="outline" size="sm" onClick={() => setSelectedImages([])}>
                          선택 초기화
                        </Button>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {selectedImagePreviews.map(({ file, index, previewUrl }) => (
                          <div key={`${file.name}-${file.size}-${file.lastModified}-${index}`} className="relative rounded border bg-gray-50 p-2">
                            <button
                              type="button"
                              onClick={() => removeSelectedImage(index)}
                              className="absolute right-1 top-1 rounded bg-white/90 p-1 text-gray-600 hover:text-red-600 border"
                              aria-label={`${file.name} 삭제`}
                            >
                              <X className="h-3 w-3" />
                            </button>
                            <img
                              src={previewUrl}
                              alt={file.name}
                              className="h-20 w-full rounded object-cover border bg-white"
                            />
                            <p className="mt-1 truncate text-[11px] text-gray-600" title={file.name}>
                              {file.name}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {(editingPortfolio?.images?.length ?? 0) > 0 && (
                    <div className="mt-4">
                      <p className="mb-2 text-xs text-gray-600">기존 등록 이미지 (클릭 삭제 가능)</p>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {editingPortfolio!.images.map((img) => (
                          <div key={img.portfolioImageId} className="relative rounded border bg-gray-50 p-2">
                            <button
                              type="button"
                              onClick={() => void handleDeleteExistingImage(editingPortfolio!.portfolioId, img.portfolioImageId)}
                              disabled={deletingImageId === img.portfolioImageId || isSaving}
                              className="absolute right-1 top-1 rounded bg-white/90 p-1 text-gray-600 hover:text-red-600 border disabled:opacity-50"
                              aria-label={`기존 이미지 ${img.portfolioImageId} 삭제`}
                            >
                              <X className="h-3 w-3" />
                            </button>
                            <img
                              src={resolveAssetUrl(img.imageUrl)}
                              alt={img.altText ?? editingPortfolio!.title}
                              className="h-20 w-full object-cover rounded border bg-white"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-4 mt-8">
                <Button onClick={() => void handleSave()} disabled={isSaving}>
                  <Save className="w-4 h-4 mr-2" />
                  {isSaving ? "저장 중..." : "저장"}
                </Button>
                <Button variant="outline" onClick={closeForm} disabled={isSaving}>취소</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
