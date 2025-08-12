import { Navigate } from "react-router-dom";
import { useAuth } from "@/features/auth/AuthProvider";
import type { ReactElement } from "react";

export default function ProtectedRoute({
  children,
}: {
  children: ReactElement;
}) {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? children : <Navigate to="/" replace />;
}
