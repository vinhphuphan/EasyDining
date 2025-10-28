import type { CartItem } from "@/models/cart"
import { createContext } from "react"

/**
 * CartContext interface defines all available cart operations
 */
export interface CartContextType {
    items: CartItem[]
    addItem: (item: Omit<CartItem, "id">) => void
    removeItem: (id: string) => void
    updateQuantity: (id: string, quantity: number) => void
    clearCart: () => void
    getTotalPrice: () => number
    getTotalItems: () => number
}

export const CartContext = createContext<CartContextType | undefined>(undefined)
