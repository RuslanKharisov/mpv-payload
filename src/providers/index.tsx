import React from 'react'

import { HeaderThemeProvider } from './HeaderTheme'
import { ThemeProvider } from './Theme'
import { TRPCReactProvider } from '@/shared/trpc/client'

export const Providers: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  return (
    <ThemeProvider>
      <HeaderThemeProvider>
        <TRPCReactProvider>{children}</TRPCReactProvider>
      </HeaderThemeProvider>
    </ThemeProvider>
  )
}
