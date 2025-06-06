import Image from "next/image"

export default function AboutPage() {
  return (
    <main className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative w-full h-[50vh] flex items-center justify-center overflow-hidden">
        <Image
          src="/placeholder.svg?height=1080&width=1920&query=modern interior design studio with team working"
          alt="About Our Studio"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 container mx-auto px-4 text-center text-white">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">우리 스튜디오 소개</h1>
          <p className="text-xl max-w-2xl mx-auto">공간의 가치를 높이는 디자인 스튜디오</p>
        </div>
      </section>

      {/* CEO Message */}
      <section className="py-20 container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="relative w-64 h-64 rounded-full overflow-hidden flex-shrink-0">
              <Image
                src="/placeholder.svg?height=400&width=400&query=professional female interior designer portrait"
                alt="CEO Portrait"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-6">CEO 메시지</h2>
              <p className="text-lg mb-4">안녕하세요, 인테리어 스튜디오의 대표 김민지입니다.</p>
              <p className="text-muted-foreground mb-4">
                우리 스튜디오는 2010년 설립 이후, 공간이 가진 잠재력을 최대한 끌어내는 디자인을 추구해 왔습니다. 우리는
                단순히 아름다운 공간을 만드는 것을 넘어, 그 공간을 사용하는 사람들의 삶의 질을 향상시키는 디자인을
                지향합니다.
              </p>
              <p className="text-muted-foreground">
                각 프로젝트마다 고객의 니즈와 공간의 특성을 깊이 이해하고, 그에 맞는 최적의 솔루션을 제공하기 위해
                노력하고 있습니다. 우리와 함께 당신의 공간에 새로운 가치를 더해보세요.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-3xl font-bold mb-6">비전 & 미션</h2>
            <p className="text-xl">우리는 공간을 통해 사람들의 삶에 긍정적인 변화를 가져오는 것을 목표로 합니다.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <h3 className="text-2xl font-semibold mb-4">비전</h3>
              <p className="text-muted-foreground">
                모든 공간이 그 안에서 생활하는 사람들에게 영감을 주고, 기능적이면서도 아름다운 환경을 제공하는 세상을
                만들어 나갑니다.
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <h3 className="text-2xl font-semibold mb-4">미션</h3>
              <p className="text-muted-foreground">
                혁신적인 디자인 접근 방식과 세심한 디테일 관리를 통해 고객의 기대를 뛰어넘는 공간을 창조합니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* History */}
      <section className="py-20 container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">회사 연혁</h2>

          <div className="space-y-12">
            {history.map((item, index) => (
              <div key={index} className="flex flex-col md:flex-row gap-6">
                <div className="md:w-1/4">
                  <div className="text-2xl font-bold">{item.year}</div>
                </div>
                <div className="md:w-3/4 border-l-2 pl-6 pb-6">
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-3xl font-bold mb-6">핵심 가치</h2>
            <p className="text-xl">우리의 모든 프로젝트와 의사결정을 이끄는 핵심 가치입니다.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {coreValues.map((value, index) => (
              <div key={index} className="bg-white p-8 rounded-lg shadow-sm text-center">
                <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
                  {index + 1}
                </div>
                <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                <p className="text-muted-foreground">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-3xl font-bold mb-6">디자인 팀</h2>
          <p className="text-xl">창의적이고 열정적인 전문가들이 모여 최고의 디자인을 만들어냅니다.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
          {team.map((member, index) => (
            <div key={index} className="text-center">
              <div className="relative w-48 h-48 rounded-full overflow-hidden mx-auto mb-4">
                <Image src={member.photo || "/placeholder.svg"} alt={member.name} fill className="object-cover" />
              </div>
              <h3 className="text-lg font-semibold">{member.name}</h3>
              <p className="text-sm text-muted-foreground">{member.position}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}

// Sample data
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
    title: "혁신",
    description: "항상 새로운 디자인 접근 방식을 탐구하고 창의적인 솔루션을 개발합니다.",
  },
  {
    title: "정밀함",
    description: "모든 디테일에 세심한 주의를 기울여 완벽한 결과물을 만들어냅니다.",
  },
  {
    title: "지속가능성",
    description: "환경을 고려한 재료 선택과 에너지 효율적인 디자인을 추구합니다.",
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
