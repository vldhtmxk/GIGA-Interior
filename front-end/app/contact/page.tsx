"use client"

import { useEffect, useRef, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { CheckCircle, Clock, Mail, MapPin, Phone } from "lucide-react"
import { inquiryApi } from "@/lib/api"
import { cn } from "@/lib/utils"

const formSchema = z.object({
  name: z.string().min(2, { message: "이름을 입력해주세요" }),
  email: z.string().email({ message: "유효한 이메일 주소를 입력해주세요" }),
  phone: z.string().min(10, { message: "유효한 전화번호를 입력해주세요" }),
  projectType: z.string().min(1, { message: "프로젝트 유형을 선택해주세요" }),
  budget: z.string().min(1, { message: "예산 범위를 선택해주세요" }),
  message: z.string().min(10, { message: "메시지를 10자 이상 입력해주세요" }),
})

type FormValues = z.infer<typeof formSchema>

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

export default function ContactPage() {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState("")
  const header = useInViewOnce<HTMLElement>(0.1)
  const body = useInViewOnce<HTMLElement>(0.1)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      projectType: "",
      budget: "",
      message: "",
    },
  })

  async function onSubmit(values: FormValues) {
    setSubmitError("")
    try {
      await inquiryApi.create({
        name: values.name,
        email: values.email,
        phone: values.phone,
        projectType: values.projectType,
        budgetRange: values.budget,
        message: values.message,
      })
      setIsSubmitted(true)
      reset()
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "문의 접수 중 오류가 발생했습니다.")
    }
  }

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
          Contact
        </p>
        <h1
          className={cn(
            "giga-display mb-8 text-[clamp(2.8rem,7vw,7rem)] font-light leading-none text-white transition-all",
            header.isVisible ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0",
          )}
          style={{ transitionDuration: "980ms" }}
        >
          Let's create
          <br />
          <em className="not-italic text-[#c9a96e]">together</em>
        </h1>
      </section>

      <section ref={body.ref} className="mx-auto grid max-w-[1400px] grid-cols-1 gap-16 px-6 pb-24 lg:grid-cols-5 lg:px-16">
        <div
          className={cn(
            "order-2 space-y-12 transition-all duration-[980ms] lg:col-span-2",
            body.isVisible ? "translate-x-0 opacity-100" : "translate-x-8 opacity-0",
          )}
        >
          <div>
            <p className="mb-6 text-[10px] uppercase tracking-[0.35em] text-[#c9a96e]">Contact Info</p>
            <ul className="space-y-6">
              {[
                { icon: MapPin, label: "Address", value: "서울특별시 강남구 테헤란로 123\nGIGA Tower 15F" },
                { icon: Phone, label: "Phone", value: "02-1234-5678" },
                { icon: Mail, label: "Email", value: "hello@giga-interior.kr" },
                { icon: Clock, label: "Hours", value: "평일 09:00 - 18:00\n토요일 10:00 - 15:00 (예약 필수)" },
              ].map(({ icon: Icon, label, value }) => (
                <li key={label} className="flex gap-4">
                  <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center border border-white/10">
                    <Icon size={13} className="text-[#c9a96e]" />
                  </div>
                  <div>
                    <p className="mb-1 text-[10px] uppercase tracking-[0.2em] text-white/30">{label}</p>
                    <p className="whitespace-pre-line text-sm text-white/60">{value}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="mb-6 text-[10px] uppercase tracking-[0.35em] text-[#c9a96e]">Process</p>
            <div className="space-y-4">
              {[
                { step: "01", text: "상담 신청 및 초기 미팅" },
                { step: "02", text: "현장 방문 및 니즈 파악" },
                { step: "03", text: "컨셉 디자인 제안" },
                { step: "04", text: "실시도면 및 시공" },
                { step: "05", text: "준공 및 사후 관리" },
              ].map(({ step, text }) => (
                <div key={step} className="group flex items-center gap-4">
                  <span className="w-6 text-xs text-[#c9a96e]/40">{step}</span>
                  <div className="h-px flex-1 bg-white/5 transition-colors group-hover:bg-[#c9a96e]/20" />
                  <p className="text-sm text-white/40 transition-colors group-hover:text-white/65">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div
          className={cn(
            "order-1 transition-all duration-[980ms] lg:col-span-3",
            body.isVisible ? "translate-x-0 opacity-100" : "-translate-x-8 opacity-0",
          )}
        >
          {isSubmitted ? (
            <div className="flex h-full flex-col items-center justify-center border border-white/10 py-20 text-center">
              <CheckCircle size={48} className="mb-6 text-[#c9a96e]" />
              <h2 className="giga-display mb-4 text-3xl font-light text-white">상담 신청이 완료되었습니다</h2>
              <p className="max-w-sm text-sm leading-relaxed text-white/40">
                빠른 시일 내에 담당자가 연락을 드릴 예정입니다. 일반적으로 영업일 기준 1-2일 내에 연락드립니다.
              </p>
              <button
                type="button"
                onClick={() => setIsSubmitted(false)}
                className="mt-8 border border-[#c9a96e]/60 px-6 py-2 text-xs uppercase tracking-[0.2em] text-[#c9a96e] transition-colors hover:bg-[#c9a96e] hover:text-[#0a0a0a]"
              >
                새 문의하기
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-[10px] uppercase tracking-[0.2em] text-white/30">
                    성함 <span className="text-[#c9a96e]">*</span>
                  </label>
                  <input
                    {...register("name")}
                    className="w-full border border-white/10 bg-transparent px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-white/20 focus:border-[#c9a96e]/50"
                    placeholder="홍길동"
                  />
                  {errors.name && <p className="mt-2 text-xs text-red-400">{errors.name.message}</p>}
                </div>
                <div>
                  <label className="mb-2 block text-[10px] uppercase tracking-[0.2em] text-white/30">
                    연락처 <span className="text-[#c9a96e]">*</span>
                  </label>
                  <input
                    {...register("phone")}
                    className="w-full border border-white/10 bg-transparent px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-white/20 focus:border-[#c9a96e]/50"
                    placeholder="01012345678"
                  />
                  {errors.phone && <p className="mt-2 text-xs text-red-400">{errors.phone.message}</p>}
                </div>
              </div>

              <div>
                <label className="mb-2 block text-[10px] uppercase tracking-[0.2em] text-white/30">
                  이메일 <span className="text-[#c9a96e]">*</span>
                </label>
                <input
                  {...register("email")}
                  className="w-full border border-white/10 bg-transparent px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-white/20 focus:border-[#c9a96e]/50"
                  placeholder="example@email.com"
                />
                {errors.email && <p className="mt-2 text-xs text-red-400">{errors.email.message}</p>}
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-[10px] uppercase tracking-[0.2em] text-white/30">
                    서비스 유형 <span className="text-[#c9a96e]">*</span>
                  </label>
                  <select
                    {...register("projectType")}
                    className="w-full cursor-pointer appearance-none border border-white/10 bg-[#0a0a0a] px-4 py-3 text-sm text-white outline-none transition-colors focus:border-[#c9a96e]/50"
                  >
                    <option value="">선택하세요</option>
                    <option value="주거 인테리어">주거 인테리어</option>
                    <option value="상업 인테리어">상업 인테리어</option>
                    <option value="오피스 인테리어">오피스 인테리어</option>
                    <option value="호텔·숙박">호텔·숙박</option>
                    <option value="기타">기타</option>
                  </select>
                  {errors.projectType && <p className="mt-2 text-xs text-red-400">{errors.projectType.message}</p>}
                </div>
                <div>
                  <label className="mb-2 block text-[10px] uppercase tracking-[0.2em] text-white/30">
                    예산 범위 <span className="text-[#c9a96e]">*</span>
                  </label>
                  <select
                    {...register("budget")}
                    className="w-full cursor-pointer appearance-none border border-white/10 bg-[#0a0a0a] px-4 py-3 text-sm text-white outline-none transition-colors focus:border-[#c9a96e]/50"
                  >
                    <option value="">선택하세요</option>
                    <option value="1천만원 미만">1천만원 미만</option>
                    <option value="1천만원 - 3천만원">1천만원 - 3천만원</option>
                    <option value="3천만원 - 5천만원">3천만원 - 5천만원</option>
                    <option value="5천만원 - 1억원">5천만원 - 1억원</option>
                    <option value="1억원 이상">1억원 이상</option>
                  </select>
                  {errors.budget && <p className="mt-2 text-xs text-red-400">{errors.budget.message}</p>}
                </div>
              </div>

              <div>
                <label className="mb-2 block text-[10px] uppercase tracking-[0.2em] text-white/30">
                  문의 내용 <span className="text-[#c9a96e]">*</span>
                </label>
                <textarea
                  {...register("message")}
                  rows={5}
                  className="w-full resize-none border border-white/10 bg-transparent px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-white/20 focus:border-[#c9a96e]/50"
                  placeholder="원하시는 스타일, 참고 이미지 URL, 기타 요청 사항 등을 자유롭게 작성해 주세요."
                />
                {errors.message && <p className="mt-2 text-xs text-red-400">{errors.message.message}</p>}
              </div>

              {submitError && <p className="text-sm text-red-400">{submitError}</p>}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#c9a96e] py-4 text-[11px] font-medium uppercase tracking-[0.3em] text-[#0a0a0a] transition-colors duration-300 hover:bg-white disabled:opacity-70"
              >
                {isSubmitting ? "문의 접수 중..." : "무료 상담 신청하기"}
              </button>
              <p className="text-center text-xs text-white/20">제출 시 개인정보 처리방침에 동의하는 것으로 간주됩니다.</p>
            </form>
          )}
        </div>
      </section>

      <div className="flex h-64 items-center justify-center border-t border-white/5 bg-[#111]">
        <div className="text-center">
          <MapPin size={24} className="mx-auto mb-3 text-[#c9a96e]" />
          <p className="text-xs tracking-widest text-white/30">서울특별시 강남구 테헤란로 123</p>
        </div>
      </div>
    </main>
  )
}
