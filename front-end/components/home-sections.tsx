"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { ArrowRight, ArrowUpRight } from "lucide-react"
import FeaturedProjectCard from "@/components/featured-project-card"
import { cn } from "@/lib/utils"

type FeaturedProject = {
  id: string
  title: string
  category: string
  image: string
}

function useInViewOnce<T extends HTMLElement>(threshold = 0.18) {
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

const services = [
  {
    no: "01",
    title: "인테리어 디자인",
    description: "공간의 기능과 미학을 고려한 맞춤형 인테리어 디자인 서비스를 제공합니다.",
  },
  {
    no: "02",
    title: "공간 계획",
    description: "효율적인 공간 활용을 위한 레이아웃 설계와 공간 계획 서비스를 제공합니다.",
  },
  {
    no: "03",
    title: "가구 디자인",
    description: "공간에 맞는 맞춤형 가구 디자인 및 제작 서비스를 제공합니다.",
  },
]

export default function HomeSections({ featured }: { featured: FeaturedProject[] }) {
  const projects = useInViewOnce<HTMLElement>(0.12)
  const servicesSection = useInViewOnce<HTMLElement>(0.12)
  const cta = useInViewOnce<HTMLElement>(0.2)

  return (
    <>
      <section ref={projects.ref} className="mx-auto w-full max-w-[1400px] px-6 py-24 lg:px-16">
        <div
          className={cn(
            "mb-16 flex items-end justify-between gap-6 transition-all",
            projects.isVisible ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0",
          )}
          style={{ transitionDuration: "860ms" }}
        >
          <div>
            <p className="mb-3 text-[10px] uppercase tracking-[0.35em] text-[#c9a96e]">Featured Work</p>
            <h2 className="giga-display text-[clamp(1.6rem,4vw,3rem)] font-light text-white">Main Projects</h2>
          </div>
          <Link
            href="/portfolio"
            className="hidden items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-white/50 transition-colors hover:text-[#c9a96e] sm:flex"
          >
            View All <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {featured.map((project, index) => (
            <div
              key={project.id}
              className={cn(
                "transition-all",
                projects.isVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0",
              )}
              style={{ transitionDuration: "860ms", transitionDelay: `${index * 90}ms` }}
            >
              <FeaturedProjectCard id={project.id} title={project.title} category={project.category} image={project.image} />
            </div>
          ))}
        </div>
      </section>

      <section ref={servicesSection.ref} className="border-y border-white/5 px-6 py-20 lg:px-16">
        <div className="mx-auto w-full max-w-[1400px]">
          <div
            className={cn(
              "mb-14 transition-all",
              servicesSection.isVisible ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0",
            )}
            style={{ transitionDuration: "860ms" }}
          >
            <p className="mb-3 text-[10px] uppercase tracking-[0.35em] text-[#c9a96e]">What We Do</p>
            <h2 className="giga-display text-[clamp(1.6rem,4vw,3rem)] font-light text-white">Our Services</h2>
          </div>

          <div className="divide-y divide-white/10">
            {services.map((service, index) => (
              <div
                key={service.title}
                className={cn(
                  "group grid cursor-pointer gap-4 py-6 transition-all sm:grid-cols-[64px_260px_1fr_auto] sm:items-center",
                  servicesSection.isVisible ? "translate-x-0 opacity-100" : "-translate-x-6 opacity-0",
                )}
                style={{ transitionDuration: "860ms", transitionDelay: `${index * 90}ms` }}
              >
                <span className="text-xs tracking-[0.2em] text-[#c9a96e]/50">{service.no}</span>
                <h3 className="giga-display text-xl font-light text-white/80 transition-colors duration-300 group-hover:text-white sm:text-2xl">
                  {service.title}
                </h3>
                <p className="text-[13px] leading-relaxed text-white/35 transition-colors duration-300 group-hover:text-white/55 sm:text-sm">
                  {service.description}
                </p>
                <ArrowUpRight className="h-4 w-4 text-[#c9a96e] opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-0.5 group-hover:opacity-100" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section ref={cta.ref} className="mx-auto w-full max-w-[1400px] px-6 py-24 lg:px-16">
        <div
          className={cn(
            "relative overflow-hidden border border-white/10 p-12 text-center transition-all lg:p-20",
            cta.isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0",
          )}
          style={{ transitionDuration: "980ms" }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[#c9a96e]/10 to-transparent" />
          <p className="relative z-10 mb-4 text-[10px] uppercase tracking-[0.35em] text-[#c9a96e]">Start Your Project</p>
          <h2 className="giga-display relative z-10 mb-8 text-[clamp(2rem,5vw,4rem)] font-light text-white">
            당신의 공간을 함께
            <br />
            만들어 보실래요?
          </h2>
          <Link
            href="/contact"
            className="relative z-10 inline-flex items-center gap-3 bg-[#c9a96e] px-10 py-4 text-[11px] uppercase tracking-[0.22em] text-[#0a0a0a] transition-all duration-300 hover:bg-white"
          >
            무료 상담 신청하기 <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  )
}
