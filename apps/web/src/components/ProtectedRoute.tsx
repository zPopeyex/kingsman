import { Navigate } from "react-router-dom";
import { useAuth } from "@/features/auth/AuthProvider";
import type { ReactElement } from "react";

function FullScreenSpinner() {
  return (
    <div className="fixed inset-0 grid place-items-center bg-[#0B0B0B]">
      <div className="animate-pulse text-[#D4AF37] text-sm tracking-wide">
        Cargando…
      </div>
    </div>
  );
}

export default function ProtectedRoute({
  children,
}: {
  children: ReactElement;
}) {
  const { user, loading } = useAuth();

  if (loading) return <FullScreenSpinner />; // evita pantalla en blanco
  if (!user) return <Navigate to="/" replace />;

  return children;
}
