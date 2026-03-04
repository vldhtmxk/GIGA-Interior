"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { cn } from "@/lib/utils"

type FeaturedProjectCardProps = {
  id: string
  title: string
  category: string
  image: string
}

export default function FeaturedProjectCard({ id, title, category, image }: FeaturedProjectCardProps) {
  const [active, setActive] = useState(false)

  return (
    <Link
      href={`/portfolio/${id}`}
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
      onFocus={() => setActive(true)}
      onBlur={() => setActive(false)}
      onTouchStart={() => setActive(true)}
      onTouchEnd={() => setTimeout(() => setActive(false), 220)}
      onPointerDown={() => setActive(true)}
      onPointerUp={() => setTimeout(() => setActive(false), 180)}
      className={cn(
        "group giga-card-reveal relative block cursor-pointer overflow-hidden border border-white/10 transition-all duration-500 [touch-action:manipulation] hover:-translate-y-1 hover:border-[#c9a96e]/40 focus-visible:-translate-y-1 focus-visible:border-[#c9a96e]/40",
        active ? "-translate-y-1 border-[#c9a96e]/40" : "",
      )}
    >
      <div className="relative h-[360px] overflow-hidden lg:h-[460px]">
        <Image
          src={image || "/placeholder.svg"}
          alt={title}
          fill
          className={cn("object-cover transition-transform duration-700 group-hover:scale-105 group-focus-visible:scale-105", active ? "scale-105" : "")}
        />
        <div
          className={cn(
            "absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/85 via-transparent to-transparent transition-colors duration-500 group-hover:from-[#0a0a0a]/72 group-focus-visible:from-[#0a0a0a]/72",
            active ? "from-[#0a0a0a]/72" : "",
          )}
        />
        <div className="absolute bottom-0 left-0 p-6">
          <p className="mb-2 text-[10px] uppercase tracking-[0.25em] text-[#c9a96e]">{category}</p>
          <h3
            className={cn(
              "giga-display text-2xl font-light text-white transition-colors duration-300 group-hover:text-[#f4e8d1] group-focus-visible:text-[#f4e8d1] lg:text-[1.8rem]",
              active ? "text-[#f4e8d1]" : "",
            )}
          >
            {title}
          </h3>
        </div>
        <div
          className={cn(
            "absolute right-4 top-4 flex h-8 w-8 items-center justify-center bg-[#c9a96e] transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100",
            active ? "translate-x-0 opacity-100" : "translate-x-4 opacity-0",
          )}
        >
          <ArrowUpRight className="h-4 w-4 text-[#0a0a0a]" />
        </div>
      </div>
    </Link>
  )
}
