export type Role = 'dev' | 'admin' | 'client'

export const permissions = [
  'view_home',
  'book_appointment',
  'view_works',
  'admin_panel',
  'manage_schedule',
  'manage_products',
  'manage_payments',
  'manage_roles',
] as const

export type Permission = (typeof permissions)[number]

export const rolePermissions: Record<Role, Permission[]> = {
  dev: [...permissions],
  admin: [
    'view_home',
    'book_appointment',
    'view_works',
    'admin_panel',
    'manage_schedule',
    'manage_products',
    'manage_payments',
    'manage_roles',
  ],
  client: ['view_home', 'book_appointment', 'view_works'],
}
