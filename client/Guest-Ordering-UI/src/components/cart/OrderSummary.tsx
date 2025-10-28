import type { CartItem } from "@/models/cart"
import { CartItemRow } from "./CartItemRow"
import { Button } from "@/components/ui/button"

interface OrderSummaryProps {
    items: CartItem[]
    onUpdateQuantity: (id: string, quantity: number) => void
    onClose: () => void
}

export const OrderSummary = ({ items, onUpdateQuantity, onClose }: OrderSummaryProps) => {
    const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0)
    const processingFee = subtotal * 0.03
    const total = subtotal + processingFee

    return (
        <div>
            <h3 className="text-base font-semibold mb-4">Your Order</h3>
            <div className="space-y-3">
                {items.map((item) => (
                    <CartItemRow
                        key={item.id}
                        item={item}
                        onUpdateQuantity={onUpdateQuantity}
                    />
                ))}

                <div className="border-t border-gray-200 pt-3 mt-3 space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Subtotal</span>
                        <span className="font-medium">${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Processing fee</span>
                        <span className="font-medium">+${processingFee.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-base font-bold">
                        <span>Total</span>
                        <span>${total.toFixed(2)}</span>
                    </div>
                </div>
            </div>

            <Button
                onClick={onClose}
                variant="outline"
                className="w-full mt-4 border-gray-300 hover:bg-gray-50 bg-transparent cursor-pointer"
            >
                Add more
            </Button>
        </div>
    )
}