import React, { useState, useEffect } from "react";

const AnimationsToggle: React.FC = () => {
  const [animationsEnabled, setAnimationsEnabled] = useState(true);

  useEffect(() => {
    // Verificar preferencia inicial del sistema
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) {
      setAnimationsEnabled(false);
      document.documentElement.setAttribute("data-animations", "off");
    }

    // Escuchar cambios en la preferencia del sistema
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handleChange = (e: MediaQueryListEvent) => {
      if (e.matches) {
        setAnimationsEnabled(false);
        document.documentElement.setAttribute("data-animations", "off");
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const toggleAnimations = () => {
    const newState = !animationsEnabled;
    setAnimationsEnabled(newState);

    if (newState) {
      document.documentElement.removeAttribute("data-animations");
    } else {
      document.documentElement.setAttribute("data-animations", "off");
    }

    // Refrescar ScrollTrigger si existe
    if (window.ScrollTrigger) {
      window.ScrollTrigger.refresh();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-40">
      <button
        onClick={toggleAnimations}
        className="bg-stone/90 backdrop-blur-sm border border-golden/30 text-text-active px-4 py-3 rounded-2xl font-body font-body-medium text-sm hover:bg-golden/20 hover:border-golden/50 transition-all duration-300 focus-golden flex items-center gap-3 shadow-golden group"
        aria-label={`${
          animationsEnabled ? "Desactivar" : "Activar"
        } animaciones`}
      >
        <div className="relative">
          <div
            className={`w-10 h-5 bg-stone rounded-full relative transition-colors duration-300 ${
              animationsEnabled ? "bg-golden/30" : "bg-stone/50"
            }`}
          >
            <div
              className={`absolute top-0.5 w-4 h-4 bg-golden rounded-full transition-transform duration-300 ${
                animationsEnabled ? "translate-x-5" : "translate-x-0.5"
              }`}
            />
          </div>
        </div>

        <span className="hidden sm:inline-block group-hover:text-golden transition-colors">
          {animationsEnabled ? "Animaciones" : "Sin animaciones"}
        </span>

        <div className="w-4 h-4 flex items-center justify-center">
          {animationsEnabled ? (
            <span className="text-golden text-xs animate-pulse">⚡</span>
          ) : (
            <span className="text-text-inactive text-xs">⏸</span>
          )}
        </div>
      </button>
    </div>
  );
};

// Declarar ScrollTrigger global para TypeScript
declare global {
  interface Window {
    ScrollTrigger?: {
      refresh: () => void;
    };
  }
}

export default AnimationsToggle;
