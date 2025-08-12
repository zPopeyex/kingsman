import { useLocation, useNavigate } from "react-router-dom";
import BottomNav from "./BottomNav";

type TabKey = "home" | "schedule" | "works" | "shop" | "profile";

const keyToPath: Record<TabKey, string> = {
  home: "/",
  schedule: "/citas",
  works: "/trabajos",
  shop: "/shop",
  profile: "/profile",
};

function pathToKey(pathname: string): TabKey {
  if (pathname.startsWith("/citas")) return "schedule";
  if (pathname.startsWith("/trabajos")) return "works";
  if (pathname.startsWith("/shop")) return "shop";
  if (pathname.startsWith("/profile")) return "profile";
  return "home";
}

export default function BottomNavAdapter() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const value = pathToKey(pathname);

  return (
    <BottomNav
      value={value}
      onChange={(key) => {
        navigate(keyToPath[key]);
      }}
    />
  );
}
