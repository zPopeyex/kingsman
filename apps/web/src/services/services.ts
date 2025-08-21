import portafolioData from '@/data/portafolio.json';
import type { Service } from '@/types/booking';

// Servicios predefinidos basados en el portafolio
const PREDEFINED_SERVICES: Service[] = [
  {
    id: 'corte-basico',
    name: 'Corte Básico',
    durationMinutes: 30,
    price: 30000,
    description: 'Corte de cabello tradicional'
  },
  {
    id: 'corte-premium',
    name: 'Corte Premium + Diseño',
    durationMinutes: 45,
    price: 50000,
    description: 'Corte con diseño personalizado y detalles'
  },
  {
    id: 'barba',
    name: 'Arreglo de Barba',
    durationMinutes: 30,
    price: 25000,
    description: 'Perfilado y arreglo de barba'
  },
  {
    id: 'combo-completo',
    name: 'Combo Completo',
    durationMinutes: 60,
    price: 70000,
    description: 'Corte + Barba + Masaje'
  },
  {
    id: 'afeitado-clasico',
    name: 'Afeitado Clásico',
    durationMinutes: 30,
    price: 35000,
    description: 'Afeitado tradicional con navaja'
  }
];

/**
 * Obtiene todos los servicios disponibles
 */
export function getServices(): Service[] {
  return PREDEFINED_SERVICES;
}

/**
 * Obtiene un servicio por ID
 */
export function getServiceById(serviceId: string): Service | undefined {
  return PREDEFINED_SERVICES.find(s => s.id === serviceId);
}

/**
 * Obtiene categorías del portafolio para referencia
 */
export function getPortfolioCategories(): string[] {
  const categories = new Set(portafolioData.map(item => item.category));
  return Array.from(categories);
}