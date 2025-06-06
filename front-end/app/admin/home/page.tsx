"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Edit, Trash2, Save } from "lucide-react"

interface CarouselSlide {
  id: number
  title: string
  subtitle: string
  buttonText: string
  buttonLink: string
  image: string
}

interface FeaturedProject {
  id: number
  title: string
  category: string
  image: string
}

export default function AdminHomePage() {
  const [carouselSlides, setCarouselSlides] = useState<CarouselSlide[]>([
    {
      id: 1,
      title: "공간에 생명을\n불어넣다",
      subtitle: "현대적이고 세련된 인테리어로 당신만의 특별한 공간을 창조합니다",
      buttonText: "포트폴리오 보기",
      buttonLink: "/portfolio",
      image: "/placeholder.svg?height=1080&width=1920",
    },
  ])

  const [featuredProjects, setFeaturedProjects] = useState<FeaturedProject[]>([
    { id: 1, title: "모던 오피스 공간", category: "Office", image: "/placeholder.svg?height=400&width=600" },
    { id: 2, title: "럭셔리 쇼룸", category: "Showroom", image: "/placeholder.svg?height=400&width=600" },
    { id: 3, title: "크리에이티브 스튜디오", category: "Studio", image: "/placeholder.svg?height=400&width=600" },
  ])

  const [editingSlide, setEditingSlide] = useState<CarouselSlide | null>(null)
  const [newSlide, setNewSlide] = useState<Partial<CarouselSlide>>({})

  const handleSaveSlide = () => {
    if (editingSlide) {
      setCarouselSlides((slides) => slides.map((slide) => (slide.id === editingSlide.id ? editingSlide : slide)))
      setEditingSlide(null)
    } else if (newSlide.title && newSlide.subtitle) {
      const id = Math.max(...carouselSlides.map((s) => s.id), 0) + 1
      setCarouselSlides((slides) => [
        ...slides,
        {
          id,
          title: newSlide.title || "",
          subtitle: newSlide.subtitle || "",
          buttonText: newSlide.buttonText || "자세히 보기",
          buttonLink: newSlide.buttonLink || "/",
          image: newSlide.image || "/placeholder.svg?height=1080&width=1920",
        },
      ])
      setNewSlide({})
    }
  }

  const handleDeleteSlide = (id: number) => {
    setCarouselSlides((slides) => slides.filter((slide) => slide.id !== id))
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-black mb-2">홈페이지 관리</h1>
        <p className="text-gray-600">메인 캐러셀과 주요 프로젝트를 관리합니다</p>
      </div>

      {/* 캐러셀 관리 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            메인 캐러셀 관리
            <Button
              onClick={() => setNewSlide({ title: "", subtitle: "", buttonText: "", buttonLink: "", image: "" })}
              size="sm"
            >
              <Plus className="w-4 h-4 mr-2" />
              슬라이드 추가
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 기존 슬라이드 목록 */}
          {carouselSlides.map((slide) => (
            <div key={slide.id} className="border rounded-lg p-4">
              {editingSlide?.id === slide.id ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">메인 제목</label>
                    <Textarea
                      value={editingSlide.title}
                      onChange={(e) => setEditingSlide({ ...editingSlide, title: e.target.value })}
                      rows={2}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">서브 제목</label>
                    <Textarea
                      value={editingSlide.subtitle}
                      onChange={(e) => setEditingSlide({ ...editingSlide, subtitle: e.target.value })}
                      rows={2}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">버튼 텍스트</label>
                      <Input
                        value={editingSlide.buttonText}
                        onChange={(e) => setEditingSlide({ ...editingSlide, buttonText: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">버튼 링크</label>
                      <Input
                        value={editingSlide.buttonLink}
                        onChange={(e) => setEditingSlide({ ...editingSlide, buttonLink: e.target.value })}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">배경 이미지</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) {
                          console.log("Selected background image:", file)
                        }
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                    <p className="text-xs text-gray-500 mt-1">고해상도 이미지 권장 (1920x1080)</p>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleSaveSlide} size="sm">
                      <Save className="w-4 h-4 mr-2" />
                      저장
                    </Button>
                    <Button variant="outline" onClick={() => setEditingSlide(null)} size="sm">
                      취소
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg">{slide.title.replace("\n", " ")}</h3>
                    <p className="text-gray-600 mb-2">{slide.subtitle}</p>
                    <div className="text-sm text-gray-500">
                      <span className="bg-gray-100 px-2 py-1 rounded mr-2">{slide.buttonText}</span>
                      <span>→ {slide.buttonLink}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => setEditingSlide(slide)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDeleteSlide(slide.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* 새 슬라이드 추가 폼 */}
          {newSlide.title !== undefined && (
            <div className="border rounded-lg p-4 bg-gray-50">
              <h3 className="font-semibold mb-4">새 슬라이드 추가</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">메인 제목</label>
                  <Textarea
                    value={newSlide.title || ""}
                    onChange={(e) => setNewSlide({ ...newSlide, title: e.target.value })}
                    rows={2}
                    placeholder="줄바꿈은 \n으로 입력하세요"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">서브 제목</label>
                  <Textarea
                    value={newSlide.subtitle || ""}
                    onChange={(e) => setNewSlide({ ...newSlide, subtitle: e.target.value })}
                    rows={2}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">버튼 텍스트</label>
                    <Input
                      value={newSlide.buttonText || ""}
                      onChange={(e) => setNewSlide({ ...newSlide, buttonText: e.target.value })}
                      placeholder="자세히 보기"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">버튼 링크</label>
                    <Input
                      value={newSlide.buttonLink || ""}
                      onChange={(e) => setNewSlide({ ...newSlide, buttonLink: e.target.value })}
                      placeholder="/portfolio"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">배경 이미지</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) {
                        console.log("Selected background image:", file)
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                  <p className="text-xs text-gray-500 mt-1">고해상도 이미지 권장 (1920x1080)</p>
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleSaveSlide} size="sm">
                    <Save className="w-4 h-4 mr-2" />
                    추가
                  </Button>
                  <Button variant="outline" onClick={() => setNewSlide({})} size="sm">
                    취소
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 주요 프로젝트 관리 */}
      <Card>
        <CardHeader>
          <CardTitle>주요 프로젝트 관리</CardTitle>
          <p className="text-sm text-gray-600">포트폴리오에서 3개의 프로젝트를 선택하여 홈페이지에 표시합니다</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {featuredProjects.map((project, index) => (
              <div key={project.id} className="border rounded-lg p-4">
                <div className="aspect-video bg-gray-200 rounded mb-3 flex items-center justify-center">
                  <span className="text-gray-500 text-sm">프로젝트 이미지</span>
                </div>
                <h3 className="font-semibold">{project.title}</h3>
                <p className="text-sm text-gray-600">{project.category}</p>
                <Button variant="outline" size="sm" className="mt-2 w-full">
                  프로젝트 변경
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
