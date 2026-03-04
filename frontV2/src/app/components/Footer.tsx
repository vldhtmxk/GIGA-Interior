import { Link } from "react-router";
import { Instagram, Youtube, MessageCircle } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#060606] border-t border-white/5 py-16 px-6 lg:px-12">
      <div className="max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-2">
            <div className="mb-6">
              <span
                style={{ fontFamily: "'Cormorant Garamond', serif", letterSpacing: "0.15em" }}
                className="text-white text-3xl font-light"
              >
                GIGA
              </span>
              <span
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                className="text-[#c9a96e] text-xs tracking-[0.3em] uppercase ml-2"
              >
                INTERIOR
              </span>
            </div>
            <p className="text-white/40 text-sm leading-relaxed max-w-xs">
              공간이 삶을 바꿉니다. GIGA Interior는 당신의 공간에 새로운 감각과 가치를 불어넣습니다.
            </p>
            <div className="flex gap-4 mt-6">
              <a href="#" className="w-9 h-9 border border-white/10 flex items-center justify-center text-white/40 hover:text-[#c9a96e] hover:border-[#c9a96e]/40 transition-all duration-300">
                <Instagram size={15} />
              </a>
              <a href="#" className="w-9 h-9 border border-white/10 flex items-center justify-center text-white/40 hover:text-[#c9a96e] hover:border-[#c9a96e]/40 transition-all duration-300">
                <Youtube size={15} />
              </a>
              <a href="#" className="w-9 h-9 border border-white/10 flex items-center justify-center text-white/40 hover:text-[#c9a96e] hover:border-[#c9a96e]/40 transition-all duration-300">
                <MessageCircle size={15} />
              </a>
            </div>
          </div>
          <div>
            <p className="text-[10px] tracking-[0.25em] uppercase text-[#c9a96e] mb-5">Menu</p>
            <ul className="space-y-3">
              {[["Home", "/"], ["About", "/about"], ["Portfolio", "/portfolio"], ["Careers", "/careers"], ["Contact", "/contact"]].map(([label, path]) => (
                <li key={path}>
                  <Link to={path} className="text-white/40 text-sm hover:text-white/80 transition-colors duration-200">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-[10px] tracking-[0.25em] uppercase text-[#c9a96e] mb-5">Contact</p>
            <ul className="space-y-3 text-white/40 text-sm">
              <li>서울특별시 강남구 테헤란로 123</li>
              <li>02-1234-5678</li>
              <li>hello@giga-interior.kr</li>
              <li>평일 09:00 – 18:00</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-white/20 text-xs tracking-widest">© 2026 GIGA Interior. All rights reserved.</p>
          <p className="text-white/20 text-xs tracking-widest">Designed with passion in Seoul</p>
        </div>
      </div>
    </footer>
  );
}
