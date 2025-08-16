// src/hooks/useAuth.ts
import { useAuth as useAuthProvider } from "@/features/auth/AuthProvider";
import type { Role } from "@/config/routes";

/**
 * Wrapper pequeño para normalizar lo que necesita navegación y perfil:
 * - role ('client' | 'admin' | 'dev') con default 'client'
 * - isAdmin (admin o dev)
 * - logout (si no existe, noop)
 *
 * Mantiene TODO lo que ya expone tu AuthProvider (user, profile, loading, loginWithGoogle, setProfile, etc)
 */
export function useAuth() {
  // Tu hook real del provider
  const ctx = useAuthProvider() as unknown as {
    user: any;
    profile?: { role?: Role } | null;
    loading?: boolean;
    loginWithGoogle?: () => Promise<void>;
    logout?: () => Promise<void>;
    setProfile?: React.Dispatch<React.SetStateAction<any>>;
    [k: string]: any;
  };

  // Defaults seguros
  const role: Role = (ctx?.profile?.role as Role) ?? "client";
  const isAdmin = role === "admin" || role === "dev";
  const logout = ctx?.logout ?? (async () => {});

  return {
    ...ctx,
    role,
    isAdmin,
    logout,
  };
}
