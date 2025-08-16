// apps/web/src/sections/ParallaxShowcase.tsx
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { mountReveals } from "@/lib/reveal";
gsap.registerPlugin(ScrollTrigger);

type Img = { src: string; alt: string };

type Props = {
  // Pasa las 3 imágenes desde la página (API sin cambios).
  left: Img; // p.ej. { src: "/images/kingsman/img_3363-full.webp", alt: "Barbería – plano 1" }
  right: Img; // p.ej. { src: "/images/kingsman/IMG_4274.webp",       alt: "Barbería – plano 2" }
  center: Img; // p.ej. { src: "/images/kingsman/img_4914-full.webp",  alt: "Kingsman Shampoo" }
};

export default function ParallaxShowcase({ left, right, center }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    // (opcional) Pre-carga/definición de variantes; rutas actualizadas a /images/kingsman
    const images = [
      {
        src: "/images/kingsman/img_3363-full.webp",
        srcSet: "/images/kingsman/img_3363-full.webp 1080w",
        alt: "Barbero en estudio con su perro",
      },
      {
        src: "/images/kingsman/img_3357-full.webp",
        srcSet: "/images/kingsman/img_3357-full.webp 1080w",
        alt: "Interior del estudio Kingsman",
      },
      {
        src: "/images/kingsman/img_4914-full.webp",
        srcSet: "/images/kingsman/img_4914-full.webp 1080w",
        alt: "Arte shampoo Kingsman",
      },
    ];
    void images; // evita warning si no las usas directamente

    // pin + scrub del bloque
    const mm = gsap.matchMedia();
    mm.add("(min-width: 768px)", () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: "bottom+=60% top",
          scrub: 1.4,
          pin: true,
          anticipatePin: 1,
        },
      });

      tl.fromTo(
        el.querySelector("[data-layer='bg']"),
        { yPercent: 0, opacity: 0.7 },
        { yPercent: -10, opacity: 1, ease: "none" },
        0
      );
      tl.fromTo(
        el.querySelector("[data-layer='mid']"),
        { yPercent: 10, scale: 0.98, opacity: 0.6 },
        { yPercent: -10, scale: 1, opacity: 1, ease: "none" },
        0
      );
      tl.fromTo(
        el.querySelector("[data-layer='front']"),
        { yPercent: 20, scale: 0.96, opacity: 0.0 },
        { yPercent: -20, scale: 1, opacity: 1, ease: "none" },
        0
      );

      return () => {
        tl.scrollTrigger?.kill();
        tl.kill();
      };
    });

    const off = mountReveals(el);
    return () => {
      mm.revert();
      off();
    };
  }, []);

  return (
    <section
      ref={rootRef}
      className="relative min-h-[160svh] bg-[#0B0B0B]"
      aria-label="Showcase parallax"
    >
      {/* glow de fondo */}
      <div
        data-layer="bg"
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 30%, rgba(52,64,160,0.25), transparent 60%), linear-gradient(180deg,#0B0B0B 0%, #0B0B0B 40%, #0B0B0B 100%)",
        }}
      />

      {/* contenido “pin” */}
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        {/* izquierda (media) */}
        <img
          src={left.src}
          alt={left.alt}
          data-layer="mid"
          data-reveal
          data-depth="0.4"
          className="absolute left-[6%] top-1/2 -translate-y-1/2 w-[38%] max-w-[520px] rounded-2xl border border-white/8 shadow-[0_8px_30px_rgba(0,0,0,.35)] object-cover"
        />

        {/* derecha (frontal) */}
        <img
          src={right.src}
          alt={right.alt}
          data-layer="front"
          data-reveal
          data-depth="0.7"
          className="absolute right-[6%] top-1/2 -translate-y-1/2 w-[40%] max-w-[560px] rounded-2xl border border-white/8 shadow-[0_10px_40px_rgba(0,0,0,.45)] object-cover"
        />

        {/* centro – producto / logo */}
        <div
          data-reveal
          data-depth="0.9"
          className="absolute left-1/2 top-[58%] -translate-x-1/2 -translate-y-1/2 text-center"
        >
          <img
            src={center.src}
            alt={center.alt}
            className="w-[220px] md:w-[300px] mx-auto drop-shadow-[0_12px_60px_rgba(212,175,55,.25)]"
            loading="lazy"
          />
          <p className="mt-3 text-sm md:text-base text-[#C7C7C7]">
            Productos propios • acabado premium
          </p>
        </div>
      </div>
    </section>
  );
}
