import Link from "next/link"
import { Instagram, MessageCircle, Youtube } from "lucide-react"

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-[#060606] px-6 py-16 text-white lg:px-12">
      <div className="mx-auto max-w-[1400px]">
        <div className="mb-16 grid grid-cols-1 gap-12 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="mb-6 flex items-end gap-2">
              <span className="giga-display text-3xl font-light tracking-[0.16em]">GIGA</span>
              <span className="text-xs uppercase tracking-[0.3em] text-[#c9a96e]">INTERIOR</span>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-white/40">
              공간이 삶을 바꿉니다. GIGA Interior는 당신의 공간에 새로운 감각과 가치를 불어넣습니다.
            </p>
            <div className="mt-6 flex gap-4">
              <Link
                href="#"
                className="flex h-9 w-9 items-center justify-center border border-white/10 text-white/40 transition-all duration-300 hover:border-[#c9a96e]/40 hover:text-[#c9a96e]"
              >
                <Instagram size={15} />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link
                href="#"
                className="flex h-9 w-9 items-center justify-center border border-white/10 text-white/40 transition-all duration-300 hover:border-[#c9a96e]/40 hover:text-[#c9a96e]"
              >
                <Youtube size={15} />
                <span className="sr-only">Youtube</span>
              </Link>
              <Link
                href="#"
                className="flex h-9 w-9 items-center justify-center border border-white/10 text-white/40 transition-all duration-300 hover:border-[#c9a96e]/40 hover:text-[#c9a96e]"
              >
                <MessageCircle size={15} />
                <span className="sr-only">Message</span>
              </Link>
            </div>
          </div>

          <div>
            <p className="mb-5 text-[10px] uppercase tracking-[0.25em] text-[#c9a96e]">Menu</p>
            <ul className="space-y-3">
              {[
                ["홈", "/"],
                ["소개", "/about"],
                ["포트폴리오", "/portfolio"],
                ["프로세스", "/process"],
                ["문의", "/contact"],
                ["채용", "/recruit"],
              ].map(([label, path]) => (
                <li key={path}>
                  <Link href={path} className="text-sm text-white/40 transition-colors duration-200 hover:text-white/80">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="mb-5 text-[10px] uppercase tracking-[0.25em] text-[#c9a96e]">Contact</p>
            <ul className="space-y-3 text-sm text-white/40">
              <li>서울특별시 강남구 테헤란로 123</li>
              <li>인테리어 스튜디오 빌딩 5층</li>
              <li>info@interiorstudio.com</li>
              <li>평일 09:00 - 18:00</li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/5 pt-8 text-center sm:flex-row">
          <p className="text-xs tracking-widest text-white/20">&copy; {new Date().getFullYear()} GIGA Interior. All rights reserved.</p>
          <p className="text-xs tracking-widest text-white/20">Designed with passion in Seoul</p>
        </div>
      </div>
    </footer>
  )
}
