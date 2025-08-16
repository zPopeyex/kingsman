// web/apps/src/config/routes.ts
import {
  HomeIcon,
  CalendarIcon,
  ScissorsIcon,
  ShoppingBagIcon,
  UserIcon,
  CogIcon,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface Route {
  path: string;
  label: string;
  icon: LucideIcon;
  requireAdmin?: boolean;
  ariaLabel?: string;
  component?: string;
}

export const routes: Route[] = [
  {
    path: "/",
    label: "Inicio",
    icon: HomeIcon,
    ariaLabel: "Ir a página de inicio",
    component: "LandingParallax"
  },
  {
    path: "/citas",
    label: "Agendar",
    icon: CalendarIcon,
    ariaLabel: "Agendar una cita",
    component: "Booking"
  },
  {
    path: "/trabajos",
    label: "Trabajos",
    icon: ScissorsIcon,
    ariaLabel: "Ver portafolio de trabajos",
    component: "Works"
  },
  {
    path: "/shop",
    label: "Tienda",
    icon: ShoppingBagIcon,
    ariaLabel: "Explorar productos en tienda",
    component: "Shop"
  },
  {
    path: "/profile",
    label: "Perfil",
    icon: UserIcon,
    ariaLabel: "Mi perfil de usuario",
    component: "Profile"
  },
  {
    path: "/admin",
    label: "Panel Admin",
    icon: CogIcon,
    requireAdmin: true,
    ariaLabel: "Panel de administración",
    component: "Admin"
  },
];

// Función simplificada sin sistema de permisos complejo
export const getVisibleRoutes = (isAdmin: boolean = false): Route[] => {
  return routes.filter((route) => !route.requireAdmin || isAdmin);
};