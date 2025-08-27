import type { ClientUser } from 'payload'

export const isHidden = (user: ClientUser | null): boolean => {
  return Boolean(user?.roles?.includes('super-admin'))
}
