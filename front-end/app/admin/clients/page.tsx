"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, Edit, Trash2, Save } from "lucide-react"

interface Client {
  id: number
  name: string
  category: "client" | "partner"
  logo: string
  description?: string
}

export default function AdminClientsPage() {
  const [clients, setClients] = useState<Client[]>([
    { id: 1, name: "Samsung Electronics", category: "client", logo: "/placeholder.svg?height=80&width=160" },
    { id: 2, name: "LG Display", category: "client", logo: "/placeholder.svg?height=80&width=160" },
    { id: 3, name: "Herman Miller", category: "partner", logo: "/placeholder.svg?height=80&width=160" },
    { id: 4, name: "Steelcase", category: "partner", logo: "/placeholder.svg?height=80&width=160" },
  ])

  const [editingClient, setEditingClient] = useState<Client | null>(null)
  const [newClient, setNewClient] = useState<Partial<Client>>({})
  const [showForm, setShowForm] = useState(false)
  const [activeTab, setActiveTab] = useState<"client" | "partner">("client")

  const handleSave = () => {
    if (editingClient) {
      setClients((items) => items.map((item) => (item.id === editingClient.id ? editingClient : item)))
      setEditingClient(null)
    } else if (newClient.name) {
      const id = Math.max(...clients.map((c) => c.id), 0) + 1
      setClients((items) => [
        ...items,
        {
          id,
          name: newClient.name || "",
          category: newClient.category || "client",
          logo: newClient.logo || "/placeholder.svg?height=80&width=160",
          description: newClient.description || "",
        },
      ])
      setNewClient({})
      setShowForm(false)
    }
  }

  const handleDelete = (id: number) => {
    setClients((items) => items.filter((item) => item.id !== id))
  }

  const filteredClients = clients.filter((client) => client.category === activeTab)

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-black mb-2">고객사/파트너 관리</h1>
          <p className="text-gray-600">고객사와 파트너사를 관리합니다</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          추가
        </Button>
      </div>

      {/* 탭 */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
        <button
          onClick={() => setActiveTab("client")}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === "client" ? "bg-white text-black shadow-sm" : "text-gray-600"
          }`}
        >
          고객사
        </button>
        <button
          onClick={() => setActiveTab("partner")}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === "partner" ? "bg-white text-black shadow-sm" : "text-gray-600"
          }`}
        >
          파트너사
        </button>
      </div>

      {/* 클라이언트 목록 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredClients.map((client) => (
          <Card key={client.id}>
            <CardContent className="p-4">
              <div className="aspect-video bg-gray-100 rounded mb-4 flex items-center justify-center">
                <span className="text-gray-500 text-sm">로고</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">{client.name}</h3>
              <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
                <span
                  className={`px-2 py-1 rounded ${
                    client.category === "client" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"
                  }`}
                >
                  {client.category === "client" ? "고객사" : "파트너사"}
                </span>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setEditingClient(client)} className="flex-1">
                  <Edit className="w-4 h-4 mr-1" />
                  편집
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleDelete(client.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 추가/편집 모달 */}
      {(showForm || editingClient) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-6">{editingClient ? "편집" : "새로 추가"}</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">회사명</label>
                  <Input
                    value={editingClient?.name || newClient.name || ""}
                    onChange={(e) => {
                      if (editingClient) {
                        setEditingClient({ ...editingClient, name: e.target.value })
                      } else {
                        setNewClient({ ...newClient, name: e.target.value })
                      }
                    }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">카테고리</label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    value={editingClient?.category || newClient.category || "client"}
                    onChange={(e) => {
                      const category = e.target.value as "client" | "partner"
                      if (editingClient) {
                        setEditingClient({ ...editingClient, category })
                      } else {
                        setNewClient({ ...newClient, category })
                      }
                    }}
                  >
                    <option value="client">고객사</option>
                    <option value="partner">파트너사</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">로고 이미지</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) {
                        // 파일 처리 로직
                        console.log("Selected logo file:", file)
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                  <p className="text-xs text-gray-500 mt-1">JPG, PNG 파일만 업로드 가능</p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">설명 (선택사항)</label>
                  <Input
                    value={editingClient?.description || newClient.description || ""}
                    onChange={(e) => {
                      if (editingClient) {
                        setEditingClient({ ...editingClient, description: e.target.value })
                      } else {
                        setNewClient({ ...newClient, description: e.target.value })
                      }
                    }}
                  />
                </div>
              </div>

              <div className="flex gap-4 mt-6">
                <Button onClick={handleSave} className="flex-1">
                  <Save className="w-4 h-4 mr-2" />
                  저장
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setEditingClient(null)
                    setNewClient({})
                    setShowForm(false)
                  }}
                  className="flex-1"
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
