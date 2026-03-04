"use client"

import { useMemo, useState } from "react"
import Image from "next/image"
import { CalendarIcon, Clock, Tag, User } from "lucide-react"
import { cn } from "@/lib/utils"

export type NewsPost = {
  title: string
  category: string
  date: string
  excerpt: string
  image: string
  author?: string
  readTime?: string
  tags?: string[]
}

type NewsSectionsProps = {
  featured: NewsPost
  posts: NewsPost[]
}

export default function NewsSections({ featured, posts }: NewsSectionsProps) {
  const categories = useMemo(() => ["전체", ...Array.from(new Set(posts.map((post) => post.category)))], [posts])
  const [activeCategory, setActiveCategory] = useState("전체")

  const filtered = useMemo(() => {
    if (activeCategory === "전체") return posts
    return posts.filter((post) => post.category === activeCategory)
  }, [activeCategory, posts])

  return (
    <main className="giga-public-surface min-h-screen pt-24">
      <section className="mx-auto max-w-[1400px] px-6 py-20 lg:px-16">
        <p className="mb-4 text-[10px] uppercase tracking-[0.4em] text-[#c9a96e]">News</p>
        <h1 className="giga-display mb-6 text-[clamp(2.6rem,7vw,7rem)] font-light leading-none text-white">
          Latest
          <br />
          <em className="not-italic text-[#c9a96e]">Updates</em>
        </h1>
        <p className="max-w-2xl text-base leading-relaxed text-white/40">
          GIGA Interior의 최신 소식과 프로젝트 인사이트를 확인하세요.
        </p>
      </section>

      <section className="mx-auto max-w-[1400px] px-6 pb-14 lg:px-16">
        <div className="overflow-hidden border border-white/10">
          <div className="relative h-[260px] sm:h-[340px] lg:h-[420px]">
            <Image src={featured.image} alt={featured.title} fill className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/30 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
              <p className="mb-3 text-[10px] uppercase tracking-[0.25em] text-[#c9a96e]">{featured.category}</p>
              <h2 className="giga-display text-[clamp(1.5rem,3.4vw,3rem)] font-light text-white">{featured.title}</h2>
              <p className="mt-3 max-w-3xl text-sm text-white/55">{featured.excerpt}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-6 pb-8 lg:px-16">
        <div className="flex flex-wrap gap-5">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setActiveCategory(category)}
              className={cn(
                "border-b pb-1 text-[10px] uppercase tracking-[0.22em] transition-all duration-300",
                activeCategory === category
                  ? "border-[#c9a96e] text-[#c9a96e]"
                  : "border-transparent text-white/35 hover:text-white/70",
              )}
            >
              {category}
            </button>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-6 pb-24 lg:px-16">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {filtered.map((post, index) => (
            <article
              key={`${post.title}-${index}`}
              className="giga-card-reveal overflow-hidden border border-white/10 transition-all duration-500 hover:-translate-y-0.5 hover:border-[#c9a96e]/40"
              style={{ animationDelay: `${index * 70}ms` }}
            >
              <div className="relative h-56 sm:h-64">
                <Image src={post.image} alt={post.title} fill className="object-cover" />
              </div>
              <div className="p-5 sm:p-6">
                <div className="mb-3 flex flex-wrap items-center gap-3 text-xs text-white/40">
                  <span className="text-[#c9a96e]">{post.category}</span>
                  <span className="inline-flex items-center gap-1">
                    <CalendarIcon className="h-3.5 w-3.5" />
                    {post.date}
                  </span>
                </div>
                <h3 className="giga-display text-2xl font-light text-white">{post.title}</h3>
                <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-white/45">{post.excerpt}</p>
                {(post.author || post.readTime || post.tags?.length) && (
                  <div className="mt-5 flex flex-wrap items-center gap-4 text-xs text-white/35">
                    {post.author && (
                      <span className="inline-flex items-center gap-1">
                        <User className="h-3.5 w-3.5" /> {post.author}
                      </span>
                    )}
                    {post.readTime && (
                      <span className="inline-flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" /> {post.readTime}
                      </span>
                    )}
                    {post.tags && post.tags.length > 0 && (
                      <span className="inline-flex items-center gap-1">
                        <Tag className="h-3.5 w-3.5" /> {post.tags.join(", ")}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
        {filtered.length === 0 && (
          <div className="border border-dashed border-white/20 p-10 text-center text-white/45">등록된 소식이 없습니다.</div>
        )}
      </section>
    </main>
  )
}

