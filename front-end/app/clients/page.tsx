import Image from "next/image"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { clientPartnerApi, resolveAssetUrl } from "@/lib/api"

type ClientItem = {
  clientId: number
  name: string
  category: "client" | "partner"
  logoUrl: string | null
  description: string | null
}

export default async function ClientsPage() {
  let dbClients: ClientItem[] = []
  try {
    const rows = await clientPartnerApi.getAll()
    dbClients = rows.map((row) => ({
      clientId: row.clientId,
      name: row.name,
      category: row.category?.toLowerCase() === "partner" ? "partner" : "client",
      logoUrl: row.logoUrl,
      description: row.description,
    }))
  } catch {
    dbClients = []
  }

  const clientRows = dbClients.filter((item) => item.category === "client")
  const partnerRows = dbClients.filter((item) => item.category === "partner")

  return (
    <main className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative w-full h-[50vh] flex items-center justify-center overflow-hidden">
        <Image
          src="/menu-hero/clients.svg"
          alt="Our Clients"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 container mx-auto px-4 text-center text-white">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">클라이언트 & 파트너</h1>
          <p className="text-xl max-w-2xl mx-auto">우리와 함께한 소중한 클라이언트와 파트너를 소개합니다</p>
        </div>
      </section>

      {/* Clients & Partners */}
      <section className="py-20 container mx-auto px-4">
        <Tabs defaultValue="clients" className="max-w-5xl mx-auto">
          <div className="flex justify-center mb-12">
            <TabsList>
              <TabsTrigger value="clients">클라이언트</TabsTrigger>
              <TabsTrigger value="partners">파트너</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="clients" className="mt-0">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">우리의 클라이언트</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                다양한 산업 분야의 클라이언트들과 함께 성공적인 프로젝트를 진행해왔습니다.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {clientRows.map((client) => (
                <div key={client.clientId} className="flex flex-col items-center">
                  <div className="w-32 h-32 bg-slate-50 rounded-lg flex items-center justify-center p-4 mb-4">
                    <Image
                      src={resolveAssetUrl(client.logoUrl) || "/placeholder.svg"}
                      alt={client.name}
                      width={100}
                      height={50}
                      className="max-w-full max-h-full object-contain"
                      unoptimized
                    />
                  </div>
                  <h3 className="font-semibold text-center">{client.name}</h3>
                  <p className="text-sm text-muted-foreground text-center">{client.description || "클라이언트"}</p>
                </div>
              ))}
            </div>
            {clientRows.length === 0 && (
              <div className="mt-8 border border-dashed border-gray-300 rounded-lg p-8 text-center text-gray-500">
                등록된 클라이언트가 없습니다.
              </div>
            )}

            <div className="mt-16 space-y-12">
              <h2 className="text-3xl font-bold mb-8 text-center">클라이언트 후기</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {testimonials.map((testimonial, index) => (
                  <div key={index} className="bg-slate-50 p-8 rounded-lg">
                    <div className="flex items-center mb-6">
                      <div className="relative w-16 h-16 rounded-full overflow-hidden mr-4">
                        <Image
                          src={testimonial.avatar || "/placeholder.svg"}
                          alt={testimonial.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="font-semibold">{testimonial.name}</h3>
                        <p className="text-sm text-muted-foreground">{testimonial.company}</p>
                      </div>
                    </div>
                    <p className="italic mb-4">{testimonial.quote}</p>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="w-5 h-5 text-yellow-500 fill-current" viewBox="0 0 24 24">
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="partners" className="mt-0">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">우리의 파트너</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                최고의 품질과 서비스를 제공하기 위해 신뢰할 수 있는 파트너들과 협력하고 있습니다.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {partnerRows.map((partner) => (
                <div key={partner.clientId} className="bg-slate-50 p-8 rounded-lg">
                  <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center p-2 mb-4">
                    <Image
                      src={resolveAssetUrl(partner.logoUrl) || "/placeholder.svg"}
                      alt={partner.name}
                      width={48}
                      height={48}
                      className="max-w-full max-h-full object-contain"
                      unoptimized
                    />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{partner.name}</h3>
                  <p className="text-sm text-muted-foreground">{partner.description || "파트너사"}</p>
                </div>
              ))}
            </div>
            {partnerRows.length === 0 && (
              <div className="mt-8 border border-dashed border-gray-300 rounded-lg p-8 text-center text-gray-500">
                등록된 파트너사가 없습니다.
              </div>
            )}
          </TabsContent>
        </Tabs>
      </section>

      {/* Brands */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">협력 브랜드</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              우리는 최고 품질의 제품을 제공하는 다양한 브랜드와 협력하고 있습니다.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 max-w-5xl mx-auto">
            {brands.map((brand, index) => (
              <div key={index} className="bg-white p-4 rounded-lg flex items-center justify-center h-24">
                <Image
                  src={brand.logo || "/placeholder.svg"}
                  alt={brand.name}
                  width={100}
                  height={50}
                  className="max-w-full max-h-full object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}

// Sample data
const testimonials = [
  {
    name: "김지현",
    company: "모던 리빙 CEO",
    quote:
      "인테리어 스튜디오와 함께한 프로젝트는 우리의 기대를 훨씬 뛰어넘었습니다. 그들의 창의적인 접근 방식과 세심한 디테일 관리는 정말 인상적이었습니다.",
    avatar: "/placeholder.svg?height=100&width=100&query=professional woman portrait",
  },
  {
    name: "이상호",
    company: "카페 세레니티 대표",
    quote:
      "우리 카페의 분위기를 완벽하게 이해하고 그에 맞는 독특한 디자인을 제안해 주셔서 매우 만족스러웠습니다. 고객들의 반응도 매우 좋습니다.",
    avatar: "/placeholder.svg?height=100&width=100&query=professional man portrait",
  },
  {
    name: "박민영",
    company: "테크 이노베이션 HR 매니저",
    quote:
      "직원들의 생산성과 만족도를 고려한 오피스 디자인을 제안해 주셔서 감사합니다. 새로운 공간으로 이전한 후 팀의 사기가 크게 향상되었습니다.",
    avatar: "/placeholder.svg?height=100&width=100&query=professional woman portrait with glasses",
  },
  {
    name: "정태영",
    company: "럭셔리 부티크 오너",
    quote:
      "우리 브랜드의 아이덴티티를 완벽하게 반영한 쇼룸 디자인에 매우 만족합니다. 고급스러우면서도 편안한 쇼핑 경험을 제공할 수 있게 되었습니다.",
    avatar: "/placeholder.svg?height=100&width=100&query=professional man portrait with suit",
  },
]

const brands = [
  {
    name: "디자인 퍼니처",
    logo: "/placeholder.svg?height=100&width=200&query=minimal furniture brand logo",
  },
  {
    name: "모던 라이팅",
    logo: "/placeholder.svg?height=100&width=200&query=minimal lighting brand logo",
  },
  {
    name: "럭셔리 패브릭",
    logo: "/placeholder.svg?height=100&width=200&query=minimal fabric brand logo",
  },
  {
    name: "에코 마테리얼",
    logo: "/placeholder.svg?height=100&width=200&query=minimal eco material brand logo",
  },
  {
    name: "스마트 홈",
    logo: "/placeholder.svg?height=100&width=200&query=minimal smart home brand logo",
  },
  {
    name: "아트 데코",
    logo: "/placeholder.svg?height=100&width=200&query=minimal art deco brand logo",
  },
  {
    name: "키친 솔루션",
    logo: "/placeholder.svg?height=100&width=200&query=minimal kitchen solution brand logo",
  },
  {
    name: "바스 디자인",
    logo: "/placeholder.svg?height=100&width=200&query=minimal bath design brand logo",
  },
  {
    name: "플로어링 프로",
    logo: "/placeholder.svg?height=100&width=200&query=minimal flooring brand logo",
  },
  {
    name: "가든 스타일",
    logo: "/placeholder.svg?height=100&width=200&query=minimal garden style brand logo",
  },
  {
    name: "아트 오브젝트",
    logo: "/placeholder.svg?height=100&width=200&query=minimal art object brand logo",
  },
  {
    name: "스토리지 시스템",
    logo: "/placeholder.svg?height=100&width=200&query=minimal storage system brand logo",
  },
]
