import type { ClientUser } from 'payload'

export const isHidden = (user: ClientUser | null | undefined): boolean => {
  return Boolean(user?.roles?.includes('super-admin'))
}
