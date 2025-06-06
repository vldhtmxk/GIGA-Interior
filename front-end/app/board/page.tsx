import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, Clock, Tag, User } from "lucide-react"

export default function BoardPage() {
  return (
    <main className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative w-full h-[40vh] flex items-center justify-center overflow-hidden">
        <Image
          src="/placeholder.svg?height=1080&width=1920&query=modern interior design blog and news"
          alt="Board"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 container mx-auto px-4 text-center text-white">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">소식</h1>
          <p className="text-xl max-w-2xl mx-auto">인테리어 스튜디오의 최신 소식과 디자인 인사이트를 확인하세요</p>
        </div>
      </section>

      {/* Board Content */}
      <section className="py-20 container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          {/* Categories */}
          <div className="flex flex-wrap gap-2 mb-12 justify-center">
            <Badge variant="outline" className="text-sm py-2 px-4 rounded-full">
              전체
            </Badge>
            <Badge variant="outline" className="text-sm py-2 px-4 rounded-full">
              회사 소식
            </Badge>
            <Badge variant="outline" className="text-sm py-2 px-4 rounded-full">
              프로젝트 업데이트
            </Badge>
            <Badge variant="outline" className="text-sm py-2 px-4 rounded-full">
              디자인 트렌드
            </Badge>
            <Badge variant="outline" className="text-sm py-2 px-4 rounded-full">
              이벤트
            </Badge>
          </div>

          {/* Featured Post */}
          <div className="mb-16">
            <Card className="overflow-hidden">
              <div className="relative h-[400px] w-full">
                <Image
                  src="/placeholder.svg?height=800&width=1200&query=modern interior design award ceremony"
                  alt="Featured Post"
                  fill
                  className="object-cover"
                />
              </div>
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Badge>회사 소식</Badge>
                  <div className="text-sm text-muted-foreground flex items-center">
                    <CalendarIcon className="h-4 w-4 mr-1" />
                    2023.10.15
                  </div>
                </div>
                <CardTitle className="text-2xl">2023 한국 인테리어 디자인 어워드 수상</CardTitle>
                <CardDescription>
                  인테리어 스튜디오가 2023 한국 인테리어 디자인 어워드에서 '올해의 상업 공간 디자인' 부문을
                  수상했습니다.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  지난 주말 서울 그랜드 호텔에서 열린 2023 한국 인테리어 디자인 어워드에서 인테리어 스튜디오가 '카페
                  세레니티' 프로젝트로 '올해의 상업 공간 디자인' 부문을 수상했습니다. 이번 수상은 우리 스튜디오의
                  창의적인 디자인 접근 방식과 세심한 디테일 관리가 인정받은 결과입니다.
                </p>
              </CardContent>
              <CardFooter>
                <Button asChild>
                  <Link href="/board/featured-post">자세히 보기</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>

          {/* Recent Posts */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold mb-8">최근 소식</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {recentPosts.map((post, index) => (
                <Card key={index}>
                  <div className="relative h-48 w-full">
                    <Image src={post.image || "/placeholder.svg"} alt={post.title} fill className="object-cover" />
                  </div>
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline">{post.category}</Badge>
                      <div className="text-sm text-muted-foreground">{post.date}</div>
                    </div>
                    <CardTitle className="text-xl">{post.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground line-clamp-2">{post.excerpt}</p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" asChild>
                      <Link href={`/board/${post.slug}`}>자세히 보기</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>

          {/* All Posts */}
          <div>
            <h2 className="text-2xl font-bold mb-8">모든 소식</h2>

            <div className="space-y-6">
              {allPosts.map((post, index) => (
                <div key={index} className="flex flex-col md:flex-row gap-6 border-b pb-6">
                  <div className="md:w-1/4 flex-shrink-0">
                    <div className="relative h-40 w-full rounded-lg overflow-hidden">
                      <Image src={post.image || "/placeholder.svg"} alt={post.title} fill className="object-cover" />
                    </div>
                  </div>
                  <div className="md:w-3/4">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <Badge variant="outline">{post.category}</Badge>
                      <div className="text-sm text-muted-foreground flex items-center">
                        <CalendarIcon className="h-4 w-4 mr-1" />
                        {post.date}
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
                    <p className="text-muted-foreground mb-4 line-clamp-2">{post.excerpt}</p>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <User className="h-4 w-4 mr-1" />
                        {post.author}
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="h-4 w-4 mr-1" />
                        {post.readTime}
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Tag className="h-4 w-4 mr-1" />
                        {post.tags.join(", ")}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-center mt-12">
              <Button variant="outline">더 보기</Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

// Sample data
const recentPosts = [
  {
    title: "2024 인테리어 트렌드 전망",
    category: "디자인 트렌드",
    date: "2023.12.20",
    excerpt:
      "다가오는 2024년, 인테리어 디자인 분야에서 주목해야 할 주요 트렌드를 소개합니다. 지속 가능한 소재부터 자연 요소의 통합까지, 내년의 디자인 방향성을 미리 살펴보세요.",
    image: "/placeholder.svg?height=400&width=600&query=2024 interior design trends",
    slug: "2024-interior-trends",
  },
  {
    title: "신규 디자이너 영입 소식",
    category: "회사 소식",
    date: "2023.11.05",
    excerpt:
      "인테리어 스튜디오가 새로운 시니어 디자이너 두 명을 영입했습니다. 국내외에서 다양한 경험을 쌓은 실력 있는 디자이너들의 합류로 더욱 다채로운 프로젝트를 선보일 예정입니다.",
    image: "/placeholder.svg?height=400&width=600&query=interior design team meeting",
    slug: "new-designers-joining",
  },
]

const allPosts = [
  {
    title: "럭셔리 펜트하우스 프로젝트 완공",
    category: "프로젝트 업데이트",
    date: "2023.10.10",
    excerpt:
      "6개월간의 작업 끝에 강남 럭셔리 펜트하우스 프로젝트가 성공적으로 완공되었습니다. 도심 속 여유로운 휴식 공간을 컨셉으로 한 이번 프로젝트의 비하인드 스토리를 공개합니다.",
    image: "/placeholder.svg?height=400&width=600&query=luxury penthouse interior",
    author: "김민지",
    readTime: "5분 소요",
    tags: ["주거 공간", "럭셔리", "펜트하우스"],
    slug: "luxury-penthouse-completion",
  },
  {
    title: "가을 인테리어 스타일링 팁",
    category: "디자인 트렌드",
    date: "2023.09.15",
    excerpt:
      "따뜻하고 아늑한 가을 분위기를 집 안에 들이는 방법을 소개합니다. 색상, 텍스처, 소품 활용 등 간단한 변화로 계절감을 더하는 스타일링 팁을 확인하세요.",
    image: "/placeholder.svg?height=400&width=600&query=autumn interior styling",
    author: "박소연",
    readTime: "4분 소요",
    tags: ["스타일링", "가을", "시즌 인테리어"],
    slug: "autumn-styling-tips",
  },
  {
    title: "서울 디자인 위크 참가 후기",
    category: "이벤트",
    date: "2023.08.30",
    excerpt:
      "지난주 개최된 서울 디자인 위크에 인테리어 스튜디오가 참가했습니다. 다양한 디자이너들과의 교류와 최신 트렌드를 접한 현장의 생생한 후기를 전합니다.",
    image: "/placeholder.svg?height=400&width=600&query=design week exhibition",
    author: "이준호",
    readTime: "6분 소요",
    tags: ["이벤트", "디자인 위크", "전시"],
    slug: "seoul-design-week",
  },
  {
    title: "소규모 공간 활용 가이드",
    category: "디자인 트렌드",
    date: "2023.08.10",
    excerpt:
      "작은 공간을 효율적으로 활용하면서도 스타일리시하게 꾸미는 방법을 알려드립니다. 수납 솔루션부터 시각적 트릭까지, 공간을 넓어 보이게 하는 디자인 팁을 확인하세요.",
    image: "/placeholder.svg?height=400&width=600&query=small space interior solutions",
    author: "정태영",
    readTime: "7분 소요",
    tags: ["소형 주택", "공간 활용", "수납"],
    slug: "small-space-guide",
  },
  {
    title: "친환경 인테리어 솔루션",
    category: "디자인 트렌드",
    date: "2023.07.25",
    excerpt:
      "지속 가능한 디자인을 위한 친환경 인테리어 솔루션을 소개합니다. 재활용 소재, 에너지 효율적인 설계, 자연 요소 활용 등 환경을 생각하는 디자인 방법을 알아보세요.",
    image: "/placeholder.svg?height=400&width=600&query=eco friendly interior design",
    author: "김민지",
    readTime: "5분 소요",
    tags: ["친환경", "지속가능성", "그린 디자인"],
    slug: "eco-friendly-solutions",
  },
]
