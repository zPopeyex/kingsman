import React, { useEffect, useRef } from "react";
import { scrollManager } from "../lib/scroll";

const ParallaxLayers: React.FC = () => {
  const bgLayerRef = useRef<HTMLDivElement>(null);
  const midLayerRef = useRef<HTMLDivElement>(null);
  const fgLayerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollManager.init();

    // Crear efectos parallax para cada capa con diferentes velocidades
    if (bgLayerRef.current) {
      scrollManager.createParallax(bgLayerRef.current, 0.2); // Más lento
    }
    if (midLayerRef.current) {
      scrollManager.createParallax(midLayerRef.current, 0.5); // Velocidad media
    }
    if (fgLayerRef.current) {
      scrollManager.createParallax(fgLayerRef.current, 0.8); // Más rápido
    }

    return () => {
      scrollManager.killAll();
    };
  }, []);

  return (
    <section className="relative h-[200vh] overflow-hidden">
      {/* Background Layer - más lento */}
      <div
        ref={bgLayerRef}
        className="absolute inset-0 will-change-transform"
        style={{
          backgroundImage: "url(/assets/images/barber-shop-bg.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "brightness(0.3) sepia(0.2) hue-rotate(30deg)",
        }}
      >
        {/* Fallback gradient si no hay imagen */}
        <div className="absolute inset-0 bg-gradient-to-br from-stone via-background to-stone opacity-80" />
      </div>

      {/* Mid Layer - velocidad media */}
      <div
        ref={midLayerRef}
        className="absolute inset-0 will-change-transform flex items-center justify-center"
      >
        <div className="text-center">
          <h2 className="font-display font-display-black text-clamp-4xl lg:text-7xl text-golden/20 mb-4 tracking-display">
            ESTILO
          </h2>
          <p className="font-body text-clamp-lg text-text-inactive/40 tracking-wide">
            Tradición & Modernidad
          </p>
        </div>
      </div>

      {/* Foreground Layer - más rápido */}
      <div ref={fgLayerRef} className="absolute inset-0 will-change-transform">
        {/* Elementos decorativos que se mueven más rápido */}
        <div className="absolute top-1/4 left-1/4 w-32 h-32 border border-golden/30 rounded-full hidden lg:block" />
        <div className="absolute bottom-1/4 right-1/4 w-24 h-24 border border-golden/20 rounded-full hidden lg:block" />

        {/* Texto overlay */}
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 text-center">
          <p className="font-display font-display-bold text-clamp-xl text-text-active tracking-display">
            EXPERIENCIA PREMIUM
          </p>
        </div>
      </div>
    </section>
  );
};

export default ParallaxLayers;
