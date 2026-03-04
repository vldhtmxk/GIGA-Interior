"use client"

import { useMemo, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { cn } from "@/lib/utils"

type PortfolioCard = {
  id: number
  title: string
  category: string
  description: string
  image: string
}

type PortfolioSectionsProps = {
  projects: PortfolioCard[]
}

const CATEGORIES = ["all", "주거 공간", "상업 공간", "업무 공간"] as const

export default function PortfolioSections({ projects }: PortfolioSectionsProps) {
  const [activeCategory, setActiveCategory] = useState<(typeof CATEGORIES)[number]>("all")

  const filtered = useMemo(() => {
    if (activeCategory === "all") return projects
    return projects.filter((project) => project.category === activeCategory)
  }, [activeCategory, projects])

  return (
    <main className="giga-public-surface min-h-screen pt-24">
      <section className="mx-auto max-w-[1400px] px-6 py-20 lg:px-16">
        <p className="mb-4 text-[10px] uppercase tracking-[0.4em] text-[#c9a96e]">Portfolio</p>
        <h1 className="giga-display mb-12 text-[clamp(2.8rem,7vw,7rem)] font-light leading-none text-white">Our Work</h1>

        <div className="flex flex-wrap gap-6">
          {CATEGORIES.map((category) => {
            const label = category === "all" ? "전체" : category
            const isActive = activeCategory === category
            return (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                className={cn(
                  "border-b pb-1 text-[10px] uppercase tracking-[0.22em] transition-all duration-300",
                  isActive ? "border-[#c9a96e] text-[#c9a96e]" : "border-transparent text-white/35 hover:text-white/70",
                )}
              >
                {label}
              </button>
            )
          })}
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-6 pb-24 lg:px-16">
        {filtered.length === 0 ? (
          <div className="border border-dashed border-white/20 p-12 text-center text-white/45">등록된 포트폴리오가 없습니다.</div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((project, index) => (
              <Link
                key={project.id}
                href={`/portfolio/${project.id}`}
                className="group giga-card-reveal relative block overflow-hidden border border-white/10 transition-all duration-500 hover:-translate-y-1 hover:border-[#c9a96e]/40"
                style={{ animationDelay: `${index * 70}ms` }}
              >
                <div className="relative h-72 overflow-hidden lg:h-80">
                  <Image
                    src={project.image || "/placeholder.svg"}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.08]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/80 via-[#0a0a0a]/10 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <div className="flex items-end justify-between gap-4">
                      <div>
                        <p className="mb-1 text-[9px] uppercase tracking-[0.3em] text-[#c9a96e]">{project.category}</p>
                        <h3 className="giga-display text-xl font-light text-white">{project.title}</h3>
                        <p className="mt-2 line-clamp-1 text-xs text-white/50">{project.description}</p>
                      </div>
                      <div className="flex h-8 w-8 translate-x-3 items-center justify-center bg-[#c9a96e] opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
                        <ArrowUpRight className="h-4 w-4 text-[#0a0a0a]" />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}

