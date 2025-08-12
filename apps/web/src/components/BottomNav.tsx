import { useEffect, useMemo, useRef, useState } from "react";
import type { ReactElement } from "react";

type TabKey = "home" | "shop" | "promos" | "profile";
type Props = {
  value: TabKey;
  onChange?: (t: TabKey) => void;
  maxWidth?: number;
};

const TABS: {
  key: TabKey;
  label: string;
  icon: (active?: boolean) => ReactElement;
}[] = [
  {
    key: "home",
    label: "Inicio",
    // Casa sin chimenea, con relleno blanco si activa
    icon: (a) => (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        aria-hidden
        className={a ? "fill-white" : "fill-[var(--kb-muted)]"}
      >
        <path d="M10.293 3.293a1 1 0 0 1 1.414 0l8 8a1 1 0 1 1-1.414 1.414L18 12.414V19a2 2 0 0 1-2 2h-3v-5a1 1 0 0 0-1-1h-2a1 1 0 0 0-1 1v5H6a2 2 0 0 1-2-2v-6.586l-.293.293A1 1 0 1 1 2.293 11.293l8-8Z" />
      </svg>
    ),
  },
  {
    key: "shop",
    label: "Tienda",
    icon: (a) => (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        aria-hidden
        className={a ? "stroke-white" : "stroke-[var(--kb-muted)]"}
      >
        <g fill="none" strokeWidth="1.8" strokeLinecap="round">
          <path d="M5 8h14l-1.2 11.2A2 2 0 0 1 15.8 21H8.2a2 2 0 0 1-2-1.8L5 8Z" />
          <path d="M9 10V7a3 3 0 0 1 6 0v3" />
        </g>
      </svg>
    ),
  },
  {
    key: "promos",
    label: "Promos",
    icon: (a) => (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        aria-hidden
        className={a ? "stroke-white" : "stroke-[var(--kb-muted)]"}
      >
        <g fill="none" strokeWidth="1.8" strokeLinecap="round">
          <path d="M3 12.5V7a2 2 0 0 1 2-2h5.5l8 8a2 2 0 0 1 0 2.8l-4.7 4.7a2 2 0 0 1-2.8 0l-8-8Z" />
          <path d="M7.5 8.5h.01M14.5 11.5l-5 5" />
        </g>
      </svg>
    ),
  },
  {
    key: "profile",
    label: "Perfil",
    icon: (a) => (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        aria-hidden
        className={a ? "stroke-white" : "stroke-[var(--kb-muted)]"}
      >
        <g fill="none" strokeWidth="1.8" strokeLinecap="round">
          <circle cx="12" cy="8" r="3.5" />
          <path d="M5 20.4a7 7 0 0 1 14 0" />
        </g>
      </svg>
    ),
  },
];

const tokensCSS = `
:root{
  --kb-bg:#0B0B0B;
  --kb-surface:#111111;
  --kb-gold:#C9A227; /* dorado más cálido */
  --kb-text:#EAEAEA;
  --kb-muted:#9A9A9A;
  --kb-radius:18px;
}
`;

function useDebouncedResize(delay = 100) {
  const [, force] = useState(0);
  useEffect(() => {
    let t: any;
    const on = () => {
      clearTimeout(t);
      t = setTimeout(() => force(Math.random()), delay);
    };
    addEventListener("resize", on);
    addEventListener("orientationchange", on);
    return () => {
      clearTimeout(t);
      removeEventListener("resize", on);
      removeEventListener("orientationchange", on);
    };
  }, [delay]);
}

