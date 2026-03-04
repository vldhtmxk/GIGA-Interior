'use client'

import { useEffect, useMemo, useRef, useState } from "react"
import type { TouchEvent } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { resolveAssetUrl, type MainCarouselResponse } from "@/lib/api"

const defaultSlides = [
  {
    image:
      "https://images.unsplash.com/photo-1672927936377-97d1be3976cd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBpbnRlcmlvciUyMGRlc2lnbiUyMGxpdmluZyUyMHJvb20lMjBtb2Rlcm58ZW58MXx8fHwxNzcyNTkxMTIzfDA&ixlib=rb-4.1.0&q=80&w=1080",
    title: "Space That Tells Your Story",
    subtitle: "We craft refined interiors where proportion, light, and material become one experience.",
    buttonText: "프로젝트 시작하기",
    buttonLink: "/contact",
  },
  {
    image:
      "https://images.unsplash.com/photo-1668026694348-b73c5eb5e299?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBraXRjaGVuJTIwaW50ZXJpb3IlMjBkZXNpZ258ZW58MXx8fHwxNzcyNTQ5NjkxfDA&ixlib=rb-4.1.0&q=80&w=1080",
    title: "Luxury Living, Thoughtfully Designed",
    subtitle: "From private residences to signature spaces, we deliver timeless design with clear intent.",
    buttonText: "프로젝트 시작하기",
    buttonLink: "/contact",
  },
  {
    image:
      "https://images.unsplash.com/photo-1703355685639-d558d1b0f63e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb250ZW1wb3JhcnklMjBvZmZpY2UlMjBpbnRlcmlvciUyMGRlc2lnbnxlbnwxfHx8fDE3NzI1NDk4MjF8MA&ixlib=rb-4.1.0&q=80&w=1080",
    title: "Commercial Spaces With Character",
    subtitle: "Build environments that strengthen brand identity and elevate customer experience.",
    buttonText: "프로젝트 시작하기",
    buttonLink: "/contact",
  },
]

type HeroSlide = {
  image: string
  title: string
  subtitle?: string | null
  buttonText?: string | null
  buttonLink?: string | null
}

export default function HeroCarousel({ slides }: { slides?: HeroSlide[] | MainCarouselResponse[] }) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const touchStartX = useRef<number | null>(null)
  const normalizedSlides: HeroSlide[] = useMemo(
    () =>
      (slides ?? []).length > 0
        ? (slides ?? []).map((slide: any) => ({
            image: resolveAssetUrl(slide.backgroundUrl ?? slide.image) || "/placeholder.svg",
            title: slide.title,
            subtitle: slide.subtitle,
            buttonText: slide.buttonText,
            buttonLink: slide.buttonLink,
          }))
        : defaultSlides,
    [slides],
  )

  const slideCount = normalizedSlides.length || 1

  useEffect(() => {
    if (slideCount <= 1) return
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slideCount)
    }, 7000)
    return () => clearInterval(timer)
  }, [slideCount])

  useEffect(() => {
    if (currentSlide >= slideCount) {
      setCurrentSlide(0)
    }
  }, [currentSlide, slideCount])

  const goPrev = () => setCurrentSlide((prev) => (prev - 1 + slideCount) % slideCount)
  const goNext = () => setCurrentSlide((prev) => (prev + 1) % slideCount)

  const onTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    touchStartX.current = e.changedTouches[0]?.clientX ?? null
  }

  const onTouchEnd = (e: TouchEvent<HTMLDivElement>) => {
    if (touchStartX.current === null) return
    const endX = e.changedTouches[0]?.clientX ?? touchStartX.current
    const delta = endX - touchStartX.current
    touchStartX.current = null
    if (Math.abs(delta) < 40) return
    if (delta > 0) goPrev()
    else goNext()
  }

  return (
    <section className="relative h-[90vh] min-h-[560px] w-full overflow-hidden">
      <div
        className="h-full"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <div
          className="flex h-full transition-transform duration-700 ease-out"
          style={{
            width: `${slideCount * 100}%`,
            transform: `translate3d(-${(currentSlide * 100) / slideCount}%, 0, 0)`,
          }}
        >
        {normalizedSlides.map((slide, i) => (
          <div
            key={i}
            className="relative flex h-full shrink-0 items-center justify-center"
            style={{ width: `${100 / slideCount}%` }}
          >
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              className="object-cover"
              priority={i === 0}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/65 via-[#0a0a0a]/30 to-[#0a0a0a]" />
            <div className="relative z-10 mx-auto flex h-full w-full max-w-[1400px] items-end px-5 pb-24 sm:px-6 lg:px-16">
              <div>
                <p
                  className="giga-item-rise mb-5 text-[10px] uppercase tracking-[0.38em] text-[#c9a96e]"
                  style={{ animationDelay: "80ms" }}
                >
                  GIGA Interior Studio
                </p>
                <h1
                  className="giga-display giga-item-rise mb-6 max-w-[18ch] break-words text-[clamp(1.8rem,7vw,5.2rem)] font-light leading-[1.03] text-white"
                  style={{ animationDelay: "180ms" }}
                >
                  {slide.title}
                </h1>
                {slide.subtitle && (
                  <p
                    className="giga-item-rise mb-10 max-w-2xl break-words text-sm leading-relaxed text-white/70 sm:text-base lg:text-lg"
                    style={{ animationDelay: "280ms" }}
                  >
                    {slide.subtitle}
                  </p>
                )}
                <Link
                  href={slide.buttonLink || "/contact"}
                  className="giga-item-rise inline-flex items-center gap-3 bg-[#c9a96e] px-8 py-4 text-[11px] uppercase tracking-[0.2em] text-[#0a0a0a] transition-all duration-300 hover:bg-white"
                  style={{ animationDelay: "360ms" }}
                >
                  {slide.buttonText || "프로젝트 시작하기"} <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        ))}
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 gap-2">
        {normalizedSlides.map((_, idx) => (
          <span
            key={idx}
            className={`h-1.5 transition-all ${idx === currentSlide ? "w-8 bg-[#c9a96e]" : "w-4 bg-white/40"}`}
          />
        ))}
      </div>
    </section>
  )
}
