import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function PortfolioPage() {
  return (
    <main className="flex flex-col min-h-screen">
      {/* Hero Section */}
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

      {/* Portfolio Gallery */}
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
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="residential" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects
                .filter((project) => project.category === "주거 공간")
                .map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
            </div>
          </TabsContent>

          <TabsContent value="commercial" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects
                .filter((project) => project.category === "상업 공간")
                .map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
            </div>
          </TabsContent>

          <TabsContent value="office" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects
                .filter((project) => project.category === "업무 공간")
                .map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
            </div>
          </TabsContent>
        </Tabs>

        <div className="text-center mt-12">
          <Button asChild variant="outline">
            <Link href="/contact">프로젝트 문의하기</Link>
          </Button>
        </div>
      </section>

      {/* Download Portfolio */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-6">포트폴리오 다운로드</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            우리의 전체 포트폴리오를 PDF로 다운로드하여 자세히 살펴보세요.
          </p>
          <Button>포트폴리오 PDF 다운로드</Button>
        </div>
      </section>
    </main>
  )
}

function ProjectCard({ project }: { project: any }) {
  return (
    <Link href={`/portfolio/${project.id}`} className="group block overflow-hidden rounded-lg">
      <div className="relative h-80 overflow-hidden">
        <Image
          src={project.image || "/placeholder.svg"}
          alt={project.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="p-4">
        <div className="text-sm text-muted-foreground mb-1">{project.category}</div>
        <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
        <p className="text-muted-foreground line-clamp-2">{project.description}</p>
      </div>
    </Link>
  )
}

// Sample data
const projects = [
  {
    id: "modern-apartment",
    title: "모던 아파트 리모델링",
    category: "주거 공간",
    description: "서울 강남의 아파트를 밝고 개방감 있는 공간으로 리모델링한 프로젝트입니다.",
    image:
      "/placeholder.svg?height=800&width=600&query=modern apartment interior with minimalist furniture and white walls",
  },
  {
    id: "boutique-showroom",
    title: "부티크 쇼룸",
    category: "상업 공간",
    description: "패션 브랜드를 위한 미니멀한 쇼룸 디자인으로, 제품이 돋보이는 공간을 구성했습니다.",
    image: "/placeholder.svg?height=800&width=600&query=minimalist retail showroom with white walls and wooden accents",
  },
  {
    id: "office-space",
    title: "크리에이티브 오피스",
    category: "업무 공간",
    description: "디자인 회사를 위한 창의적인 업무 공간으로, 협업과 개인 작업이 모두 가능한 레이아웃입니다.",
    image:
      "/placeholder.svg?height=800&width=600&query=modern office space with collaborative areas and minimalist design",
  },
  {
    id: "luxury-penthouse",
    title: "럭셔리 펜트하우스",
    category: "주거 공간",
    description: "도심 속 펜트하우스를 고급스러운 분위기로 디자인한 프로젝트입니다.",
    image:
      "/placeholder.svg?height=800&width=600&query=luxury penthouse interior with panoramic views and modern furniture",
  },
  {
    id: "cafe-interior",
    title: "모던 카페",
    category: "상업 공간",
    description: "자연광이 풍부한 카페 인테리어로, 편안하면서도 세련된 분위기를 연출했습니다.",
    image: "/placeholder.svg?height=800&width=600&query=modern cafe interior with natural light and minimalist design",
  },
  {
    id: "startup-headquarters",
    title: "스타트업 본사",
    category: "업무 공간",
    description: "젊은 스타트업을 위한 역동적이고 유연한 업무 공간 디자인입니다.",
    image: "/placeholder.svg?height=800&width=600&query=startup office with flexible workspace and modern design",
  },
  {
    id: "minimal-studio",
    title: "미니멀 스튜디오 아파트",
    category: "주거 공간",
    description: "작은 공간을 효율적으로 활용한 스튜디오 아파트 디자인입니다.",
    image: "/placeholder.svg?height=800&width=600&query=minimal studio apartment with space saving furniture",
  },
  {
    id: "restaurant-design",
    title: "컨템포러리 레스토랑",
    category: "상업 공간",
    description: "현대적인 감각의 레스토랑 인테리어로, 편안한 다이닝 경험을 제공합니다.",
    image: "/placeholder.svg?height=800&width=600&query=contemporary restaurant interior with elegant dining space",
  },
  {
    id: "coworking-space",
    title: "코워킹 스페이스",
    category: "업무 공간",
    description: "다양한 업무 스타일을 수용할 수 있는 유연한 코워킹 공간입니다.",
    image: "/placeholder.svg?height=800&width=600&query=modern coworking space with various work areas",
  },
]
