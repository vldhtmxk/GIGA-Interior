import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plus, Minus, ArrowUpRight } from "lucide-react";

const benefits = [
  { icon: "🎨", title: "창작 자율성", desc: "디자이너의 개성과 창의성을 최대한 존중하는 자율적 업무 환경" },
  { icon: "📚", title: "교육 지원", desc: "해외 세미나, 트렌드 리서치, 자격증 취득 비용 전액 지원" },
  { icon: "🌍", title: "해외 견학", desc: "연 1회 해외 인테리어 트렌드 투어 (밀라노, 도쿄, 파리)" },
  { icon: "⏱️", title: "유연 근무", desc: "코어타임 기반 유연근무제, 재택근무 병행 가능" },
  { icon: "💰", title: "성과 보상", desc: "프로젝트 성과에 따른 인센티브 및 이익공유제 운영" },
  { icon: "🏥", title: "건강 관리", desc: "종합건강검진, 심리상담 프로그램, 피트니스 비용 지원" },
];

const positions = [
  {
    id: 1,
    title: "Senior Interior Designer",
    department: "Design",
    type: "정규직",
    location: "서울 강남 본사",
    desc: "5년 이상의 주거/상업 인테리어 경험을 가진 시니어 디자이너를 모십니다. 클라이언트와의 직접 소통 및 프로젝트 리드 역할을 담당하게 됩니다.",
    requirements: ["인테리어 관련 학위", "5년 이상 실무 경험", "AutoCAD, SketchUp, 3ds Max 능숙", "영어 의사소통 가능자 우대"],
  },
  {
    id: 2,
    title: "Junior Space Planner",
    department: "Design",
    type: "정규직",
    location: "서울 강남 본사",
    desc: "2-3년 경력의 공간 기획자를 모집합니다. 다양한 스케일의 프로젝트에서 시니어 디자이너와 함께 작업하며 성장할 수 있는 기회입니다.",
    requirements: ["인테리어/건축 관련 학과", "2년 이상 실무 경험", "CAD 기본 사용 가능", "포트폴리오 필수 제출"],
  },
  {
    id: 3,
    title: "Project Manager",
    department: "Operations",
    type: "정규직",
    location: "서울 강남 본사",
    desc: "인테리어 프로젝트의 전반적인 진행을 관리하는 PM을 모집합니다. 시공사, 협력업체와의 협력 및 일정/예산 관리를 담당합니다.",
    requirements: ["건설/인테리어 업계 경험 3년 이상", "MS Project 또는 유사 툴 사용 경험", "커뮤니케이션 능력 우수자", "PMP 자격증 우대"],
  },
  {
    id: 4,
    title: "3D Visualization Artist",
    department: "Design",
    type: "정규직·계약직",
    location: "서울 강남 본사 / 재택 가능",
    desc: "포트폴리오 및 클라이언트 프레젠테이션용 고퀄리티 3D 렌더링을 제작하는 아티스트를 모집합니다.",
    requirements: ["3ds Max, V-Ray 또는 Corona 능숙", "Lumion, Enscape 사용 가능자 우대", "포트폴리오 필수", "건축/인테리어 이해도 보유자"],
  },
  {
    id: 5,
    title: "Brand & Marketing Manager",
    department: "Marketing",
    type: "정규직",
    location: "서울 강남 본사",
    desc: "GIGA Interior의 브랜드 아이덴티티와 온/오프라인 마케팅 전략을 기획·실행하는 마케터를 찾습니다.",
    requirements: ["마케팅/광고/브랜드 전공 또는 5년 이상 경력", "SNS 채널 운영 경험", "사진/영상 콘텐츠 제작 능력 우대", "인테리어/라이프스타일 분야 관심자 우대"],
  },
];

