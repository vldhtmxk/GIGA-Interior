import PortfolioSections from "@/components/portfolio-sections"
import { portfolioApi, resolveAssetUrl, type PortfolioResponse } from "@/lib/api"

type PortfolioCard = {
  id: number
  title: string
  category: string
  description: string
  image: string
}

const categoryLabel = (value?: string | null) => {
  if (!value) return "기타"
  const lower = value.toLowerCase()
  if (lower.includes("residential") || value.includes("주거")) return "주거 공간"
  if (lower.includes("commercial") || lower.includes("showroom") || lower.includes("cafe") || value.includes("상업")) return "상업 공간"
  if (lower.includes("office") || value.includes("오피스") || value.includes("업무")) return "업무 공간"
  return value
}

const toCard = (project: PortfolioResponse): PortfolioCard => ({
  id: project.portfolioId,
  title: project.title,
  category: categoryLabel(project.category),
  description: project.description ?? "프로젝트 상세 소개가 준비 중입니다.",
  image:
    resolveAssetUrl(project.thumbnailUrl) ||
    resolveAssetUrl(project.images?.[0]?.imageUrl) ||
    "/placeholder.svg?height=800&width=600",
})

export default async function PortfolioPage() {
  let projects: PortfolioCard[] = []
  try {
    projects = (await portfolioApi.getAll()).map(toCard)
  } catch {
    projects = []
  }

  return <PortfolioSections projects={projects} />
}
