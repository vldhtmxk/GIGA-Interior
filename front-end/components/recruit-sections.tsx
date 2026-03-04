"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Briefcase, Clock, GraduationCap, Heart, MapPin, Users } from "lucide-react"
import { cn } from "@/lib/utils"

type RecruitCard = {
  id: number
  title: string
  department: string
  type: string
  experience: string
  location: string
  deadline: string
  description: string
  imageUrl: string | null
}

type RecruitSectionsProps = {
  positions: RecruitCard[]
}

function useInViewOnce<T extends HTMLElement>(threshold = 0.14) {
  const ref = useRef<T | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (!ref.current || isVisible) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold },
    )
    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [isVisible, threshold])

  return { ref, isVisible }
}

const culture = [
  {
    title: "Creative Environment",
    description: "자유로운 사고와 혁신적 아이디어가 존중받는 창의적 업무 환경",
  },
  {
    title: "Collaboration",
    description: "팀워크를 바탕으로 한 협업으로 더 나은 결과물을 만들어갑니다",
  },
  {
    title: "Continuous Learning",
    description: "트렌드와 기술을 지속적으로 학습하고 프로젝트에 적용합니다",
  },
  {
    title: "Client Focus",
    description: "고객의 만족과 성공을 최우선으로 생각하는 서비스 마인드",
  },
]

const benefits = [
  {
    icon: Heart,
    title: "워라밸",
    description: "주 40시간 근무제와 유연근무제로 일과 삶의 균형을 지원합니다",
  },
  {
    icon: GraduationCap,
    title: "성장 지원",
    description: "교육비 지원과 세미나/연수 기회를 통해 성장을 돕습니다",
  },
  {
    icon: Users,
    title: "수평적 문화",
    description: "자유로운 의견 교환과 아이디어가 존중받는 조직문화입니다",
  },
  {
    icon: Briefcase,
    title: "보상 체계",
    description: "성과 기반 보상과 합리적인 평가 체계를 운영합니다",
  },
]

