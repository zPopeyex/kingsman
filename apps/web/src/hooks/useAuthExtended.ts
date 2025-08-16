// kingsman/apps/web/src/hooks/useAuthExtended.ts
import { useAuth as useAuthBase } from '@/features/auth/AuthProvider';
import type { Permission, Role } from '@/lib/roles';
import { rolePermissions, DEFAULT_ROLE } from '@/lib/roles';

export const useAuthExtended = () => {
  const baseAuth = useAuthBase();
  const { user, profile, loading } = baseAuth;
  
  // Usar rol por defecto si el usuario está autenticado pero no tiene rol
  const effectiveRole: Role | null = profile?.role || (user ? DEFAULT_ROLE : null);
  
  // Helper para verificar si es admin o dev
  const isAdmin = effectiveRole === 'admin' || effectiveRole === 'dev';
  
  // Helper para verificar permisos con manejo seguro
  const hasPermission = (permission: Permission): boolean => {
    // Durante la carga, asumir sin permisos
    if (loading) return false;
    
    // Si no hay usuario, no tiene permisos (excepto algunos públicos)
    if (!user) {
      // Permisos públicos que no requieren login
      const publicPermissions: Permission[] = ['view_home', 'view_works'];
      return publicPermissions.includes(permission);
    }
    
    // Si hay usuario pero no rol, usar permisos del rol por defecto
    const userRole = effectiveRole || DEFAULT_ROLE;
    
    // Verificar permisos del rol
    if (userRole && userRole in rolePermissions) {
      const rolePerms = rolePermissions[userRole as Role];
      if (rolePerms && rolePerms.includes(permission)) return true;
    }
    
    // Verificar permisos adicionales del usuario
    if (profile?.permissions && Array.isArray(profile.permissions)) {
      if (profile.permissions.includes(permission)) return true;
    }
    
    return false;
  };
  
  // Helper para verificar rol
  const hasRole = (role: string): boolean => {
    return effectiveRole === role;
  };
  
  // Helper para verificar múltiples roles
  const hasAnyRole = (roles: string[]): boolean => {
    if (!effectiveRole) return false;
    return roles.includes(effectiveRole);
  };
  
  return {
    ...baseAuth,
    // Mantenemos user y profile del contexto original
    user,
    profile,
    userDoc: profile, // Alias para compatibilidad
    loading,
    // Nuevos helpers
    isAdmin,
    isDev: effectiveRole === 'dev',
    isClient: effectiveRole === 'client',
    hasPermission,
    hasRole,
    hasAnyRole,
    // Permisos comunes para acceso rápido
    canAccessAdmin: hasPermission('admin_panel'),
    canManageSchedule: hasPermission('manage_schedule'),
    canManageProducts: hasPermission('manage_products'),
    canBookAppointment: hasPermission('book_appointment'),
    // Estados útiles
    isAuthenticated: !!user,
    effectiveRole,
  };
};