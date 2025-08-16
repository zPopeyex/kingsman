// apps/web/src/lib/reveal.ts
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

export function mountReveals(
  root: HTMLElement | Document = document,
  {
    once = true,
    defaultY = 40,
    defaultOpacity = 0,
  }: { once?: boolean; defaultY?: number; defaultOpacity?: number } = {}
) {
  const items = Array.from(
    root.querySelectorAll<HTMLElement>("[data-reveal]")
  );
  const cleanups: Array<() => void> = [];

  items.forEach((el) => {
    const depth = Number(el.dataset.depth ?? 0); // 0–1 (más alto = más rápido)
    const fromY =
      el.dataset.fromY != null ? Number(el.dataset.fromY) : defaultY;
    const dur = el.dataset.dur ? Number(el.dataset.dur) : 0.9;

    gsap.set(el, { y: fromY, opacity: defaultOpacity, willChange: "transform" });

    const tween = gsap.to(el, {
      y: 0,
      opacity: 1,
      ease: "power3.out",
      duration: dur,
      scrollTrigger: {
        trigger: el,
        start: "top 80%",
        toggleActions: once ? "play none none none" : "play reverse play reverse",
      },
    });

    // Parallax fino mientras se hace scroll (scrub)
    if (depth > 0) {
      const p = gsap.to(el, {
        yPercent: -depth * 20,
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.2,
        },
      });
      cleanups.push(() => p.kill());
    }
    cleanups.push(() => {
      tween.scrollTrigger?.kill();
      tween.kill();
    });
  });

  return () => cleanups.forEach((c) => c());
}
