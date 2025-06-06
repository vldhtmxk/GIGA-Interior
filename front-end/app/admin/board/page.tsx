"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, Edit, Trash2, Save, Star, Eye } from "lucide-react"

interface BoardPost {
  id: number
  title: string
  category: "news" | "project" | "event" | "notice"
  content: string
  excerpt: string
  author: string
  date: string
  views: number
  featured: boolean
}

export default function AdminBoardPage() {
  const [posts, setPosts] = useState<BoardPost[]>([
    {
      id: 1,
      title: "GIGA Interior, 2024 한국 인테리어 디자인 대상 수상",
      category: "news",
      content: "GIGA Interior가 2024 한국 인테리어 디자인 대상에서 상업공간 부문 대상을 수상했습니다...",
      excerpt: "GIGA Interior가 2024 한국 인테리어 디자인 대상에서 상업공간 부문 대상을 수상했습니다.",
      author: "관리자",
      date: "2024-03-15",
      views: 1250,
      featured: true,
    },
    {
      id: 2,
      title: "신규 쇼룸 오픈 - 강남 플래그십 스토어",
      category: "news",
      content: "강남구 청담동에 GIGA Interior의 새로운 플래그십 쇼룸이 오픈했습니다...",
      excerpt: "강남구 청담동에 GIGA Interior의 새로운 플래그십 쇼룸이 오픈했습니다.",
      author: "마케팅팀",
      date: "2024-03-10",
      views: 890,
      featured: false,
    },
  ])

  const [editingPost, setEditingPost] = useState<BoardPost | null>(null)
  const [newPost, setNewPost] = useState<Partial<BoardPost>>({})
  const [showForm, setShowForm] = useState(false)

  const categories = [
    { value: "news", label: "뉴스" },
    { value: "project", label: "프로젝트 소식" },
    { value: "event", label: "이벤트" },
    { value: "notice", label: "공지사항" },
  ]

  const handleSave = () => {
    if (editingPost) {
      setPosts((items) => items.map((item) => (item.id === editingPost.id ? editingPost : item)))
      setEditingPost(null)
    } else if (newPost.title) {
      const id = Math.max(...posts.map((p) => p.id), 0) + 1
      setPosts((items) => [
        ...items,
        {
          id,
          title: newPost.title || "",
          category: (newPost.category as any) || "news",
          content: newPost.content || "",
          excerpt: newPost.excerpt || "",
          author: newPost.author || "관리자",
          date: new Date().toISOString().split("T")[0],
          views: 0,
          featured: newPost.featured || false,
        },
      ])
      setNewPost({})
      setShowForm(false)
    }
  }

  const handleDelete = (id: number) => {
    setPosts((items) => items.filter((item) => item.id !== id))
  }

  const toggleFeatured = (id: number) => {
    setPosts((items) => items.map((item) => (item.id === id ? { ...item, featured: !item.featured } : item)))
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "news":
        return "bg-blue-100 text-blue-800"
      case "project":
        return "bg-green-100 text-green-800"
      case "event":
        return "bg-purple-100 text-purple-800"
      case "notice":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-black mb-2">게시판 관리</h1>
          <p className="text-gray-600">게시글을 작성하고 관리합니다</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          게시글 작성
        </Button>
      </div>

      {/* 게시글 목록 */}
      <div className="space-y-4">
        {posts.map((post) => (
          <Card key={post.id}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(post.category)}`}>
                      {categories.find((c) => c.value === post.category)?.label}
                    </span>
                    {post.featured && (
                      <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium flex items-center gap-1">
                        <Star className="w-3 h-3" />
                        주요 소식
                      </span>
                    )}
                    <span className="flex items-center gap-1 text-sm text-gray-500">
                      <Eye className="w-4 h-4" />
                      {post.views.toLocaleString()}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-black mb-2">{post.title}</h3>
                  <p className="text-gray-600 mb-4">{post.excerpt}</p>

                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>작성자: {post.author}</span>
                    <span>작성일: {post.date}</span>
                  </div>
                </div>

                <div className="flex gap-2 ml-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleFeatured(post.id)}
                    className={post.featured ? "bg-yellow-50" : ""}
                  >
                    <Star className={`w-4 h-4 ${post.featured ? "fill-yellow-400 text-yellow-400" : ""}`} />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setEditingPost(post)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDelete(post.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 추가/편집 모달 */}
      {(showForm || editingPost) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-6">{editingPost ? "게시글 편집" : "새 게시글 작성"}</h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">제목</label>
                  <Input
                    value={editingPost?.title || newPost.title || ""}
                    onChange={(e) => {
                      if (editingPost) {
                        setEditingPost({ ...editingPost, title: e.target.value })
                      } else {
                        setNewPost({ ...newPost, title: e.target.value })
                      }
                    }}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">카테고리</label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      value={editingPost?.category || newPost.category || ""}
                      onChange={(e) => {
                        if (editingPost) {
                          setEditingPost({ ...editingPost, category: e.target.value as any })
                        } else {
                          setNewPost({ ...newPost, category: e.target.value as any })
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
                  <div>
                    <label className="block text-sm font-medium mb-2">작성자</label>
                    <Input
                      value={editingPost?.author || newPost.author || "관리자"}
                      onChange={(e) => {
                        if (editingPost) {
                          setEditingPost({ ...editingPost, author: e.target.value })
                        } else {
                          setNewPost({ ...newPost, author: e.target.value })
                        }
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">요약</label>
                  <Textarea
                    value={editingPost?.excerpt || newPost.excerpt || ""}
                    onChange={(e) => {
                      if (editingPost) {
                        setEditingPost({ ...editingPost, excerpt: e.target.value })
                      } else {
                        setNewPost({ ...newPost, excerpt: e.target.value })
                      }
                    }}
                    rows={2}
                    placeholder="게시글의 간단한 요약을 작성하세요"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">내용</label>
                  <Textarea
                    value={editingPost?.content || newPost.content || ""}
                    onChange={(e) => {
                      if (editingPost) {
                        setEditingPost({ ...editingPost, content: e.target.value })
                      } else {
                        setNewPost({ ...newPost, content: e.target.value })
                      }
                    }}
                    rows={10}
                    placeholder="게시글 내용을 작성하세요"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">첨부 이미지</label>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => {
                      const files = Array.from(e.target.files || [])
                      console.log("Selected images:", files)
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                  <p className="text-xs text-gray-500 mt-1">여러 이미지를 선택할 수 있습니다</p>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={editingPost?.featured || newPost.featured || false}
                    onChange={(e) => {
                      if (editingPost) {
                        setEditingPost({ ...editingPost, featured: e.target.checked })
                      } else {
                        setNewPost({ ...newPost, featured: e.target.checked })
                      }
                    }}
                    className="w-4 h-4"
                  />
                  <label htmlFor="featured" className="text-sm font-medium">
                    주요 소식으로 설정
                  </label>
                </div>
              </div>

              <div className="flex gap-4 mt-8">
                <Button onClick={handleSave} className="flex-1">
                  <Save className="w-4 h-4 mr-2" />
                  저장
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setEditingPost(null)
                    setNewPost({})
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
