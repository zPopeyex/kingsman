// kingsman/apps/web/src/hooks/useAuth.ts
import { useContext } from 'react';
import { AuthContext } from '@/features/auth/AuthProvider';
import type { UserDoc } from '@/types/user';
import type { Role, Permission } from '@/lib/roles';
import { rolePermissions } from '@/lib/roles';

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  
  // Asumiendo que tu AuthContext provee user (Firebase Auth) y userDoc (Firestore)
  const { user, userDoc } = context;
  
  // Helper para verificar si es admin o dev
  const isAdmin = userDoc?.role === 'admin' || userDoc?.role === 'dev';
  
  // Helper para verificar permisos
  const hasPermission = (permission: Permission): boolean => {
    if (!userDoc?.role) return false;
    
    // Verificar permisos del rol
    const rolePerms = rolePermissions[userDoc.role];
    if (rolePerms.includes(permission)) return true;
    
    // Verificar permisos adicionales del usuario
    if (userDoc.permissions?.includes(permission)) return true;
    
    return false;
  };
  
  // Helper para verificar rol
  const hasRole = (role: Role): boolean => {
    return userDoc?.role === role;
  };
  
  // Helper para verificar múltiples roles
  const hasAnyRole = (roles: Role[]): boolean => {
    return roles.includes(userDoc?.role as Role);
  };
  
  return {
    ...context,
    isAdmin,
    isDev: userDoc?.role === 'dev',
    isClient: userDoc?.role === 'client',
    hasPermission,
    hasRole,
    hasAnyRole,
    // Permisos comunes para acceso rápido
    canAccessAdmin: hasPermission('admin_panel'),
    canManageSchedule: hasPermission('manage_schedule'),
    canManageProducts: hasPermission('manage_products'),
    canBookAppointment: hasPermission('book_appointment'),
  };
};