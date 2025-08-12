import type { PropsWithChildren } from "react";
import { useAuth } from "@/features/auth/AuthProvider";
import LoginScreen from "@/features/auth/LoginScreen";

export default function AuthGate({ children }: PropsWithChildren) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-dvh grid place-items-center text-neutral-400">
        Cargando…
      </div>
    );
  }
  if (!user) return <LoginScreen />;

  return <>{children}</>;
}
