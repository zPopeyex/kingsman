// web/apps/src/components/navigation/DesktopNav.tsx
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { getVisibleRoutes } from "@/config/routes";
import { useAuth } from "../../hooks/useAuth";

interface DesktopNavProps {
  position?: "top" | "bottom";
}

const DesktopNav: React.FC<DesktopNavProps> = ({ position = "top" }) => {
  const location = useLocation();
  const { isAdmin } = useAuth();
  const visibleRoutes = getVisibleRoutes(isAdmin);

  const isActive = (path: string): boolean => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  const getAriaCurrentValue = (path: string): "page" | undefined => {
    return isActive(path) ? "page" : undefined;
  };

  const isTop = position === "top";
  const positionClasses = isTop ? "top-0 border-b" : "bottom-0 border-t";

  return (
    <nav
      className={`
        hidden md:block fixed left-0 right-0 z-40
        ${positionClasses} border-[#1A1A1A]
        bg-gradient-to-${isTop ? "b" : "t"} from-[#0B0B0B] to-[#0B0B0B]/95
        backdrop-blur-xl
      `}
      role="navigation"
      aria-label={`Navegación principal ${
        position === "top" ? "superior" : "inferior"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo area for top nav */}
          {isTop && (
            <div className="flex-shrink-0">
              <Link
                to="/"
                className="text-2xl font-['Playfair_Display'] text-[#D4AF37] hover:text-white transition-colors duration-300"
                aria-label="Kingsman Barber - Inicio"
              >
                Kingsman
              </Link>
            </div>
          )}

          {/* Navigation links */}
          <div
            className={`flex items-center space-x-1 ${!isTop ? "mx-auto" : ""}`}
          >
            {visibleRoutes.map((route) => {
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
                  aria-current={getAriaCurrentValue(route.path)}
                  tabIndex={0}
                >
                  <Icon
                    className={`
                      w-5 h-5 transition-transform duration-300
                      ${isCurrentRoute ? "scale-110" : "group-hover:scale-110"}
                    `}
                    aria-hidden="true"
                  />
                  <span className="hidden lg:inline-block">{route.label}</span>

                  {/* Active indicator line */}
                  {isCurrentRoute && (
                    <span
                      className={`absolute ${
                        isTop ? "bottom-0" : "top-0"
                      } left-4 right-4 h-0.5 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent`}
                      aria-hidden="true"
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* CTA area for top nav */}
          {isTop && (
            <div className="flex-shrink-0">
              <Link
                to="/agendar"
                className="
                  inline-flex items-center px-6 py-2.5 rounded-2xl
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
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default DesktopNav;
