// web/apps/src/components/BottomNavAdapter.tsx - Mejorado con sincronización
import { useLocation, useNavigate } from "react-router-dom";
import BottomNav from "./BottomNav";
//import { useAuthExtended } from "@/hooks/useAuthExtended";

type TabKey = "home" | "schedule" | "works" | "shop" | "profile";

// Mapeo actualizado con las rutas de tu app
const keyToPath: Record<TabKey, string> = {
  home: "/",
  schedule: "/citas",
  works: "/trabajos",
  shop: "/shop",
  profile: "/profile",
};

// Función mejorada para detectar la ruta activa
function pathToKey(pathname: string): TabKey {
  // Exact match para home
  if (pathname === "/") return "home";

  // Partial matches para otras rutas
  if (pathname.startsWith("/citas")) return "schedule";
  if (pathname.startsWith("/trabajos")) return "works";
  if (pathname.startsWith("/shop")) return "shop";
  if (pathname.startsWith("/profile")) return "profile";

  // Default fallback
  return "home";
}

export default function BottomNavAdapter() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  //const { isAdmin } = useAuthExtended();

  const value = pathToKey(pathname);

  const handleNavigation = (key: TabKey) => {
    const targetPath = keyToPath[key];

    // Si ya estamos en la ruta, no navegar (evita re-renders innecesarios)
    if (pathname === targetPath) return;

    navigate(targetPath);
  };

  return (
    <BottomNav
      value={value}
      onChange={handleNavigation}
      maxWidth={420} // Mantén tu configuración actual
    />
  );
}
