import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Registrar plugins
gsap.registerPlugin(ScrollTrigger)

export class ScrollManager {
  private static instance: ScrollManager
  private isInitialized = false

  static getInstance(): ScrollManager {
    if (!ScrollManager.instance) {
      ScrollManager.instance = new ScrollManager()
    }
    return ScrollManager.instance
  }

  init() {
    if (this.isInitialized) return
    
    // Configuración global de ScrollTrigger
    ScrollTrigger.defaults({
      toggleActions: "play none none reverse",
      scroller: "body"
    })

    // Actualizar ScrollTrigger en resize
    ScrollTrigger.addEventListener("refresh", () => ScrollTrigger.update())

    this.isInitialized = true
  }

  // Helper para crear animaciones de parallax
  createParallax(element: string | Element, speed: number = 0.5) {
    return gsap.to(element, {
      yPercent: -50 * speed,
      ease: "none",
      scrollTrigger: {
        trigger: element,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
        invalidateOnRefresh: true
      }
    })
  }

  // Helper para secciones pin con scroll
  createPinnedSection(trigger: string | Element, duration: string = "200%") {
    return ScrollTrigger.create({
      trigger,
      start: "top top",
      end: `+=${duration}`,
      pin: true,
      anticipatePin: 1,
      scrub: 1,
      invalidateOnRefresh: true
    })
  }

  // Helper para reel horizontal
  createHorizontalScroll(container: string | Element, items: string | (Element | null)[]) {
    const itemsArray = Array.isArray(items) 
      ? items.filter((item): item is Element => item !== null)
      : gsap.utils.toArray(items)
    
    return gsap.to(itemsArray, {
      xPercent: -100 * (itemsArray.length - 1),
      ease: "none",
      scrollTrigger: {
        trigger: container,
        start: "top top",
        end: () => "+=" + (itemsArray.length * window.innerWidth),
        pin: true,
        scrub: 2,
        snap: {
          snapTo: 1 / (itemsArray.length - 1),
          duration: 0.5,
          delay: 0.1
        },
        anticipatePin: 1,
        invalidateOnRefresh: true
      }
    })
  }

  // Helper para reveal animations
  createScrollReveal(elements: string | (Element | null)[], options: {
    y?: number,
    opacity?: number,
    duration?: number,
    stagger?: number
  } = {}) {
    const { y = 50, opacity = 0, duration = 1, stagger = 0.1 } = options
    
    const elementsArray = Array.isArray(elements) 
      ? elements.filter((el): el is Element => el !== null)
      : elements
    
    return gsap.fromTo(elementsArray, 
      { y, opacity },
      {
        y: 0,
        opacity: 1,
        duration,
        stagger,
        ease: "power2.out",
        scrollTrigger: {
          trigger: elementsArray,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse"
        }
      }
    )
  }

  // Limpiar todas las animaciones
  killAll() {
    ScrollTrigger.killAll()
    gsap.killTweensOf("*")
  }

  // Refrescar ScrollTrigger
  refresh() {
    ScrollTrigger.refresh()
  }
}

// Instancia global
export const scrollManager = ScrollManager.getInstance()

// Export función applyParallax requerida por GalleryFlow
export const applyParallax = async (
  items: HTMLElement[], 
  options: { scrub?: number } = {}
): Promise<() => void> => {
  const { scrub = 0.8 } = options;
  
  // Aplicar parallax a cada elemento basado en su data-depth
  const tweens = items.map(item => {
    const depth = parseFloat(item.dataset.depth || '0.5');
    return gsap.to(item, {
      yPercent: -50 * depth,
      ease: "none",
      scrollTrigger: {
        trigger: item,
        start: "top bottom",
        end: "bottom top",
        scrub: scrub,
        invalidateOnRefresh: true
      }
    });
  });

  // Retornar función de cleanup
  return () => {
    tweens.forEach(tween => tween.kill());
  };
};