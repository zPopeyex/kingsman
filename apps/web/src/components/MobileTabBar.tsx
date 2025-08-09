import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Home, ShoppingBag, PercentCircle, User2, CalendarCheck2 } from "lucide-react";

type Tab = { to: string; label: string; icon: React.ComponentType<any> };

const TABS: Tab[] = [
  { to: "/",        label: "Inicio",  icon: Home },
  { to: "/tienda",  label: "Tienda",  icon: ShoppingBag },
  { to: "/trabajos",label: "Promos",  icon: PercentCircle },
  { to: "/perfil",  label: "Perfil",  icon: User2 },
];

/** Tuning visual (ajusta a gusto) */
const MAX_W   = 390;  // ancho máx de la barra
const HEIGHT  = 72;   // alto de la barra
const RADIUS  = 22;   // radio de las esquinas
const BLOB    = 56;   // diámetro del blob
const DEPTH   = 22;   // profundidad del notch curvo (hacia abajo)
const WIDTHK  = 0.55; // factor del ancho del notch (0.45–0.65 recomendado)
const ICON_Y  = 18;   // altura de iconos/labels dentro de la barra

/** Path de un rect redondeado */
function roundedRectPath(w: number, h: number, r: number) {
  const rw = Math.min(r, h / 2, w / 2);
  return [
    `M ${rw} 0`,
    `H ${w - rw}`,
    `Q ${w} 0 ${w} ${rw}`,
    `V ${h - rw}`,
    `Q ${w} ${h} ${w - rw} ${h}`,
    `H ${rw}`,
    `Q 0 ${h} 0 ${h - rw}`,
    `V ${rw}`,
    `Q 0 0 ${rw} 0`,
    "Z",
  ].join(" ");
}

/** Notch curvo (spline) centrado en 0,0 y abierto hacia abajo.
 *  Usamos un path con dos curvas C para lograr la “onda” suave.
 *  Queda cerrado por arriba para que la máscara recorte correctamente.
 */
function notchPath(w: number, d: number) {
  const half = w / 2;
  // control points (estética: más horizontal = onda suave)
  const c = half * 0.6;
  return [
    `M ${-half} 0`,
    `C ${-c} 0, ${-c} ${d}, 0 ${d}`,
    `C ${c} ${d}, ${c} 0, ${half} 0`,
    `L ${half} -6`,
    `L ${-half} -6`,
    "Z",
  ].join(" ");
}

export function MobileTabBar() {
  const { pathname } = useLocation();
  const nav = useNavigate();

  const wrapRef = useRef<HTMLDivElement>(null);
  const [w, setW] = useState(320);

  // medir ancho disponible (responsive)
  useEffect(() => {
    const measure = () => setW(Math.min(wrapRef.current?.offsetWidth ?? 320, MAX_W));
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  // tab activo
  const active = useMemo(() => {
    const i = TABS.findIndex(t => pathname === t.to || (t.to !== "/" && pathname.startsWith(t.to)));
    return i === -1 ? 0 : i;
  }, [pathname]);

  const cell = w / TABS.length;
  const cx   = cell * (active + 0.5);       // centro X del blob / notch
  const cy   = (BLOB / 2) - DEPTH;          // centro Y del blob (notch arriba)

  // ancho del notch en función del ancho de celda (queda proporcional)
  const notchW = Math.max(70, Math.min(110, cell * WIDTHK));

  const BlobIcon = active === 0 ? CalendarCheck2 : TABS[active].icon;

  const maskId = "tab-mask";
  const gooId  = "goo";

  return (
    <div className="md:hidden fixed inset-x-0 bottom-0 z-40 pb-[env(safe-area-inset-bottom)]">
      <div ref={wrapRef} className="relative mx-auto px-4">
        <div className="relative mx-auto" style={{ width: "100%", maxWidth: MAX_W }}>
          {/* SVG principal */}
          <svg
            width="100%"
            height={HEIGHT + BLOB / 2}
            viewBox={`0 0 ${w} ${HEIGHT + BLOB / 2}`}
            className="block"
          >
            <defs>
              {/* Filtro gooey para fusión líquida */}
              <filter id={gooId}>
                <feGaussianBlur in="SourceGraphic" stdDeviation="9" result="blur" />
                <feColorMatrix
                  in="blur"
                  mode="matrix"
                  values="
                    1 0 0 0 0
                    0 1 0 0 0
                    0 0 1 0 0
                    0 0 0 20 -10"
                  result="goo"
                />
                <feComposite in="SourceGraphic" in2="goo" operator="atop" />
              </filter>

              {/* Máscara: barra (blanca) – notch curvo (negro) */}
              <mask id={maskId}>
                <path d={roundedRectPath(w, HEIGHT, RADIUS)} fill="#fff" />
                <motion.path
                  d={notchPath(notchW, DEPTH)}
                  fill="#000"
                  initial={false}
                  animate={{ x: cx, y: DEPTH + 4 }} // +4 pega al borde superior
                  transition={{ type: "spring", stiffness: 520, damping: 36 }}
                />
              </mask>
            </defs>

            {/* Grupo gooey: barra + blob = líquido */}
            <g filter={`url(#${gooId})`}>
              <path d={roundedRectPath(w, HEIGHT, RADIUS)} fill="#161616" />
              <motion.circle
                r={BLOB / 2}
                fill="#D4AF37"
                initial={false}
                animate={{ cx, cy }}
                transition={{ type: "spring", stiffness: 560, damping: 36 }}
              />
            </g>

            {/* Trazo fino para definición */}
            <path d={roundedRectPath(w, HEIGHT, RADIUS)} fill="none" stroke="#1F1F1F" strokeWidth="1" />
          </svg>

          {/* Capa de items con MÁSCARA (no se ven bajo el notch) */}
          <div
            className="absolute inset-0 grid z-10"
            style={{ gridTemplateColumns: `repeat(${TABS.length}, 1fr)` }}
          >
            <div
              className="absolute inset-0 grid"
              style={{
                gridTemplateColumns: `repeat(${TABS.length}, 1fr)`,
                mask: `url(#${maskId})`,
                WebkitMask: `url(#${maskId})`,
              }}
            >
              {TABS.map((t, i) => {
                const Icon = t.icon;
                const isActive = i === active;
                return (
                  <NavLink
                    key={t.to}
                    to={t.to}
                    className="relative h-full flex flex-col items-center justify-end pb-2"
                  >
                    <Icon
                      className={`w-5 h-5 ${isActive ? "text-[#F4D061]" : "text-neutral-400"}`}
                      style={{ transform: `translateY(-${ICON_Y}px)` }}
                    />
                    <span
                      className={`text-[11px] ${isActive ? "text-[#F4D061]" : "text-neutral-400"}`}
                      style={{ transform: `translateY(-${ICON_Y - 2}px)` }}
                    >
                      {t.label}
                    </span>
                  </NavLink>
                );
              })}
            </div>
          </div>

          {/* Icono “clickable” encima del blob */}
          <button
            onClick={() => nav(TABS[active].to)}
            className="absolute -translate-x-1/2 -translate-y-1/2 z-20 text-black"
            style={{ left: cx, top: cy }}
            aria-label={TABS[active].label}
          >
            <BlobIcon className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
}
