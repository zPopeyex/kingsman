import type { Permission } from "@/lib/roles";
import type { UserDoc } from "@/types/user";

export function hasPermission(user: UserDoc | null, permission: Permission): boolean {
  if (!user) return false;
  return Array.isArray(user.permissions) && user.permissions.includes(permission);
}
