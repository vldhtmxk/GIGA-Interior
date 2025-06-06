import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Download } from "lucide-react"

// 이 페이지는 동적 라우팅을 위한 예시입니다
// 실제 구현에서는 데이터베이스나 CMS에서 프로젝트 데이터를 가져와야 합니다
export default function ProjectDetailPage({ params }: { params: { id: string } }) {
  // 실제 구현에서는 params.id를 사용하여 특정 프로젝트 데이터를 가져옵니다
  // 여기서는 예시 데이터를 사용합니다
  const project = {
    id: params.id,
    title: "모던 아파트 리모델링",
    category: "주거 공간",
    location: "서울 강남구",
    year: "2023",
    size: "120㎡",
    description:
      "서울 강남의 아파트를 밝고 개방감 있는 공간으로 리모델링한 프로젝트입니다. 자연광을 최대한 활용하고 공간의 효율성을 높이는 동시에 미니멀하면서도 따뜻한 분위기를 연출했습니다.",
    challenge:
      "기존 벽식 구조의 제약 속에서 개방감을 최대화하고, 수납 공간을 확보하는 것이 주요 과제였습니다. 또한 고객의 라이프스타일을 반영한 맞춤형 공간 구성이 필요했습니다.",
    solution:
      "주요 벽체를 일부 철거하고 구조 보강을 통해 개방감을 확보했으며, 맞춤형 가구를 활용해 효율적인 수납 공간을 마련했습니다. 자연 소재와 중성적인 색상 팔레트를 사용하여 따뜻하면서도 세련된 분위기를 연출했습니다.",
    mainImage:
      "/placeholder.svg?height=1080&width=1920&query=modern apartment living room with white walls and wooden floor",
    images: [
      "/placeholder.svg?height=800&width=1200&query=modern apartment kitchen with island",
      "/placeholder.svg?height=800&width=1200&query=modern apartment bedroom with minimal furniture",
      "/placeholder.svg?height=800&width=1200&query=modern apartment bathroom with shower",
      "/placeholder.svg?height=800&width=1200&query=modern apartment dining area with pendant lights",
      "/placeholder.svg?height=800&width=1200&query=modern apartment home office corner",
    ],
    testimonial: {
      quote:
        "인테리어 스튜디오와 함께한 리모델링 프로젝트는 기대 이상의 결과였습니다. 우리 가족의 라이프스타일을 정확히 이해하고 그에 맞는 공간을 만들어 주셔서 매우 만족스럽습니다.",
      author: "김지현",
      position: "고객",
    },
    materials: ["화이트 오크 원목", "이태리 대리석", "친환경 페인트", "브라스 피팅", "자연 린넨 패브릭"],
  }

  return (
    <main className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative w-full h-[70vh] flex items-center justify-center overflow-hidden">
        <Image
          src={project.mainImage || "/placeholder.svg"}
          alt={project.title}
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative z-10 container mx-auto px-4 text-center text-white">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">{project.title}</h1>
          <p className="text-xl max-w-2xl mx-auto">
            {project.category} | {project.location}
          </p>
        </div>
      </section>

      {/* Project Info */}
      <section className="py-20 container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-12">
            <Button variant="outline" asChild>
              <Link href="/portfolio">
                <ArrowLeft className="mr-2 h-4 w-4" />
                모든 프로젝트
              </Link>
            </Button>
            <Button>
              <Download className="mr-2 h-4 w-4" />
              프로젝트 PDF
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div>
              <h3 className="font-semibold mb-2">프로젝트 정보</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <span className="font-medium text-foreground">위치:</span> {project.location}
                </li>
                <li>
                  <span className="font-medium text-foreground">연도:</span> {project.year}
                </li>
                <li>
                  <span className="font-medium text-foreground">면적:</span> {project.size}
                </li>
                <li>
                  <span className="font-medium text-foreground">카테고리:</span> {project.category}
                </li>
              </ul>
            </div>
            <div className="md:col-span-2">
              <h3 className="font-semibold mb-2">프로젝트 개요</h3>
              <p className="text-muted-foreground">{project.description}</p>
            </div>
          </div>

          <div className="space-y-12 mb-16">
            <div>
              <h3 className="text-xl font-semibold mb-4">도전 과제</h3>
              <p className="text-muted-foreground">{project.challenge}</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">솔루션</h3>
              <p className="text-muted-foreground">{project.solution}</p>
            </div>
          </div>

          <div className="space-y-8 mb-16">
            {project.images.map((image, index) => (
              <div key={index} className="relative h-[60vh] w-full rounded-lg overflow-hidden">
                <Image
                  src={image || "/placeholder.svg"}
                  alt={`${project.title} - 이미지 ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
            <div>
              <h3 className="text-xl font-semibold mb-4">사용 자재</h3>
              <ul className="space-y-2">
                {project.materials.map((material, index) => (
                  <li key={index} className="flex items-center">
                    <div className="w-2 h-2 bg-black rounded-full mr-3"></div>
                    {material}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-slate-50 p-8 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">고객 후기</h3>
              <p className="italic mb-4">{project.testimonial.quote}</p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-slate-200 rounded-full mr-3"></div>
                <div>
                  <p className="font-medium">{project.testimonial.author}</p>
                  <p className="text-sm text-muted-foreground">{project.testimonial.position}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center">
            <h3 className="text-xl font-semibold mb-6">비슷한 프로젝트</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((item) => (
                <Link key={item} href={`/portfolio/similar-project-${item}`} className="group block">
                  <div className="relative h-60 overflow-hidden rounded-lg mb-3">
                    <Image
                      src={`/placeholder.svg?height=600&width=400&query=modern interior design project ${item}`}
                      alt={`비슷한 프로젝트 ${item}`}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <h4 className="font-medium">비슷한 프로젝트 {item}</h4>
                  <p className="text-sm text-muted-foreground">주거 공간</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-black text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">나만의 프로젝트를 시작하세요</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            당신의 공간에 맞는 맞춤형 디자인 솔루션을 찾고 계신가요? 지금 문의하시고 무료 상담을 받아보세요.
          </p>
          <Button asChild className="bg-white text-black hover:bg-white/90">
            <Link href="/contact">무료 상담 예약하기</Link>
          </Button>
        </div>
      </section>
    </main>
  )
}
