// kingsman/apps/web/src/components/Header.tsx
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { getVisibleRoutes } from "@/config/routes";
import { useAuthExtended } from "@/hooks/useAuthExtended";
import { CogIcon } from "lucide-react";

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { isAdmin, hasPermission, loading } = useAuthExtended();

  // Durante la carga, mostrar un estado mínimo
  if (loading) {
    return (
      <header className="fixed top-0 left-0 right-0 z-40 bg-[#0B0B0B]/80 backdrop-blur-xl border-b border-[#1A1A1A]">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center group">
            <h1 className="font-['Playfair_Display'] font-bold text-2xl text-[#D4AF37] tracking-wide">
              KINGSMAN
            </h1>
            <span className="ml-2 text-[#C7C7C7] font-['Segoe_UI'] text-sm">
              BARBER
            </span>
          </Link>
        </div>
      </header>
    );
  }

  // Obtener rutas visibles basadas en permisos
  const visibleRoutes = getVisibleRoutes(hasPermission, isAdmin);

  const isActive = (path: string): boolean => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-[#0B0B0B]/80 backdrop-blur-xl border-b border-[#1A1A1A]">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center group">
          <h1 className="font-['Playfair_Display'] font-bold text-2xl text-[#D4AF37] tracking-wide group-hover:text-white transition-colors duration-300">
            KINGSMAN
          </h1>
          <span className="ml-2 text-[#C7C7C7] font-['Segoe_UI'] text-sm">
            BARBER
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          {visibleRoutes.map((route) => {
            // No mostrar admin en la nav principal, lo ponemos aparte
            if (route.path === "/admin") return null;

            const Icon = route.icon;
            const isCurrentRoute = isActive(route.path);

            return (
              <Link
                key={route.path}
                to={route.path}
                className={`
                  group relative flex items-center gap-2 px-4 py-2 rounded-2xl
                  transition-all duration-300 font-medium
                  ${
                    isCurrentRoute
                      ? "bg-[#1A1A1A] text-[#D4AF37] shadow-[0_0_20px_rgba(212,175,55,0.15)]"
                      : "text-[#C7C7C7] hover:text-white hover:bg-[#1A1A1A]/50"
                  }
                  focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:ring-offset-2 
                  focus:ring-offset-[#0B0B0B]
                `}
                aria-label={route.ariaLabel || route.label}
                aria-current={isCurrentRoute ? "page" : undefined}
              >
                <Icon
                  className="w-4 h-4 transition-transform duration-300 group-hover:scale-110"
                  aria-hidden="true"
                />
                <span className="hidden lg:inline-block">{route.label}</span>
              </Link>
            );
          })}

          {/* Admin link separado si tiene permisos */}
          {hasPermission("admin_panel") && (
            <>
              <div className="w-px h-6 bg-[#1A1A1A] mx-2" />
              <Link
                to="/admin"
                className={`
                  group relative flex items-center gap-2 px-3 py-2 rounded-2xl
                  transition-all duration-300 font-medium
                  ${
                    isActive("/admin")
                      ? "bg-[#1A1A1A] text-[#D4AF37] shadow-[0_0_20px_rgba(212,175,55,0.15)]"
                      : "text-[#C7C7C7] hover:text-white hover:bg-[#1A1A1A]/50"
                  }
                `}
                aria-label="Panel de administración"
              >
                <CogIcon className="w-4 h-4" />
                <span className="hidden lg:inline-block text-xs">Admin</span>
              </Link>
            </>
          )}

          {/* CTA Button - Solo si puede agendar */}
          {hasPermission("book_appointment") && (
            <Link
              to="/citas"
              className="
                ml-4 inline-flex items-center px-6 py-2.5 rounded-2xl
                bg-gradient-to-r from-[#D4AF37] to-[#C7A936]
                text-[#0B0B0B] font-semibold
                hover:shadow-[0_0_25px_rgba(212,175,55,0.3)]
                transform hover:scale-105 transition-all duration-300
                focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:ring-offset-2 
                focus:ring-offset-[#0B0B0B]
              "
              aria-label="Reservar cita ahora"
            >
              Reservar Ahora
            </Link>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] rounded-lg"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Abrir menú de navegación"
          aria-expanded={isMenuOpen}
        >
          <div className="w-6 h-5 flex flex-col justify-between">
            <span
              className={`block h-0.5 bg-[#D4AF37] transition-transform duration-300 ${
                isMenuOpen ? "rotate-45 translate-y-2" : ""
              }`}
            />
            <span
              className={`block h-0.5 bg-[#D4AF37] transition-opacity duration-300 ${
                isMenuOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`block h-0.5 bg-[#D4AF37] transition-transform duration-300 ${
                isMenuOpen ? "-rotate-45 -translate-y-2" : ""
              }`}
            />
          </div>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-[#1A1A1A]/95 backdrop-blur-sm border-t border-[#1A1A1A]">
          <nav className="container mx-auto px-4 py-6 space-y-2">
            {visibleRoutes.map((route) => {
              const Icon = route.icon;
              const isCurrentRoute = isActive(route.path);

              return (
                <Link
                  key={route.path}
                  to={route.path}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-2xl
                    transition-all duration-300
                    ${
                      isCurrentRoute
                        ? "bg-[#D4AF37]/10 text-[#D4AF37]"
                        : "text-[#C7C7C7] hover:text-white hover:bg-[#1A1A1A]/50"
                    }
                  `}
                  onClick={() => setIsMenuOpen(false)}
                  aria-current={isCurrentRoute ? "page" : undefined}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{route.label}</span>
                </Link>
              );
            })}

            {/* CTA en mobile */}
            {hasPermission("book_appointment") && (
              <Link
                to="/citas"
                className="
                  block w-full mt-4 px-6 py-3 rounded-2xl text-center
                  bg-gradient-to-r from-[#D4AF37] to-[#C7A936]
                  text-[#0B0B0B] font-semibold
                  hover:shadow-[0_0_25px_rgba(212,175,55,0.3)]
                  transition-all duration-300
                "
                onClick={() => setIsMenuOpen(false)}
              >
                Reservar Ahora
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
