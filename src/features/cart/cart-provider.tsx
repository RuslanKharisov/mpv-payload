'use client'

import { CartEntry, NormalizedCartItem } from '@/entities/cart'
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useCallback,
  useMemo,
} from 'react'

type CartContextType = {
  items: CartEntry[]
  addToCart: (item: NormalizedCartItem, quantity: number) => void
  updateQuantity: (itemId: string | number, quantity: number) => void
  removeFromCart: (itemId: string | number) => void
  clearCart: () => void
}

export const CartContext = createContext<CartContextType | undefined>(undefined)

const cartLocalStorageKey = 'shopping-cart' // Ключ для localStorage

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartEntry[]>([])

  useEffect(() => {
    try {
      const storedItems = window.localStorage.getItem(cartLocalStorageKey)
      if (storedItems) {
        setItems(JSON.parse(storedItems))
      }
    } catch (error) {
      console.error('Failed to parse cart items from localStorage', error)
    }
  }, []) // Пустой массив зависимостей означает, что этот эффект выполнится 1 раз после монтирования

  // Сохраняем изменения в localStorage при любом изменении `items`
  useEffect(() => {
    // Добавим проверку, чтобы не сохранять пустой массив при самой первой загрузке
    if (items.length > 0 || localStorage.getItem(cartLocalStorageKey)) {
      window.localStorage.setItem(cartLocalStorageKey, JSON.stringify(items))
    }
  }, [items])

  // Используем useCallback, чтобы функции не создавались заново при каждом рендере
  const addToCart = useCallback((item: NormalizedCartItem, quantity: number) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.item.id === item.id)
      if (existing) {
        return prev.map((i) =>
          i.item.id === item.id ? { ...i, quantity: i.quantity + quantity } : i,
        )
      }
      return [...prev, { item, quantity }]
    })
  }, [])

  const updateQuantity = useCallback((stockId: string | number, quantity: number) => {
    setItems((prev) =>
      prev.map((i) => (i.item.id === stockId ? { ...i, quantity: Math.max(1, quantity) } : i)),
    )
  }, [])

  const removeFromCart = useCallback((stockId: string | number) => {
    setItems((prev) => prev.filter((i) => i.item.id !== stockId))
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
