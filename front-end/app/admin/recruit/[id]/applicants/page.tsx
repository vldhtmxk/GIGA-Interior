"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Eye, Download, Mail, Phone } from "lucide-react"

interface Applicant {
  id: number
  name: string
  email: string
  phone: string
  experience: string
  appliedDate: string
  status: "pending" | "reviewed" | "interview" | "rejected" | "hired"
  resumeUrl?: string
  portfolioUrl?: string
}

export default function ApplicantsPage({ params }: { params: { id: string } }) {
  const [applicants] = useState<Applicant[]>([
    {
      id: 1,
      name: "김철수",
      email: "kim@example.com",
      phone: "010-1234-5678",
      experience: "5년",
      appliedDate: "2024-03-15",
      status: "pending",
      resumeUrl: "/resume1.pdf",
      portfolioUrl: "/portfolio1.pdf",
    },
    {
      id: 2,
      name: "이영희",
      email: "lee@example.com",
      phone: "010-9876-5432",
      experience: "3년",
      appliedDate: "2024-03-14",
      status: "reviewed",
      resumeUrl: "/resume2.pdf",
    },
    {
      id: 3,
      name: "박민수",
      email: "park@example.com",
      phone: "010-5555-1234",
      experience: "7년",
      appliedDate: "2024-03-13",
      status: "interview",
      resumeUrl: "/resume3.pdf",
      portfolioUrl: "/portfolio3.pdf",
    },
  ])

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
          <Link href="/admin/recruit">
            <ArrowLeft className="w-4 h-4 mr-2" />
            채용 관리로 돌아가기
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-black">지원자 목록</h1>
          <p className="text-gray-600">시니어 인테리어 디자이너 - 총 {applicants.length}명 지원</p>
        </div>
      </div>

      {/* 지원자 목록 */}
      <div className="space-y-4">
        {applicants.map((applicant) => (
          <Card key={applicant.id}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-4">
                    <h3 className="text-xl font-bold text-black">{applicant.name}</h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(applicant.status)}`}>
                      {getStatusText(applicant.status)}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-4">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      {applicant.email}
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      {applicant.phone}
                    </div>
                    <div>경력: {applicant.experience}</div>
                    <div>지원일: {applicant.appliedDate}</div>
                  </div>

                  <div className="flex gap-2">
                    {applicant.resumeUrl && (
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-1" />
                        이력서
                      </Button>
                    )}
                    {applicant.portfolioUrl && (
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-1" />
                        포트폴리오
                      </Button>
                    )}
                  </div>
                </div>

                <div className="flex gap-2 ml-4">
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/admin/recruit/${params.id}/applicants/${applicant.id}`}>
                      <Eye className="w-4 h-4 mr-1" />
                      상세보기
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
