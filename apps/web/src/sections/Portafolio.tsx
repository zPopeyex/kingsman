import React, { useEffect, useRef } from "react";
import { scrollManager } from "../lib/scroll";

interface TrabajoPortafolio {
  id: number;
  title: string;
  category: string;
  image: string;
  description: string;
}

const trabajos: TrabajoPortafolio[] = [
  {
    id: 1,
    title: "Estilo Clásico",
    category: "Corte Tradicional",
    image: "/assets/images/kingsman-portfolio-classic.jpg",
    description: "Corte clásico con degradado perfecto",
  },
  {
    id: 2,
    title: "Look Moderno",
    category: "Corte Contemporáneo",
    image: "/assets/images/kingsman-portfolio-modern.jpg",
    description: "Estilo moderno con líneas definidas",
  },
  {
    id: 3,
    title: "Fade Profesional",
    category: "Técnica Avanzada",
    image: "/assets/images/kingsman-portfolio-fade.jpg",
    description: "Fade perfecto con transiciones suaves",
  },
  {
    id: 4,
    title: "Estilo Vintage",
    category: "Retro Premium",
    image: "/assets/images/kingsman-portfolio-vintage.jpg",
    description: "Inspirado en la elegancia atemporal",
  },
  {
    id: 5,
    title: "Corte Texturizado",
    category: "Textura Natural",
    image: "/assets/images/kingsman-portfolio-textured.jpg",
    description: "Textura natural con volumen controlado",
  },
  {
    id: 6,
    title: "Look Ejecutivo",
    category: "Profesional",
    image: "/assets/images/kingsman-portfolio-executive.jpg",
    description: "Elegancia para el profesional moderno",
  },
];

const Portafolio: React.FC = () => {
  const gridRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    scrollManager.init();

    if (itemsRef.current.length > 0) {
      scrollManager.createScrollReveal(itemsRef.current.filter(Boolean), {
        y: 80,
        opacity: 0,
        duration: 1,
        stagger: 0.15,
      });
    }

    return () => {
      // No usar killAll aquí
    };
  }, []);

  return (
    <section className="py-20 bg-background min-h-screen relative overflow-hidden">
      {/* Background decoration premium */}
      <div className="absolute inset-0 bg-gradient-to-br from-golden/5 via-transparent to-stone/10" />
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-golden/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-stone/10 rounded-full blur-2xl" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Header Premium */}
        <div className="text-center mb-20">
          <div className="inline-block relative">
            <h2 className="font-display font-display-black text-clamp-3xl lg:text-6xl text-golden mb-6 tracking-display">
              PORTAFOLIO
            </h2>
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-transparent via-golden to-transparent" />
            <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-16 h-px bg-gradient-to-r from-transparent via-golden/50 to-transparent" />
          </div>
          <p className="font-body text-clamp-lg text-text-inactive tracking-wide max-w-2xl mx-auto mt-8">
            Cada corte cuenta una historia. Descubre algunos de nuestros
            trabajos más destacados.
          </p>
        </div>

        {/* Grid Premium */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto"
        >
          {trabajos.map((trabajo, index) => (
            <div
              key={trabajo.id}
              ref={(el) => {
                itemsRef.current[index] = el;
              }}
              className="group cursor-pointer"
            >
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-stone/10 to-background border border-golden/10 backdrop-blur-sm hover:border-golden/30 transition-all duration-500">
                {/* Imagen principal con efectos premium */}
                <div className="aspect-[4/5] overflow-hidden relative">
                  <div
                    className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                    style={{
                      backgroundImage: `url(${trabajo.image})`,
                    }}
                  >
                    {/* Fallback elegante con gradiente */}
                    <div className="absolute inset-0 bg-gradient-to-br from-golden/30 to-stone/60 flex items-center justify-center">
                      <span className="text-golden font-display text-3xl opacity-60 tracking-display">
                        {trabajo.title.split(" ")[0]}
                      </span>
                    </div>

                    {/* Overlay gradiente elegante */}
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500" />

                    {/* Borde interior dorado */}
                    <div className="absolute inset-2 border border-golden/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>

                  {/* Overlay de información premium */}
                  <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-end">
                    <div className="p-6 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                      <div className="inline-block px-3 py-1 bg-golden/20 border border-golden/30 rounded-full mb-3 backdrop-blur-sm">
                        <span className="text-golden text-xs font-body font-body-medium tracking-wide">
                          {trabajo.category}
                        </span>
                      </div>
                      <p className="text-text-inactive text-sm font-body leading-relaxed">
                        {trabajo.description}
                      </p>
                    </div>
                  </div>

                  {/* Icono de zoom premium */}
                  <div className="absolute top-4 right-4 w-10 h-10 bg-background/80 backdrop-blur-sm border border-golden/30 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transform scale-75 group-hover:scale-100 transition-all duration-300">
                    <span className="text-golden text-sm">⚡</span>
                  </div>

                  {/* Shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
                </div>

                {/* Info inferior premium */}
                <div className="p-6">
                  <h3 className="font-display font-display-bold text-clamp-lg text-text-active mb-2 tracking-display group-hover:text-golden transition-colors duration-300">
                    {trabajo.title}
                  </h3>

                  {/* Línea decorativa animada */}
                  <div className="w-12 h-px bg-gradient-to-r from-golden/50 to-transparent mb-3 group-hover:w-20 transition-all duration-500" />

                  <p className="text-text-inactive text-clamp-sm font-body">
                    {trabajo.category}
                  </p>

                  {/* Stats decorativos */}
                  <div className="mt-4 flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-golden/60 rounded-full"></div>
                      <span className="text-xs text-text-inactive">
                        Premium
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-golden/40 rounded-full"></div>
                      <span className="text-xs text-text-inactive">
                        Kingsman
                      </span>
                    </div>
                  </div>
                </div>

                {/* Glow effect premium */}
                <div className="absolute inset-0 bg-gradient-to-t from-golden/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-3xl pointer-events-none" />
              </div>
            </div>
          ))}
        </div>

        {/* CTA Premium mejorado */}
        <div className="text-center mt-20">
          <button className="relative inline-block bg-gradient-to-r from-golden/10 to-golden/5 border-2 border-golden/30 text-golden px-12 py-4 rounded-full font-body font-body-medium text-clamp-lg hover:border-golden hover:bg-golden hover:text-background transition-all duration-500 focus-golden transform hover:scale-105 group overflow-hidden shadow-golden">
            <span className="relative z-10">Ver Más Trabajos</span>
            <div className="absolute inset-0 bg-golden transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-center rounded-full" />

            {/* Partículas decorativas */}
            <div
              className="absolute top-2 right-4 w-1 h-1 bg-golden/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ animationDelay: "0.1s" }}
            ></div>
            <div
              className="absolute bottom-2 left-6 w-1 h-1 bg-golden/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ animationDelay: "0.2s" }}
            ></div>
          </button>
        </div>
      </div>
    </section>
  );
};

export default Portafolio;
