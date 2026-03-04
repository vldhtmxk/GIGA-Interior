import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowUpRight } from "lucide-react";

const heroImage = "https://images.unsplash.com/photo-1672927936377-97d1be3976cd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBpbnRlcmlvciUyMGRlc2lnbiUyMGxpdmluZyUyMHJvb20lMjBtb2Rlcm58ZW58MXx8fHwxNzcyNTkxMTIzfDA&ixlib=rb-4.1.0&q=80&w=1080";
const kitchenImage = "https://images.unsplash.com/photo-1668026694348-b73c5eb5e299?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBraXRjaGVuJTIwaW50ZXJpb3IlMjBkZXNpZ258ZW58MXx8fHwxNzcyNTQ5NjkxfDA&ixlib=rb-4.1.0&q=80&w=1080";
const officeImage = "https://images.unsplash.com/photo-1703355685639-d558d1b0f63e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb250ZW1wb3JhcnklMjBvZmZpY2UlMjBpbnRlcmlvciUyMGRlc2lnbnxlbnwxfHx8fDE3NzI1NDk4MjF8MA&ixlib=rb-4.1.0&q=80&w=1080";
const lobbyImage = "https://images.unsplash.com/photo-1744782996368-dc5b7e697f4c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBob3RlbCUyMGxvYmJ5JTIwaW50ZXJpb3J8ZW58MXx8fHwxNzcyNTE4NTQyfDA&ixlib=rb-4.1.0&q=80&w=1080";
const restaurantImage = "https://images.unsplash.com/photo-1669131196140-49591336b13e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjByZXN0YXVyYW50JTIwaW50ZXJpb3IlMjBkZXNpZ258ZW58MXx8fHwxNzcyNTkxMTI1fDA&ixlib=rb-4.1.0&q=80&w=1080";
const bedroomImage = "https://images.unsplash.com/photo-1760072513393-b9d81f65dd7e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsaXN0JTIwaW50ZXJpb3IlMjBiZWRyb29tJTIwZWxlZ2FudHxlbnwxfHx8fDE3NzI1OTExMjR8MA&ixlib=rb-4.1.0&q=80&w=1080";
const bathroomImage = "https://images.unsplash.com/photo-1572742482459-e04d6cfdd6f3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBiYXRocm9vbSUyMGludGVyaW9yJTIwbWFyYmxlfGVufDF8fHx8MTc3MjQ4MDAxMnww&ixlib=rb-4.1.0&q=80&w=1080";

const allProjects = [
  { id: 1, title: "The Blanc Residence", category: "주거", year: "2025", location: "서울 성북구", area: "152㎡", image: heroImage },
  { id: 2, title: "Maison Kitchen", category: "주거", year: "2025", location: "서울 마포구", area: "89㎡", image: kitchenImage },
  { id: 3, title: "Opus Office HQ", category: "오피스", year: "2024", location: "서울 강남구", area: "430㎡", image: officeImage },
  { id: 4, title: "Grand Signature Hotel", category: "호텔", year: "2024", location: "제주 서귀포시", area: "1,200㎡", image: lobbyImage },
  { id: 5, title: "Atelier Restaurant", category: "상업", year: "2024", location: "서울 용산구", area: "215㎡", image: restaurantImage },
  { id: 6, title: "Mono Suite", category: "주거", year: "2023", location: "부산 해운대구", area: "178㎡", image: bedroomImage },
  { id: 7, title: "Marble House Bath", category: "주거", year: "2023", location: "서울 서초구", area: "62㎡", image: bathroomImage },
  { id: 8, title: "Neo Workspace", category: "오피스", year: "2023", location: "판교 테크노밸리", area: "320㎡", image: officeImage },
];

const categories = ["전체", "주거", "상업", "오피스", "호텔"];

export function PortfolioPage() {
  const [activeCategory, setActiveCategory] = useState("전체");
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  const filtered = activeCategory === "전체" ? allProjects : allProjects.filter(p => p.category === activeCategory);

  return (
    <div className="bg-[#0a0a0a] pt-24">
      {/* Header */}
      <section className="px-6 lg:px-16 max-w-[1400px] mx-auto py-20">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-[#c9a96e] text-[10px] tracking-[0.4em] uppercase mb-4"
        >
          Portfolio
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
          className="text-[clamp(3rem,7vw,7rem)] font-light text-white leading-none mb-12"
        >
          Our Work
        </motion.h1>

        {/* Filter */}
        <div className="flex gap-6 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`text-[10px] tracking-[0.2em] uppercase pb-1 border-b transition-all duration-300 ${
                activeCategory === cat
                  ? "text-[#c9a96e] border-[#c9a96e]"
                  : "text-white/30 border-transparent hover:text-white/60"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Grid */}
      <section className="px-6 lg:px-16 max-w-[1400px] mx-auto pb-24">
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence mode="popLayout">
            {filtered.map((project) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.4 }}
                onMouseEnter={() => setHoveredId(project.id)}
                onMouseLeave={() => setHoveredId(null)}
                className={`group relative overflow-hidden cursor-pointer ${project.id === 1 || project.id === 4 ? "md:col-span-2 lg:col-span-1" : ""}`}
              >
                <div className="relative h-72 lg:h-80 overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
                    style={{ transform: hoveredId === project.id ? "scale(1.08)" : "scale(1)" }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/80 via-[#0a0a0a]/10 to-transparent" />

                  {/* Hover overlay */}
                  <motion.div
                    animate={{ opacity: hoveredId === project.id ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0 bg-[#c9a96e]/10"
                  />

                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-[#c9a96e] text-[9px] tracking-[0.3em] uppercase mb-1">{project.category} · {project.year}</p>
                        <h3
                          style={{ fontFamily: "'Cormorant Garamond', serif" }}
                          className="text-white text-xl font-light"
                        >
                          {project.title}
                        </h3>
                      </div>
                      <motion.div
                        animate={{
                          opacity: hoveredId === project.id ? 1 : 0,
                          x: hoveredId === project.id ? 0 : 10
                        }}
                        className="w-8 h-8 bg-[#c9a96e] flex items-center justify-center flex-shrink-0 ml-4"
                      >
                        <ArrowUpRight size={14} className="text-[#0a0a0a]" />
                      </motion.div>
                    </div>
                  </div>
                </div>

                {/* Project info below image */}
                <div className="border border-t-0 border-white/5 p-4 flex justify-between text-[10px] text-white/30 tracking-wide">
                  <span>{project.location}</span>
                  <span>{project.area}</span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </section>
    </div>
  );
}
