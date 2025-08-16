// web/apps/src/sections/Servicios.tsx
import React, { useEffect, useRef } from "react";
import { scrollManager } from "../lib/scroll";

interface Servicio {
  id: number;
  title: string;
  description: string;
  price: string;
  duration: string;
  image: string;
}

const servicios: Servicio[] = [
  {
    id: 1,
    title: "Corte Clásico",
    description:
      "Corte tradicional con técnicas maestras, terminado con navaja y productos premium.",
    price: "$45",
    duration: "45 min",
    image: "/assets/images/kingsman-classic-cut.jpg",
  },
  {
    id: 2,
    title: "Afeitado Completo",
    description:
      "Afeitado con navaja tradicional, toallas calientes y cuidado post-afeitado.",
    price: "$35",
    duration: "30 min",
    image: "/assets/images/kingsman-face-treatment.jpg",
  },
  {
    id: 3,
    title: "Barba & Bigote",
    description:
      "Arreglo y diseño de barba y bigote con productos especializados.",
    price: "$30",
    duration: "25 min",
    image: "/assets/images/kingsman-beard-styling.jpg",
  },
  {
    id: 4,
    title: "Paquete Premium",
    description:
      "Servicio completo: corte, afeitado, barba y tratamiento facial.",
    price: "$85",
    duration: "90 min",
    image: "/assets/images/kingsman-premium-package.jpg",
  },
];

const Servicios: React.FC = () => {
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    scrollManager.init();

    // Solo usar ScrollReveal - sin scroll horizontal
    if (cardsRef.current.length > 0) {
      scrollManager.createScrollReveal(cardsRef.current.filter(Boolean), {
        y: 60,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
      });
    }

    return () => {
      // No usar killAll aquí
    };
  }, []);

  return (
    <section className="relative bg-gradient-to-b from-background via-stone/10 to-background py-20 lg:py-32">
      {/* Header */}
      <div className="container mx-auto px-4 text-center mb-20">
        <h2 className="font-display font-display-black text-clamp-3xl lg:text-6xl text-golden mb-6 tracking-display">
          SERVICIOS
        </h2>
        <p className="font-body text-clamp-base lg:text-clamp-lg text-text-inactive tracking-wide max-w-3xl mx-auto">
          Cada servicio es una experiencia única diseñada para realzar tu estilo
          personal
        </p>
      </div>

      {/* Cards Grid Responsivo - SIEMPRE VISIBLE */}
      <div className="container mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 lg:gap-8 justify-items-center max-w-none">
          {servicios.map((servicio, index) => (
            <div
              key={servicio.id}
              ref={(el) => {
                cardsRef.current[index] = el;
              }}
              className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-stone/20 via-background/95 to-stone/30 border border-golden/10 backdrop-blur-sm hover:border-golden/30 transition-all duration-500 w-full max-w-sm"
            >
              {/* Imagen de fondo con overlay elegante */}
              <div className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity duration-700">
                <div
                  className="w-full h-full bg-cover bg-center"
                  style={{
                    backgroundImage: `url(${servicio.image})`,
                  }}
                />
                {/* Fallback con gradiente dorado */}
                <div className="absolute inset-0 bg-gradient-to-br from-golden/20 to-stone/40" />
              </div>

              {/* Borde interior dorado sutil */}
              <div className="absolute inset-[1px] rounded-3xl border border-golden/5 group-hover:border-golden/15 transition-colors duration-500" />

              {/* Contenido */}
              <div className="relative p-6 lg:p-8 z-10">
                {/* Icono decorativo */}
                <div className="w-14 h-14 lg:w-16 lg:h-16 mx-auto mb-4 lg:mb-6 relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-golden/20 to-golden/5 rounded-xl lg:rounded-2xl rotate-45 group-hover:rotate-0 transition-transform duration-500" />
                  <div className="absolute inset-1 lg:inset-2 bg-golden/10 rounded-lg lg:rounded-xl flex items-center justify-center">
                    <span className="text-golden text-xl lg:text-2xl font-display">
                      {index === 0
                        ? "✂"
                        : index === 1
                        ? "🪒"
                        : index === 2
                        ? "✨"
                        : "👑"}
                    </span>
                  </div>
                </div>

                {/* Título */}
                <h3 className="font-display font-display-bold text-lg lg:text-xl xl:text-2xl text-golden mb-3 lg:mb-4 tracking-display text-center group-hover:text-yellow-400 transition-colors duration-300">
                  {servicio.title}
                </h3>

                {/* Descripción */}
                <p className="font-body text-text-inactive text-sm lg:text-base mb-6 lg:mb-8 leading-relaxed text-center">
                  {servicio.description}
                </p>

                {/* Divisor decorativo */}
                <div className="w-12 lg:w-16 h-px bg-gradient-to-r from-transparent via-golden/30 to-transparent mx-auto mb-4 lg:mb-6" />

                {/* Info de precio y duración */}
                <div className="flex justify-between items-center mb-6 lg:mb-8">
                  <div className="text-center">
                    <p className="text-text-inactive text-xs lg:text-sm font-body mb-1">
                      Precio
                    </p>
                    <span className="font-display font-display-bold text-base lg:text-lg xl:text-xl text-text-active">
                      {servicio.price}
                    </span>
                  </div>
                  <div className="w-px h-6 lg:h-8 bg-golden/20" />
                  <div className="text-center">
                    <p className="text-text-inactive text-xs lg:text-sm font-body mb-1">
                      Duración
                    </p>
                    <span className="font-body text-text-inactive text-xs lg:text-sm">
                      {servicio.duration}
                    </span>
                  </div>
                </div>

                {/* CTA Button */}
                <button className="w-full relative overflow-hidden bg-transparent border-2 border-golden/30 text-golden px-4 lg:px-6 py-2 lg:py-3 rounded-xl lg:rounded-2xl font-body font-body-medium text-sm lg:text-base transition-all duration-500 group-hover:border-golden/60 focus-golden group">
                  <span className="relative z-10 group-hover:text-background transition-colors duration-300">
                    Reservar
                  </span>
                  <div className="absolute inset-0 bg-golden transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                </button>
              </div>

              {/* Glow effect en hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-golden/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-3xl" />

              {/* Shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-golden/10 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
            </div>
          ))}
        </div>
      </div>

      {/* CTA adicional */}
      <div className="container mx-auto px-4 text-center">
        <button className="relative inline-block bg-gradient-to-r from-golden/10 to-golden/5 border-2 border-golden/30 text-golden px-12 py-4 rounded-full font-body font-body-medium text-lg hover:border-golden hover:bg-golden hover:text-background transition-all duration-500 focus-golden transform hover:scale-105 group overflow-hidden shadow-golden">
          <span className="relative z-10">Ver Todos los Servicios</span>
          <div className="absolute inset-0 bg-golden transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-center rounded-full" />
        </button>
      </div>
    </section>
  );
};

export default Servicios;
