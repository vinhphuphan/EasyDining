"use client"

import { useState } from "react"
import { X, Minus, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { MenuItem } from "@/lib/mock-data"

interface AddItemModalProps {
  item: MenuItem
  onClose: () => void
  onAdd: (item: MenuItem, quantity: number, addOns: any[], note: string) => void
}

export function AddItemModal({ item, onClose, onAdd }: AddItemModalProps) {
  const [quantity, setQuantity] = useState(1)
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([])
  const [note, setNote] = useState("")

  const handleAddOnToggle = (addOnName: string) => {
    setSelectedAddOns((prev) =>
      prev.includes(addOnName) ? prev.filter((name) => name !== addOnName) : [...prev, addOnName],
    )
  }

  const handleAdd = () => {
    const addOns = item.addOns?.filter((a) => selectedAddOns.includes(a.name)) || []
    onAdd(item, quantity, addOns, note)
  }

  const addOnsTotal =
    item.addOns?.filter((a) => selectedAddOns.includes(a.name)).reduce((sum, a) => sum + a.price, 0) || 0
  const totalPrice = (item.price + addOnsTotal) * quantity

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-background rounded-2xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Add Order
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-accent rounded-lg transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Item Info */}
          <div className="flex gap-4 mb-6">
            <img src={item.image || "/placeholder.svg"} alt={item.name} className="w-20 h-20 rounded-lg object-cover" />
            <div className="flex-1">
              <h3 className="font-semibold mb-1">{item.name}</h3>
              <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Base Price</span>
                <span className="text-lg font-bold text-primary">${item.price.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Add Ons */}
          {item.addOns && item.addOns.length > 0 && (
            <div className="mb-6">
              <h4 className="font-semibold mb-3">Add On</h4>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {item.addOns.map((addOn) => (
                  <button
                    key={addOn.name}
                    onClick={() => handleAddOnToggle(addOn.name)}
                    className={`w-full flex items-center justify-between p-3 rounded-lg border transition-colors ${
                      selectedAddOns.includes(addOn.name)
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          selectedAddOns.includes(addOn.name) ? "border-primary bg-primary" : "border-border"
                        }`}
                      >
                        {selectedAddOns.includes(addOn.name) && (
                          <div className="w-2 h-2 rounded-full bg-primary-foreground"></div>
                        )}
                      </div>
                      <span className="font-medium">{addOn.name}</span>
                    </div>
                    <span className="text-sm font-medium">+$ {addOn.price.toFixed(2)}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Note */}
          <div className="mb-6">
            <Label htmlFor="note" className="mb-2 block">
              Add On <span className="text-muted-foreground font-normal">Optional</span>
            </Label>
            <Textarea
              id="note"
              placeholder="Add special instructions..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
            />
          </div>

          {/* Quantity */}
          <div className="flex items-center justify-between mb-6">
            <span className="font-semibold">Quantity</span>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-2 rounded-lg border hover:bg-accent transition-colors"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="text-xl font-semibold w-12 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="p-2 rounded-lg border hover:bg-accent transition-colors"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t">
          <div className="flex items-center justify-between mb-4">
            <span className="text-lg font-semibold">Total</span>
            <span className="text-2xl font-bold text-primary">${totalPrice.toFixed(2)}</span>
          </div>
          <Button size="lg" className="w-full" onClick={handleAdd}>
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  )
}

function ShoppingCart({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
      />
    </svg>
  )
}
