"use client"

import { useCart } from "@/hooks/useCart"
/**
 * OrdersModal Component
 *
 * Displays a modal showing all current orders in the cart.
 * Shows "No orders exist" message when cart is empty.
 */

import { X } from "lucide-react"

import { AlertCircle } from "lucide-react"

interface OrdersModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function OrdersModal({ isOpen, onClose }: OrdersModalProps) {
  const { items } = useCart()

  if (!isOpen) return null

  return (
    <>
      <div className="fixed inset-0 bg-black/60 z-40 animate-fade-in" onClick={onClose} aria-hidden="true" />

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div className="bg-white rounded-2xl max-w-lg w-full max-h-[80vh] overflow-hidden flex flex-col animate-scale-in pointer-events-auto shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold">Current Orders</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Close orders modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto flex-1">
            {items.length === 0 ? (
              // Empty state
              <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                <AlertCircle className="w-16 h-16 mb-4" />
                <p className="text-lg">No orders exist</p>
              </div>
            ) : (
              // Orders list
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 pb-4 border-b last:border-b-0">
                    <img
                      src={item.imageUrl || "/placeholder.svg"}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                      {item.note && (
                        <p className="text-xs text-gray-400 mt-1 italic">Note: {item.note}</p>
                      )}
                    </div>
                    <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}

                <div className="flex items-center justify-between pt-4 border-t-2">
                  <span className="text-lg font-semibold">Total</span>
                  <span className="text-xl font-bold text-primary">
                    ${items.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
