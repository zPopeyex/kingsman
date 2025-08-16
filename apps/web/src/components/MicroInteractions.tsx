import React, { useEffect, useRef } from "react";

const MicroInteractions: React.FC = () => {
  const rippleContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Ripple effect en clicks
    const createRipple = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isButton = target.matches('button, a, [role="button"]');

      if (!isButton || !rippleContainerRef.current) return;

      const rect = target.getBoundingClientRect();
      const ripple = document.createElement("div");

      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;

      ripple.style.cssText = `
        position: absolute;
        border-radius: 50%;
        background: rgba(212, 175, 55, 0.3);
        width: ${size}px;
        height: ${size}px;
        left: ${rect.left + x}px;
        top: ${rect.top + y}px;
        pointer-events: none;
        transform: scale(0);
        animation: ripple-animation 0.6s ease-out;
        z-index: 9998;
      `;

      rippleContainerRef.current.appendChild(ripple);

      // Limpiar después de la animación
      setTimeout(() => {
        if (ripple.parentNode) {
          ripple.parentNode.removeChild(ripple);
        }
      }, 600);
    };

    // Magnetic hover effect - CORREGIDO
    const magneticHover = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      const isInteractive = target.matches("button, a, [data-magnetic]");
      if (!isInteractive) return;

      const rect = target.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const deltaX = (e.clientX - centerX) * 0.1;
      const deltaY = (e.clientY - centerY) * 0.1;

      if (target.style) {
        target.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
      }
    };

    // Magnetic leave - CORREGIDO con validaciones
    const magneticLeave = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target || !target.style) return;

      const isInteractive = target.matches("button, a, [data-magnetic]");
      if (!isInteractive) return;

      target.style.transform = "";
    };

    // Text reveal animation
    const observeTextElements = () => {
      const textElements = document.querySelectorAll("[data-text-reveal]");

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const element = entry.target as HTMLElement;
              const text = element.textContent || "";
              element.innerHTML = "";

              text.split("").forEach((char, index) => {
                const span = document.createElement("span");
                span.textContent = char === " " ? "\u00A0" : char;
                span.style.cssText = `
                display: inline-block;
                opacity: 0;
                transform: translateY(20px);
                animation: text-reveal 0.6s ease-out ${index * 0.03}s forwards;
              `;
                element.appendChild(span);
              });

              observer.unobserve(element);
            }
          });
        },
        { threshold: 0.1 }
      );

      textElements.forEach((el) => observer.observe(el));

      return () => observer.disconnect();
    };

    // Event listeners
    document.addEventListener("click", createRipple);
    document.addEventListener("mousemove", magneticHover);
    document.addEventListener("mouseleave", magneticLeave);

    // Observar elementos de texto
    const cleanupTextObserver = observeTextElements();

    return () => {
      document.removeEventListener("click", createRipple);
      document.removeEventListener("mousemove", magneticHover);
      document.removeEventListener("mouseleave", magneticLeave);
      cleanupTextObserver();
    };
  }, []);

  return (
    <>
      {/* Container para ripples */}
      <div
        ref={rippleContainerRef}
        className="pointer-events-none fixed inset-0 z-[9998]"
      />
    </>
  );
};

export default MicroInteractions;
