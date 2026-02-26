import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { portfolioApi, resolveAssetUrl } from "@/lib/api"

const categoryLabel = (value?: string | null) => {
  if (!value) return "기타"
  const lower = value.toLowerCase()
  if (lower.includes("residential") || value.includes("주거")) return "주거 공간"
  if (lower.includes("commercial") || lower.includes("showroom") || lower.includes("cafe") || value.includes("상업")) return "상업 공간"
  if (lower.includes("office") || value.includes("오피스") || value.includes("업무")) return "업무 공간"
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">프로젝트를 찾을 수 없습니다</h1>
          <Button asChild><Link href="/portfolio">포트폴리오로 돌아가기</Link></Button>
        </div>
      </div>
    )
  }

  const images = (project.images ?? []).map((img) => resolveAssetUrl(img.imageUrl)).filter(Boolean)
  const heroImage = images[0] || "/placeholder.svg?height=1080&width=1920"
  const materials = (project.materials ?? "").split(",").map((s) => s.trim()).filter(Boolean)

  return (
    <main className="flex flex-col min-h-screen">
      <section className="relative w-full h-[70vh] flex items-center justify-center overflow-hidden">
        <Image src={heroImage} alt={project.title} fill priority className="object-cover" />
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative z-10 container mx-auto px-4 text-center text-white">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">{project.title}</h1>
          <p className="text-xl max-w-2xl mx-auto">{categoryLabel(project.category)} | {project.location ?? "위치 미정"}</p>
        </div>
      </section>

      <section className="py-20 container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-12">
            <Button variant="outline" asChild>
              <Link href="/portfolio"><ArrowLeft className="mr-2 h-4 w-4" />모든 프로젝트</Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div>
              <h3 className="font-semibold mb-2">프로젝트 정보</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li><span className="font-medium text-foreground">위치:</span> {project.location ?? "-"}</li>
                <li><span className="font-medium text-foreground">연도:</span> {project.year ?? "-"}</li>
                <li><span className="font-medium text-foreground">면적:</span> {project.area ?? "-"}</li>
                <li><span className="font-medium text-foreground">카테고리:</span> {categoryLabel(project.category)}</li>
                <li><span className="font-medium text-foreground">클라이언트:</span> {project.clientName ?? "-"}</li>
                <li><span className="font-medium text-foreground">기간:</span> {project.duration ? `${project.duration}개월` : "-"}</li>
              </ul>
            </div>
            <div className="md:col-span-2">
              <h3 className="font-semibold mb-2">프로젝트 개요</h3>
              <p className="text-muted-foreground whitespace-pre-line">{project.description ?? "프로젝트 설명이 없습니다."}</p>
            </div>
          </div>

          <div className="space-y-12 mb-16">
            {project.concept && (
              <div>
                <h3 className="text-xl font-semibold mb-4">디자인 컨셉</h3>
                <p className="text-muted-foreground whitespace-pre-line">{project.concept}</p>
              </div>
            )}
            {project.feature && (
              <div>
                <h3 className="text-xl font-semibold mb-4">주요 특징</h3>
                <p className="text-muted-foreground whitespace-pre-line">{project.feature}</p>
              </div>
            )}
          </div>

          {images.length > 0 && (
            <div className="space-y-8 mb-16">
              {images.map((image, index) => (
                <div key={index} className="relative h-[60vh] w-full rounded-lg overflow-hidden">
                  <Image src={image} alt={`${project.title} - 이미지 ${index + 1}`} fill className="object-cover" />
                </div>
              ))}
            </div>
          )}

          {materials.length > 0 && (
            <div className="mb-16">
              <h3 className="text-xl font-semibold mb-4">사용 자재</h3>
              <ul className="space-y-2">
                {materials.map((material, index) => (
                  <li key={index} className="flex items-center"><div className="w-2 h-2 bg-black rounded-full mr-3"></div>{material}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}

