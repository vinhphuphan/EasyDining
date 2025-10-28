import { Minus, Plus } from "lucide-react"
import type { CartItem } from "@/models/cart"

interface CartItemRowProps {
    item: CartItem
    onUpdateQuantity: (id: string, quantity: number) => void
}

export const CartItemRow = ({ item, onUpdateQuantity }: CartItemRowProps) => {
    return (
        <div className="flex items-start justify-between py-2">
            <div className="flex items-start gap-3 flex-1">
                <div className="w-6 h-6 bg-gray-100 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-sm font-semibold">{item.quantity}</span>
                </div>

                {/* Item thumbnail */}
                <div className="w-12 h-12 rounded-md overflow-hidden bg-gray-100 flex-shrink-0 mt-0.5">
                    <img
                        src={item.imageUrl || "/placeholder.svg"}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                    />
                </div>

                <div className="flex-1">
                    <p className="font-medium text-sm leading-tight">{item.name}</p>
                    <p className="text-xs text-gray-500 mt-1">{item.category}</p>
                    {item.note && (
                        <p className="text-xs text-gray-400 mt-1 italic">Note: {item.note}</p>
                    )}

                    <div className="flex items-center gap-2 mt-2">
                        <button
                            onClick={() => {
                                const newQuantity = item.quantity - 1;
                                if (newQuantity >= 0) {
                                    onUpdateQuantity(item.id, newQuantity);
                                }
                            }}
                            className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors cursor-pointer"
                            aria-label="Decrease quantity"
                        >
                            <Minus className="w-3.5 h-3.5" />
                        </button>                            disabled={item.quantity <= 1}
                        >
                            <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                        <button
                            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                            className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors cursor-pointer"
                            aria-label="Increase quantity"
                        >
                            <Plus className="w-3.5 h-3.5" />
                        </button>
                    </div>
                </div>
            </div>

            <div className="text-sm font-semibold ml-4">
                ${(item.price * item.quantity).toFixed(2)}
            </div>
        </div >
    )
}