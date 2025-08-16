// src/components/Header.tsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DesktopNav from "@/components/navigation/DesktopNav";

export default function Header() {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia("(min-width: 768px)");
    const apply = () => setIsDesktop(mql.matches);
    apply();

    if ("addEventListener" in mql) {
      mql.addEventListener("change", apply);
      return () => mql.removeEventListener("change", apply);
    } else {
      // @ts-expect-error: fallback legacy
      mql.addListener(apply);
      // @ts-expect-error: fallback legacy
      return () => mql.removeListener(apply);
    }
  }, []);

  // No renderizar nada en móvil
  if (!isDesktop) return null;

  return (
    <header
      className="
        fixed top-0 left-0 right-0 z-50
        bg-[#0B0B0B]/80 backdrop-blur
        border-b border-white/5
        h-14
      "
      role="banner"
    >
      <div className="container mx-auto px-4 h-full flex items-center justify-between">
        {/* Logo / Marca */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-[#D4AF37]"
          aria-label="Kingsman Barber - inicio"
        >
          <img
            src="/kingsman_logo_transparent.webp"
            alt=""
            className="w-6 h-6"
          />
          <span className="font-serif tracking-[0.06em]">Kingsman Barber</span>
        </Link>

        {/* Nav de escritorio */}
        <DesktopNav />
      </div>
    </header>
  );
}
