import type { AccessArgs, FieldAccess } from 'payload'

import type { User } from '@/payload-types'

type isAuthenticated = (args: AccessArgs<User>) => boolean

export const authenticated: isAuthenticated = ({ req: { user } }) => {
  return Boolean(user)
}

export const isAuthenticatedFieldAccess: FieldAccess = ({ req: { user } }) => {
  return Boolean(user)
}
