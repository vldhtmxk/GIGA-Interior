import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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

function ProjectCard({ project }: { project: PortfolioCard }) {
  return (
    <Link href={`/portfolio/${project.id}`} className="group block overflow-hidden rounded-lg">
      <div className="relative h-80 overflow-hidden">
        <Image src={project.image} alt={project.title} fill className="object-cover transition-transform duration-300 group-hover:scale-105" />
      </div>
      <div className="p-4">
        <div className="text-sm text-muted-foreground mb-1">{project.category}</div>
        <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
        <p className="text-muted-foreground line-clamp-2">{project.description}</p>
      </div>
    </Link>
  )
}

export default async function PortfolioPage() {
  let projects: PortfolioCard[] = []
  try {
    projects = (await portfolioApi.getAll()).map(toCard)
  } catch {
    projects = []
  }

  const residential = projects.filter((p) => p.category === "주거 공간")
  const commercial = projects.filter((p) => p.category === "상업 공간")
  const office = projects.filter((p) => p.category === "업무 공간")

  return (
    <main className="flex flex-col min-h-screen">
      <section className="relative w-full h-[50vh] flex items-center justify-center overflow-hidden">
        <Image
          src="/placeholder.svg?height=1080&width=1920&query=collection of modern interior design projects"
          alt="Portfolio"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 container mx-auto px-4 text-center text-white">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">포트폴리오</h1>
          <p className="text-xl max-w-2xl mx-auto">우리의 다양한 프로젝트를 통해 공간의 변화를 확인하세요</p>
        </div>
      </section>

      <section className="py-20 container mx-auto px-4">
        <Tabs defaultValue="all" className="max-w-5xl mx-auto">
          <div className="flex justify-center mb-12">
            <TabsList>
              <TabsTrigger value="all">전체</TabsTrigger>
              <TabsTrigger value="residential">주거 공간</TabsTrigger>
              <TabsTrigger value="commercial">상업 공간</TabsTrigger>
              <TabsTrigger value="office">오피스</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="all" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project) => <ProjectCard key={project.id} project={project} />)}
            </div>
          </TabsContent>
          <TabsContent value="residential" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {residential.map((project) => <ProjectCard key={project.id} project={project} />)}
            </div>
          </TabsContent>
          <TabsContent value="commercial" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {commercial.map((project) => <ProjectCard key={project.id} project={project} />)}
            </div>
          </TabsContent>
          <TabsContent value="office" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {office.map((project) => <ProjectCard key={project.id} project={project} />)}
            </div>
          </TabsContent>
        </Tabs>

        {projects.length === 0 && (
          <div className="mt-8 border border-dashed border-gray-300 rounded-lg p-10 text-center text-gray-500">
            등록된 포트폴리오가 없습니다.
          </div>
        )}

        <div className="text-center mt-12">
          <Button asChild variant="outline">
            <Link href="/contact">프로젝트 문의하기</Link>
          </Button>
        </div>
      </section>
    </main>
  )
}
