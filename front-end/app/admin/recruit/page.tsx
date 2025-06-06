"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, Edit, Trash2, Save, Users, Eye } from "lucide-react"

interface JobPosting {
  id: number
  title: string
  department: string
  type: string
  experience: string
  location: string
  deadline: string
  description: string
  applicantCount: number
}

export default function AdminRecruitPage() {
  const [jobPostings, setJobPostings] = useState<JobPosting[]>([
    {
      id: 1,
      title: "시니어 인테리어 디자이너",
      department: "디자인팀",
      type: "정규직",
      experience: "경력 5년 이상",
      location: "서울 강남구",
      deadline: "2024-04-30",
      description: "상업공간 및 주거공간 디자인 전문가를 모집합니다.",
      applicantCount: 12,
    },
    {
      id: 2,
      title: "주니어 인테리어 디자이너",
      department: "디자인팀",
      type: "정규직",
      experience: "신입/경력 1-3년",
      location: "서울 강남구",
      deadline: "2024-04-15",
      description: "인테리어 디자인에 열정이 있는 주니어 디자이너를 모집합니다.",
      applicantCount: 8,
    },
  ])

  const [editingJob, setEditingJob] = useState<JobPosting | null>(null)
  const [newJob, setNewJob] = useState<Partial<JobPosting>>({})
  const [showForm, setShowForm] = useState(false)

  const handleSave = () => {
    if (editingJob) {
      setJobPostings((items) => items.map((item) => (item.id === editingJob.id ? editingJob : item)))
      setEditingJob(null)
    } else if (newJob.title) {
      const id = Math.max(...jobPostings.map((j) => j.id), 0) + 1
      setJobPostings((items) => [
        ...items,
        {
          id,
          title: newJob.title || "",
          department: newJob.department || "",
          type: newJob.type || "",
          experience: newJob.experience || "",
          location: newJob.location || "",
          deadline: newJob.deadline || "",
          description: newJob.description || "",
          applicantCount: 0,
        },
      ])
      setNewJob({})
      setShowForm(false)
    }
  }

  const handleDelete = (id: number) => {
    setJobPostings((items) => items.filter((item) => item.id !== id))
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-black mb-2">채용 관리</h1>
          <p className="text-gray-600">채용 공고와 지원자를 관리합니다</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          채용 공고 추가
        </Button>
      </div>

      {/* 채용 공고 목록 */}
      <div className="space-y-4">
        {jobPostings.map((job) => (
          <Card key={job.id}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="px-3 py-1 bg-black text-white rounded-full text-sm font-medium">
                      {job.department}
                    </span>
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">{job.type}</span>
                    <span className="flex items-center gap-1 text-sm text-gray-600">
                      <Users className="w-4 h-4" />
                      {job.applicantCount}명 지원
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-black mb-2">{job.title}</h3>
                  <p className="text-gray-600 mb-4">{job.description}</p>

                  <div className="grid grid-cols-3 gap-4 text-sm text-gray-500">
                    <div>경력: {job.experience}</div>
                    <div>위치: {job.location}</div>
                    <div>마감: {job.deadline}</div>
                  </div>
                </div>

                <div className="flex gap-2 ml-4">
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/admin/recruit/${job.id}/applicants`}>
                      <Eye className="w-4 h-4 mr-1" />
                      지원자 보기
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setEditingJob(job)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDelete(job.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 추가/편집 모달 */}
      {(showForm || editingJob) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-6">{editingJob ? "채용 공고 편집" : "새 채용 공고 추가"}</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">직책명</label>
                  <Input
                    value={editingJob?.title || newJob.title || ""}
                    onChange={(e) => {
                      if (editingJob) {
                        setEditingJob({ ...editingJob, title: e.target.value })
                      } else {
                        setNewJob({ ...newJob, title: e.target.value })
                      }
                    }}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">부서</label>
                    <Input
                      value={editingJob?.department || newJob.department || ""}
                      onChange={(e) => {
                        if (editingJob) {
                          setEditingJob({ ...editingJob, department: e.target.value })
                        } else {
                          setNewJob({ ...newJob, department: e.target.value })
                        }
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">고용형태</label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      value={editingJob?.type || newJob.type || ""}
                      onChange={(e) => {
                        if (editingJob) {
                          setEditingJob({ ...editingJob, type: e.target.value })
                        } else {
                          setNewJob({ ...newJob, type: e.target.value })
                        }
                      }}
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
                      value={editingJob?.experience || newJob.experience || ""}
                      onChange={(e) => {
                        if (editingJob) {
                          setEditingJob({ ...editingJob, experience: e.target.value })
                        } else {
                          setNewJob({ ...newJob, experience: e.target.value })
                        }
                      }}
                      placeholder="신입/경력 3년 이상"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">근무지</label>
                    <Input
                      value={editingJob?.location || newJob.location || ""}
                      onChange={(e) => {
                        if (editingJob) {
                          setEditingJob({ ...editingJob, location: e.target.value })
                        } else {
                          setNewJob({ ...newJob, location: e.target.value })
                        }
                      }}
                      placeholder="서울 강남구"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">마감일</label>
                  <Input
                    type="date"
                    value={editingJob?.deadline || newJob.deadline || ""}
                    onChange={(e) => {
                      if (editingJob) {
                        setEditingJob({ ...editingJob, deadline: e.target.value })
                      } else {
                        setNewJob({ ...newJob, deadline: e.target.value })
                      }
                    }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">상세 설명</label>
                  <Textarea
                    value={editingJob?.description || newJob.description || ""}
                    onChange={(e) => {
                      if (editingJob) {
                        setEditingJob({ ...editingJob, description: e.target.value })
                      } else {
                        setNewJob({ ...newJob, description: e.target.value })
                      }
                    }}
                    rows={4}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">채용공고 이미지</label>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => {
                      // 파일 처리 로직
                      const files = Array.from(e.target.files || [])
                      console.log("Selected files:", files)
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                  <p className="text-xs text-gray-500 mt-1">여러 이미지를 선택할 수 있습니다</p>
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
                    setEditingJob(null)
                    setNewJob({})
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
