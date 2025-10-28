import { ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"

interface EmptyCartStateProps {
    onClose: () => void
}

export const EmptyCartState = ({ onClose }: EmptyCartStateProps) => {
    return (
        <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <ShoppingCart className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Your cart is empty</h3>
            <p className="text-gray-500 mb-6 max-w-sm">
                Add some delicious items from our menu to get started with your order.
            </p>
            <Button onClick={onClose} className="bg-primary hover:bg-primary/90 text-white">
                Browse Menu
            </Button>
        </div>
    )
}