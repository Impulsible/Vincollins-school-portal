export type UserRole = 'student' | 'staff' | 'admin' | 'super_admin'

export const roleHierarchy: Record<UserRole, number> = {
  student: 0,
  staff: 1,
  admin: 2,
  super_admin: 3,
}

export const rolePermissions: Record<UserRole, string[]> = {
  student: ['view:own_profile', 'view:own_results', 'view:timetable'],
  staff: ['view:own_profile', 'manage:results', 'manage:assignments', 'view:students'],
  admin: ['manage:users', 'manage:academics', 'manage:results', 'view:reports'],
  super_admin: ['manage:system', 'manage:all', 'configure:settings'],
}

export function hasPermission(userRole: UserRole, requiredRole: UserRole): boolean {
  return roleHierarchy[userRole] >= roleHierarchy[requiredRole]
}