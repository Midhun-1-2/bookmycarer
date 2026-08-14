import {
  LayoutDashboard,
  CalendarClock,
  Users,
  ShieldCheck,
  FolderKanban,
  FileText,
  UserCog,
  Settings,
  ClipboardList,
} from 'lucide-react'

export const ROLES = {
  USER: 'user',
  STAFF: 'staff',
  ADMIN: 'admin',
  SUPER_ADMIN: 'super-admin',
}

export const ROLE_LABEL = {
  [ROLES.USER]: 'Care Seeker',
  [ROLES.STAFF]: 'Caregiver Staff',
  [ROLES.ADMIN]: 'Admin',
  [ROLES.SUPER_ADMIN]: 'Super Admin',
}

export const ROLE_HOME = {
  [ROLES.USER]: '/user/dashboard',
  [ROLES.STAFF]: '/staff/dashboard',
  [ROLES.ADMIN]: '/admin/dashboard',
  [ROLES.SUPER_ADMIN]: '/super-admin/dashboard',
}

export const STAFF_NAV = [
  { to: '/staff/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/staff/engagements', label: 'Engagements', icon: CalendarClock },
  { to: '/staff/profile', label: 'Profile', icon: UserCog },
]

export const ADMIN_NAV = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/staff', label: 'Staff Accounts', icon: Users },
  { to: '/admin/categories', label: 'Service Categories', icon: FolderKanban },
  { to: '/admin/service-pages', label: 'Service Pages CMS', icon: FileText },
  { to: '/admin/bookings', label: 'Bookings Oversight', icon: ClipboardList },
]

export const SUPER_ADMIN_NAV = [
  { to: '/super-admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/super-admin/admins', label: 'Admin Accounts', icon: ShieldCheck },
  { to: '/admin/staff', label: 'Staff Accounts', icon: Users },
  { to: '/admin/categories', label: 'Service Categories', icon: FolderKanban },
  { to: '/admin/service-pages', label: 'Service Pages CMS', icon: FileText },
  { to: '/admin/bookings', label: 'Bookings Oversight', icon: ClipboardList },
  { to: '/super-admin/settings', label: 'System Settings', icon: Settings },
]

export function roleAllows(sessionRole, allowedRoles) {
  if (!sessionRole) return false
  if (allowedRoles.includes(sessionRole)) return true
  // Super Admin can access anything Admin can (superset access)
  if (sessionRole === ROLES.SUPER_ADMIN && allowedRoles.includes(ROLES.ADMIN)) return true
  return false
}
