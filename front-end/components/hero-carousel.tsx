'use client'

import { useKeenSlider } from "keen-slider/react"
import { KeenSliderPlugin } from "keen-slider"
import "keen-slider/keen-slider.min.css"
import { useRef } from "react"
import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { resolveAssetUrl, type MainCarouselResponse } from "@/lib/api"

// 🔁 자동 슬라이드 플러그인 정의
const Autoplay: KeenSliderPlugin = (slider) => {
  let timeout: ReturnType<typeof setTimeout>
  let mouseOver = false

  function clearNextTimeout() {
    clearTimeout(timeout)
  }

  function nextTimeout() {
    clearTimeout(timeout)
    if (mouseOver) return
    timeout = setTimeout(() => {
      slider.next()
    }, 4000) // 슬라이드 간격 4초
  }

  slider.on("created", () => {
    slider.container.addEventListener("mouseover", () => {
      mouseOver = true
      clearNextTimeout()
    })
    slider.container.addEventListener("mouseout", () => {
      mouseOver = false
      nextTimeout()
    })
    nextTimeout()
  })
  slider.on("dragStarted", clearNextTimeout)
  slider.on("animationEnded", nextTimeout)
  slider.on("updated", nextTimeout)
}

const defaultSlides = [
  {
    image: "/minimalist-living-room.png",
    title: "공간에 영감을 불어넣는 디자인",
    subtitle: "당신의 공간을 아름답고 기능적인 예술 작품으로 변화시켜 드립니다",
    buttonText: "견적 문의하기",
    buttonLink: "/contact",
  },
  {
    image: "/banner2.jpg",
    title: "프리미엄 오피스 솔루션",
    subtitle: "업무 공간을 효율적이면서도 세련되게 구성해드립니다",
    buttonText: "견적 문의하기",
    buttonLink: "/contact",
  },
  {
    image: "/banner3.jpg",
    title: "맞춤형 쇼룸 디자인",
    subtitle: "브랜드 아이덴티티를 살린 고급 쇼룸 연출",
    buttonText: "견적 문의하기",
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
  const normalizedSlides: HeroSlide[] =
    (slides ?? []).length > 0
      ? (slides ?? []).map((slide: any) => ({
          image: resolveAssetUrl(slide.backgroundUrl ?? slide.image) || "/placeholder.svg",
          title: slide.title,
          subtitle: slide.subtitle,
          buttonText: slide.buttonText,
          buttonLink: slide.buttonLink,
        }))
      : defaultSlides

  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    loop: true,
    slides: { perView: 1 },
    defaultAnimation: {
      duration: 1200, // 부드럽고 느리게
      easing: (t) => 1 - Math.pow(1 - t, 3), 
    },
    slideChanged(s) {
      setCurrentSlide(s.track.details.rel)
    },
  }, [Autoplay])

  return (
    <section className="relative w-full h-[52vh] min-h-[360px] max-h-[620px] sm:h-[58vh] lg:h-[62vh] overflow-hidden">
      <div ref={sliderRef} className="keen-slider h-full">
        {normalizedSlides.map((slide, i) => (
          <div key={i} className="keen-slider__slide relative flex items-center justify-center">
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              className="object-cover"
              priority={i === 0}
            />
            <div className="absolute inset-0 bg-black/40" />
            <div className="relative z-10 text-center text-white px-4 max-w-3xl">
              <h1 className="text-3xl md:text-5xl font-bold mb-4">{slide.title}</h1>
              <p className="text-lg md:text-xl mb-6 font-light">{slide.subtitle}</p>
              <Button asChild className="bg-white text-black hover:bg-white/90">
                <Link href={slide.buttonLink || "/contact"}>
                  {slide.buttonText || "견적 문의하기"} <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* 좌우 화살표 */}
      <button
        onClick={() => instanceRef.current?.prev()}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/70 hover:bg-white rounded-full p-2 shadow"
      >
        <ChevronLeft className="text-black w-6 h-6" />
      </button>
      <button
        onClick={() => instanceRef.current?.next()}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/70 hover:bg-white rounded-full p-2 shadow"
      >
        <ChevronRight className="text-black w-6 h-6" />
      </button>
    </section>
  )
}
