"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Download, Mail, Phone, Calendar, User } from "lucide-react"

interface ApplicantDetail {
  id: number
  name: string
  email: string
  phone: string
  position: string
  experience: string
  education: string
  portfolio: string
  motivation: string
  salary: string
  startDate: string
  appliedDate: string
  status: "pending" | "reviewed" | "interview" | "rejected" | "hired"
  files: { name: string; url: string }[]
  notes: string
}

export default function ApplicantDetailPage({
  params,
}: {
  params: { id: string; applicantId: string }
}) {
  const [applicant] = useState<ApplicantDetail>({
    id: 1,
    name: "김철수",
    email: "kim@example.com",
    phone: "010-1234-5678",
    position: "시니어 인테리어 디자이너",
    experience: "삼성전자 디자인팀 5년 근무\n현대건설 인테리어 부문 2년 근무",
    education: "홍익대학교 실내건축학과 졸업",
    portfolio: "https://portfolio.example.com",
    motivation:
      "GIGA Interior의 혁신적인 디자인 철학에 깊이 공감하며, 저의 경험과 열정을 바탕으로 회사의 성장에 기여하고 싶습니다.",
    salary: "7000만원",
    startDate: "2024-05-01",
    appliedDate: "2024-03-15",
    status: "pending",
    files: [
      { name: "김철수_이력서.pdf", url: "/resume1.pdf" },
      { name: "포트폴리오.pdf", url: "/portfolio1.pdf" },
    ],
    notes: "",
  })

  const [notes, setNotes] = useState(applicant.notes)
  const [status, setStatus] = useState(applicant.status)

  const handleStatusChange = (newStatus: string) => {
    setStatus(newStatus as any)
    // 실제로는 서버에 저장
  }

  const handleNotesUpdate = () => {
    // 실제로는 서버에 저장
    alert("메모가 저장되었습니다.")
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "reviewed":
        return "bg-blue-100 text-blue-800"
      case "interview":
        return "bg-purple-100 text-purple-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      case "hired":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "검토 대기"
      case "reviewed":
        return "검토 완료"
      case "interview":
        return "면접 예정"
      case "rejected":
        return "불합격"
      case "hired":
        return "합격"
      default:
        return "알 수 없음"
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Button asChild variant="outline">
          <Link href={`/admin/recruit/${params.id}/applicants`}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            지원자 목록으로 돌아가기
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-black">{applicant.name}</h1>
          <p className="text-gray-600">{applicant.position} 지원자</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 메인 정보 */}
        <div className="lg:col-span-2 space-y-6">
          {/* 기본 정보 */}
          <Card>
            <CardHeader>
              <CardTitle>기본 정보</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-500" />
                  <span className="font-medium">이름:</span>
                  <span>{applicant.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span className="font-medium">지원일:</span>
                  <span>{applicant.appliedDate}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <span className="font-medium">이메일:</span>
                  <span>{applicant.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-500" />
                  <span className="font-medium">연락처:</span>
                  <span>{applicant.phone}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 경력 및 학력 */}
          <Card>
            <CardHeader>
              <CardTitle>경력 및 학력</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">경력 사항</h4>
                <p className="text-gray-700 whitespace-pre-line">{applicant.experience}</p>
              </div>
              <div>
                <h4 className="font-medium mb-2">학력 사항</h4>
                <p className="text-gray-700">{applicant.education}</p>
              </div>
              {applicant.portfolio && (
                <div>
                  <h4 className="font-medium mb-2">포트폴리오</h4>
                  <a
                    href={applicant.portfolio}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {applicant.portfolio}
                  </a>
                </div>
              )}
            </CardContent>
          </Card>

          {/* 지원 동기 */}
          <Card>
            <CardHeader>
              <CardTitle>지원 동기</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">{applicant.motivation}</p>
            </CardContent>
          </Card>

          {/* 첨부 파일 */}
          <Card>
            <CardHeader>
              <CardTitle>첨부 파일</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {applicant.files.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <span className="text-sm">{file.name}</span>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-1" />
                      다운로드
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 사이드바 */}
        <div className="space-y-6">
          {/* 상태 관리 */}
          <Card>
            <CardHeader>
              <CardTitle>지원 상태</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <span className="font-medium">현재 상태:</span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(status)}`}>
                  {getStatusText(status)}
                </span>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">상태 변경</label>
                <select
                  value={status}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="pending">검토 대기</option>
                  <option value="reviewed">검토 완료</option>
                  <option value="interview">면접 예정</option>
                  <option value="rejected">불합격</option>
                  <option value="hired">합격</option>
                </select>
              </div>
            </CardContent>
          </Card>

          {/* 추가 정보 */}
          <Card>
            <CardHeader>
              <CardTitle>추가 정보</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <span className="font-medium">희망 연봉:</span>
                <span className="ml-2">{applicant.salary}</span>
              </div>
              <div>
                <span className="font-medium">입사 가능일:</span>
                <span className="ml-2">{applicant.startDate}</span>
              </div>
            </CardContent>
          </Card>

          {/* 메모 */}
          <Card>
            <CardHeader>
              <CardTitle>메모</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                placeholder="지원자에 대한 메모를 작성하세요..."
              />
              <Button onClick={handleNotesUpdate} className="w-full">
                메모 저장
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
