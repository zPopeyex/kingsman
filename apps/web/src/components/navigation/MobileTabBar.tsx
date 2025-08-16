// web/apps/src/components/navigation/MobileTabBar.tsx
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { getVisibleRoutes, type Route } from "@/config/routes";
import { useAuth } from "../../hooks/useAuth";

const MobileTabBar: React.FC = () => {
  const location = useLocation();
  const { isAdmin } = useAuth();
  const [activeIndex, setActiveIndex] = useState(0);
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

  useEffect(() => {
    const currentIndex = visibleRoutes.findIndex((route: Route) =>
      isActive(route.path)
    );
    if (currentIndex !== -1) {
      setActiveIndex(currentIndex);
    }
  }, [location.pathname, visibleRoutes]);

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
      role="navigation"
      aria-label="Navegación principal móvil"
    >
      {/* Liquid background effect */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0B] to-[#1A1A1A] backdrop-blur-xl opacity-95" />

      {/* Gooey indicator */}
      <div
        className="absolute h-16 w-16 bg-gradient-to-br from-[#D4AF37] to-[#C7A936] rounded-full blur-xl opacity-40 transition-all duration-500 ease-out"
        style={{
          left: `${(activeIndex / (visibleRoutes.length - 1)) * 75 + 12.5}%`,
          transform: "translateX(-50%)",
          bottom: "1rem",
        }}
      />

      <div className="relative flex justify-around items-center h-20 px-4">
        {visibleRoutes.map((route: Route, index: number) => {
          const Icon = route.icon;
          const isCurrentRoute = isActive(route.path);

          return (
            <Link
              key={route.path}
              to={route.path}
              className={`
                relative flex flex-col items-center justify-center
                w-16 h-16 rounded-2xl transition-all duration-300
                ${
                  isCurrentRoute
                    ? "text-[#D4AF37] scale-110"
                    : "text-[#C7C7C7] hover:text-white"
                }
                focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:ring-offset-2 
                focus:ring-offset-[#0B0B0B]
              `}
              aria-label={route.ariaLabel || route.label}
              aria-current={getAriaCurrentValue(route.path)}
              tabIndex={0}
              onFocus={() => setActiveIndex(index)}
            >
              <Icon
                className={`
                  w-6 h-6 transition-all duration-300
                  ${
                    isCurrentRoute
                      ? "drop-shadow-[0_0_8px_rgba(212,175,55,0.5)]"
                      : ""
                  }
                `}
                aria-hidden="true"
              />
              <span className="text-xs mt-1 font-medium">{route.label}</span>

              {/* Active dot indicator */}
              {isCurrentRoute && (
                <span
                  className="absolute -bottom-1 w-1 h-1 bg-[#D4AF37] rounded-full"
                  aria-hidden="true"
                />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileTabBar;
