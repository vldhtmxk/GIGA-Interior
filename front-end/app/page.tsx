import HeroCarousel from "@/components/hero-carousel" 
import HomeSections from "@/components/home-sections"
import { homeContentApi, resolveAssetUrl } from "@/lib/api"

export default async function Home() {
  let homeContent: Awaited<ReturnType<typeof homeContentApi.get>> | null = null
  try {
    homeContent = await homeContentApi.get()
  } catch {
    homeContent = null
  }

  const apiFeatured = homeContent?.featuredProjects ?? []
  const normalizedApiFeatured = apiFeatured
    .map((project) => ({
      id: String(project.portfolioId),
      title: project.title?.trim() || "Untitled Project",
      category: project.category ?? "Project",
      image: resolveAssetUrl((project as any).thumbnailUrl) || "/placeholder.svg",
    }))
    .filter((project) => project.id)

  const featured = (normalizedApiFeatured.length > 0 ? normalizedApiFeatured : featuredProjects).map((project) => ({
    id: String((project as any).portfolioId ?? project.id),
    title: project.title,
    category: project.category ?? "Project",
    image: resolveAssetUrl((project as any).thumbnailUrl ?? (project as any).image) || "/placeholder.svg",
  }))

  return (
    <main className="giga-public-surface flex min-h-screen flex-col">
      <HeroCarousel slides={homeContent?.carousels} />
      <HomeSections featured={featured} />
    </main>
  )
}

const featuredProjects = [
  {
    portfolioId: "sample-1",
    title: "The Blanc Residence",
    category: "Residential",
    image:
      "https://images.unsplash.com/photo-1672927936377-97d1be3976cd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
  },
  {
    portfolioId: "sample-2",
    title: "Maison Kitchen",
    category: "Residential",
    image:
      "https://images.unsplash.com/photo-1668026694348-b73c5eb5e299?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
  },
  {
    portfolioId: "sample-3",
    title: "Opus Office",
    category: "Office",
    image:
      "https://images.unsplash.com/photo-1703355685639-d558d1b0f63e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
  },
]
