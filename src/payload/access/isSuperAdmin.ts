import { User } from '@/payload-types'
import type { Access, FieldAccess } from 'payload'

export const isSuperAdminAccess: Access = ({ req }): boolean => {
  return isSuperAdmin(req?.user as User | null | undefined)
}

export const isSuperAdmin = (user: User | null | undefined): boolean => {
  if (!user) return false
  if (!Array.isArray(user.roles)) return false
  return user.roles.includes('super-admin')
}

export const isSuperAdminFieldAccess: FieldAccess = ({ req }) => {
  return isSuperAdmin(req?.user as User | null | undefined)
}
