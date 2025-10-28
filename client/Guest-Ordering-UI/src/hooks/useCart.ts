import { useContext } from "react"
import { CartContext } from "@/contexts/CartContextType"

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
