// web/apps/src/utils/imageUtils.ts
export interface PortfolioImage {
  id: string;
  title: string;
  caption: string;
  category: string;
  src: string;
  alt: string;
  width: number;
  height: number;
  priority: boolean;
  palette: string[];
}

/**
 * Genera srcSet para imágenes responsivas
 * Crea variaciones optimizadas para diferentes densidades de pantalla
 */
export const buildSrcSet = (baseSrc: string, originalWidth: number): string => {
  // Remover extensión del archivo
  const withoutExt = baseSrc.replace(/\.(webp|jpg|jpeg|png)$/i, '');
  const ext = baseSrc.match(/\.(webp|jpg|jpeg|png)$/i)?.[1] || 'webp';
  
  // Generar diferentes tamaños (responsive breakpoints)
  const sizes = [
    { width: 400, suffix: '-sm' },
    { width: 800, suffix: '-md' },
    { width: 1200, suffix: '-lg' },
    { width: originalWidth, suffix: '' }, // Original
  ].filter(size => size.width <= originalWidth);

  return sizes
    .map(size => `${withoutExt}${size.suffix}.${ext} ${size.width}w`)
    .join(', ');
};

/**
 * Genera el atributo sizes para imágenes responsivas
 * Optimizado para grid masonry responsive
 */
export const buildSizes = (): string => {
  return [
    '(max-width: 640px) 100vw',      // Mobile: full width
    '(max-width: 768px) 50vw',       // Tablet: 2 columns
    '(max-width: 1024px) 33vw',      // Desktop small: 3 columns
    '(max-width: 1280px) 25vw',      // Desktop: 4 columns
    '20vw'                           // Large desktop: 5 columns
  ].join(', ');
};

/**
 * Calcula el aspect ratio para CSS
 */
export const getAspectRatio = (width: number, height: number): string => {
  return `${width} / ${height}`;
};

/**
 * Genera placeholder blur data URL
 */
export const generateBlurPlaceholder = (width: number, height: number, palette: string[]): string => {
  const canvas = document.createElement('canvas');
  canvas.width = 10;
  canvas.height = Math.round((height / width) * 10);
  
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';
  
  // Gradiente usando la paleta de colores
  const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  palette.forEach((color, index) => {
    gradient.addColorStop(index / (palette.length - 1), color);
  });
  
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  return canvas.toDataURL('image/jpeg', 0.1);
};

/**
 * Hook para lazy loading con Intersection Observer
 */
export const useLazyLoading = () => {
  const loadImage = (img: HTMLImageElement, src: string, srcSet?: string) => {
    return new Promise((resolve, reject) => {
      const imageLoader = new Image();
      
      imageLoader.onload = () => {
        img.src = src;
        if (srcSet) img.srcset = srcSet;
        img.classList.add('loaded');
        resolve(true);
      };
      
      imageLoader.onerror = reject;
      imageLoader.src = src;
    });
  };

  const observeImage = (img: HTMLImageElement, src: string, srcSet?: string) => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            loadImage(img, src, srcSet);
            observer.unobserve(img);
          }
        });
      },
      {
        rootMargin: '50px 0px', // Precargar 50px antes de que sea visible
        threshold: 0.1
      }
    );

    observer.observe(img);
    return observer;
  };

  return { loadImage, observeImage };
};