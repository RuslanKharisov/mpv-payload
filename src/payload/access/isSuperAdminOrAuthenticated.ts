import { AccessArgs } from 'payload'
import type { User } from '@/payload-types'

type AccessFn = (args: AccessArgs<User>) => boolean

export const isSuperAdminOrAuthenticated: AccessFn = ({ req: { user } }) => {
  if (!user) return false

  if (user.roles?.includes('super-admin')) {
    return true
  }

  return true
}
