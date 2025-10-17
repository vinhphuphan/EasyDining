"use client"
import { useState } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useCart } from "@/contexts/CartContext"
import { toast } from "sonner"
import { X, Minus, Plus } from "lucide-react"
import type { MenuItem } from "@/data/menuData"

interface ItemDetailModalProps {
  item: MenuItem | null;
  open: boolean;
  onClose: () => void;
  openCartDialog?: () => void;
}

export const ItemDetailModal = ({ item, open, onClose, openCartDialog }: ItemDetailModalProps) => {
  const { addItem } = useCart()
  const [quantity, setQuantity] = useState<number>(1)
  const [note, setNote] = useState<string>("")

  // Early return if no item
  if (!item) return null

  // Increase quantity
  const handleIncrease = () => {
    setQuantity((prev) => prev + 1)
  }

  // Decrease quantity (minimum 1)
  const handleDecrease = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1))
  }

  //  Add item to cart with quantity and note
  const handleAddToCart = () => {
    addItem({
      name: item.name,
      price: item.price,
      quantity: quantity,
      note: note || undefined,
      image: item.image,
    })

    toast.success(`Added ${quantity} × ${item.name}`, {
      action: {
        label: "View Cart",
        onClick: () => {
          if (openCartDialog) openCartDialog();
        },
      },
    })

    // Reset and close
    setQuantity(1)
    setNote("")
    onClose()
  }

  // Calculate total price
  const totalPrice = item.price * quantity

  return (
    <>
      {open && <div className="fixed inset-0 bg-black/60 z-50 animate-fade-in" onClick={onClose} aria-hidden="true" />}

      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[600px] p-0 gap-0 bg-white overflow-hidden max-h-[90vh] overflow-y-auto animate-scale-in border-none">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 z-10 rounded-full bg-white/90 p-2 hover:bg-white transition-colors"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Hero image */}
          <div className="w-full h-64 bg-gray-100 overflow-hidden">
            <img
              src={item.image || "/placeholder.svg?height=256&width=600"}
              alt={item.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Content */}
          <div className="p-4 space-y-4">
            {/* Title */}
            <h2 className="text-xl font-bold">
              {item.name} {item.nameKo}
            </h2>

            {/* Menu Note section */}
            <div className="space-y-2">
              <label className="text-base font-semibold block">Menu Note</label>
              <Textarea
                placeholder="Note for menu"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="min-h-[100px] resize-none border-gray-200 focus:border-primary focus:ring-primary"
              />
            </div>

            {/* Quantity selector */}
            <div className="flex items-center justify-center gap-4 py-2">
              <button
                onClick={handleDecrease}
                className="w-10 h-10 rounded-full cursor-pointer border-2 border-gray-300 flex items-center justify-center hover:border-gray-400 transition-colors"
                aria-label="Decrease quantity"
              >
                <Minus className="h-5 w-5" />
              </button>
              <span className="text-xl font-semibold w-10 text-center">{quantity}</span>
              <button
                onClick={handleIncrease}
                className="w-10 h-10 cursor-pointer rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-gray-400 transition-colors"
                aria-label="Increase quantity"
              >
                <Plus className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="bg-primary text-white px-6 py-4 flex items-center justify-between">
            <span className="text-xl font-bold">${totalPrice.toFixed(2)}</span>
            <Button
              onClick={handleAddToCart}
              className="bg-white text-primary hover:bg-gray-100 font-semibold px-8 py-2 h-auto cursor-pointer"
            >
              Add to Cart
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
