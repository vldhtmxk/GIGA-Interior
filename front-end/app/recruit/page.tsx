import Link from "next/link"
import { Button } from "@/components/ui/button"
import { recruitApi, resolveAssetUrl, type RecruitResponse } from "@/lib/api"
import { MapPin, Clock, Users, Heart, Briefcase, GraduationCap } from "lucide-react"

const formatDate = (value?: string | null) => {
  if (!value) return "상시채용"
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleDateString("ko-KR")
}

const toCard = (item: RecruitResponse) => ({
  id: item.recruitId,
  title: item.position,
  department: item.department ?? "미정",
  type: item.empType ?? "미정",
  experience: item.careerLevel ?? "협의",
  location: item.location ?? "미정",
  deadline: formatDate(item.deadline),
  description: item.description ?? "채용 상세 내용은 공고 상세 페이지에서 확인해주세요.",
  imageUrl: resolveAssetUrl(item.imageUrl),
})

export default async function RecruitPage() {
  let positions: ReturnType<typeof toCard>[] = []
  try {
    positions = (await recruitApi.getAll()).map(toCard)
  } catch {
    positions = []
  }

  const benefits = [
    {
      icon: <Heart className="w-8 h-8" />,
      title: "워라밸",
      description: "주 40시간 근무제와 유연근무제를 통해 일과 삶의 균형을 지원합니다",
    },
    {
      icon: <GraduationCap className="w-8 h-8" />,
      title: "성장 지원",
      description: "교육비 지원, 세미나 참석, 해외 연수 등 지속적인 성장을 위한 투자를 아끼지 않습니다",
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "수평적 문화",
      description: "자유로운 의견 교환과 창의적 아이디어가 존중받는 수평적 조직문화입니다",
    },
    {
      icon: <Briefcase className="w-8 h-8" />,
      title: "경쟁력 있는 연봉",
      description: "업계 최고 수준의 연봉과 성과에 따른 인센티브를 제공합니다",
    },
  ]

  const culture = [
    {
      title: "창의적 환경",
      description: "자유로운 사고와 혁신적 아이디어가 존중받는 창의적 업무 환경",
    },
    {
      title: "협업 중심",
      description: "팀워크를 바탕으로 한 협업을 통해 더 나은 결과물을 만들어가는 문화",
    },
    {
      title: "지속적 학습",
      description: "새로운 트렌드와 기술을 지속적으로 학습하고 적용하는 성장 문화",
    },
    {
      title: "고객 중심",
      description: "고객의 만족과 성공을 최우선으로 생각하는 서비스 마인드",
    },
  ]

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-black mb-6">RECRUIT</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              성장하는 브랜드와 함께할 인재를 찾습니다. GIGA Interior에서 당신의 꿈을 펼쳐보세요.
            </p>
            <Button asChild size="lg" className="bg-black text-white hover:bg-gray-800">
              <Link href="/recruit/apply">지원하기</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Company Culture */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-black mb-4">GIGA Interior의 문화</h2>
            <p className="text-gray-600 text-lg">우리가 추구하는 가치와 일하는 방식</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {culture.map((item, index) => (
              <div key={index} className="text-center p-6">
                <h3 className="text-xl font-semibold text-black mb-4">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-black mb-4">복리후생</h2>
            <p className="text-gray-600 text-lg">직원들의 행복과 성장을 위한 다양한 혜택</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center p-8 bg-white rounded-lg">
                <div className="flex justify-center mb-6 text-black">{benefit.icon}</div>
                <h3 className="text-xl font-semibold text-black mb-4">{benefit.title}</h3>
                <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-black mb-4">채용 공고</h2>
            <p className="text-gray-600 text-lg">현재 모집 중인 포지션들을 확인해보세요</p>
          </div>

          <div className="space-y-6">
            {positions.map((position) => (
              <div
                key={position.id}
                className="border border-gray-200 rounded-lg p-8 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-4">
                      <span className="px-3 py-1 bg-black text-white rounded-full text-sm font-medium">
                        {position.department}
                      </span>
                      <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">{position.type}</span>
                    </div>

                    <Link href={`/recruit/${position.id}`}>
                      <h3 className="text-2xl font-bold text-black mb-4 hover:text-gray-600 transition-colors cursor-pointer">
                        {position.title}
                      </h3>
                    </Link>

                    {position.imageUrl && (
                      <div className="mb-4">
                        <img
                          src={position.imageUrl}
                          alt={position.title}
                          className="h-40 w-full max-w-md rounded-md object-cover border"
                        />
                      </div>
                    )}

                    <p className="text-gray-600 leading-relaxed mb-6">{position.description}</p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-2">
                        <Briefcase className="w-4 h-4" />
                        <span>{position.experience}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>{position.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>마감: {position.deadline}</span>
                      </div>
                    </div>
                  </div>

                  <div className="lg:w-48">
                    <Button asChild className="w-full bg-black text-white hover:bg-gray-800">
                      <Link href={`/recruit/${position.id}`}>상세보기</Link>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            {positions.length === 0 && (
              <div className="border border-dashed border-gray-300 rounded-lg p-10 text-center text-gray-500">
                현재 등록된 채용 공고가 없습니다.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Ideal Candidate */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-black mb-4">이런 분을 찾습니다</h2>
            <p className="text-gray-600 text-lg">GIGA Interior가 원하는 인재상</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white text-2xl">🎨</span>
              </div>
              <h3 className="text-xl font-semibold text-black mb-4">창의적 사고</h3>
              <p className="text-gray-600">기존의 틀에 얽매이지 않고 새로운 아이디어를 제시할 수 있는 창의적 사고력</p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white text-2xl">🤝</span>
              </div>
              <h3 className="text-xl font-semibold text-black mb-4">소통 능력</h3>
              <p className="text-gray-600">클라이언트와 팀원들과의 원활한 소통을 통해 최상의 결과를 만들어내는 능력</p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white text-2xl">📈</span>
              </div>
              <h3 className="text-xl font-semibold text-black mb-4">성장 의지</h3>
              <p className="text-gray-600">지속적인 학습과 발전을 통해 개인과 회사가 함께 성장하고자 하는 의지</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-black mb-6">GIGA Interior와 함께 성장하세요</h2>
          <p className="text-gray-600 text-lg mb-8">
            당신의 재능과 열정으로 더 나은 공간을 만들어가는 여정에 동참해주세요
          </p>
          <Button asChild size="lg" className="bg-black text-white hover:bg-gray-800">
            <Link href="/recruit/apply">지금 지원하기</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