export default function BottomNav({ value, onChange, maxWidth = 420 }: Props) {
  useDebouncedResize(100);

  const navRef = useRef<HTMLDivElement>(null);
  const btnRefs = useRef<HTMLButtonElement[]>([]);
  const [xTarget, setX] = useState(0);
  const [pressing, setPressing] = useState(false);

  const recalc = () => {
    const idx = TABS.findIndex((t) => t.key === value);
    const nav = navRef.current;
    const btn = btnRefs.current[idx];
    if (!nav || !btn) return;
    const bNav = nav.getBoundingClientRect();
    const bBtn = btn.getBoundingClientRect();
    setX(bBtn.left + bBtn.width / 2 - bNav.left);
  };

  useEffect(recalc, [value, maxWidth]);
  useEffect(() => {
    const t = setTimeout(recalc, 0);
    return () => clearTimeout(t);
  }, []);
  useDebouncedResize(120);
  useEffect(recalc);

  useEffect(() => {
    if (!pressing) return;
    const t = setTimeout(() => setPressing(false), 170);
    return () => clearTimeout(t);
  }, [pressing]);

  const gooId = useMemo(() => "kb-goo-filter", []);
  // animaciones más fluidas (380ms) y solo transform/opacity
  const tr = "transform 380ms cubic-bezier(.2,.8,.2,1), opacity 220ms";

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: tokensCSS }} />
      <svg width="0" height="0" aria-hidden focusable="false">
        <defs>
          <filter id={gooId}>
            {/* blur un poco mayor para fluidez del “gel” */}
            <feGaussianBlur
              in="SourceGraphic"
              stdDeviation="12"
              result="blur"
            />
            <feColorMatrix
              in="blur"
              type="matrix"
              values="
              1 0 0 0 0
              0 1 0 0 0
              0 0 1 0 0
              0 0 0 20 -10"
              result="goo"
            />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>
      </svg>

      {/* SOLO MÓVIL */}
      <nav
        role="navigation"
        aria-label="Bottom navigation"
        className="fixed inset-x-0 bottom-0 z-50 pb-[env(safe-area-inset-bottom)] md:hidden"
      >
        <div className="mx-auto px-3" style={{ maxWidth }}>
          <div
            ref={navRef}
            className="
              relative h-[78px]
              rounded-[var(--kb-radius)]
              bg-[var(--kb-surface)]
              shadow-[0_8px_24px_rgba(0,0,0,.45)]
              border-t border-white/10
              backdrop-blur
              overflow-visible
            "
          >
            {/* capa gooey */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ filter: `url(#${gooId})` }}
            >
              {/* blob principal (base 56px; pop 62px; sobresale 12px) */}
              <div
                className="absolute bg-[var(--kb-gold)] rounded-full"
                style={{
                  width: pressing ? 68 : 62,
                  height: pressing ? 68 : 62,
                  transform: `translateX(${
                    xTarget - (pressing ? 36 : 33)
                  }px) translateY(-12px)`,
                  transition: tr,
                }}
              />
              {/* mini blobs seguidores con delays para “líquido” */}
              <div
                className="absolute bg-[var(--kb-gold)] rounded-full opacity-95"
                style={{
                  width: 20,
                  height: 20,
                  transform: `translateX(${xTarget - 10}px) translateY(-6px)`,
                  transition: tr,
                  transitionDelay: "45ms",
                }}
              />
              <div
                className="absolute bg-[var(--kb-gold)] rounded-full opacity-85"
                style={{
                  width: 13,
                  height: 13,
                  transform: `translateX(${xTarget - 6.5}px) translateY(-2px)`,
                  transition: tr,
                  transitionDelay: "70ms",
                }}
              />
              <div
                className="absolute bg-[var(--kb-gold)] rounded-full opacity-75"
                style={{
                  width: 9,
                  height: 9,
                  transform: `translateX(${xTarget - 4.5}px) translateY(0px)`,
                  transition: tr,
                  transitionDelay: "95ms",
                }}
              />
            </div>

            {/* tabs */}
            <ul className="grid grid-cols-4 h-full relative z-10 select-none">
              {TABS.map((t, i) => {
                const active = value === t.key;
                return (
                  <li key={t.key} className="flex">
                    <button
                      ref={(el) => {
                        btnRefs.current[i] = el!;
                      }}
                      className="
  group flex-1 flex flex-col items-center justify-center
  min-w-[56px] min-h-[56px] outline-none
  focus-visible:ring-2 focus-visible:ring-[var(--kb-gold)]
  focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--kb-surface)]
  rounded-[12px]
"
                      aria-current={active ? "page" : undefined}
                      aria-label={t.label}
                      onClick={() => {
                        setPressing(true);
                        onChange?.(t.key);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          setPressing(true);
                          onChange?.(t.key);
                        }
                      }}
                    >
                      <div
                        className="transition-all"
                        style={{
                          transform: `translateY(${active ? "-6px" : "0px"})`,
                          opacity: active ? 1 : 0.7,
                        }}
                      >
                        {t.icon(active)}
                      </div>
                      <span
                        className="mt-1 text-[12px] font-medium"
                        style={{
                          color: active ? "white" : "var(--kb-muted)",
                          transform: `translateY(${active ? "-2px" : "0px"})`,
                          opacity: active ? 1 : 0.7,
                          transition: tr,
                          fontFamily:
                            "system-ui, Segoe UI, Roboto, Helvetica, Arial, sans-serif",
                        }}
                      >
                        {t.label}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}
