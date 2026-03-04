import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { APP_PATHS } from "@/shared/routes/paths";

const navLinks = [
  { label: "Home", path: APP_PATHS.home },
  { label: "About", path: APP_PATHS.about },
  { label: "Portfolio", path: APP_PATHS.portfolio },
  { label: "Recruit", path: APP_PATHS.recruit },
  { label: "Contact", path: APP_PATHS.contact },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled ? "bg-[#0a0a0a]/95 backdrop-blur-md border-b border-white/5" : "bg-transparent"
        }`}
      >
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-5 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="relative z-10">
            <div className="flex flex-col leading-none">
              <span
                style={{ fontFamily: "'Cormorant Garamond', serif", letterSpacing: "0.15em" }}
                className="text-white text-2xl font-light tracking-widest"
              >
                GIGA
              </span>
              <span
                style={{ fontFamily: "'Space Grotesk', sans-serif", letterSpacing: "0.3em" }}
                className="text-[#c9a96e] text-[9px] font-light tracking-[0.3em] uppercase"
              >
                INTERIOR
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <ul className="hidden lg:flex items-center gap-10">
            {navLinks.map((link) => (
              <li key={link.path}>
                <Link
                  to={link.path}
                  className={`text-[11px] tracking-[0.2em] uppercase transition-colors duration-300 relative group ${
                    location.pathname === link.path ? "text-[#c9a96e]" : "text-white/70 hover:text-white"
                  }`}
                >
                  {link.label}
                  <span
                    className={`absolute -bottom-1 left-0 h-px bg-[#c9a96e] transition-all duration-300 ${
                      location.pathname === link.path ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                  />
                </Link>
              </li>
            ))}
          </ul>

          {/* CTA */}
          <Link
            to={APP_PATHS.contact}
            className="hidden lg:flex items-center gap-2 border border-[#c9a96e]/40 text-[#c9a96e] px-5 py-2.5 text-[10px] tracking-[0.2em] uppercase hover:bg-[#c9a96e] hover:text-[#0a0a0a] transition-all duration-300"
          >
            무료 상담
          </Link>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden text-white z-10"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-[#0a0a0a] flex flex-col items-center justify-center gap-8"
          >
            {navLinks.map((link, i) => (
              <motion.div
                key={link.path}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
              >
                <Link
                  to={link.path}
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                  className={`text-4xl font-light tracking-widest uppercase ${
                    location.pathname === link.path ? "text-[#c9a96e]" : "text-white/80"
                  }`}
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <Link
                to={APP_PATHS.contact}
                className="mt-4 border border-[#c9a96e] text-[#c9a96e] px-8 py-3 text-xs tracking-[0.25em] uppercase"
              >
                무료 상담
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
