import Image from "next/image"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { portfolioApi, resolveAssetUrl } from "@/lib/api"

const categoryLabel = (value?: string | null) => {
  if (!value) return "Other"
  const lower = value.toLowerCase()
  if (lower.includes("residential") || value.includes("주거")) return "Residential"
  if (lower.includes("commercial") || lower.includes("showroom") || lower.includes("cafe") || value.includes("상업")) return "Commercial"
  if (lower.includes("office") || value.includes("오피스") || value.includes("업무")) return "Office"
  return value
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }> | { id: string }
}) {
  const resolved = await Promise.resolve(params)
  let project = null as Awaited<ReturnType<typeof portfolioApi.getOne>> | null
  try {
    project = await portfolioApi.getOne(resolved.id)
  } catch {
    project = null
  }

  if (!project) {
    return (
      <main className="giga-public-surface flex min-h-screen items-center justify-center px-6 pt-24">
        <div className="max-w-lg border border-white/10 p-10 text-center">
          <h1 className="giga-display text-4xl font-light text-white">Project Not Found</h1>
          <p className="mt-4 text-sm text-white/45">해당 포트폴리오를 찾을 수 없습니다.</p>
          <Link
            href="/portfolio"
            className="mt-8 inline-flex items-center gap-2 border border-[#c9a96e]/60 px-6 py-3 text-[10px] uppercase tracking-[0.22em] text-[#c9a96e] transition-colors hover:bg-[#c9a96e] hover:text-[#0a0a0a]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back To Portfolio
          </Link>
        </div>
      </main>
    )
  }

  const images = (project.images ?? []).map((img) => resolveAssetUrl(img.imageUrl)).filter(Boolean)
  const heroImage = images[0] || "/placeholder.svg?height=1080&width=1920"
  const materials = (project.materials ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)

  return (
    <main className="giga-public-surface min-h-screen pt-24">
      <section className="mx-auto max-w-[1400px] px-6 py-14 lg:px-16 lg:py-20">
        <Link
          href="/portfolio"
          className="mb-8 inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-white/45 transition-colors hover:text-[#c9a96e]"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back To Portfolio
        </Link>

        <p className="mb-4 text-[10px] uppercase tracking-[0.36em] text-[#c9a96e] giga-fade-up">Project Detail</p>
        <h1 className="giga-display giga-fade-up text-[clamp(2.2rem,6vw,5.5rem)] font-light leading-none text-white">
          {project.title}
        </h1>
        <p className="giga-fade-up mt-5 text-sm text-white/45 sm:text-base">
          {categoryLabel(project.category)} {project.location ? `· ${project.location}` : ""}
        </p>
      </section>

      <section className="mx-auto max-w-[1400px] px-6 pb-10 lg:px-16">
        <div className="relative h-[42vh] overflow-hidden border border-white/10 sm:h-[56vh] lg:h-[72vh]">
          <Image src={heroImage} alt={project.title} fill priority className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/75 via-transparent to-transparent" />
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-6 pb-16 lg:px-16 lg:pb-20">
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          {[
            { label: "Category", value: categoryLabel(project.category) },
            { label: "Year", value: project.year ? String(project.year) : "-" },
            { label: "Area", value: project.area ?? "-" },
            { label: "Client", value: project.clientName ?? "-" },
            { label: "Duration", value: project.duration ? `${project.duration} months` : "-" },
            { label: "Location", value: project.location ?? "-" },
          ].map((item) => (
            <div key={item.label} className="giga-card-reveal border border-white/10 p-5">
              <p className="text-[10px] uppercase tracking-[0.24em] text-white/35">{item.label}</p>
              <p className="mt-3 text-sm text-white/75">{item.value}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-6 pb-20 lg:px-16">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          <article className="giga-card-reveal border border-white/10 p-7 lg:p-9">
            <p className="mb-4 text-[10px] uppercase tracking-[0.28em] text-[#c9a96e]">Overview</p>
            <p className="whitespace-pre-line text-sm leading-relaxed text-white/50">
              {project.description ?? "프로젝트 설명이 없습니다."}
            </p>
          </article>

          {project.concept && (
            <article className="giga-card-reveal border border-white/10 p-7 lg:p-9">
              <p className="mb-4 text-[10px] uppercase tracking-[0.28em] text-[#c9a96e]">Concept</p>
              <p className="whitespace-pre-line text-sm leading-relaxed text-white/50">{project.concept}</p>
            </article>
          )}

          {project.feature && (
            <article className="giga-card-reveal border border-white/10 p-7 lg:col-span-2 lg:p-9">
              <p className="mb-4 text-[10px] uppercase tracking-[0.28em] text-[#c9a96e]">Key Features</p>
              <p className="whitespace-pre-line text-sm leading-relaxed text-white/50">{project.feature}</p>
            </article>
          )}
        </div>
      </section>

      {images.length > 0 && (
        <section className="mx-auto max-w-[1400px] px-6 pb-20 lg:px-16">
          <p className="mb-6 text-[10px] uppercase tracking-[0.32em] text-[#c9a96e]">Gallery</p>
          <div className="space-y-4">
            {images.map((image, index) => (
              <div key={index} className="giga-card-reveal relative h-[36vh] overflow-hidden border border-white/10 sm:h-[46vh] lg:h-[62vh]">
                <Image src={image} alt={`${project.title} image ${index + 1}`} fill className="object-cover" />
              </div>
            ))}
          </div>
        </section>
      )}

      {materials.length > 0 && (
        <section className="mx-auto max-w-[1400px] px-6 pb-24 lg:px-16">
          <div className="border border-white/10 p-8 lg:p-10">
            <p className="mb-6 text-[10px] uppercase tracking-[0.28em] text-[#c9a96e]">Materials</p>
            <ul className="grid grid-cols-1 gap-3 text-sm text-white/65 sm:grid-cols-2 lg:grid-cols-3">
              {materials.map((material, index) => (
                <li key={index} className="flex items-center gap-3">
                  <span className="h-1.5 w-1.5 bg-[#c9a96e]" />
                  <span>{material}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </main>
  )
}

