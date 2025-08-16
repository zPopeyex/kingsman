import React, { useState, useEffect } from "react";
import Preloader from "../components/Preloader";
import Header from "../components/Header";
import Hero from "../sections/Hero";
import ParallaxLayers from "../sections/ParallaxLayers";
import Servicios from "../sections/Servicios";
import Portafolio from "../sections/Portafolio";
import GoldenCursor from "../components/GoldenCursor";
import AnimationsToggle from "../components/AnimationsToggle";
import MicroInteractions from "../components/MicroInteractions";
import SafeBlendModes from "../components/SafeBlendModes";

const LandingParallax: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3200);

    return () => clearTimeout(timer);
  }, []);

  return (
    <SafeBlendModes fallbackClassName="no-blend-support">
      <div className="min-h-screen bg-background">
        {isLoading && <Preloader />}

        <Header />

        <main>
          <Hero />
          <ParallaxLayers />
          <Servicios />
          <Portafolio />

          {/* Footer Premium */}
          <footer className="relative py-20 bg-gradient-to-t from-stone/20 to-background border-t border-golden/10">
            {/* Background decorativo */}
            <div className="absolute inset-0 opacity-5">
              <div
                className="w-full h-full bg-contain bg-center bg-no-repeat"
                style={{
                  backgroundImage: "url(/assets/images/kingsman-logo.png)",
                  filter: "sepia(1) hue-rotate(30deg) saturate(2)",
                }}
              />
            </div>

            <div className="container mx-auto px-4 relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
                {/* Info de contacto */}
                <div className="text-center md:text-left">
                  <h3 className="font-display font-display-bold text-clamp-xl text-golden mb-4 tracking-display">
                    KINGSMAN
                  </h3>
                  <p className="font-body text-text-inactive mb-4 leading-relaxed">
                    Barbería & Tattoo premium donde creamos looks de leyenda con
                    técnicas tradicionales y estilo moderno.
                  </p>
                  <div className="flex items-center justify-center md:justify-start gap-4">
                    <div className="w-8 h-8 border border-golden/30 rounded-full flex items-center justify-center hover:bg-golden/20 transition-colors cursor-pointer">
                      <span className="text-golden text-sm">📱</span>
                    </div>
                    <div className="w-8 h-8 border border-golden/30 rounded-full flex items-center justify-center hover:bg-golden/20 transition-colors cursor-pointer">
                      <span className="text-golden text-sm">📧</span>
                    </div>
                    <div className="w-8 h-8 border border-golden/30 rounded-full flex items-center justify-center hover:bg-golden/20 transition-colors cursor-pointer">
                      <span className="text-golden text-sm">📍</span>
                    </div>
                  </div>
                </div>

                {/* Servicios rápidos */}
                <div className="text-center">
                  <h4 className="font-display font-display-bold text-clamp-lg text-text-active mb-4 tracking-display">
                    Servicios
                  </h4>
                  <ul className="space-y-2">
                    <li className="font-body text-text-inactive hover:text-golden transition-colors cursor-pointer">
                      Corte Clásico
                    </li>
                    <li className="font-body text-text-inactive hover:text-golden transition-colors cursor-pointer">
                      Afeitado Premium
                    </li>
                    <li className="font-body text-text-inactive hover:text-golden transition-colors cursor-pointer">
                      Diseño de Barba
                    </li>
                    <li className="font-body text-text-inactive hover:text-golden transition-colors cursor-pointer">
                      Tatuajes
                    </li>
                  </ul>
                </div>

                {/* Horarios */}
                <div className="text-center md:text-right">
                  <h4 className="font-display font-display-bold text-clamp-lg text-text-active mb-4 tracking-display">
                    Horarios
                  </h4>
                  <div className="space-y-2">
                    <div className="font-body text-text-inactive">
                      <span className="text-golden">Lun - Vie:</span> 9:00 -
                      19:00
                    </div>
                    <div className="font-body text-text-inactive">
                      <span className="text-golden">Sábado:</span> 9:00 - 17:00
                    </div>
                    <div className="font-body text-text-inactive">
                      <span className="text-golden">Domingo:</span> Cerrado
                    </div>
                  </div>
                </div>
              </div>

              {/* Divisor decorativo */}
              <div className="w-full h-px bg-gradient-to-r from-transparent via-golden/30 to-transparent mb-8" />

              {/* Copyright */}
              <div className="text-center">
                <p className="font-body text-text-inactive" data-text-reveal>
                  © 2024 Kingsman Barber & Tattoo. Todos los derechos
                  reservados.
                </p>
                <p className="font-body text-text-inactive text-sm mt-2 opacity-60">
                  Diseño premium - Creamos looks de leyenda
                </p>
              </div>
            </div>
          </footer>
        </main>

        {/* Micro-interacciones globales */}
        <GoldenCursor />
        <AnimationsToggle />
        <MicroInteractions />
      </div>
    </SafeBlendModes>
  );
};

export default LandingParallax;
