"use client"

import type { CartItem } from "@/models/cart"
import { CartContext } from "./CartContextType"
import { useState, useEffect, type ReactNode } from "react"

const CART_STORAGE_KEY = 'easyDining_cart'

/**
 * CartProvider wraps the app and provides cart state to all components
 */
export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([])

  // Load cart from localStorage when component mounts
  useEffect(() => {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY)
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart)
        setItems(parsedCart)
      } catch (error) {
        console.error('Failed to parse cart from localStorage:', error)
        localStorage.removeItem(CART_STORAGE_KEY)
      }
    }
  }, [])

  // Save cart to localStorage whenever items change
  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
  }, [items])

  /**
   * Add a new item to cart
   * Generates unique ID based on item properties and timestamp
   */
  const addItem = (item: Omit<CartItem, "id">) => {
    const id = `${item.menuItemId}-${Date.now()}`
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
    localStorage.removeItem(CART_STORAGE_KEY)
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
