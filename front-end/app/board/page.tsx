import NewsSections, { type NewsPost } from "@/components/news-sections"

const featured: NewsPost = {
  title: "2023 한국 인테리어 디자인 어워드 수상",
  category: "회사 소식",
  date: "2023.10.15",
  excerpt:
    "GIGA Interior가 '카페 세레니티' 프로젝트로 올해의 상업 공간 디자인 부문을 수상했습니다. 창의적인 접근과 높은 완성도를 인정받은 결과입니다.",
  image: "/placeholder.svg?height=800&width=1200&query=modern interior design award ceremony",
}

const posts: NewsPost[] = [
  {
    title: "2024 인테리어 트렌드 전망",
    category: "디자인 트렌드",
    date: "2023.12.20",
    excerpt:
      "2024년에 주목해야 할 인테리어 트렌드를 소개합니다. 지속 가능한 소재부터 자연 요소의 통합까지, 내년의 방향성을 미리 살펴보세요.",
    image: "/placeholder.svg?height=400&width=600&query=2024 interior design trends",
    author: "김민지",
    readTime: "5분 소요",
    tags: ["트렌드", "2024", "인사이트"],
  },
  {
    title: "신규 디자이너 영입 소식",
    category: "회사 소식",
    date: "2023.11.05",
    excerpt:
      "국내외 경험을 갖춘 시니어 디자이너 2인이 새롭게 합류했습니다. 더 폭넓은 프로젝트와 높은 완성도를 기대할 수 있습니다.",
    image: "/placeholder.svg?height=400&width=600&query=interior design team meeting",
    author: "이준호",
    readTime: "4분 소요",
    tags: ["팀", "브랜드", "회사"],
  },
  {
    title: "럭셔리 펜트하우스 프로젝트 완공",
    category: "프로젝트 업데이트",
    date: "2023.10.10",
    excerpt:
      "6개월간 진행한 강남 펜트하우스 프로젝트를 성공적으로 마무리했습니다. 도심 속 프리미엄 라이프스타일을 구현한 공간입니다.",
    image: "/placeholder.svg?height=400&width=600&query=luxury penthouse interior",
    author: "박소연",
    readTime: "6분 소요",
    tags: ["주거", "프리미엄", "완공"],
  },
  {
    title: "서울 디자인 위크 참가 후기",
    category: "이벤트",
    date: "2023.08.30",
    excerpt:
      "서울 디자인 위크 현장에서 최신 트렌드와 다양한 브랜드를 교류하며 얻은 인사이트를 공유합니다.",
    image: "/placeholder.svg?height=400&width=600&query=design week exhibition",
    author: "정태영",
    readTime: "5분 소요",
    tags: ["이벤트", "전시", "디자인"],
  },
  {
    title: "친환경 인테리어 솔루션",
    category: "디자인 트렌드",
    date: "2023.07.25",
    excerpt:
      "재활용 소재와 에너지 효율 설계를 중심으로 지속 가능한 인테리어 방법을 제안합니다.",
    image: "/placeholder.svg?height=400&width=600&query=eco friendly interior design",
    author: "김민지",
    readTime: "5분 소요",
    tags: ["친환경", "지속가능성", "그린"],
  },
]

export default function BoardPage() {
  return <NewsSections featured={featured} posts={posts} />
}

