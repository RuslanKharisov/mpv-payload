'use client'

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useCallback,
  useMemo,
} from 'react'
import { StockWithTenantAndCurrency } from '@/features/stock'

export type CartItem = {
  stock: StockWithTenantAndCurrency
  quantity: number
}

type CartContextType = {
  items: CartItem[]
  addToCart: (stock: StockWithTenantAndCurrency, quantity?: number) => void
  removeFromCart: (stockId: string | number) => void
  clearCart: () => void
  updateQuantity: (stockId: string | number, quantity: number) => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)
const cartLocalStorageKey = 'shopping-cart' // Ключ для localStorage

export function CartProvider({ children }: { children: ReactNode }) {
  // 1. Инициализируем состояние из localStorage
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const storedItems = window.localStorage.getItem(cartLocalStorageKey)
      return storedItems ? JSON.parse(storedItems) : []
    } catch (error) {
      console.error('Failed to parse cart items from localStorage', error)
      return []
    }
  })

  // 2. Сохраняем изменения в localStorage с помощью useEffect
  useEffect(() => {
    window.localStorage.setItem(cartLocalStorageKey, JSON.stringify(items))
  }, [items])

  // Используем useCallback, чтобы функции не создавались заново при каждом рендере
  const addToCart = useCallback((stock: StockWithTenantAndCurrency, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.stock.id === stock.id)
      if (existing) {
        return prev.map((i) =>
          i.stock.id === stock.id ? { ...i, quantity: i.quantity + quantity } : i,
        )
      }
      return [...prev, { stock, quantity }]
    })
  }, [])

  const updateQuantity = useCallback((stockId: string | number, quantity: number) => {
    setItems((prev) =>
      prev.map((i) => (i.stock.id === stockId ? { ...i, quantity: Math.max(1, quantity) } : i)),
    )
  }, [])

  const removeFromCart = useCallback((stockId: string | number) => {
    setItems((prev) => prev.filter((i) => i.stock.id !== stockId))
  }, [])

  const clearCart = useCallback(() => {
    setItems([])
  }, [])

  const contextValue = useMemo(
    () => ({ items, addToCart, removeFromCart, clearCart, updateQuantity }),
    [items, addToCart, removeFromCart, clearCart, updateQuantity],
  )

  return <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) {
    throw new Error('useCart must be used inside CartProvider')
  }
  return ctx
}
