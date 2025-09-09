import React from 'react'

import { HeaderThemeProvider } from './HeaderTheme'
import { ThemeProvider } from './Theme'
import { TRPCReactProvider } from '@/shared/trpc/client'
import { CartProvider } from '@/features/cart/cart-provider'

export const Providers: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  return (
    <ThemeProvider>
      <HeaderThemeProvider>
        <CartProvider>
          <TRPCReactProvider>{children}</TRPCReactProvider>
        </CartProvider>
      </HeaderThemeProvider>
    </ThemeProvider>
  )
}
