import { useRef, useEffect, useState } from "react";
import { Link } from "react-router";
import { motion, useScroll, useTransform } from "motion/react";
import { ArrowRight, ArrowUpRight, ChevronDown } from "lucide-react";

const heroImage = "https://images.unsplash.com/photo-1672927936377-97d1be3976cd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBpbnRlcmlvciUyMGRlc2lnbiUyMGxpdmluZyUyMHJvb20lMjBtb2Rlcm58ZW58MXx8fHwxNzcyNTkxMTIzfDA&ixlib=rb-4.1.0&q=80&w=1080";
const kitchenImage = "https://images.unsplash.com/photo-1668026694348-b73c5eb5e299?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBraXRjaGVuJTIwaW50ZXJpb3IlMjBkZXNpZ258ZW58MXx8fHwxNzcyNTQ5NjkxfDA&ixlib=rb-4.1.0&q=80&w=1080";
const officeImage = "https://images.unsplash.com/photo-1703355685639-d558d1b0f63e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb250ZW1wb3JhcnklMjBvZmZpY2UlMjBpbnRlcmlvciUyMGRlc2lnbnxlbnwxfHx8fDE3NzI1NDk4MjF8MA&ixlib=rb-4.1.0&q=80&w=1080";
const lobbyImage = "https://images.unsplash.com/photo-1744782996368-dc5b7e697f4c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBob3RlbCUyMGxvYmJ5JTIwaW50ZXJpb3J8ZW58MXx8fHwxNzcyNTE4NTQyfDA&ixlib=rb-4.1.0&q=80&w=1080";
const restaurantImage = "https://images.unsplash.com/photo-1669131196140-49591336b13e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjByZXN0YXVyYW50JTIwaW50ZXJpb3IlMjBkZXNpZ258ZW58MXx8fHwxNzcyNTkxMTI1fDA&ixlib=rb-4.1.0&q=80&w=1080";
const bedroomImage = "https://images.unsplash.com/photo-1760072513393-b9d81f65dd7e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsaXN0JTIwaW50ZXJpb3IlMjBiZWRyb29tJTIwZWxlZ2FudHxlbnwxfHx8fDE3NzI1OTExMjR8MA&ixlib=rb-4.1.0&q=80&w=1080";

const stats = [
  { value: "12+", label: "Years of Experience" },
  { value: "340+", label: "Projects Completed" },
  { value: "98%", label: "Client Satisfaction" },
  { value: "25", label: "Design Awards" },
];

const services = [
  { no: "01", title: "주거 인테리어", desc: "아파트, 빌라, 단독주택 등 삶의 공간을 감각적으로 재해석합니다." },
  { no: "02", title: "상업 인테리어", desc: "카페, 레스토랑, 리테일 등 브랜드 아이덴티티를 공간으로 표현합니다." },
  { no: "03", title: "오피스 인테리어", desc: "업무 효율과 감성을 동시에 만족시키는 워크스페이스를 설계합니다." },
  { no: "04", title: "호텔·숙박 인테리어", desc: "투숙객에게 특별한 경험을 선사하는 럭셔리 공간을 완성합니다." },
];

const projects = [
  { id: 1, title: "The Blanc Residence", category: "주거", year: "2025", image: heroImage },
  { id: 2, title: "Maison Kitchen", category: "주거", year: "2025", image: kitchenImage },
  { id: 3, title: "Opus Office", category: "오피스", year: "2024", image: officeImage },
  { id: 4, title: "Grand Lobby", category: "호텔", year: "2024", image: lobbyImage },
];

