import React, { useEffect, useRef } from "react";
import Object3D from "../three/Object3D";
import { useThreeResponsive } from "../hooks/useThreeResponsive";

const Hero: React.FC = () => {
  const taglineRef = useRef<HTMLDivElement>(null);
  const { shouldRender, isReducedMotion } = useThreeResponsive();

  useEffect(() => {
    // Animación de aparición de letras
    const letters = taglineRef.current?.querySelectorAll(".letter");
    if (letters && !isReducedMotion) {
      letters.forEach((letter, index) => {
        const element = letter as HTMLElement;
        element.style.animationDelay = `${index * 0.1}s`;
        element.classList.add("animate-fade-in");
      });
    }
  }, [isReducedMotion]);

  const taglineText = "Creamos looks de leyenda";
  const letters = taglineText.split("").map((char, index) => (
    <span
      key={index}
      className={`letter inline-block ${char === " " ? "w-4" : ""}`}
      style={{
        opacity: isReducedMotion ? 1 : 0,
        transform: isReducedMotion ? "none" : "translateY(20px)",
      }}
    >
      {char === " " ? "\u00A0" : char}
    </span>
  ));

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background con gradiente y glow */}
      <div
        className="absolute inset-0 opacity-90"
        style={{
          background: `
            radial-gradient(circle at 30% 20%, rgba(100, 100, 255, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 70% 80%, rgba(150, 50, 200, 0.1) 0%, transparent 50%),
            linear-gradient(135deg, #0B0B0B 0%, #1A1A1A 50%, #0B0B0B 100%)
          `,
        }}
      />

      {/* Logo principal centrado - usando imagen de Kingsman */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-5 opacity-5">
        <div
          className="w-96 h-96 bg-contain bg-center bg-no-repeat"
          style={{
            backgroundImage: "url(/assets/images/kingsman-logo.png)",
            filter: "sepia(1) hue-rotate(30deg) saturate(2)",
          }}
        />
      </div>

      {/* Glow animado */}
      <div
        className={`absolute inset-0 opacity-30 ${
          !isReducedMotion ? "animate-glow-pulse" : ""
        }`}
        style={{
          background:
            "radial-gradient(circle at center, rgba(212, 175, 55, 0.1) 0%, transparent 70%)",
        }}
      />

      {/* Objeto 3D o Fallback Premium */}
      <div className="absolute right-10 top-1/2 transform -translate-y-1/2 hidden lg:block">
        {shouldRender ? (
          <div className="w-96 h-96">
            <Object3D className="opacity-60 hover:opacity-100 transition-opacity duration-500" />
          </div>
        ) : (
          // Fallback premium mejorado con logo Kingsman
          <div className="w-96 h-96 flex items-center justify-center">
            <div className="relative">
              {/* Círculos concéntricos elegantes */}
              <div className="absolute inset-0 border-2 border-golden/20 rounded-full animate-pulse" />
              <div
                className="absolute inset-4 border border-golden/30 rounded-full animate-pulse"
                style={{ animationDelay: "0.5s" }}
              />
              <div
                className="absolute inset-8 border border-golden/40 rounded-full animate-pulse"
                style={{ animationDelay: "1s" }}
              />

              {/* Logo Kingsman central */}
              <div className="w-32 h-32 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div
                  className="w-full h-full bg-contain bg-center bg-no-repeat opacity-80"
                  style={{
                    backgroundImage:
                      "url(/assets/images/kingsman-barber-icon.png)",
                  }}
                />
              </div>

              <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2">
                <span className="text-golden/40 font-display text-sm tracking-wide">
                  KINGSMAN BARBER
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Contenido principal */}
      <div className="relative z-10 text-center px-4 max-w-6xl mx-auto lg:mr-96">
        {/* Título principal */}
        <h1 className="font-display font-display-black text-clamp-5xl lg:text-8xl text-golden mb-6 tracking-display">
          KINGSMAN
        </h1>

        <div className="font-display font-display-bold text-clamp-2xl lg:text-4xl text-text-active mb-12 tracking-display opacity-80">
          BARBERÍA & TATTOO
        </div>

        {/* Tagline con letras espaciadas */}
        <div
          ref={taglineRef}
          className="font-display font-display-bold text-clamp-xl lg:text-3xl text-text-inactive mb-16 tracking-[0.2em] lg:tracking-[0.3em]"
        >
          {letters}
        </div>

        {/* CTA Premium con gradientes */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button className="relative overflow-hidden bg-golden text-background px-8 py-4 rounded-full font-body font-body-medium text-clamp-lg transition-all duration-300 focus-golden transform hover:scale-105 group shadow-golden">
            <span className="relative z-10">Reservar Cita</span>
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-golden transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
          </button>

          <button className="relative overflow-hidden border-2 border-golden text-golden px-8 py-4 rounded-full font-body font-body-medium text-clamp-lg transition-all duration-300 focus-golden group">
            <span className="relative z-10">Ver Servicios</span>
            <div className="absolute inset-0 bg-golden transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center" />
          </button>
        </div>

        {/* Indicador de scroll mejorado */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 hidden lg:block">
          <div
            className={`flex flex-col items-center ${
              !isReducedMotion ? "animate-bounce" : ""
            }`}
          >
            <span className="text-text-inactive font-body text-sm mb-3 tracking-wide opacity-60">
              Descubre más
            </span>
            <div className="relative">
              <div className="w-8 h-12 border-2 border-golden/40 rounded-full flex justify-center relative overflow-hidden">
                <div
                  className={`w-1 h-3 bg-golden rounded-full mt-2 ${
                    !isReducedMotion ? "animate-pulse" : ""
                  }`}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-golden/10 to-transparent" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative elements premium */}
      <div className="absolute top-20 left-10 hidden lg:block">
        <div className="relative">
          <div
            className={`w-24 h-24 border border-golden/20 rounded-full ${
              !isReducedMotion ? "animate-pulse" : ""
            }`}
          />
          <div className="absolute inset-3 border border-golden/10 rounded-full" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-golden/30 rounded-full" />
        </div>
      </div>

      <div className="absolute bottom-20 right-10 hidden lg:block">
        <div className="relative">
          <div
            className={`w-32 h-32 border border-golden/10 rounded-full ${
              !isReducedMotion ? "animate-pulse" : ""
            }`}
            style={{ animationDelay: isReducedMotion ? "0s" : "1s" }}
          />
          <div className="absolute inset-4 border border-golden/20 rounded-full" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-golden/20 rounded-full" />
        </div>
      </div>

      {/* Elementos flotantes adicionales */}
      <div
        className="absolute top-1/4 left-1/3 w-2 h-2 bg-golden/40 rounded-full hidden lg:block animate-pulse"
        style={{ animationDelay: "2s" }}
      />
      <div
        className="absolute bottom-1/3 left-1/4 w-1 h-1 bg-golden/60 rounded-full hidden lg:block animate-pulse"
        style={{ animationDelay: "3s" }}
      />
      <div
        className="absolute top-2/3 right-1/3 w-3 h-3 border border-golden/30 rounded-full hidden lg:block animate-pulse"
        style={{ animationDelay: "1.5s" }}
      />
    </section>
  );
};

export default Hero;
