import React, { useEffect, useState } from "react";

const Preloader: React.FC = () => {
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => setIsComplete(true), 200);
          return 100;
        }
        return prev + 2;
      });
    }, 30);

    return () => clearInterval(timer);
  }, []);

  if (isComplete) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-background flex items-center justify-center"
      aria-live="polite"
      aria-label="Cargando contenido"
    >
      <div className="text-center">
        {/* Logo/Título */}
        <h1 className="font-display font-display-black text-clamp-4xl text-golden mb-8 tracking-display">
          KINGSMAN
        </h1>

        {/* Barra de progreso */}
        <div className="w-64 h-1 bg-stone mx-auto mb-4 overflow-hidden rounded-full">
          <div
            className="h-full bg-gradient-to-r from-golden to-yellow-400 transition-all duration-100 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Porcentaje */}
        <p className="font-body font-body-normal text-text-inactive text-clamp-sm tracking-wide">
          {progress}%
        </p>
      </div>
    </div>
  );
};

export default Preloader;