function CountUp({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          let start = 0;
          const duration = 1500;
          const step = Math.ceil(target / (duration / 16));
          const timer = setInterval(() => {
            start += step;
            if (start >= target) {
              setCount(target);
              clearInterval(timer);
            } else {
              setCount(start);
            }
          }, 16);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return <div ref={ref}>{count}{suffix}</div>;
}

export function HomePage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <div className="bg-[#0a0a0a]">
      {/* ── HERO ── */}
      <section ref={heroRef} className="relative h-screen overflow-hidden">
        <motion.div style={{ y: heroY }} className="absolute inset-0">
          <img src={heroImage} alt="hero" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/60 via-[#0a0a0a]/20 to-[#0a0a0a]" />
        </motion.div>

        <motion.div
          style={{ opacity: heroOpacity }}
          className="relative h-full flex flex-col justify-end pb-24 px-6 lg:px-16 max-w-[1400px] mx-auto"
        >
          {/* eyebrow */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-[#c9a96e] text-[10px] tracking-[0.4em] uppercase mb-6"
          >
            Seoul — Est. 2013
          </motion.p>

          {/* headline */}
          <div className="overflow-hidden mb-8">
            <motion.h1
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
              style={{ fontFamily: "'Cormorant Garamond', serif", lineHeight: 0.9 }}
              className="text-[clamp(3.5rem,9vw,9rem)] font-light text-white tracking-tight"
            >
              Space that
              <br />
              <em className="text-[#c9a96e] not-italic">tells your</em>
              <br />
              story.
            </motion.h1>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.7 }}
            >
              <Link
                to="/portfolio"
                className="flex items-center gap-3 bg-[#c9a96e] text-[#0a0a0a] px-8 py-4 text-[11px] tracking-[0.2em] uppercase hover:bg-white transition-all duration-300 group"
              >
                포트폴리오 보기
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.7 }}
            >
              <Link
                to="/contact"
                className="text-white/60 text-[11px] tracking-[0.2em] uppercase hover:text-white transition-colors duration-300 flex items-center gap-2"
              >
                무료 상담 신청 <ArrowUpRight size={14} />
              </Link>
            </motion.div>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 right-8 flex flex-col items-center gap-2 text-white/30"
        >
          <span className="text-[9px] tracking-[0.3em] uppercase rotate-90 mb-4">Scroll</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            <ChevronDown size={16} />
          </motion.div>
        </motion.div>
      </section>

      {/* ── MARQUEE TICKER ── */}
      <div className="border-y border-white/5 py-4 overflow-hidden bg-[#0d0d0d]">
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
          className="flex gap-0 whitespace-nowrap"
        >
          {[...Array(2)].map((_, i) => (
            <span key={i} className="flex items-center">
              {["Interior Design", "Space Planning", "Luxury Living", "Commercial Design", "Hotel Interior", "Office Design"].map((item) => (
                <span key={item} className="flex items-center">
                  <span className="text-[10px] tracking-[0.25em] uppercase text-white/30 px-8">{item}</span>
                  <span className="text-[#c9a96e]/30 text-xs">✦</span>
                </span>
              ))}
            </span>
          ))}
        </motion.div>
      </div>

      {/* ── FEATURED PROJECTS ── */}
      <section className="py-24 px-6 lg:px-16 max-w-[1400px] mx-auto">
        <div className="flex items-end justify-between mb-16">
          <div>
            <p className="text-[#c9a96e] text-[10px] tracking-[0.35em] uppercase mb-3">Featured Work</p>
            <h2
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
              className="text-[clamp(2rem,5vw,4rem)] font-light text-white"
            >
              Selected Projects
            </h2>
          </div>
          <Link
            to="/portfolio"
            className="hidden sm:flex items-center gap-2 text-white/40 text-[11px] tracking-[0.2em] uppercase hover:text-[#c9a96e] transition-colors"
          >
            View All <ArrowRight size={12} />
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.slice(0, 2).map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} large />
          ))}
          {projects.slice(2).map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i + 2} />
          ))}
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="border-y border-white/5 py-20 px-6">
        <div className="max-w-[1400px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <div
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
                className="text-[clamp(2.5rem,5vw,4.5rem)] font-light text-[#c9a96e] leading-none mb-3"
              >
                {stat.value}
              </div>
              <p className="text-white/30 text-[10px] tracking-[0.2em] uppercase">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── SERVICES ── */}
      <section className="py-24 px-6 lg:px-16 max-w-[1400px] mx-auto">
        <div className="mb-16">
          <p className="text-[#c9a96e] text-[10px] tracking-[0.35em] uppercase mb-3">What We Do</p>
          <h2
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
            className="text-[clamp(2rem,5vw,4rem)] font-light text-white"
          >
            Our Services
          </h2>
        </div>
        <div className="divide-y divide-white/5">
          {services.map((service, i) => (
            <motion.div
              key={service.no}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              className="flex flex-col sm:flex-row sm:items-center gap-4 py-8 group cursor-pointer"
            >
              <span className="text-[#c9a96e]/40 text-xs tracking-widest w-10">{service.no}</span>
              <h3
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
                className="text-2xl sm:text-3xl font-light text-white/80 group-hover:text-white transition-colors sm:w-72 flex-shrink-0"
              >
                {service.title}
              </h3>
              <p className="text-white/30 text-sm leading-relaxed sm:pl-8 flex-1">{service.desc}</p>
              <ArrowUpRight
                size={18}
                className="text-white/0 group-hover:text-[#c9a96e] transition-all duration-300 flex-shrink-0"
              />
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── SPLIT VISUAL SECTION ── */}
      <section className="py-8 px-6 lg:px-16 max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="absolute -top-4 -left-4 w-24 h-24 border border-[#c9a96e]/20 z-0" />
            <img
              src={restaurantImage}
              alt="restaurant"
              className="relative z-10 w-full h-[500px] object-cover"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:pl-12"
          >
            <p className="text-[#c9a96e] text-[10px] tracking-[0.35em] uppercase mb-5">Our Philosophy</p>
            <h2
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
              className="text-[clamp(2rem,4vw,3.5rem)] font-light text-white leading-tight mb-8"
            >
              공간은 단순한
              <br />
              <em className="text-[#c9a96e] not-italic">장식이 아닙니다</em>
            </h2>
            <p className="text-white/40 text-sm leading-relaxed mb-6">
              GIGA Interior는 공간을 삶의 방식으로 이해합니다. 우리는 트렌드를 따르는 것이 아니라, 당신의 이야기를 공간에 담아냅니다. 소재, 빛, 비율, 질감 — 모든 요소가 조화를 이룰 때 비로소 공간은 완성됩니다.
            </p>
            <p className="text-white/40 text-sm leading-relaxed mb-10">
              창립 이후 300개 이상의 프로젝트를 통해 우리는 단 하나의 원칙을 지켜왔습니다. 클라이언트의 라이프스타일을 먼저 이해하고, 그에 맞는 최적의 공간을 설계한다는 것.
            </p>
            <Link
              to="/about"
              className="inline-flex items-center gap-3 text-[#c9a96e] text-[11px] tracking-[0.2em] uppercase group"
            >
              <span className="h-px w-8 bg-[#c9a96e] group-hover:w-16 transition-all duration-300" />
              회사 소개 보기
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="py-24 px-6 lg:px-16 max-w-[1400px] mx-auto mt-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative overflow-hidden border border-white/10 p-12 lg:p-20 text-center"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[#c9a96e]/5 to-transparent" />
          <p className="text-[#c9a96e] text-[10px] tracking-[0.4em] uppercase mb-4 relative z-10">Start Your Project</p>
          <h2
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
            className="text-[clamp(2rem,5vw,4rem)] font-light text-white mb-8 relative z-10"
          >
            당신의 공간을 함께
            <br />만들어 보실래요?
          </h2>
          <Link
            to="/contact"
            className="relative z-10 inline-flex items-center gap-3 bg-[#c9a96e] text-[#0a0a0a] px-10 py-4 text-[11px] tracking-[0.25em] uppercase hover:bg-white transition-all duration-300 group"
          >
            무료 상담 신청하기
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </section>
    </div>
  );
}

function ProjectCard({ project, index, large }: { project: { id: number; title: string; category: string; year: string; image: string }; index: number; large?: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.7 }}
      className="group relative overflow-hidden cursor-pointer"
    >
      <div className={`relative overflow-hidden ${large ? "h-[400px] lg:h-[500px]" : "h-[300px]"}`}>
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/80 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 p-6">
          <p className="text-[#c9a96e] text-[9px] tracking-[0.3em] uppercase mb-2">{project.category} · {project.year}</p>
          <h3
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
            className="text-white text-2xl font-light"
          >
            {project.title}
          </h3>
        </div>
        <div className="absolute top-4 right-4 w-8 h-8 bg-[#c9a96e] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0">
          <ArrowUpRight size={14} className="text-[#0a0a0a]" />
        </div>
      </div>
    </motion.div>
  );
}
