"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { ArrowRight, CheckCircle } from "lucide-react"
import { cn } from "@/lib/utils"

type ProcessStep = {
  title: string
  description: string
  image: string
  details: string[]
}

type TimelineItem = {
  phase: string
  duration: string
  description: string
}

type FaqItem = {
  question: string
  answer: string
}

type ProcessSectionsProps = {
  processSteps: ProcessStep[]
  timeline: TimelineItem[]
  faqs: FaqItem[]
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

export default function ProcessSections({ processSteps, timeline, faqs }: ProcessSectionsProps) {
  const header = useInViewOnce<HTMLElement>(0.1)
  const overview = useInViewOnce<HTMLElement>(0.1)
  const steps = useInViewOnce<HTMLElement>(0.1)
  const timelineView = useInViewOnce<HTMLElement>(0.12)
  const faqView = useInViewOnce<HTMLElement>(0.12)
  const cta = useInViewOnce<HTMLElement>(0.2)

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
          Process
        </p>
        <h1
          className={cn(
            "giga-display mb-6 text-[clamp(2.6rem,7vw,7rem)] font-light leading-none text-white transition-all",
            header.isVisible ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0",
          )}
          style={{ transitionDuration: "980ms" }}
        >
          How We
          <br />
          <em className="not-italic text-[#c9a96e]">Build Spaces</em>
        </h1>
        <p
          className={cn(
            "max-w-2xl text-base leading-relaxed text-white/40 transition-all",
            header.isVisible ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0",
          )}
          style={{ transitionDuration: "980ms", transitionDelay: "110ms" }}
        >
          아이디어에서 완성까지, 체계적인 프로세스로 공간을 완성합니다.
        </p>
      </section>

      <section ref={overview.ref} className="mx-auto mb-20 max-w-[1100px] px-6 lg:px-16">
        <div
          className={cn(
            "border border-white/10 p-8 text-center transition-all lg:p-12",
            overview.isVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0",
          )}
          style={{ transitionDuration: "900ms" }}
        >
          <p className="text-white/55">
            우리는 각 프로젝트를 고객과의 긴밀한 협업을 통해 진행합니다. 초기 컨셉부터 최종 완성까지 모든 단계에서 고객의
            니즈를 최우선으로 고려합니다.
          </p>
        </div>
      </section>

      <section ref={steps.ref} className="mx-auto mb-24 max-w-[1400px] px-6 lg:px-16">
        <div className="space-y-24">
          {processSteps.map((step, index) => (
            <div
              key={step.title}
              className={cn(
                `grid grid-cols-1 items-center gap-10 ${index % 2 === 1 ? "lg:grid-cols-[1fr_1fr]" : "lg:grid-cols-[1fr_1fr]"}`,
                index % 2 === 1 ? "lg:[&>*:first-child]:order-2 lg:[&>*:last-child]:order-1" : "",
                steps.isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0",
              )}
              style={{ transitionDuration: "900ms", transitionDelay: `${index * 90}ms` }}
            >
              <div className="relative h-[360px] overflow-hidden lg:h-[430px]">
                <img src={step.image} alt={step.title} className="h-full w-full object-cover" />
              </div>
              <div>
                <div className="mb-4 flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#c9a96e] text-sm font-semibold text-[#0a0a0a]">
                    {index + 1}
                  </div>
                  <h3 className="giga-display text-3xl font-light text-white">{step.title}</h3>
                </div>
                <p className="mb-6 text-white/45">{step.description}</p>
                <ul className="space-y-2">
                  {step.details.map((detail) => (
                    <li key={detail} className="flex items-start gap-2 text-sm text-white/65">
                      <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-[#c9a96e]" />
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section ref={timelineView.ref} className="border-y border-white/5 px-6 py-20 lg:px-16">
        <div className="mx-auto max-w-[1200px]">
          <h2 className="giga-display mb-12 text-center text-[clamp(1.8rem,4vw,3rem)] font-light text-white">Project Timeline</h2>
          <div className="mx-auto max-w-3xl border-l border-white/20 pl-8">
            {timeline.map((item, index) => (
              <div
                key={item.phase}
                className={cn(
                  "relative mb-10 transition-all",
                  timelineView.isVisible ? "translate-x-0 opacity-100" : "translate-x-8 opacity-0",
                )}
                style={{ transitionDuration: "860ms", transitionDelay: `${index * 70}ms` }}
              >
                <div className="absolute -left-[2.1rem] top-1.5 h-3.5 w-3.5 rounded-full bg-[#c9a96e]" />
                <p className="text-sm text-[#c9a96e]">{item.duration}</p>
                <h3 className="mt-1 text-lg text-white">{item.phase}</h3>
                <p className="mt-2 text-sm text-white/45">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section ref={faqView.ref} className="mx-auto max-w-[1100px] px-6 py-20 lg:px-16">
        <h2 className="giga-display mb-12 text-center text-[clamp(1.8rem,4vw,3rem)] font-light text-white">FAQ</h2>
        <div className="space-y-8">
          {faqs.map((faq, index) => (
            <div
              key={faq.question}
              className={cn(
                "border-b border-white/10 pb-8 transition-all",
                faqView.isVisible ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0",
              )}
              style={{ transitionDuration: "860ms", transitionDelay: `${index * 70}ms` }}
            >
              <h3 className="mb-4 text-xl text-white">{faq.question}</h3>
              <p className="text-white/45">{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>

      <section ref={cta.ref} className="mx-auto max-w-[1400px] px-6 pb-24 lg:px-16">
        <div
          className={cn(
            "relative overflow-hidden border border-white/10 p-12 text-center transition-all lg:p-20",
            cta.isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0",
          )}
          style={{ transitionDuration: "980ms" }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[#c9a96e]/10 to-transparent" />
          <h2 className="giga-display relative z-10 mb-6 text-[clamp(2rem,5vw,4rem)] font-light text-white">프로젝트를 시작할 준비가 되셨나요?</h2>
          <p className="relative z-10 mx-auto mb-8 max-w-2xl text-white/50">
            지금 문의하시고 무료 상담을 통해 당신의 공간에 맞는 디자인 솔루션을 알아보세요.
          </p>
          <Link
            href="/contact"
            className="relative z-10 inline-flex items-center gap-3 bg-[#c9a96e] px-10 py-4 text-[11px] uppercase tracking-[0.22em] text-[#0a0a0a] transition-all duration-300 hover:bg-white"
          >
            무료 상담 예약하기 <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </main>
  )
}

