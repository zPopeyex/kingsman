import Header from "@/components/Header";
import BottomNavAdapter from "@/components/BottomNavAdapter";
import { Outlet, useLocation } from "react-router-dom";
import GoldenCursor from "@/components/GoldenCursor";
import AnimationsToggle from "@/components/AnimationsToggle";

export default function MainLayout() {
  const { pathname } = useLocation();
  const hideUI = ["/login", "/landing"].some((path) =>
    pathname.toLowerCase().startsWith(path)
  );

  return (
    <div className="flex flex-col min-h-screen bg-[var(--kb-bg)] text-[var(--kb-text)]">
      {/* Header - oculto en login/landing */}
      {!hideUI && <Header />}

      {/* Golden Cursor effect */}
      <GoldenCursor />

      {/* Animations Toggle Button */}
      <div className="fixed right-3 bottom-24 md:bottom-6 z-50">
        <AnimationsToggle />
      </div>

      {/* Main content SIN padding-top en desktop */}
      <main className="flex-1 pb-[90px] md:pb-0">
        <Outlet />
      </main>

      {/* BottomNav solo en mobile */}
      {!hideUI && (
        <div className="md:hidden">
          <BottomNavAdapter />
        </div>
      )}
    </div>
  );
}
