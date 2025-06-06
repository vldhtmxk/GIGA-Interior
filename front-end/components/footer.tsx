import Link from "next/link"
import { Facebook, Instagram, Twitter } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-white border-t py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">GIGA Interior</h3>
            <p className="text-sm text-muted-foreground">공간에 영감을 불어넣는 디자인 스튜디오</p>
            <div className="flex space-x-4">
              <Link href="#" className="text-muted-foreground hover:text-black">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-black">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-black">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">바로가기</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-sm text-muted-foreground hover:text-black">
                  홈
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-sm text-muted-foreground hover:text-black">
                  소개
                </Link>
              </li>
              <li>
                <Link href="/portfolio" className="text-sm text-muted-foreground hover:text-black">
                  포트폴리오
                </Link>
              </li>
              <li>
                <Link href="/process" className="text-sm text-muted-foreground hover:text-black">
                  프로세스
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">서비스</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/portfolio/residential" className="text-sm text-muted-foreground hover:text-black">
                  주거 공간
                </Link>
              </li>
              <li>
                <Link href="/portfolio/commercial" className="text-sm text-muted-foreground hover:text-black">
                  상업 공간
                </Link>
              </li>
              <li>
                <Link href="/portfolio/office" className="text-sm text-muted-foreground hover:text-black">
                  오피스
                </Link>
              </li>
              <li>
                <Link href="/portfolio/hospitality" className="text-sm text-muted-foreground hover:text-black">
                  호텔 & 리조트
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">연락처</h3>
            <address className="not-italic">
              <p className="text-sm text-muted-foreground">서울특별시 강남구 테헤란로 123</p>
              <p className="text-sm text-muted-foreground">인테리어 스튜디오 빌딩 5층</p>
              <p className="text-sm text-muted-foreground mt-2">info@interiorstudio.com</p>
              <p className="text-sm text-muted-foreground">02-123-4567</p>
            </address>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} INTERIOR STUDIO. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
