'use client'
import { createContext, useContext, ReactNode } from 'react'
import { User } from '@/payload-types'

const UserContext = createContext<User | null>(null)

export function UserProvider({ children, user }: { children: ReactNode; user: User | null }) {
  return <UserContext.Provider value={user}>{children}</UserContext.Provider>
}

export const useUser = () => {
  const user = useContext(UserContext)
  if (!user) throw new Error('useUser must be used within UserProvider')
  return user
}