export default function RecruitSections({ positions }: RecruitSectionsProps) {
  const header = useInViewOnce<HTMLElement>(0.1)
  const cultureSection = useInViewOnce<HTMLElement>(0.1)
  const benefitsSection = useInViewOnce<HTMLElement>(0.1)
  const jobsSection = useInViewOnce<HTMLElement>(0.08)
  const ctaSection = useInViewOnce<HTMLElement>(0.2)

  return (
    <main className="giga-public-surface min-h-screen pt-24">
      <section ref={header.ref} className="mx-auto max-w-[1400px] px-6 py-20 lg:px-16">
        <p
          className={cn(
            "mb-4 text-[10px] uppercase tracking-[0.4em] text-[#c9a96e] transition-all",
            header.isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
          )}
          style={{ transitionDuration: "860ms" }}
        >
          Careers
        </p>
        <h1
          className={cn(
            "giga-display mb-6 text-[clamp(2.6rem,7vw,7rem)] font-light leading-none text-white transition-all",
            header.isVisible ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0",
          )}
          style={{ transitionDuration: "980ms" }}
        >
          Join
          <br />
          <em className="not-italic text-[#c9a96e]">GIGA Interior</em>
        </h1>
        <p
          className={cn(
            "max-w-2xl text-base leading-relaxed text-white/40 transition-all",
            header.isVisible ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0",
          )}
          style={{ transitionDuration: "980ms", transitionDelay: "100ms" }}
        >
          성장하는 브랜드와 함께 공간 디자인의 새로운 기준을 만들 인재를 찾습니다.
        </p>
        <div
          className={cn(
            "mt-10 flex flex-wrap gap-4 transition-all",
            header.isVisible ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0",
          )}
          style={{ transitionDuration: "980ms", transitionDelay: "180ms" }}
        >
          <Link
            href="/recruit/apply"
            className="inline-flex items-center gap-2 bg-[#c9a96e] px-7 py-3 text-[11px] uppercase tracking-[0.24em] text-[#0a0a0a] transition-colors hover:bg-white"
          >
            지원하기 <ArrowRight className="h-4 w-4" />
          </Link>
          <a
            href="#open-positions"
            className="inline-flex items-center gap-2 border border-white/20 px-7 py-3 text-[11px] uppercase tracking-[0.24em] text-white/70 transition-colors hover:border-[#c9a96e]/50 hover:text-white"
          >
            채용 공고 보기
          </a>
        </div>
      </section>

      <section ref={cultureSection.ref} className="mx-auto max-w-[1400px] px-6 pb-24 lg:px-16">
        <h2 className="giga-display mb-10 text-[clamp(1.8rem,4vw,3rem)] font-light text-white">Our Culture</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {culture.map((item, index) => (
            <div
              key={item.title}
              className={cn(
                "border border-white/10 p-6 transition-all hover:border-[#c9a96e]/40",
                cultureSection.isVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0",
              )}
              style={{ transitionDuration: "900ms", transitionDelay: `${index * 70}ms` }}
            >
              <h3 className="giga-display text-2xl font-light text-white">{item.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-white/45">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section ref={benefitsSection.ref} className="border-y border-white/5 px-6 py-20 lg:px-16">
        <div className="mx-auto max-w-[1400px]">
          <h2 className="giga-display mb-10 text-[clamp(1.8rem,4vw,3rem)] font-light text-white">Benefits</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {benefits.map((item, index) => {
              const Icon = item.icon
              return (
                <div
                  key={item.title}
                  className={cn(
                    "border border-white/10 p-6 transition-all hover:border-[#c9a96e]/40",
                    benefitsSection.isVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0",
                  )}
                  style={{ transitionDuration: "900ms", transitionDelay: `${index * 70}ms` }}
                >
                  <Icon className="h-6 w-6 text-[#c9a96e]" />
                  <h3 className="mt-4 text-lg text-white">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/45">{item.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section id="open-positions" ref={jobsSection.ref} className="mx-auto max-w-[1400px] px-6 py-20 lg:px-16">
        <h2 className="giga-display mb-10 text-[clamp(1.8rem,4vw,3rem)] font-light text-white">Open Positions</h2>
        {positions.length === 0 ? (
          <div className="border border-dashed border-white/20 p-10 text-center text-white/45">현재 등록된 채용 공고가 없습니다.</div>
        ) : (
          <div className="space-y-4">
            {positions.map((position, index) => (
              <article
                key={position.id}
                className={cn(
                  "group border border-white/10 p-6 transition-all hover:-translate-y-0.5 hover:border-[#c9a96e]/40",
                  jobsSection.isVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0",
                )}
                style={{ transitionDuration: "900ms", transitionDelay: `${index * 70}ms` }}
              >
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_auto]">
                  <div>
                    <div className="mb-4 flex flex-wrap items-center gap-2">
                      <span className="border border-[#c9a96e]/40 px-2.5 py-1 text-[10px] uppercase tracking-[0.2em] text-[#c9a96e]">
                        {position.department}
                      </span>
                      <span className="border border-white/20 px-2.5 py-1 text-[10px] uppercase tracking-[0.2em] text-white/50">
                        {position.type}
                      </span>
                    </div>
                    <Link href={`/recruit/${position.id}`} className="inline-block">
                      <h3 className="giga-display text-3xl font-light text-white transition-colors group-hover:text-[#c9a96e]">
                        {position.title}
                      </h3>
                    </Link>
                    {position.imageUrl && (
                      <div className="relative mt-5 h-44 w-full overflow-hidden border border-white/10 sm:h-52 lg:max-w-xl">
                        <Image src={position.imageUrl} alt={position.title} fill className="object-cover" unoptimized />
                      </div>
                    )}
                    <p className="mt-5 text-sm leading-relaxed text-white/45">{position.description}</p>
                    <div className="mt-5 grid grid-cols-1 gap-3 text-xs text-white/55 sm:grid-cols-3">
                      <p className="inline-flex items-center gap-2">
                        <Briefcase className="h-4 w-4 text-[#c9a96e]" /> {position.experience}
                      </p>
                      <p className="inline-flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-[#c9a96e]" /> {position.location}
                      </p>
                      <p className="inline-flex items-center gap-2">
                        <Clock className="h-4 w-4 text-[#c9a96e]" /> 마감: {position.deadline}
                      </p>
                    </div>
                  </div>
                  <div className="lg:w-[140px]">
                    <Link
                      href={`/recruit/${position.id}`}
                      className="inline-flex w-full items-center justify-center border border-[#c9a96e]/60 px-5 py-3 text-[10px] uppercase tracking-[0.22em] text-[#c9a96e] transition-colors hover:bg-[#c9a96e] hover:text-[#0a0a0a]"
                    >
                      상세보기
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section ref={ctaSection.ref} className="mx-auto max-w-[1400px] px-6 pb-24 lg:px-16">
        <div
          className={cn(
            "relative overflow-hidden border border-white/10 p-12 text-center transition-all lg:p-20",
            ctaSection.isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0",
          )}
          style={{ transitionDuration: "980ms" }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[#c9a96e]/10 to-transparent" />
          <h2 className="giga-display relative z-10 mb-5 text-[clamp(2rem,5vw,4rem)] font-light text-white">
            Build Your Career With Us
          </h2>
          <p className="relative z-10 mx-auto mb-8 max-w-2xl text-white/50">
            당신의 재능과 열정으로 더 나은 공간을 만드는 여정에 함께하세요.
          </p>
          <Link
            href="/recruit/apply"
            className="relative z-10 inline-flex items-center gap-2 bg-[#c9a96e] px-10 py-4 text-[11px] uppercase tracking-[0.24em] text-[#0a0a0a] transition-colors hover:bg-white"
          >
            지금 지원하기 <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </main>
  )
}

