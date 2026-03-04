"use client"

import { useMemo, useState } from "react"
import Image from "next/image"
import { resolveAssetUrl } from "@/lib/api"
import { cn } from "@/lib/utils"

type ClientItem = {
  clientId: number
  name: string
  category: "client" | "partner"
  logoUrl: string | null
  description: string | null
}

type ClientsSectionsProps = {
  rows: ClientItem[]
}

const testimonials = [
  {
    name: "김지현",
    company: "모던 리빙 CEO",
    quote: "프로젝트의 디테일과 완성도가 기대 이상이었습니다.",
  },
  {
    name: "이상호",
    company: "카페 세레니티 대표",
    quote: "브랜드 분위기를 정확히 이해한 제안이 인상적이었습니다.",
  },
]

export default function ClientsSections({ rows }: ClientsSectionsProps) {
  const [tab, setTab] = useState<"client" | "partner">("client")

  const clientRows = useMemo(() => rows.filter((item) => item.category === "client"), [rows])
  const partnerRows = useMemo(() => rows.filter((item) => item.category === "partner"), [rows])
  const current = tab === "client" ? clientRows : partnerRows

  return (
    <main className="giga-public-surface min-h-screen pt-24">
      <section className="mx-auto max-w-[1400px] px-6 py-20 lg:px-16">
        <p className="mb-4 text-[10px] uppercase tracking-[0.4em] text-[#c9a96e]">Network</p>
        <h1 className="giga-display mb-12 text-[clamp(2.8rem,7vw,7rem)] font-light leading-none text-white">
          Clients &
          <br />
          <em className="not-italic text-[#c9a96e]">Partners</em>
        </h1>

        <div className="flex flex-wrap gap-6">
          {[
            { key: "client" as const, label: "클라이언트" },
            { key: "partner" as const, label: "파트너" },
          ].map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => setTab(item.key)}
              className={cn(
                "border-b pb-1 text-[10px] uppercase tracking-[0.22em] transition-all duration-300",
                tab === item.key ? "border-[#c9a96e] text-[#c9a96e]" : "border-transparent text-white/35 hover:text-white/70",
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-6 pb-24 lg:px-16">
        <div className="mb-12">
          <h2 className="giga-display text-[clamp(1.6rem,3.5vw,2.8rem)] font-light text-white">
            {tab === "client" ? "우리의 클라이언트" : "우리의 파트너"}
          </h2>
          <p className="mt-3 max-w-2xl text-white/40">
            {tab === "client"
              ? "다양한 산업 분야의 클라이언트와 함께 프로젝트를 진행해왔습니다."
              : "최고 품질의 결과를 위해 신뢰할 수 있는 파트너들과 협력하고 있습니다."}
          </p>
        </div>

        {current.length === 0 ? (
          <div className="border border-dashed border-white/20 p-10 text-center text-white/45">
            등록된 {tab === "client" ? "클라이언트" : "파트너"}가 없습니다.
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {current.map((item, index) => (
              <div
                key={item.clientId}
                className="giga-card-reveal border border-white/10 p-6 transition-all duration-500 hover:border-[#c9a96e]/40"
                style={{ animationDelay: `${index * 70}ms` }}
              >
                <div className="mb-4 flex h-20 items-center justify-center border border-white/10 bg-[#111] p-3">
                  <Image
                    src={resolveAssetUrl(item.logoUrl) || "/placeholder.svg"}
                    alt={item.name}
                    width={120}
                    height={60}
                    className="max-h-full w-auto object-contain"
                    unoptimized
                  />
                </div>
                <h3 className="text-sm text-white">{item.name}</h3>
                <p className="mt-1 text-xs text-white/35">{item.description || (tab === "client" ? "클라이언트" : "파트너사")}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      {tab === "client" && (
        <section className="border-y border-white/5 px-6 py-20 lg:px-16">
          <div className="mx-auto max-w-[1200px]">
            <h2 className="giga-display mb-10 text-center text-[clamp(1.8rem,4vw,3rem)] font-light text-white">Client Voices</h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {testimonials.map((item, index) => (
                <div key={item.name} className="giga-card-reveal border border-white/10 p-8" style={{ animationDelay: `${index * 90}ms` }}>
                  <p className="text-white/55">"{item.quote}"</p>
                  <p className="mt-6 text-sm text-[#c9a96e]">{item.name}</p>
                  <p className="text-xs text-white/35">{item.company}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  )
}

