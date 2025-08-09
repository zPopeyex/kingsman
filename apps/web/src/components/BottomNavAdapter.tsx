import { useLocation, useNavigate } from "react-router-dom";
import BottomNav from "@/components/BottomNav";

type Tab = "home" | "shop" | "promos" | "profile";

const pathToTab = (path: string): Tab => {
  if (path.startsWith("/tienda")) return "shop";
  if (path.startsWith("/trabajos")) return "promos";
  if (path.startsWith("/perfil")) return "profile";
  return "home";
};

const tabToPath: Record<Tab, string> = {
  home: "/",
  shop: "/tienda",
  promos: "/trabajos",
  profile: "/perfil",
};

export default function BottomNavAdapter() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const value = pathToTab(pathname);

  return (
    <BottomNav
      value={value}
      onChange={(t) => navigate(tabToPath[t])}
      maxWidth={420} // puedes subir a 480 si quieres más ancho
    />
  );
}
