"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { resolveAssetUrl } from "@/lib/api"

type HistoryItem = {
  year: string
  title: string
  description: string
}

type ValueItem = {
  title: string
  description: string
}

type TeamMember = {
  name: string
  position: string
  photo: string
}

type AboutSectionsProps = {
  ceo: {
    name?: string | null
    title?: string | null
    message?: string | null
    image?: string | null
  } | null
  histories: HistoryItem[]
  values: ValueItem[]
  team: TeamMember[]
}

function useInViewOnce<T extends HTMLElement>(threshold = 0.15) {
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

export default function AboutSections({ ceo, histories, values, team }: AboutSectionsProps) {
  const hero = useInViewOnce<HTMLElement>(0.1)
  const heroImage = useInViewOnce<HTMLElement>(0.1)
  const ceoSection = useInViewOnce<HTMLElement>(0.15)
  const valueSection = useInViewOnce<HTMLElement>(0.15)
  const journeySection = useInViewOnce<HTMLElement>(0.15)
  const teamSection = useInViewOnce<HTMLElement>(0.15)
  const ctaSection = useInViewOnce<HTMLElement>(0.2)

  return (
    <main className="giga-public-surface min-h-screen pt-24">
      <section ref={hero.ref} className="mx-auto max-w-[1400px] px-6 py-20 lg:px-16">
        <p
          className={cn(
            "mb-4 text-[10px] uppercase tracking-[0.4em] text-[#c9a96e] transition-all",
            hero.isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
          )}
          style={{ transitionDuration: "860ms" }}
        >
          About Us
        </p>
        <h1
          className={cn(
            "giga-display mb-8 text-[clamp(2.6rem,7vw,7rem)] font-light leading-none text-white transition-all",
            hero.isVisible ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0",
          )}
          style={{ transitionDuration: "980ms" }}
        >
          We design
          <br />
          <em className="not-italic text-[#c9a96e]">experiences</em>
        </h1>
        <p
          className={cn(
            "max-w-xl text-base leading-relaxed text-white/40 transition-all",
            hero.isVisible ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0",
          )}
          style={{ transitionDuration: "980ms", transitionDelay: "120ms" }}
        >
          {ceo?.message?.slice(0, 140) ||
            "2013년 설립 이래 GIGA Interior는 공간 디자인의 새로운 기준을 제시해왔습니다. 단순히 공간을 꾸미는 것이 아니라, 삶의 경험을 설계합니다."}
        </p>
      </section>

      <section ref={heroImage.ref} className="mx-auto mb-24 max-w-[1400px] px-6 lg:px-16">
        <div
          className={cn(
            "relative h-[60vh] min-h-[360px] overflow-hidden transition-all",
            heroImage.isVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0",
          )}
          style={{ transitionDuration: "980ms" }}
        >
          <Image
            src={resolveAssetUrl(ceo?.image) || "/menu-hero/about.svg"}
            alt={ceo?.name || "GIGA Interior team"}
            fill
            className="object-cover"
            unoptimized
          />
          <div className="absolute inset-0 bg-black/35" />
        </div>
      </section>

      <section ref={ceoSection.ref} className="mx-auto mb-24 max-w-[1400px] px-6 lg:px-16">
        <div
          className={cn(
            "grid grid-cols-1 items-center gap-10 transition-all md:grid-cols-[240px_1fr]",
            ceoSection.isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0",
          )}
          style={{ transitionDuration: "980ms" }}
        >
          <div className="relative mx-auto h-52 w-52 overflow-hidden rounded-full border border-white/10 md:mx-0">
            <Image
              src={resolveAssetUrl(ceo?.image) || "/placeholder.svg?height=400&width=400&query=professional interior designer portrait"}
              alt={ceo?.name || "CEO"}
              fill
              className="object-cover"
              unoptimized
            />
          </div>
          <div>
            <p className="mb-3 text-[10px] uppercase tracking-[0.35em] text-[#c9a96e]">CEO Message</p>
            <h2 className="giga-display mb-5 text-[clamp(1.6rem,3vw,2.6rem)] font-light text-white">
              안녕하세요, {ceo?.title || "대표"} {ceo?.name || "김민지"}입니다.
            </h2>
            <p className="whitespace-pre-line text-sm leading-relaxed text-white/50 sm:text-base">
              {ceo?.message ||
                `우리 스튜디오는 공간이 가진 잠재력을 끌어내는 디자인을 추구합니다.
단순히 아름다운 공간을 넘어, 그 공간을 사용하는 사람들의 경험을 설계합니다.`}
            </p>
          </div>
        </div>
      </section>

      <section ref={valueSection.ref} className="mx-auto mb-24 max-w-[1400px] px-6 lg:px-16">
        <p className="mb-12 text-[10px] uppercase tracking-[0.35em] text-[#c9a96e]">Our Values</p>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((value, index) => (
            <div
              key={value.title}
              className={cn(
                "border-t border-white/10 pt-6 transition-all",
                valueSection.isVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0",
              )}
              style={{ transitionDuration: "860ms", transitionDelay: `${index * 90}ms` }}
            >
              <h3 className="giga-display mb-3 text-2xl font-light text-white">{value.title}</h3>
              <p className="text-sm leading-relaxed text-white/30">{value.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section ref={journeySection.ref} className="mx-auto mb-24 grid max-w-[1400px] grid-cols-1 items-start gap-16 px-6 lg:grid-cols-2 lg:px-16">
        <div
          className={cn(
            "relative h-[520px] overflow-hidden transition-all",
            journeySection.isVisible ? "translate-x-0 opacity-100" : "-translate-x-8 opacity-0",
          )}
          style={{ transitionDuration: "980ms" }}
        >
          <Image src="/menu-hero/about.svg" alt="Interior detail" fill className="object-cover" />
        </div>

        <div
          className={cn(
            "transition-all",
            journeySection.isVisible ? "translate-x-0 opacity-100" : "translate-x-8 opacity-0",
          )}
          style={{ transitionDuration: "980ms" }}
        >
          <p className="mb-8 text-[10px] uppercase tracking-[0.35em] text-[#c9a96e]">Our Journey</p>
          <div className="space-y-8">
            {histories.map((item, index) => (
              <div
                key={`${item.year}-${item.title}`}
                className={cn(
                  "flex gap-8 transition-all",
                  journeySection.isVisible ? "translate-x-0 opacity-100" : "translate-x-5 opacity-0",
                )}
                style={{ transitionDuration: "860ms", transitionDelay: `${index * 80}ms` }}
              >
                <span className="giga-display w-14 shrink-0 text-xl font-light text-[#c9a96e]">{item.year}</span>
                <div className="flex-1 border-t border-white/10 pt-4">
                  <p className="text-sm leading-relaxed text-white/80">{item.title}</p>
                  {item.description && <p className="mt-2 text-sm leading-relaxed text-white/35">{item.description}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section ref={teamSection.ref} className="mx-auto mb-24 max-w-[1400px] px-6 lg:px-16">
        <p className="mb-4 text-[10px] uppercase tracking-[0.35em] text-[#c9a96e]">The Team</p>
        <h2 className="giga-display mb-16 text-[clamp(1.8rem,4vw,3.5rem)] font-light text-white">Meet Our Designers</h2>
        <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
          {team.map((member, index) => (
            <div
              key={member.name}
              className={cn(
                "group transition-all",
                teamSection.isVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0",
              )}
              style={{ transitionDuration: "860ms", transitionDelay: `${index * 90}ms` }}
            >
              <div className="mb-4 h-64 overflow-hidden sm:h-80">
                <Image
                  src={member.photo || "/placeholder.svg"}
                  alt={member.name}
                  width={400}
                  height={500}
                  className="h-full w-full object-cover grayscale transition-all duration-500 group-hover:scale-105 group-hover:grayscale-0"
                  unoptimized
                />
              </div>
              <h3 className="text-base text-white">{member.name}</h3>
              <p className="text-xs tracking-wide text-white/30">{member.position}</p>
            </div>
          ))}
        </div>
      </section>

      <section ref={ctaSection.ref} className="mx-auto max-w-[1400px] px-6 pb-24 lg:px-16">
        <div
          className={cn(
            "flex flex-col items-center justify-between gap-8 border border-white/10 p-12 transition-all lg:flex-row lg:p-16",
            ctaSection.isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0",
          )}
          style={{ transitionDuration: "980ms" }}
        >
          <div>
            <h2 className="giga-display mb-2 text-[clamp(1.8rem,3vw,3rem)] font-light text-white">함께 일하고 싶으신가요?</h2>
            <p className="text-sm text-white/30">채용 포지션을 확인해보세요.</p>
          </div>
          <Link
            href="/recruit"
            className="flex shrink-0 items-center gap-3 border border-[#c9a96e]/40 px-8 py-4 text-[11px] uppercase tracking-[0.2em] text-[#c9a96e] transition-all duration-300 hover:bg-[#c9a96e] hover:text-[#0a0a0a]"
          >
            채용 공고 보기
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </main>
  )
}
