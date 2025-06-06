"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, Edit, Trash2, Save, Eye } from "lucide-react"

interface Portfolio {
  id: number
  title: string
  category: string
  location: string
  year: string
  client: string
  area: string
  duration: string
  description: string
  concept: string
  images: string[]
  features: string[]
}

export default function AdminPortfolioPage() {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([
    {
      id: 1,
      title: "모던 오피스 헤드쿼터",
      category: "office",
      location: "서울 강남구",
      year: "2024",
      client: "삼성전자",
      area: "1,200㎡",
      duration: "6개월",
      description: "글로벌 IT 기업의 새로운 본사 오피스 공간",
      concept: "미래지향적이면서도 인간 중심적인 업무 환경",
      images: ["/placeholder.svg?height=600&width=800"],
      features: ["개방형 협업 공간", "집중 업무를 위한 개별 부스"],
    },
  ])

  const [editingPortfolio, setEditingPortfolio] = useState<Portfolio | null>(null)
  const [newPortfolio, setNewPortfolio] = useState<Partial<Portfolio>>({})
  const [showForm, setShowForm] = useState(false)

  const handleSave = () => {
    if (editingPortfolio) {
      setPortfolios((items) => items.map((item) => (item.id === editingPortfolio.id ? editingPortfolio : item)))
      setEditingPortfolio(null)
    } else if (newPortfolio.title) {
      const id = Math.max(...portfolios.map((p) => p.id), 0) + 1
      setPortfolios((items) => [
        ...items,
        {
          id,
          title: newPortfolio.title || "",
          category: newPortfolio.category || "",
          location: newPortfolio.location || "",
          year: newPortfolio.year || "",
          client: newPortfolio.client || "",
          area: newPortfolio.area || "",
          duration: newPortfolio.duration || "",
          description: newPortfolio.description || "",
          concept: newPortfolio.concept || "",
          images: newPortfolio.images || [],
          features: newPortfolio.features || [],
        },
      ])
      setNewPortfolio({})
      setShowForm(false)
    }
  }

  const handleDelete = (id: number) => {
    setPortfolios((items) => items.filter((item) => item.id !== id))
  }

  const categories = [
    { value: "office", label: "오피스" },
    { value: "showroom", label: "쇼룸" },
    { value: "studio", label: "스튜디오" },
    { value: "cafe", label: "카페" },
    { value: "residential", label: "주거" },
  ]

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-black mb-2">포트폴리오 관리</h1>
          <p className="text-gray-600">프로젝트를 추가, 수정, 삭제할 수 있습니다</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          포트폴리오 추가
        </Button>
      </div>

      {/* 포트폴리오 목록 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {portfolios.map((portfolio) => (
          <Card key={portfolio.id}>
            <CardContent className="p-4">
              <div className="aspect-video bg-gray-200 rounded mb-4 flex items-center justify-center">
                <span className="text-gray-500 text-sm">프로젝트 이미지</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">{portfolio.title}</h3>
              <p className="text-sm text-gray-600 mb-2">{portfolio.description}</p>
              <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
                <span className="bg-gray-100 px-2 py-1 rounded">
                  {categories.find((c) => c.value === portfolio.category)?.label}
                </span>
                <span>{portfolio.year}</span>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Eye className="w-4 h-4 mr-1" />
                  보기
                </Button>
                <Button variant="outline" size="sm" onClick={() => setEditingPortfolio(portfolio)}>
                  <Edit className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleDelete(portfolio.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 포트폴리오 추가/편집 모달 */}
      {(showForm || editingPortfolio) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-6">{editingPortfolio ? "포트폴리오 편집" : "새 포트폴리오 추가"}</h2>

              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">프로젝트 제목</label>
                    <Input
                      value={editingPortfolio?.title || newPortfolio.title || ""}
                      onChange={(e) => {
                        if (editingPortfolio) {
                          setEditingPortfolio({ ...editingPortfolio, title: e.target.value })
                        } else {
                          setNewPortfolio({ ...newPortfolio, title: e.target.value })
                        }
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">카테고리</label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      value={editingPortfolio?.category || newPortfolio.category || ""}
                      onChange={(e) => {
                        if (editingPortfolio) {
                          setEditingPortfolio({ ...editingPortfolio, category: e.target.value })
                        } else {
                          setNewPortfolio({ ...newPortfolio, category: e.target.value })
                        }
                      }}
                    >
                      <option value="">카테고리 선택</option>
                      {categories.map((cat) => (
                        <option key={cat.value} value={cat.value}>
                          {cat.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">위치</label>
                    <Input
                      value={editingPortfolio?.location || newPortfolio.location || ""}
                      onChange={(e) => {
                        if (editingPortfolio) {
                          setEditingPortfolio({ ...editingPortfolio, location: e.target.value })
                        } else {
                          setNewPortfolio({ ...newPortfolio, location: e.target.value })
                        }
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">완공년도</label>
                    <Input
                      value={editingPortfolio?.year || newPortfolio.year || ""}
                      onChange={(e) => {
                        if (editingPortfolio) {
                          setEditingPortfolio({ ...editingPortfolio, year: e.target.value })
                        } else {
                          setNewPortfolio({ ...newPortfolio, year: e.target.value })
                        }
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">클라이언트</label>
                    <Input
                      value={editingPortfolio?.client || newPortfolio.client || ""}
                      onChange={(e) => {
                        if (editingPortfolio) {
                          setEditingPortfolio({ ...editingPortfolio, client: e.target.value })
                        } else {
                          setNewPortfolio({ ...newPortfolio, client: e.target.value })
                        }
                      }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">면적</label>
                    <Input
                      value={editingPortfolio?.area || newPortfolio.area || ""}
                      onChange={(e) => {
                        if (editingPortfolio) {
                          setEditingPortfolio({ ...editingPortfolio, area: e.target.value })
                        } else {
                          setNewPortfolio({ ...newPortfolio, area: e.target.value })
                        }
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">시공기간</label>
                    <Input
                      value={editingPortfolio?.duration || newPortfolio.duration || ""}
                      onChange={(e) => {
                        if (editingPortfolio) {
                          setEditingPortfolio({ ...editingPortfolio, duration: e.target.value })
                        } else {
                          setNewPortfolio({ ...newPortfolio, duration: e.target.value })
                        }
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">프로젝트 설명</label>
                  <Textarea
                    value={editingPortfolio?.description || newPortfolio.description || ""}
                    onChange={(e) => {
                      if (editingPortfolio) {
                        setEditingPortfolio({ ...editingPortfolio, description: e.target.value })
                      } else {
                        setNewPortfolio({ ...newPortfolio, description: e.target.value })
                      }
                    }}
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">디자인 컨셉</label>
                  <Textarea
                    value={editingPortfolio?.concept || newPortfolio.concept || ""}
                    onChange={(e) => {
                      if (editingPortfolio) {
                        setEditingPortfolio({ ...editingPortfolio, concept: e.target.value })
                      } else {
                        setNewPortfolio({ ...newPortfolio, concept: e.target.value })
                      }
                    }}
                    rows={4}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">주요 특징 (쉼표로 구분)</label>
                  <Textarea
                    value={editingPortfolio?.features.join(", ") || newPortfolio.features?.join(", ") || ""}
                    onChange={(e) => {
                      const features = e.target.value
                        .split(",")
                        .map((f) => f.trim())
                        .filter((f) => f)
                      if (editingPortfolio) {
                        setEditingPortfolio({ ...editingPortfolio, features })
                      } else {
                        setNewPortfolio({ ...newPortfolio, features })
                      }
                    }}
                    rows={2}
                    placeholder="개방형 협업 공간, 집중 업무를 위한 개별 부스, 자연 채광 최적화"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">프로젝트 이미지</label>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => {
                      const files = Array.from(e.target.files || [])
                      console.log("Selected project images:", files)
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                  <p className="text-xs text-gray-500 mt-1">여러 이미지를 선택할 수 있습니다</p>
                </div>
              </div>

              <div className="flex gap-4 mt-8">
                <Button onClick={handleSave}>
                  <Save className="w-4 h-4 mr-2" />
                  저장
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setEditingPortfolio(null)
                    setNewPortfolio({})
                    setShowForm(false)
                  }}
                >
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
