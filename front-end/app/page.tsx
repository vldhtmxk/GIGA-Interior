import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import HeroCarousel from "@/components/hero-carousel" 
import { homeContentApi, resolveAssetUrl } from "@/lib/api"

export default async function Home() {
  let homeContent: Awaited<ReturnType<typeof homeContentApi.get>> | null = null
  try {
    homeContent = await homeContentApi.get()
  } catch {
    homeContent = null
  }

  const featured = (homeContent?.featuredProjects?.length ? homeContent.featuredProjects : featuredProjects).map((project) => ({
    id: String(project.portfolioId ?? project.id),
    title: project.title,
    category: project.category ?? "프로젝트",
    image: resolveAssetUrl((project as any).thumbnailUrl ?? project.image) || "/placeholder.svg",
  }))

  return (
    <main className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <HeroCarousel slides={homeContent?.carousels} />

      {/* Featured Projects */}
      <section className="py-20 container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">주요 프로젝트</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            최근에 완성된 프로젝트들을 살펴보세요. 각 공간은 고객의 니즈와 라이프스타일을 반영하여 디자인되었습니다.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featured.map((project) => (
            <Link key={project.id} href={`/portfolio/${project.id}`} className="group block overflow-hidden rounded-lg">
              <div className="relative h-80 overflow-hidden">
                <Image
                  src={project.image || "/placeholder.svg"}
                  alt={project.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                <p className="text-muted-foreground">{project.category}</p>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button asChild variant="outline">
            <Link href="/portfolio">
              모든 프로젝트 보기 <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">우리의 서비스</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              주거 공간부터 상업 공간까지, 모든 공간에 맞춤형 디자인 솔루션을 제공합니다.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service) => (
              <div key={service.title} className="p-6 bg-white rounded-lg shadow-sm">
                <div className="mb-4">{service.icon}</div>
                <h3 className="text-xl font-semibold mb-3">{service.title}</h3>
                <p className="text-muted-foreground">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">고객 후기</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            우리의 디자인 서비스를 경험한 고객들의 이야기를 들어보세요.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="p-6 bg-white rounded-lg border">
              <div className="flex items-center mb-4">
                <div className="relative w-12 h-12 rounded-full overflow-hidden mr-4">
                  <Image
                    src={testimonial.avatar || "/placeholder.svg"}
                    alt={testimonial.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-semibold">{testimonial.name}</h4>
                  <p className="text-sm text-muted-foreground">{testimonial.project}</p>
                </div>
              </div>
              <p className="italic">{testimonial.quote}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-black text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">당신의 공간을 변화시킬 준비가 되셨나요?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            지금 상담을 예약하고 당신의 공간에 맞는 맞춤형 디자인 솔루션을 만나보세요.
          </p>
          <Button asChild className="bg-white text-black hover:bg-white/90">
            <Link href="/contact">
              무료 상담 예약하기 <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </main>
  )
}

// Sample data
const featuredProjects = [
  {
    portfolioId: "modern-apartment",
    title: "모던 아파트 리모델링",
    category: "주거 공간",
    image:
      "/placeholder.svg?height=800&width=600&query=modern apartment interior with minimalist furniture and white walls",
  },
  {
    portfolioId: "boutique-showroom",
    title: "부티크 쇼룸",
    category: "상업 공간",
    image: "/placeholder.svg?height=800&width=600&query=minimalist retail showroom with white walls and wooden accents",
  },
  {
    portfolioId: "office-space",
    title: "크리에이티브 오피스",
    category: "업무 공간",
    image:
      "/placeholder.svg?height=800&width=600&query=modern office space with collaborative areas and minimalist design",
  },
]

const services = [
  {
    title: "인테리어 디자인",
    description: "공간의 기능과 미학을 고려한 맞춤형 인테리어 디자인 서비스를 제공합니다.",
    icon: <div className="w-12 h-12 bg-black/10 rounded-full flex items-center justify-center">ID</div>,
  },
  {
    title: "공간 계획",
    description: "효율적인 공간 활용을 위한 레이아웃 설계와 공간 계획 서비스를 제공합니다.",
    icon: <div className="w-12 h-12 bg-black/10 rounded-full flex items-center justify-center">SP</div>,
  },
  {
    title: "가구 디자인",
    description: "공간에 맞는 맞춤형 가구 디자인 및 제작 서비스를 제공합니다.",
    icon: <div className="w-12 h-12 bg-black/10 rounded-full flex items-center justify-center">FD</div>,
  },
]

const testimonials = [
  {
    name: "김지현",
    project: "아파트 리모델링",
    quote: "전문적인 디자인 팀과 함께 작업하면서 우리 가족의 라이프스타일에 완벽하게 맞는 공간을 만들 수 있었습니다.",
    avatar: "/placeholder.svg?height=100&width=100&query=professional woman portrait",
  },
  {
    name: "이상호",
    project: "카페 인테리어",
    quote: "우리 카페의 컨셉을 정확히 이해하고 그에 맞는 독특한 디자인을 제안해 주셔서 매우 만족스러웠습니다.",
    avatar: "/placeholder.svg?height=100&width=100&query=professional man portrait",
  },
]
