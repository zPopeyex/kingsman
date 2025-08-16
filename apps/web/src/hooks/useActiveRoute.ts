// web/apps/src/hooks/useActiveRoute.ts
import { useLocation } from 'react-router-dom';

interface ActiveRouteState {
  currentPath: string;
  isActive: (path: string) => boolean;
  getAriaCurrentValue: (path: string) => 'page' | undefined;
}

export const useActiveRoute = (): ActiveRouteState => {
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string): boolean => {
    // Exact match for home
    if (path === '/') {
      return currentPath === '/';
    }
    // For other routes, check if current path starts with route path
    return currentPath.startsWith(path);
  };

  const getAriaCurrentValue = (path: string): 'page' | undefined => {
    return isActive(path) ? 'page' : undefined;
  };

  return {
    currentPath,
    isActive,
    getAriaCurrentValue
  };
};