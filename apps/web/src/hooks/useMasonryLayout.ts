// web/apps/src/hooks/useMasonryLayout.ts
import { useEffect, useRef, useState } from 'react';

interface MasonryOptions {
  columnWidth?: number;
  gutter?: number;
  responsive?: {
    [breakpoint: number]: {
      columns: number;
      gutter?: number;
    };
  };
}

export const useMasonryLayout = (options: MasonryOptions = {}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    // Verificar soporte nativo de CSS Grid Masonry
    const supportsGridMasonry = CSS.supports('grid-template-rows', 'masonry');
    setIsSupported(supportsGridMasonry);

    if (!supportsGridMasonry && containerRef.current) {
      // Implementar fallback JavaScript
      const container = containerRef.current;
      const items = Array.from(container.children) as HTMLElement[];
      
      const resizeObserver = new ResizeObserver(() => {
        layoutMasonry(container, items, options);
      });

      // Observer el contenedor y todos los items
      resizeObserver.observe(container);
      items.forEach(item => resizeObserver.observe(item));

      // Layout inicial
      layoutMasonry(container, items, options);

      return () => {
        resizeObserver.disconnect();
      };
    }
  }, [options]);

  return { containerRef, isSupported };
};

const layoutMasonry = (
  container: HTMLElement,
  items: HTMLElement[],
  options: MasonryOptions
) => {
  const containerWidth = container.offsetWidth;
  const { gutter = 24, responsive } = options;

  // Determinar número de columnas basado en responsive breakpoints
  let columns = 3; // default
  if (responsive) {
    const sortedBreakpoints = Object.keys(responsive)
      .map(Number)
      .sort((a, b) => b - a); // Ordenar de mayor a menor

    for (const breakpoint of sortedBreakpoints) {
      if (containerWidth >= breakpoint) {
        columns = responsive[breakpoint].columns;
        break;
      }
    }
  }

  const columnWidth = (containerWidth - (gutter * (columns - 1))) / columns;
  const columnHeights = new Array(columns).fill(0);

  // Reset container
  container.style.position = 'relative';

  items.forEach((item, index) => {
    // Encontrar la columna más corta
    const shortestColumnIndex = columnHeights.indexOf(Math.min(...columnHeights));
    
    // Posicionar item
    item.style.position = 'absolute';
    item.style.width = `${columnWidth}px`;
    item.style.left = `${shortestColumnIndex * (columnWidth + gutter)}px`;
    item.style.top = `${columnHeights[shortestColumnIndex]}px`;
    
    // Actualizar altura de la columna
    const itemHeight = item.offsetHeight;
    columnHeights[shortestColumnIndex] += itemHeight + gutter;
  });

  // Ajustar altura del contenedor
  const maxHeight = Math.max(...columnHeights) - gutter;
  container.style.height = `${maxHeight}px`;
};

// Hook simplificado para grid responsive sin masonry
export const useResponsiveGrid = () => {
  const [columns, setColumns] = useState(1);

  useEffect(() => {
    const updateColumns = () => {
      const width = window.innerWidth;
      if (width >= 1280) setColumns(4);      // xl: 4 columns
      else if (width >= 1024) setColumns(3); // lg: 3 columns  
      else if (width >= 640) setColumns(2);  // sm: 2 columns
      else setColumns(1);                    // xs: 1 column
    };

    updateColumns();
    window.addEventListener('resize', updateColumns);
    return () => window.removeEventListener('resize', updateColumns);
  }, []);

  return { columns };
};