function PositionCard({ position }: { position: typeof positions[0] }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      layout
      className="border border-white/10 overflow-hidden hover:border-[#c9a96e]/30 transition-colors duration-300"
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full p-6 lg:p-8 flex items-center justify-between text-left"
      >
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 flex-1 mr-4">
          <h3 style={{ fontFamily: "'Cormorant Garamond', serif" }} className="text-xl text-white">
            {position.title}
          </h3>
          <div className="flex gap-3 flex-wrap">
            <span className="text-[9px] tracking-[0.2em] uppercase text-[#c9a96e] border border-[#c9a96e]/30 px-2 py-1">
              {position.department}
            </span>
            <span className="text-[9px] tracking-[0.2em] uppercase text-white/40 border border-white/10 px-2 py-1">
              {position.type}
            </span>
            <span className="text-[9px] tracking-[0.2em] uppercase text-white/40 border border-white/10 px-2 py-1">
              {position.location}
            </span>
          </div>
        </div>
        <div className="text-white/40 flex-shrink-0">
          {open ? <Minus size={16} /> : <Plus size={16} />}
        </div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-6 lg:px-8 pb-8 border-t border-white/5 pt-6">
              <p className="text-white/50 text-sm leading-relaxed mb-6">{position.desc}</p>
              <p className="text-[10px] tracking-[0.2em] uppercase text-[#c9a96e] mb-4">자격 요건</p>
              <ul className="space-y-2 mb-8">
                {position.requirements.map((req, i) => (
                  <li key={i} className="text-white/40 text-sm flex items-start gap-3">
                    <span className="text-[#c9a96e] mt-1 flex-shrink-0">—</span>
                    {req}
                  </li>
                ))}
              </ul>
              <button className="flex items-center gap-3 bg-[#c9a96e] text-[#0a0a0a] px-6 py-3 text-[10px] tracking-[0.2em] uppercase hover:bg-white transition-colors duration-300 group">
                지원하기
                <ArrowUpRight size={12} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function CareersPage() {
  return (
    <div className="bg-[#0a0a0a] pt-24">
      {/* Header */}
      <section className="px-6 lg:px-16 max-w-[1400px] mx-auto py-20">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-[#c9a96e] text-[10px] tracking-[0.4em] uppercase mb-4"
        >
          Careers
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
          className="text-[clamp(3rem,7vw,7rem)] font-light text-white leading-none mb-8"
        >
          Join our
          <br />
          <em className="text-[#c9a96e] not-italic">creative team</em>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-white/40 text-base max-w-lg leading-relaxed"
        >
          우리는 공간에 대한 열정을 가진 사람들과 함께 성장합니다. 당신의 창의성이 GIGA Interior를 더욱 빛나게 할 수 있습니다.
        </motion.p>
      </section>

      {/* Benefits */}
      <section className="px-6 lg:px-16 max-w-[1400px] mx-auto mb-24">
        <p className="text-[#c9a96e] text-[10px] tracking-[0.35em] uppercase mb-12">Why GIGA</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((benefit, i) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.6 }}
              className="border border-white/5 p-8 hover:border-[#c9a96e]/20 transition-colors duration-300"
            >
              <span className="text-3xl mb-6 block">{benefit.icon}</span>
              <h3 className="text-white text-base mb-2">{benefit.title}</h3>
              <p className="text-white/30 text-sm leading-relaxed">{benefit.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Positions */}
      <section className="px-6 lg:px-16 max-w-[1400px] mx-auto mb-24">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-[#c9a96e] text-[10px] tracking-[0.35em] uppercase mb-3">Open Positions</p>
            <h2
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
              className="text-[clamp(2rem,4vw,3rem)] font-light text-white"
            >
              현재 모집 중인 포지션
            </h2>
          </div>
          <span className="text-white/20 text-sm hidden sm:block">{positions.length} positions open</span>
        </div>

        <div className="space-y-3">
          {positions.map((position, i) => (
            <motion.div
              key={position.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07, duration: 0.5 }}
            >
              <PositionCard position={position} />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Open Application */}
      <section className="px-6 lg:px-16 max-w-[1400px] mx-auto pb-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-[#c9a96e]/5 border border-[#c9a96e]/20 p-12 lg:p-16 text-center"
        >
          <p className="text-[#c9a96e] text-[10px] tracking-[0.35em] uppercase mb-4">Open Application</p>
          <h2
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
            className="text-[clamp(1.8rem,3vw,3rem)] font-light text-white mb-4"
          >
            원하는 포지션이 없으신가요?
          </h2>
          <p className="text-white/40 text-sm mb-8 max-w-md mx-auto">
            포지션과 무관하게 우수한 인재라면 언제나 환영합니다. 자유 양식으로 포트폴리오와 함께 보내주세요.
          </p>
          <a
            href="mailto:careers@giga-interior.kr"
            className="inline-flex items-center gap-3 border border-[#c9a96e]/40 text-[#c9a96e] px-8 py-4 text-[11px] tracking-[0.2em] uppercase hover:bg-[#c9a96e] hover:text-[#0a0a0a] transition-all duration-300"
          >
            careers@giga-interior.kr
          </a>
        </motion.div>
      </section>
    </div>
  );
}
