"use client"

// ============================================
// CART CONTEXT
// ============================================
// Global state management for shopping cart
// Provides cart operations: add, remove, update, clear

import { createContext, useContext, useState, type ReactNode } from "react"

/**
 * CartItem represents a single item in the shopping cart
 */
export interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  options?: {
    flavor?: string
    size?: string
  }
  note?: string
  image?: string
}

/**
 * CartContext interface defines all available cart operations
 */
interface CartContextType {
  items: CartItem[]
  addItem: (item: Omit<CartItem, "id">) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  getTotalPrice: () => number
  getTotalItems: () => number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

/**
 * CartProvider wraps the app and provides cart state to all components
 */
export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([])

  /**
   * Add a new item to cart
   * Generates unique ID based on item properties and timestamp
   */
  const addItem = (item: Omit<CartItem, "id">) => {
    const id = `${item.name}-${item.options?.flavor}-${item.options?.size}-${item.note || ""}-${Date.now()}`
    setItems((prev) => [...prev, { ...item, id }])
  }

  /**
   * Remove item from cart by ID
   */
  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id))
  }

  /**
   * Update item quantity
   * If quantity is 0 or less, remove the item
   */
  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id)
      return
    }
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, quantity } : item)))
  }

  /**
   * Clear all items from cart
   */
  const clearCart = () => {
    setItems([])
  }

  /**
   * Calculate total price of all items in cart
   */
  const getTotalPrice = () => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  /**
   * Calculate total number of items in cart
   */
  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0)
  }

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        getTotalPrice,
        getTotalItems,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

/**
 * Custom hook to access cart context
 * Must be used within CartProvider
 */
export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
