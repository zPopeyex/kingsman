// src/services/portfolioService.ts
import React from 'react';
import type { PortfolioImage, PortfolioCategory, PortfolioFilters } from '@/types/portfolio';

type PortfolioListener = (works: PortfolioImage[]) => void;

class PortfolioService {
  private works: PortfolioImage[] = [];
  private listeners: PortfolioListener[] = [];

  // Cargar datos iniciales
  async loadPortfolio(): Promise<PortfolioImage[]> {
    try {
      const response = await fetch("/src/data/portafolio.json");
      if (response.ok) {
        const data = await response.json();
        this.works = Array.isArray(data) ? data : [];
        this.notifyListeners();
        return this.works;
      }
      return [];
    } catch (error) {
      console.error("Error loading portfolio:", error);
      return [];
    }
  }

  // Obtener trabajos actuales
  getWorks(): PortfolioImage[] {
    return [...this.works];
  }

  // Actualizar trabajos y notificar a todos los componentes
  updateWorks(newWorks: PortfolioImage[]): void {
    this.works = [...newWorks];
    this.notifyListeners();
  }

  // Agregar un trabajo
  addWork(work: PortfolioImage): void {
    this.works = [...this.works, work];
    this.notifyListeners();
  }

  // Actualizar un trabajo
  updateWork(updatedWork: PortfolioImage): void {
    this.works = this.works.map(work => 
      work.id === updatedWork.id ? updatedWork : work
    );
    this.notifyListeners();
  }

  // Eliminar un trabajo
  deleteWork(workId: string): void {
    this.works = this.works.filter(work => work.id !== workId);
    this.notifyListeners();
  }

  // Suscribirse a cambios
  subscribe(listener: PortfolioListener): () => void {
    this.listeners.push(listener);
    
    // Retornar función para desuscribirse
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  // Notificar a todos los listeners
  private notifyListeners(): void {
    this.listeners.forEach(listener => {
      try {
        listener(this.getWorks());
      } catch (error) {
        console.error('Error notifying portfolio listener:', error);
      }
    });
  }

  // Filtrar por categoría (para el menú trabajos)
  getWorksByCategory(category?: string): PortfolioImage[] {
    if (!category) return this.getWorks();
    return this.works.filter(work => 
      work.category.toLowerCase() === category.toLowerCase()
    );
  }

  // Obtener trabajos prioritarios
  getPriorityWorks(): PortfolioImage[] {
    return this.works.filter(work => work.priority);
  }

  // Guardar en localStorage como backup
  saveToLocalStorage(): void {
    try {
      localStorage.setItem('kingsman_portfolio_backup', JSON.stringify(this.works));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }

  // Cargar desde localStorage como backup
  loadFromLocalStorage(): PortfolioImage[] {
    try {
      const saved = localStorage.getItem('kingsman_portfolio_backup');
      if (saved) {
        const works = JSON.parse(saved);
        this.works = Array.isArray(works) ? works : [];
        this.notifyListeners();
        return this.works;
      }
    } catch (error) {
      console.error('Error loading from localStorage:', error);
    }
    return [];
  }
}

// Exportar instancia singleton
export const portfolioService = new PortfolioService();

// Hook personalizado para React
export const usePortfolio = () => {
  const [works, setWorks] = React.useState<PortfolioImage[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    // Cargar datos iniciales
    portfolioService.loadPortfolio().then(() => {
      setWorks(portfolioService.getWorks());
      setLoading(false);
    });

    // Suscribirse a cambios
    const unsubscribe = portfolioService.subscribe((newWorks) => {
      setWorks(newWorks);
    });

    return unsubscribe;
  }, []);

  return {
    works,
    loading,
    addWork: portfolioService.addWork.bind(portfolioService),
    updateWork: portfolioService.updateWork.bind(portfolioService),
    deleteWork: portfolioService.deleteWork.bind(portfolioService),
    updateWorks: portfolioService.updateWorks.bind(portfolioService),
    getWorksByCategory: portfolioService.getWorksByCategory.bind(portfolioService),
    getPriorityWorks: portfolioService.getPriorityWorks.bind(portfolioService),
  };
};