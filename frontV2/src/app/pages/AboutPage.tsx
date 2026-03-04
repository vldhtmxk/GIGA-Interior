import { motion } from "motion/react";
import { Link } from "react-router";
import { ArrowRight } from "lucide-react";

const teamImage = "https://images.unsplash.com/photo-1671576193244-964fe85e1797?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbnRlcmlvciUyMGRlc2lnbiUyMHRlYW0lMjBhcmNoaXRlY3QlMjB3b3JraW5nfGVufDF8fHx8MTc3MjU5MTEyN3ww&ixlib=rb-4.1.0&q=80&w=1080";
const bathroomImage = "https://images.unsplash.com/photo-1572742482459-e04d6cfdd6f3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBiYXRocm9vbSUyMGludGVyaW9yJTIwbWFyYmxlfGVufDF8fHx8MTc3MjQ4MDAxMnww&ixlib=rb-4.1.0&q=80&w=1080";

const values = [
  { title: "Authenticity", desc: "클라이언트 고유의 개성과 라이프스타일을 반영한 진정성 있는 공간 디자인" },
  { title: "Craftsmanship", desc: "소재 선택부터 시공까지, 장인 정신으로 완성하는 세심한 디테일" },
  { title: "Innovation", desc: "전통적 아름다움과 현대적 감각을 융합한 혁신적 디자인 접근" },
  { title: "Sustainability", desc: "환경을 생각하는 친환경 소재와 에너지 효율적 설계 시스템" },
];

const timeline = [
  { year: "2013", event: "GIGA Interior 설립, 강남구 첫 번째 쇼룸 오픈" },
  { year: "2016", event: "상업공간 부문 확장, 호텔 인테리어 첫 수주" },
  { year: "2019", event: "대한인테리어대상 최우수상 수상" },
  { year: "2021", event: "부산·제주 지사 설립, 전국 서비스 확대" },
  { year: "2024", event: "누적 프로젝트 300건 달성, Asia Design Award 수상" },
  { year: "2026", event: "해외 진출 준비 — Singapore & Tokyo" },
];

const teamMembers = [
  { name: "김지훈", role: "Founder & Creative Director", image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80" },
  { name: "박소연", role: "Principal Designer", image: "https://images.unsplash.com/photo-1573496799652-408c2ac9fe98?w=400&q=80" },
  { name: "이준형", role: "Architecture Lead", image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&q=80" },
  { name: "최아름", role: "Project Manager", image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80" },
];

export function AboutPage() {
  return (
    <div className="bg-[#0a0a0a] pt-24">
      {/* Page Header */}
      <section className="px-6 lg:px-16 max-w-[1400px] mx-auto py-20">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-[#c9a96e] text-[10px] tracking-[0.4em] uppercase mb-4"
        >
          About Us
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
          className="text-[clamp(3rem,7vw,7rem)] font-light text-white leading-none mb-8"
        >
          We design
          <br />
          <em className="text-[#c9a96e] not-italic">experiences</em>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-white/40 text-base max-w-xl leading-relaxed"
        >
          2013년 설립 이래, GIGA Interior는 공간 디자인의 새로운 기준을 제시해왔습니다. 우리는 단순히 공간을 꾸미는 것이 아니라, 그 공간에서 살아갈 사람들의 일상과 감정을 설계합니다.
        </motion.p>
      </section>

      {/* Full width image */}
      <motion.div
        initial={{ opacity: 0, scale: 1.02 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
        className="px-6 lg:px-16 max-w-[1400px] mx-auto mb-24"
      >
        <img src={teamImage} alt="team" className="w-full h-[60vh] object-cover" />
      </motion.div>

      {/* Values */}
      <section className="px-6 lg:px-16 max-w-[1400px] mx-auto mb-24">
        <p className="text-[#c9a96e] text-[10px] tracking-[0.35em] uppercase mb-12">Our Values</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((v, i) => (
            <motion.div
              key={v.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              className="border-t border-white/10 pt-6"
            >
              <h3
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
                className="text-2xl font-light text-white mb-3"
              >
                {v.title}
              </h3>
              <p className="text-white/30 text-sm leading-relaxed">{v.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Split: image + timeline */}
      <section className="px-6 lg:px-16 max-w-[1400px] mx-auto mb-24 grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <img src={bathroomImage} alt="detail" className="w-full h-[600px] object-cover" />
        </motion.div>

        <div>
          <p className="text-[#c9a96e] text-[10px] tracking-[0.35em] uppercase mb-8">Our Journey</p>
          <div className="space-y-8">
            {timeline.map((item, i) => (
              <motion.div
                key={item.year}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.6 }}
                className="flex gap-8 group"
              >
                <span
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                  className="text-[#c9a96e] text-xl font-light flex-shrink-0 w-12"
                >
                  {item.year}
                </span>
                <div className="border-t border-white/10 pt-4 flex-1">
                  <p className="text-white/50 text-sm leading-relaxed group-hover:text-white/80 transition-colors">
                    {item.event}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="px-6 lg:px-16 max-w-[1400px] mx-auto mb-24">
        <p className="text-[#c9a96e] text-[10px] tracking-[0.35em] uppercase mb-4">The Team</p>
        <h2
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
          className="text-[clamp(2rem,4vw,3.5rem)] font-light text-white mb-16"
        >
          Meet Our Designers
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {teamMembers.map((member, i) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              className="group"
            >
              <div className="overflow-hidden mb-4 h-64 sm:h-80">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105"
                />
              </div>
              <h3 className="text-white text-base mb-1">{member.name}</h3>
              <p className="text-white/30 text-xs tracking-wide">{member.role}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 lg:px-16 max-w-[1400px] mx-auto pb-24">
        <div className="border border-white/10 p-12 lg:p-16 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div>
            <h2
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
              className="text-[clamp(1.8rem,3vw,3rem)] font-light text-white mb-2"
            >
              함께 일하고 싶으신가요?
            </h2>
            <p className="text-white/30 text-sm">채용 포지션을 확인해보세요.</p>
          </div>
          <Link
            to="/careers"
            className="flex items-center gap-3 border border-[#c9a96e]/40 text-[#c9a96e] px-8 py-4 text-[11px] tracking-[0.2em] uppercase hover:bg-[#c9a96e] hover:text-[#0a0a0a] transition-all duration-300 group flex-shrink-0"
          >
            채용 공고 보기
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>
    </div>
  );
}
