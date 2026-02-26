import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { recruitApi, resolveAssetUrl, type RecruitResponse } from "@/lib/api"
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

const formatDate = (value?: string | null) => {
  if (!value) return "상시채용"
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleDateString("ko-KR")
}

const toJobDetail = (recruit: RecruitResponse): JobDetail => ({
  id: recruit.recruitId,
  title: recruit.position,
  department: recruit.department ?? "미정",
  type: recruit.empType ?? "미정",
  experience: recruit.careerLevel ?? "협의",
  location: recruit.location ?? "미정",
  deadline: formatDate(recruit.deadline),
  description: recruit.description ?? "상세 설명이 등록되지 않았습니다.",
  requirements: [
    recruit.careerLevel ? `경력 조건: ${recruit.careerLevel}` : "경력 조건 협의",
    recruit.department ? `소속 부서: ${recruit.department}` : "소속 부서 협의",
    "관련 직무 수행 역량 및 협업 능력",
  ],
  responsibilities: recruit.description
    ? recruit.description
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean)
        .slice(0, 5)
    : ["채용 공고 상세 업무는 면접/상세 안내를 통해 전달됩니다."],
  benefits: ["4대보험", "경조사 지원", "교육/성장 지원", "성과 기반 보상"],
  images: recruit.imageUrl ? [resolveAssetUrl(recruit.imageUrl)] : [],
  workingHours: "09:00 ~ 18:00 (주 40시간)",
})

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ id: string }> | { id: string }
}) {
  const resolvedParams = await Promise.resolve(params)
  let job: JobDetail | null = null
  try {
    job = toJobDetail(await recruitApi.getOne(resolvedParams.id))
  } catch {
    job = null
  }

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
                  <Link href={`/recruit/apply?recruitId=${job.id}`}>지원하기</Link>
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
              <Link href={`/recruit/apply?recruitId=${job.id}`}>지원하기</Link>
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
