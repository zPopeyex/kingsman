// web/apps/src/config/routes.ts - Actualizado para usar LandingParallax
import {
  HomeIcon,
  CalendarIcon,
  ScissorsIcon,
  ShoppingBagIcon,
  UserIcon,
  CogIcon,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { Permission } from "@/lib/roles";

export interface Route {
  path: string;
  label: string;
  icon: LucideIcon;
  requireAdmin?: boolean;
  requirePermission?: Permission;
  ariaLabel?: string;
  component?: string; // Para referencia del componente
}

export const routes: Route[] = [
  {
    path: "/",
    label: "Inicio",
    icon: HomeIcon,
    requirePermission: "view_home",
    ariaLabel: "Ir a página de inicio",
    component: "LandingParallax" // ← Cambiado de "Home" a "LandingParallax"
  },
  {
    path: "/citas",
    label: "Agendar",
    icon: CalendarIcon,
    requirePermission: "book_appointment",
    ariaLabel: "Agendar una cita",
    component: "Booking"
  },
  {
    path: "/trabajos",
    label: "Trabajos",
    icon: ScissorsIcon,
    requirePermission: "view_works",
    ariaLabel: "Ver portafolio de trabajos",
    component: "Works"
  },
  {
    path: "/shop",
    label: "Tienda",
    icon: ShoppingBagIcon,
    requirePermission: "view_home",
    ariaLabel: "Explorar productos en tienda",
    component: "shop"
  },
  {
    path: "/profile",
    label: "Perfil",
    icon: UserIcon,
    requirePermission: "view_home",
    ariaLabel: "Mi perfil de usuario",
    component: "profile"
  },
  {
    path: "/admin",
    label: "Panel Admin",
    icon: CogIcon,
    requireAdmin: true,
    requirePermission: "admin_panel",
    ariaLabel: "Panel de administración",
    component: "Admin"
  },
];

// Función mejorada que usa permisos - manteniendo tu lógica actual
export const getVisibleRoutes = (
  hasPermission: (permission: Permission) => boolean,
  isAdmin: boolean = false
): Route[] => {
  return routes.filter((route) => {
    if (route.requireAdmin && !isAdmin) return false;
    
    if (route.requirePermission) {
      return hasPermission(route.requirePermission);
    }
    
    return true;
  });
};

// Función simplificada para casos donde no tienes permisos implementados aún
export const getVisibleRoutesSimple = (isAdmin: boolean = false): Route[] => {
  return routes.filter((route) => !route.requireAdmin || isAdmin);
};