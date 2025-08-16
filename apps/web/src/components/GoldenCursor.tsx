import React, { useEffect, useRef, useState } from "react";

const GoldenCursor: React.FC = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);

  useEffect(() => {
    // Detectar si es dispositivo táctil
    const isTouchDevice =
      "ontouchstart" in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) return;

    setIsVisible(true);

    const cursor = cursorRef.current;
    const cursorDot = cursorDotRef.current;
    if (!cursor || !cursorDot) return;

    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;
    let dotX = 0;
    let dotY = 0;

    // Smooth cursor follow
    const animateCursor = () => {
      // Cursor principal (con delay)
      cursorX += (mouseX - cursorX) * 0.1;
      cursorY += (mouseY - cursorY) * 0.1;

      // Dot central (más rápido)
      dotX += (mouseX - dotX) * 0.3;
      dotY += (mouseY - dotY) * 0.3;

      cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0)`;
      cursorDot.style.transform = `translate3d(${dotX}px, ${dotY}px, 0)`;

      requestAnimationFrame(animateCursor);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseDown = () => {
      setIsClicking(true);
    };

    const handleMouseUp = () => {
      setIsClicking(false);
    };

    // Detectar elementos interactivos
    const handleElementHover = (e: Event) => {
      const target = e.target as HTMLElement;
      const isInteractive = target.matches(
        'a, button, input, textarea, select, [role="button"], [tabindex]:not([tabindex="-1"])'
      );
      setIsHovering(isInteractive);
    };

    // Event listeners
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseenter", handleMouseEnter);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mouseover", handleElementHover);

    // Iniciar animación
    animateCursor();

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseenter", handleMouseEnter);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mouseover", handleElementHover);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] mix-blend-difference">
      {/* Cursor principal */}
      <div
        ref={cursorRef}
        className={`absolute w-8 h-8 border-2 border-golden rounded-full transition-all duration-300 ease-out ${
          isHovering
            ? "scale-150 border-opacity-60"
            : "scale-100 border-opacity-40"
        } ${isClicking ? "scale-75" : ""}`}
        style={{
          left: "-16px",
          top: "-16px",
          backdropFilter: "invert(1)",
        }}
      />

      {/* Dot central */}
      <div
        ref={cursorDotRef}
        className={`absolute w-2 h-2 bg-golden rounded-full transition-all duration-150 ease-out ${
          isHovering ? "scale-0" : "scale-100"
        } ${isClicking ? "scale-150" : ""}`}
        style={{
          left: "-4px",
          top: "-4px",
        }}
      />
    </div>
  );
};

export default GoldenCursor;
