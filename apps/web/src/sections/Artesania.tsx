import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

export default function Artesania() {
  const root = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = root.current!;
    const img = el.querySelector("[data-parallax]") as HTMLElement | null;
    if (!img) return;
    const st = ScrollTrigger.create({
      trigger: el,
      start: "top bottom-=20%",
      end: "bottom top+=20%",
      scrub: 0.8,
      onUpdate: (self) => {
        const p = (self.progress - 0.5) * 2; // -1..1
        img.style.transform = `translateY(${p * -24}px) scale(1.02)`;
      },
    });
    return () => st.kill();
  }, []);

  return (
    <section
      ref={root}
      aria-label="Artesanía y precisión"
      className="relative bg-[#0B0B0B] py-16 md:py-24"
    >
      <div className="container mx-auto px-4 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <h2
            className="font-serif font-bold tracking-[.06em]"
            style={{ fontSize: "clamp(1.5rem,1rem+2vw,3rem)" }}
          >
            Artesanía &amp; Precisión
          </h2>
          <p className="mt-3 text-[#C7C7C7]">
            Cortes limpios, fades quirúrgicos y rituales de cuidado. Nos
            obsesiona la textura, la simetría y el acabado.
          </p>
          <ul className="mt-6 space-y-2 text-sm text-[#C7C7C7]">
            <li>• Fades y contornos de alta definición</li>
            <li>• Beard spa y skin care express</li>
            <li>• Productos propios Kingsman BINK</li>
          </ul>
        </div>

        <div className="relative">
          <div
            data-parallax
            className="rounded-2xl border border-white/10 overflow-hidden shadow-[0_18px_60px_rgba(0,0,0,.45)]"
          >
            <img
              src="/images/kingsman/IMG_4124.webp"
              alt="Detalle de servicio"
              className="w-full h-[380px] object-cover"
              loading="lazy"
            />
          </div>
          <div
            aria-hidden
            className="absolute -z-10 -inset-6 rounded-[28px] bg-[radial-gradient(ellipse_at_60%_20%,rgba(212,175,55,.18),transparent_60%)]"
          />
        </div>
      </div>
    </section>
  );
}
