import AboutSections from "@/components/about-sections"
import { aboutApi } from "@/lib/api"

export default async function AboutPage() {
  let aboutData: Awaited<ReturnType<typeof aboutApi.get>> | null = null
  try {
    aboutData = await aboutApi.get()
  } catch {
    aboutData = null
  }

  const ceo = aboutData?.ceo ?? null
  const histories = (aboutData?.histories?.length ? aboutData.histories : history).map((item) => ({
    year: String(item.year ?? ""),
    title: item.title,
    description: item.description ?? "",
  }))

  return <AboutSections ceo={ceo} histories={histories} values={coreValues} team={team} />
}

const history = [
  {
    year: "2010",
    title: "회사 설립",
    description: "김민지 대표가 서울 강남에 인테리어 스튜디오를 설립했습니다.",
  },
  {
    year: "2013",
    title: "첫 상업 프로젝트 완성",
    description: "강남 카페 '모던 스페이스'의 인테리어 디자인으로 업계의 주목을 받기 시작했습니다.",
  },
  {
    year: "2015",
    title: "디자인 어워드 수상",
    description: "한국 인테리어 디자인 어워드에서 '올해의 신진 디자인 스튜디오'로 선정되었습니다.",
  },
  {
    year: "2018",
    title: "사무실 확장",
    description: "팀 확장과 함께 현재의 위치로 사무실을 이전하고 쇼룸을 오픈했습니다.",
  },
  {
    year: "2020",
    title: "10주년 기념",
    description: "설립 10주년을 맞아 특별 전시회를 개최하고 디자인 장학 프로그램을 시작했습니다.",
  },
  {
    year: "2023",
    title: "국제 프로젝트 진출",
    description: "아시아 지역으로 사업을 확장하여 싱가포르와 도쿄에서 첫 프로젝트를 시작했습니다.",
  },
]

const coreValues = [
  {
    title: "Authenticity",
    description: "항상 새로운 디자인 접근 방식을 탐구하고 창의적인 솔루션을 개발합니다.",
  },
  {
    title: "Craftsmanship",
    description: "모든 디테일에 세심한 주의를 기울여 완벽한 결과물을 만들어냅니다.",
  },
  {
    title: "Innovation",
    description: "환경을 고려한 재료 선택과 에너지 효율적인 디자인을 추구합니다.",
  },
  {
    title: "Sustainability",
    description: "지속 가능한 공간 운영을 위한 친환경 소재와 효율적 설계를 적용합니다.",
  },
]

const team = [
  {
    name: "김민지",
    position: "대표 & 수석 디자이너",
    photo: "/placeholder.svg?height=300&width=300&query=professional female interior designer portrait",
  },
  {
    name: "이준호",
    position: "선임 디자이너",
    photo: "/placeholder.svg?height=300&width=300&query=professional male interior designer portrait",
  },
  {
    name: "박소연",
    position: "공간 계획 전문가",
    photo: "/placeholder.svg?height=300&width=300&query=professional female space planner portrait",
  },
  {
    name: "정태영",
    position: "프로젝트 매니저",
    photo: "/placeholder.svg?height=300&width=300&query=professional male project manager portrait",
  },
]

