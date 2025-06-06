import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Calendar, MapPin, Clock, Briefcase } from "lucide-react"

interface JobDetail {
  id: number
  title: string
  department: string
  type: string
  experience: string
  location: string
  deadline: string
  description: string
  requirements: string[]
  responsibilities: string[]
  benefits: string[]
  images: string[]
  salary?: string
  workingHours?: string
}

// 실제로는 데이터베이스에서 가져올 데이터
const getJobById = (id: string): JobDetail | null => {
  const jobs: JobDetail[] = [
    {
      id: 1,
      title: "시니어 인테리어 디자이너",
      department: "디자인팀",
      type: "정규직",
      experience: "경력 5년 이상",
      location: "서울 강남구",
      deadline: "2024-04-30",
      description:
        "상업공간 및 주거공간 디자인 전문가를 모집합니다. 창의적 사고와 실무 경험을 바탕으로 고품질의 디자인을 구현할 수 있는 분을 찾습니다.",
      requirements: [
        "인테리어 디자인 관련 학과 졸업",
        "AutoCAD, 3ds Max, SketchUp 등 디자인 프로그램 능숙",
        "상업공간 디자인 경력 5년 이상",
        "프로젝트 관리 경험",
        "원활한 커뮤니케이션 능력",
      ],
      responsibilities: [
        "상업공간 및 주거공간 인테리어 디자인",
        "클라이언트 미팅 및 요구사항 분석",
        "3D 모델링 및 렌더링 작업",
        "시공 현장 감리 및 품질 관리",
        "프로젝트 일정 관리",
      ],
      benefits: ["4대보험 완비", "연봉 협상 가능", "교육비 지원", "유연근무제", "성과급 지급"],
      images: ["/placeholder.svg?height=400&width=600", "/placeholder.svg?height=400&width=600"],
      salary: "5,000만원 ~ 7,000만원",
      workingHours: "09:00 ~ 18:00 (주 40시간)",
    },
    {
      id: 2,
      title: "주니어 인테리어 디자이너",
      department: "디자인팀",
      type: "정규직",
      experience: "신입/경력 1-3년",
      location: "서울 강남구",
      deadline: "2024-04-15",
      description:
        "인테리어 디자인에 열정이 있는 주니어 디자이너를 모집합니다. 성장 가능성과 학습 의지가 있는 분들의 지원을 환영합니다.",
      requirements: [
        "인테리어 디자인 관련 학과 졸업",
        "AutoCAD, SketchUp 기본 사용 가능",
        "포트폴리오 필수",
        "적극적인 학습 의지",
        "팀워크 중시",
      ],
      responsibilities: [
        "시니어 디자이너 업무 보조",
        "도면 작성 및 수정",
        "자료 조사 및 정리",
        "클라이언트 미팅 참석",
        "현장 방문 및 체크",
      ],
      benefits: ["4대보험 완비", "신입 교육 프로그램", "멘토링 시스템", "교육비 지원", "경력 개발 지원"],
      images: ["/placeholder.svg?height=400&width=600"],
      salary: "3,000만원 ~ 4,000만원",
      workingHours: "09:00 ~ 18:00 (주 40시간)",
    },
  ]

  return jobs.find((j) => j.id === Number.parseInt(id)) || null
}

export default function JobDetailPage({ params }: { params: { id: string } }) {
  const job = getJobById(params.id)

  if (!job) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">채용공고를 찾을 수 없습니다</h1>
          <Button asChild>
            <Link href="/recruit">채용정보로 돌아가기</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white">
      {/* Header */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Button asChild variant="outline" className="mb-6">
            <Link href="/recruit">
              <ArrowLeft className="w-4 h-4 mr-2" />
              채용정보로 돌아가기
            </Link>
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-4 mb-4">
                <span className="px-3 py-1 bg-black text-white rounded-full text-sm font-medium">{job.department}</span>
                <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">{job.type}</span>
              </div>

              <h1 className="text-4xl font-bold text-black mb-4">{job.title}</h1>
              <p className="text-xl text-gray-600 mb-6">{job.description}</p>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-600">경력: {job.experience}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-600">위치: {job.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-600">마감: {job.deadline}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-600">근무시간: {job.workingHours}</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border h-fit">
              <h3 className="font-semibold text-black mb-4">채용 정보</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">부서</span>
                  <span className="font-medium">{job.department}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">고용형태</span>
                  <span className="font-medium">{job.type}</span>
                </div>
                {job.salary && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">연봉</span>
                    <span className="font-medium">{job.salary}</span>
                  </div>
                )}
                <div className="pt-4">
                  <Button asChild className="w-full bg-black text-white hover:bg-gray-800">
                    <Link href="/recruit/apply">지원하기</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Job Images */}
      {job.images.length > 0 && (
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {job.images.map((image, index) => (
                <div key={index} className="relative h-64 rounded-lg overflow-hidden">
                  <Image
                    src={image || "/placeholder.svg"}
                    alt={`${job.title} - ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Job Details */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* 주요 업무 */}
            <div>
              <h2 className="text-2xl font-bold text-black mb-6">주요 업무</h2>
              <ul className="space-y-3">
                {job.responsibilities.map((responsibility, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-black rounded-full mt-2 flex-shrink-0" />
                    <span className="text-gray-700">{responsibility}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 지원 자격 */}
            <div>
              <h2 className="text-2xl font-bold text-black mb-6">지원 자격</h2>
              <ul className="space-y-3">
                {job.requirements.map((requirement, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-black rounded-full mt-2 flex-shrink-0" />
                    <span className="text-gray-700">{requirement}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 복리후생 */}
            <div>
              <h2 className="text-2xl font-bold text-black mb-6">복리후생</h2>
              <ul className="space-y-3">
                {job.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-black rounded-full mt-2 flex-shrink-0" />
                    <span className="text-gray-700">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-black mb-6">지원하고 싶으신가요?</h2>
          <p className="text-gray-600 mb-8">GIGA Interior와 함께 성장할 기회를 놓치지 마세요</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-black text-white hover:bg-gray-800">
              <Link href="/recruit/apply">지원하기</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/contact">문의하기</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
