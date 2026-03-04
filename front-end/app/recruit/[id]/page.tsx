import Image from "next/image"
import Link from "next/link"
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
      <main className="giga-public-surface flex min-h-screen items-center justify-center px-6 pt-24">
        <div className="border border-white/10 p-10 text-center">
          <h1 className="giga-display text-4xl font-light text-white">Position Not Found</h1>
          <p className="mt-3 text-sm text-white/45">채용공고를 찾을 수 없습니다.</p>
          <Link
            href="/recruit"
            className="mt-6 inline-flex items-center gap-2 border border-[#c9a96e]/60 px-6 py-3 text-[10px] uppercase tracking-[0.22em] text-[#c9a96e] transition-colors hover:bg-[#c9a96e] hover:text-[#0a0a0a]"
          >
            채용정보로 돌아가기
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="giga-public-surface min-h-screen pt-24">
      <section className="mx-auto max-w-[1400px] px-6 py-16 lg:px-16 lg:py-20">
        <Link
          href="/recruit"
          className="mb-7 inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-white/45 transition-colors hover:text-[#c9a96e]"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          채용정보로 돌아가기
        </Link>

        <div className="mb-4 flex flex-wrap items-center gap-2">
          <span className="border border-[#c9a96e]/40 px-2.5 py-1 text-[10px] uppercase tracking-[0.2em] text-[#c9a96e]">
            {job.department}
          </span>
          <span className="border border-white/15 px-2.5 py-1 text-[10px] uppercase tracking-[0.2em] text-white/45">{job.type}</span>
        </div>

        <h1 className="giga-display giga-fade-up text-[clamp(2.2rem,6vw,5rem)] font-light leading-none text-white">{job.title}</h1>
        <p className="giga-fade-up mt-5 max-w-3xl text-sm leading-relaxed text-white/45 lg:text-base">{job.description}</p>
      </section>

      {job.images.length > 0 && (
        <section className="mx-auto max-w-[1400px] px-6 pb-12 lg:px-16">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {job.images.map((image, index) => (
              <div key={index} className="giga-card-reveal relative h-[36vh] overflow-hidden border border-white/10 sm:h-[46vh]">
                <Image src={image || "/placeholder.svg"} alt={`${job.title} - ${index + 1}`} fill className="object-cover" />
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="mx-auto max-w-[1400px] px-6 pb-16 lg:px-16 lg:pb-20">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
          <div className="giga-card-reveal border border-white/10 p-5">
            <p className="text-[10px] uppercase tracking-[0.22em] text-white/30">Experience</p>
            <p className="mt-3 inline-flex items-center gap-2 text-sm text-white/70">
              <Briefcase className="h-4 w-4 text-[#c9a96e]" /> {job.experience}
            </p>
          </div>
          <div className="giga-card-reveal border border-white/10 p-5">
            <p className="text-[10px] uppercase tracking-[0.22em] text-white/30">Location</p>
            <p className="mt-3 inline-flex items-center gap-2 text-sm text-white/70">
              <MapPin className="h-4 w-4 text-[#c9a96e]" /> {job.location}
            </p>
          </div>
          <div className="giga-card-reveal border border-white/10 p-5">
            <p className="text-[10px] uppercase tracking-[0.22em] text-white/30">Deadline</p>
            <p className="mt-3 inline-flex items-center gap-2 text-sm text-white/70">
              <Calendar className="h-4 w-4 text-[#c9a96e]" /> {job.deadline}
            </p>
          </div>
          <div className="giga-card-reveal border border-white/10 p-5">
            <p className="text-[10px] uppercase tracking-[0.22em] text-white/30">Working Hours</p>
            <p className="mt-3 inline-flex items-center gap-2 text-sm text-white/70">
              <Clock className="h-4 w-4 text-[#c9a96e]" /> {job.workingHours}
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-6 pb-20 lg:px-16">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <article className="giga-card-reveal border border-white/10 p-7">
            <p className="mb-5 text-[10px] uppercase tracking-[0.25em] text-[#c9a96e]">Responsibilities</p>
            <ul className="space-y-3">
              {job.responsibilities.map((item, index) => (
                <li key={index} className="flex gap-3 text-sm text-white/55">
                  <span className="mt-2 h-1.5 w-1.5 bg-[#c9a96e]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </article>

          <article className="giga-card-reveal border border-white/10 p-7">
            <p className="mb-5 text-[10px] uppercase tracking-[0.25em] text-[#c9a96e]">Requirements</p>
            <ul className="space-y-3">
              {job.requirements.map((item, index) => (
                <li key={index} className="flex gap-3 text-sm text-white/55">
                  <span className="mt-2 h-1.5 w-1.5 bg-[#c9a96e]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </article>

          <article className="giga-card-reveal border border-white/10 p-7">
            <p className="mb-5 text-[10px] uppercase tracking-[0.25em] text-[#c9a96e]">Benefits</p>
            <ul className="space-y-3">
              {job.benefits.map((item, index) => (
                <li key={index} className="flex gap-3 text-sm text-white/55">
                  <span className="mt-2 h-1.5 w-1.5 bg-[#c9a96e]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </article>
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-6 pb-24 lg:px-16">
        <div className="relative overflow-hidden border border-white/10 p-10 text-center lg:p-14">
          <div className="absolute inset-0 bg-gradient-to-br from-[#c9a96e]/10 to-transparent" />
          <p className="relative z-10 mb-3 text-[10px] uppercase tracking-[0.28em] text-[#c9a96e]">Apply Now</p>
          <h2 className="giga-display relative z-10 text-[clamp(1.8rem,4vw,3rem)] font-light text-white">함께 성장할 준비가 되셨나요?</h2>
          <p className="relative z-10 mx-auto mt-3 max-w-xl text-sm text-white/45">지원서를 제출하시면 검토 후 순차적으로 연락드리겠습니다.</p>
          <div className="relative z-10 mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href={`/recruit/apply?recruitId=${job.id}`}
              className="inline-flex items-center justify-center bg-[#c9a96e] px-8 py-3 text-[10px] uppercase tracking-[0.22em] text-[#0a0a0a] transition-colors hover:bg-white"
            >
              지원하기
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center border border-[#c9a96e]/60 px-8 py-3 text-[10px] uppercase tracking-[0.22em] text-[#c9a96e] transition-colors hover:bg-[#c9a96e] hover:text-[#0a0a0a]"
            >
              문의하기
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
