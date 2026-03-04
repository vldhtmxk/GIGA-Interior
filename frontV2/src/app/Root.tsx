import { Outlet, useLocation } from "react-router";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { useEffect } from "react";

export function Root() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div style={{ fontFamily: "'Space Grotesk', 'Inter', sans-serif" }} className="bg-[#0a0a0a] text-white min-h-screen">
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  );
}
