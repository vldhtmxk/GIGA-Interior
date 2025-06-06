import Image from "next/image"

export default function BrandStoryPage() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center">
        <div className="absolute inset-0">
          <Image
            src="/placeholder.svg?height=1080&width=1920"
            alt="Brand Story Background"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50" />
        </div>

        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
          <h1 className="text-5xl md:text-7xl font-bold mb-8">BRAND STORY</h1>
          <p className="text-2xl md:text-3xl font-light">공간에 담긴 철학과 감성</p>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold text-black mb-8">
                공간은 단순한 장소가 아닌
                <br />
                삶의 이야기가 시작되는 곳
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                GIGA Interior는 단순히 아름다운 공간을 만드는 것을 넘어서, 그 안에서 펼쳐질 삶의 이야기를 상상하며
                디자인합니다.
              </p>
              <p className="text-gray-600 text-lg leading-relaxed">
                모든 공간에는 고유한 정체성과 목적이 있습니다. 우리는 그 본질을 발견하고, 현대적 감각으로 재해석하여
                시간이 흘러도 변하지 않는 가치를 창조합니다.
              </p>
            </div>
            <div className="relative">
              <Image
                src="/placeholder.svg?height=600&width=800"
                alt="Philosophy"
                width={800}
                height={600}
                className="rounded-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-black mb-4">핵심 가치</h2>
            <p className="text-gray-600 text-lg">GIGA Interior가 추구하는 디자인 철학</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-20 h-20 bg-black rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white text-2xl font-bold">01</span>
              </div>
              <h3 className="text-2xl font-bold text-black mb-4">TIMELESS</h3>
              <p className="text-gray-600 leading-relaxed">
                유행을 따르지 않고 시간이 흘러도 변하지 않는 본질적 아름다움을 추구합니다
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-black rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white text-2xl font-bold">02</span>
              </div>
              <h3 className="text-2xl font-bold text-black mb-4">FUNCTIONAL</h3>
              <p className="text-gray-600 leading-relaxed">
                아름다움과 기능성의 완벽한 조화를 통해 실용적이면서도 감각적인 공간을 완성합니다
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-black rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white text-2xl font-bold">03</span>
              </div>
              <h3 className="text-2xl font-bold text-black mb-4">AUTHENTIC</h3>
              <p className="text-gray-600 leading-relaxed">
                클라이언트의 진정한 니즈를 파악하여 그들만의 고유한 정체성을 공간에 담아냅니다
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-black mb-8">우리의 비전</h2>
          <p className="text-2xl text-gray-700 leading-relaxed mb-8">
            "공간을 통해 사람들의 삶을 더욱 풍요롭게 만드는 것"
          </p>
          <p className="text-lg text-gray-600 leading-relaxed">
            GIGA Interior는 단순한 인테리어 회사를 넘어서, 공간이 가진 무한한 가능성을 탐구하고 실현하는 크리에이티브
            파트너가 되고자 합니다. 우리가 만드는 모든 공간이 그 안에서 생활하고 일하는 사람들에게 영감과 행복을 선사할
            수 있기를 바랍니다.
          </p>
        </div>
      </section>
    </div>
  )
}
