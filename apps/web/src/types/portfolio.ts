// src/types/portfolio.ts

/**
 * Interfaz que representa un trabajo del portfolio
 * Basada en la estructura de src/data/portafolio.json
 */
export interface PortfolioImage {
  id: string;
  title: string;
  caption: string;    // Descripción del trabajo
  category: string;   // "Cortes", "Barbas", "Tattos", etc.
  src: string;        // URL de la imagen
  alt: string;        // Texto alternativo para SEO
  width: number;      // Ancho en píxeles
  height: number;     // Alto en píxeles
  priority: boolean;  // Si es un trabajo prioritario/destacado
  palette: string[];  // Array de colores hex ["#0B0B0B", "#D4AF37", "#1A1A1A"]
}

/**
 * Tipos de categorías disponibles
 */
export type PortfolioCategory = 
  | 'Cortes'
  | 'Barbas' 
  | 'Tattos'
  | 'Afeitados'
  | 'Servicios Premium'
  | 'Cortes Especializados'
  | 'Trabajos Artísticos';

/**
 * Interfaz para filtros de portfolio
 */
export interface PortfolioFilters {
  category?: PortfolioCategory;
  priority?: boolean;
  searchTerm?: string;
}

/**
 * Estado del portfolio con metadatos
 */
export interface PortfolioState {
  items: PortfolioImage[];
  loading: boolean;
  hasChanges: boolean;
  lastUpdated?: Date;
}

/**
 * Parámetros para crear un nuevo trabajo
 */
export type CreateWorkData = Omit<PortfolioImage, 'id'>;

/**
 * Parámetros para actualizar un trabajo existente
 */
export type UpdateWorkData = Partial<PortfolioImage> & { id: string };