"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Edit, Trash2, Save } from "lucide-react"

interface CEOInfo {
  name: string
  title: string
  message: string
  image: string
}

interface HistoryItem {
  id: number
  year: string
  title: string
  description: string
}

export default function AdminAboutPage() {
  const [ceoInfo, setCeoInfo] = useState<CEOInfo>({
    name: "김기가",
    title: "GIGA Interior 대표이사",
    message: `"공간은 단순한 물리적 환경이 아닙니다. 그 안에서 일어나는 모든 순간들이 모여 하나의 이야기가 되고, 그 이야기가 우리의 삶을 더욱 풍요롭게 만듭니다."

GIGA Interior를 설립한 이후, 저희는 단순히 아름다운 공간을 만드는 것을 넘어서 클라이언트의 라이프스타일과 가치관을 깊이 이해하고, 그것을 공간에 담아내는 일에 집중해왔습니다.

앞으로도 GIGA Interior는 혁신적인 디자인과 완벽한 시공을 통해 고객 여러분의 꿈을 현실로 만들어가겠습니다.`,
    image: "/placeholder.svg?height=600&width=500",
  })

  const [history, setHistory] = useState<HistoryItem[]>([
    { id: 1, year: "2020", title: "GIGA Interior 설립", description: "현대적 감각의 인테리어 디자인 스튜디오로 출발" },
    { id: 2, year: "2021", title: "상업공간 전문화", description: "오피스, 쇼룸, 카페 등 상업공간 디자인 전문성 확보" },
    {
      id: 3,
      year: "2022",
      title: "디자인 어워드 수상",
      description: "한국 인테리어 디자인 대상 상업공간 부문 우수상 수상",
    },
    {
      id: 4,
      year: "2023",
      title: "팀 확장 및 서비스 다각화",
      description: "전문 디자이너 팀 확장, 주거공간 디자인 서비스 시작",
    },
    { id: 5, year: "2024", title: "프리미엄 브랜드 도약", description: "고급 주거 및 상업공간 전문 브랜드로 성장" },
  ])

  const [editingCEO, setEditingCEO] = useState(false)
  const [editingHistory, setEditingHistory] = useState<HistoryItem | null>(null)
  const [newHistory, setNewHistory] = useState<Partial<HistoryItem>>({})

  const handleSaveCEO = () => {
    setEditingCEO(false)
    // 실제로는 서버에 저장
  }

  const handleSaveHistory = () => {
    if (editingHistory) {
      setHistory((items) => items.map((item) => (item.id === editingHistory.id ? editingHistory : item)))
      setEditingHistory(null)
    } else if (newHistory.year && newHistory.title) {
      const id = Math.max(...history.map((h) => h.id), 0) + 1
      setHistory((items) => [
        ...items,
        {
          id,
          year: newHistory.year || "",
          title: newHistory.title || "",
          description: newHistory.description || "",
        },
      ])
      setNewHistory({})
    }
  }

  const handleDeleteHistory = (id: number) => {
    setHistory((items) => items.filter((item) => item.id !== id))
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-black mb-2">회사 정보 관리</h1>
        <p className="text-gray-600">CEO 메시지와 회사 연혁을 관리합니다</p>
      </div>

      {/* CEO 정보 관리 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            CEO 정보 관리
            <Button onClick={() => setEditingCEO(!editingCEO)} variant="outline" size="sm">
              <Edit className="w-4 h-4 mr-2" />
              {editingCEO ? "취소" : "편집"}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {editingCEO ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">이름</label>
                  <Input value={ceoInfo.name} onChange={(e) => setCeoInfo({ ...ceoInfo, name: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">직책</label>
                  <Input value={ceoInfo.title} onChange={(e) => setCeoInfo({ ...ceoInfo, title: e.target.value })} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">CEO 메시지</label>
                <Textarea
                  value={ceoInfo.message}
                  onChange={(e) => setCeoInfo({ ...ceoInfo, message: e.target.value })}
                  rows={10}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">CEO 이미지</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      console.log("Selected CEO image:", file)
                    }
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
                <p className="text-xs text-gray-500 mt-1">세로형 이미지 권장</p>
              </div>
              <Button onClick={handleSaveCEO}>
                <Save className="w-4 h-4 mr-2" />
                저장
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-lg mb-2">{ceoInfo.name}</h3>
                <p className="text-gray-600 mb-4">{ceoInfo.title}</p>
                <div className="text-sm text-gray-700 whitespace-pre-line">{ceoInfo.message}</div>
              </div>
              <div className="aspect-[4/5] bg-gray-200 rounded-lg flex items-center justify-center">
                <span className="text-gray-500">CEO 이미지</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 회사 연혁 관리 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            회사 연혁 관리
            <Button onClick={() => setNewHistory({ year: "", title: "", description: "" })} size="sm">
              <Plus className="w-4 h-4 mr-2" />
              연혁 추가
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* 기존 연혁 목록 */}
          {history.map((item) => (
            <div key={item.id} className="border rounded-lg p-4">
              {editingHistory?.id === item.id ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">연도</label>
                      <Input
                        value={editingHistory.year}
                        onChange={(e) => setEditingHistory({ ...editingHistory, year: e.target.value })}
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm font-medium mb-2">제목</label>
                      <Input
                        value={editingHistory.title}
                        onChange={(e) => setEditingHistory({ ...editingHistory, title: e.target.value })}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">설명</label>
                    <Textarea
                      value={editingHistory.description}
                      onChange={(e) => setEditingHistory({ ...editingHistory, description: e.target.value })}
                      rows={2}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleSaveHistory} size="sm">
                      <Save className="w-4 h-4 mr-2" />
                      저장
                    </Button>
                    <Button variant="outline" onClick={() => setEditingHistory(null)} size="sm">
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
                    <Button variant="outline" size="sm" onClick={() => setEditingHistory(item)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDeleteHistory(item.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* 새 연혁 추가 폼 */}
          {newHistory.year !== undefined && (
            <div className="border rounded-lg p-4 bg-gray-50">
              <h3 className="font-semibold mb-4">새 연혁 추가</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">연도</label>
                    <Input
                      value={newHistory.year || ""}
                      onChange={(e) => setNewHistory({ ...newHistory, year: e.target.value })}
                      placeholder="2024"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium mb-2">제목</label>
                    <Input
                      value={newHistory.title || ""}
                      onChange={(e) => setNewHistory({ ...newHistory, title: e.target.value })}
                      placeholder="주요 사건 제목"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">설명</label>
                  <Textarea
                    value={newHistory.description || ""}
                    onChange={(e) => setNewHistory({ ...newHistory, description: e.target.value })}
                    rows={2}
                    placeholder="상세 설명"
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleSaveHistory} size="sm">
                    <Save className="w-4 h-4 mr-2" />
                    추가
                  </Button>
                  <Button variant="outline" onClick={() => setNewHistory({})} size="sm">
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
