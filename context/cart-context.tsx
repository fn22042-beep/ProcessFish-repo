"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react"
import type { CartItem } from "@/lib/cart-types"

const CART_STORAGE_KEY = "processe-fish-cart"

interface CartContextValue {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (productId: string, weight: string) => void
  updateQuantity: (productId: string, weight: string, quantity: number) => void
  clearCart: () => void
  totalItems: number
  totalAmount: number
}

const CartContext = createContext<CartContextValue | null>(null)

function loadCart(): CartItem[] {
  if (typeof window === "undefined") return []
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function saveCart(items: CartItem[]) {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
  } catch {
    // ignore
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setItems(loadCart())
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted) saveCart(items)
  }, [items, mounted])

  const addItem = useCallback((item: CartItem) => {
    setItems((prev) => {
      const key = `${item.productId}-${item.weight}`
      const idx = prev.findIndex(
        (i) => i.productId === item.productId && i.weight === item.weight
      )
      if (idx >= 0) {
        const next = [...prev]
        next[idx] = { ...next[idx], quantity: next[idx].quantity + item.quantity }
        return next
      }
      return [...prev, { ...item }]
    })
  }, [])

  const removeItem = useCallback((productId: string, weight: string) => {
    setItems((prev) =>
      prev.filter((i) => !(i.productId === productId && i.weight === weight))
    )
  }, [])

  const updateQuantity = useCallback(
    (productId: string, weight: string, quantity: number) => {
      if (quantity < 1) {
        removeItem(productId, weight)
        return
      }
      setItems((prev) =>
        prev.map((i) =>
          i.productId === productId && i.weight === weight
            ? { ...i, quantity }
            : i
        )
      )
    },
    [removeItem]
  )

  const clearCart = useCallback(() => setItems([]), [])

  const totalItems = useMemo(
    () => items.reduce((sum, i) => sum + i.quantity, 0),
    [items]
  )
  const totalAmount = useMemo(() => {
    const parseWeight = (weight: string) => {
      const numericValue = parseFloat(weight)
      if (isNaN(numericValue)) return 1
      const lower = weight.toLowerCase()
      if (lower.includes("kg")) return numericValue
      if (lower.includes("g") || lower.includes("গ্রাম")) return numericValue / 1000
      return 1
    }

    const sum = items.reduce((sum, i) => {
      const multiplier = parseWeight(i.weight)
      return sum + i.price * multiplier * i.quantity
    }, 0)

    // We store totals as integer BDT in DB (Prisma Int)
    return Math.round(sum)
  }, [items])

  const value = useMemo(
    () => ({
      items,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      totalItems,
      totalAmount,
    }),
    [items, addItem, removeItem, updateQuantity, clearCart, totalItems, totalAmount]
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error("useCart must be used within CartProvider")
  return ctx
}
