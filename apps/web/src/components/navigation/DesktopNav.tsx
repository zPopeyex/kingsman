import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { getVisibleRoutes } from "@/config/routes";
import { useAuth } from "@/hooks/useAuth";

export default function DesktopNav() {
  const [isMd, setIsMd] = useState<boolean>(() =>
    typeof window !== "undefined"
      ? window.matchMedia("(min-width: 768px)").matches
      : false
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mm = window.matchMedia("(min-width: 768px)");
    const onChange = () => setIsMd(mm.matches);
    mm.addEventListener?.("change", onChange);
    // ts-expect-error legacy
    mm.addListener?.(onChange);
    return () => {
      mm.removeEventListener?.("change", onChange);
      // ts-expect-error legacy
      mm.removeListener?.(onChange);
    };
  }, []);

  if (!isMd) return <div className="hidden md:block" aria-hidden />;

  const { role } = useAuth();
  const routes = getVisibleRoutes(role);

  return (
    <nav aria-label="Navegación principal" className="hidden md:block min-w-0">
      <ul className="flex items-center gap-1 lg:gap-2 flex-wrap">
        {routes.map((r) => (
          <li key={r.path} className="min-w-0">
            <NavLink
              to={r.path}
              className={({ isActive }) =>
                [
                  "inline-flex items-center gap-1.5 rounded-xl lg:rounded-2xl border",
                  "px-2 py-1.5 lg:px-3 lg:py-2",
                  "text-sm lg:text-base",
                  "max-w-[10rem] lg:max-w-[16rem] truncate",
                  isActive
                    ? "bg-white/5 border-white/15 text-white"
                    : "border-white/10 text-neutral-300 hover:bg-white/5",
                ].join(" ")
              }
              aria-label={r.ariaLabel || r.label}
            >
              <r.icon className="w-3.5 h-3.5 lg:w-4 lg:h-4 shrink-0" />
              {/* CAMBIADO: Mostrar texto siempre en md y superiores */}
              <span className="truncate">{r.label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
