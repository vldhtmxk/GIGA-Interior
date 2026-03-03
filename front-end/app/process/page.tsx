import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"

export default function ProcessPage() {
  return (
    <main className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative w-full h-[50vh] flex items-center justify-center overflow-hidden">
        <Image
          src="/menu-hero/process.svg"
          alt="Our Process"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 container mx-auto px-4 text-center text-white">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">디자인 프로세스</h1>
          <p className="text-xl max-w-2xl mx-auto">아이디어에서 완성까지, 우리의 체계적인 디자인 과정을 소개합니다</p>
        </div>
      </section>

      {/* Process Overview */}
      <section className="py-20 container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-3xl font-bold mb-6">우리의 접근 방식</h2>
          <p className="text-xl text-muted-foreground">
            우리는 각 프로젝트를 고객과의 긴밀한 협업을 통해 진행합니다. 초기 컨셉부터 최종 완성까지, 모든 단계에서
            고객의 니즈를 최우선으로 고려합니다.
          </p>
        </div>

        <div className="space-y-24 max-w-4xl mx-auto">
          {processSteps.map((step, index) => (
            <div
              key={index}
              className={`flex flex-col ${index % 2 === 1 ? "md:flex-row-reverse" : "md:flex-row"} gap-8 items-center`}
            >
              <div className="md:w-1/2">
                <div className="relative h-80 w-full overflow-hidden rounded-lg">
                  <Image src={step.image || "/placeholder.svg"} alt={step.title} fill className="object-cover" />
                </div>
              </div>
              <div className="md:w-1/2">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center font-bold mr-4">
                    {index + 1}
                  </div>
                  <h3 className="text-2xl font-bold">{step.title}</h3>
                </div>
                <p className="text-muted-foreground mb-6">{step.description}</p>
                <ul className="space-y-2">
                  {step.details.map((detail, idx) => (
                    <li key={idx} className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-black mr-2 flex-shrink-0 mt-0.5" />
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-3xl font-bold mb-6">프로젝트 타임라인</h2>
            <p className="text-xl text-muted-foreground">
              일반적인 프로젝트의 진행 일정입니다. 프로젝트의 규모와 복잡성에 따라 달라질 수 있습니다.
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="relative border-l-2 border-black pl-8 pb-8 ml-4">
              {timeline.map((item, index) => (
                <div key={index} className="mb-12 relative">
                  <div className="absolute w-4 h-4 bg-black rounded-full -left-[2.5rem] top-1.5"></div>
                  <div className="font-bold text-lg mb-1">{item.phase}</div>
                  <div className="text-sm text-muted-foreground mb-2">{item.duration}</div>
                  <p>{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">자주 묻는 질문</h2>

          <div className="space-y-8">
            {faqs.map((faq, index) => (
              <div key={index} className="border-b pb-8">
                <h3 className="text-xl font-semibold mb-4">{faq.question}</h3>
                <p className="text-muted-foreground">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-black text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">프로젝트를 시작할 준비가 되셨나요?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            지금 문의하시고 무료 상담을 통해 당신의 공간에 맞는 디자인 솔루션을 알아보세요.
          </p>
          <Button asChild className="bg-white text-black hover:bg-white/90">
            <Link href="/contact">무료 상담 예약하기</Link>
          </Button>
        </div>
      </section>
    </main>
  )
}

// Sample data
const processSteps = [
  {
    title: "초기 상담 및 요구사항 분석",
    description: "고객의 니즈와 예산, 타임라인을 파악하고 프로젝트의 범위를 정의합니다.",
    image: "/placeholder.svg?height=800&width=600&query=interior designer consulting with client",
    details: [
      "고객의 라이프스타일과 선호도 파악",
      "공간 사용 목적과 요구사항 분석",
      "예산 및 일정 협의",
      "현장 방문 및 실측",
    ],
  },
  {
    title: "컨셉 개발 및 디자인 제안",
    description: "수집된 정보를 바탕으로 공간에 맞는 디자인 컨셉을 개발하고 제안합니다.",
    image: "/placeholder.svg?height=800&width=600&query=interior design concept sketches and mood boards",
    details: [
      "디자인 컨셉 및 무드보드 개발",
      "공간 레이아웃 및 평면도 작성",
      "재료 및 색상 팔레트 제안",
      "3D 렌더링 및 시각화 자료 제작",
    ],
  },
  {
    title: "디자인 확정 및 상세 계획",
    description: "고객의 피드백을 반영하여 디자인을 확정하고 상세 계획을 수립합니다.",
    image: "/placeholder.svg?height=800&width=600&query=detailed interior design plans and blueprints",
    details: [
      "최종 디자인 확정 및 계약 체결",
      "상세 도면 및 시공 계획 작성",
      "재료 및 가구 선정 확정",
      "예산 및 일정 최종 조율",
    ],
  },
  {
    title: "시공 및 프로젝트 관리",
    description: "확정된 디자인에 따라 시공을 진행하고 전체 프로세스를 관리합니다.",
    image: "/placeholder.svg?height=800&width=600&query=interior construction in progress with workers",
    details: [
      "시공업체 선정 및 협업",
      "자재 발주 및 납품 일정 관리",
      "현장 감독 및 품질 관리",
      "진행 상황 정기 보고 및 이슈 해결",
    ],
  },
  {
    title: "스타일링 및 완공",
    description: "마무리 작업과 스타일링을 통해 공간에 생명력을 불어넣고 프로젝트를 완성합니다.",
    image: "/placeholder.svg?height=800&width=600&query=final styled interior space with accessories and furniture",
    details: [
      "가구 및 조명 설치",
      "액세서리 및 소품 스타일링",
      "최종 점검 및 하자 보수",
      "완공 사진 촬영 및 프로젝트 마무리",
    ],
  },
]

const timeline = [
  {
    phase: "초기 상담 및 요구사항 분석",
    duration: "1-2주",
    description: "고객과의 미팅, 현장 방문, 요구사항 파악 및 프로젝트 범위 정의",
  },
  {
    phase: "컨셉 개발 및 디자인 제안",
    duration: "2-3주",
    description: "디자인 컨셉 개발, 무드보드 및 초기 시각화 자료 제작, 고객 프레젠테이션",
  },
  {
    phase: "디자인 확정 및 상세 계획",
    duration: "2-4주",
    description: "피드백 반영 및 디자인 수정, 최종 디자인 확정, 상세 도면 및 시공 계획 작성",
  },
  {
    phase: "시공 준비 및 자재 발주",
    duration: "2-3주",
    description: "시공업체 선정, 자재 및 가구 발주, 시공 일정 수립",
  },
  {
    phase: "시공 및 프로젝트 관리",
    duration: "4-12주",
    description: "실제 시공 진행, 현장 감독 및 품질 관리, 이슈 해결 및 진행 상황 보고",
  },
  {
    phase: "스타일링 및 완공",
    duration: "1-2주",
    description: "가구 및 조명 설치, 액세서리 스타일링, 최종 점검 및 고객 인도",
  },
]

const faqs = [
  {
    question: "프로젝트 비용은 어떻게 책정되나요?",
    answer:
      "프로젝트 비용은 공간의 크기, 디자인 복잡성, 재료 선택, 가구 및 액세서리 등 여러 요소에 따라 달라집니다. 초기 상담 후 상세한 견적을 제공해 드립니다.",
  },
  {
    question: "프로젝트 완료까지 얼마나 걸리나요?",
    answer:
      "프로젝트 기간은 규모와 복잡성에 따라 다르지만, 일반적으로 소규모 프로젝트는 2-3개월, 대규모 프로젝트는 4-6개월 정도 소요됩니다.",
  },
  {
    question: "디자인 과정에서 고객의 참여는 어느 정도인가요?",
    answer:
      "우리는 고객과의 협업을 중요시합니다. 주요 결정 사항에 대해 고객의 의견을 구하며, 정기적인 업데이트와 피드백 세션을 통해 프로젝트를 진행합니다.",
  },
  {
    question: "기존 가구나 소품을 활용할 수 있나요?",
    answer:
      "네, 가능합니다. 기존 가구나 소품 중 디자인 컨셉에 맞는 것들은 새로운 디자인에 통합할 수 있습니다. 초기 상담 시 보존하고 싶은 아이템에 대해 알려주세요.",
  },
  {
    question: "지방이나 해외 프로젝트도 진행하나요?",
    answer:
      "네, 전국 및 일부 해외 지역에서도 프로젝트를 진행하고 있습니다. 거리에 따라 추가 비용이 발생할 수 있으며, 자세한 사항은 문의해 주세요.",
  },
]
