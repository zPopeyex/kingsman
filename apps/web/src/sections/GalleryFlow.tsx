import { useEffect, useRef } from "react";
import { applyParallax } from "@/lib/scroll";

/**
 * Reel horizontal con snap + leves velocidades diferentes (parallax) para dar profundidad.
 * Accesible por teclado (tab y flechas) y navegable con rueda/táctil.
 */
export default function GalleryFlow() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;

    // distintos data-depth para cada tarjeta
    const items = Array.from(el.querySelectorAll<HTMLElement>("[data-depth]"));
    let dispose: any;
    (async () => (dispose = await applyParallax(items, { scrub: 0.8 })))();
    return () => dispose && dispose();
  }, []);

  const card =
    "snap-center shrink-0 w-[78vw] md:w-[38vw] xl:w-[28vw] rounded-2xl overflow-hidden border border-white/10 bg-[#111111]/60 shadow-[0_8px_30px_rgba(212,175,55,0.15)]";

  return (
    <section
      ref={root}
      className="relative bg-[#0B0B0B] py-14 md:py-16"
      aria-labelledby="gallery-title"
    >
      <div className="container mx-auto px-4">
        <h2
          id="gallery-title"
          className="font-serif tracking-[0.06em] text-[clamp(1.4rem,1rem+1.5vw,2.2rem)] mb-6"
        >
          El lugar, el detalle, el estilo
        </h2>

        <div
          className="
            overflow-x-auto no-scrollbar snap-x snap-mandatory
            flex gap-5 md:gap-6 items-stretch
            [scrollbar-width:none] [-ms-overflow-style:none]
          "
          role="list"
          aria-label="Galería Kingsman"
        >
          {/* tarjeta 1 */}
          <article
            role="listitem"
            className={card}
            data-depth="0.6"
            tabIndex={0}
          >
            <img
              src="/images/kingsman/IMG_4124.webp"
              alt="Cliente con mascarilla facial durante el servicio"
              loading="lazy"
              className="w-full h-full object-cover"
            />
          </article>

          {/* tarjeta 2 */}
          <article
            role="listitem"
            className={card}
            data-depth="0.5"
            tabIndex={0}
          >
            <img
              src="/images/kingsman/img_3357-full.webp"
              alt="Barbero con su perro Paco en la silla"
              loading="lazy"
              className="w-full h-full object-cover"
            />
          </article>

          {/* tarjeta 3 */}
          <article
            role="listitem"
            className={card}
            data-depth="0.8"
            tabIndex={0}
          >
            <img
              src="/images/kingsman/IMG_4274.webp"
              alt="Ambiente de estudio con TV y plantas"
              loading="lazy"
              className="w-full h-full object-cover"
            />
          </article>

          {/* tarjeta 4 */}
          <article
            role="listitem"
            className={card}
            data-depth="0.7"
            tabIndex={0}
          >
            <img
              src="/images/kingsman/IMG_0231.webp"
              alt="Botella de shampoo Kingsman Bink"
              loading="lazy"
              className="w-full h-full object-cover"
            />
          </article>
        </div>
      </div>
    </section>
  );
}
