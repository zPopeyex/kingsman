// src/config/routes.ts
import {
  Home as HomeIcon,
  Calendar as CalendarIcon,
  Scissors as ScissorsIcon,
  ShoppingBag as StoreIcon,
  User as UserIcon,
  Cog as CogIcon,
} from "lucide-react";

/**
 * Roles soportados en la app
 */
export type Role = "client" | "admin" | "dev";

/**
 * Definición de una ruta de navegación
 * - requireRoles omitido => visible para todos
 */
export type Route = {
  path: string;
  label: string;
  icon: React.ComponentType<any>;
  ariaLabel?: string;
  requireRoles?: Role[];
};

/**
 * Mapa de rutas principal (mantiene tus paths actuales)
 */
export const ROUTES: Route[] = [
  { path: "/",         label: "Inicio",   icon: HomeIcon },
  { path: "/citas",    label: "Agendar",  icon: CalendarIcon },
  { path: "/trabajos", label: "Trabajos", icon: ScissorsIcon },
  { path: "/shop",     label: "Tienda",   icon: StoreIcon },
  { path: "/profile",  label: "Perfil",   icon: UserIcon },
  // Solo para admin/dev:
  { path: "/admin",    label: "Panel admin", icon: CogIcon, requireRoles: ["admin", "dev"] },
];

/**
 * Devuelve las rutas visibles según el rol del usuario
 */
export function getVisibleRoutes(role: Role): Route[] {
  return ROUTES.filter((r) => {
    if (!r.requireRoles) return true;
    return r.requireRoles.includes(role);
  });
}
