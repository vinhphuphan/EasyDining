import { useState } from "react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { X, Minus, Plus } from "lucide-react"
import { useCart } from "@/hooks/useCart"
import type { MenuItem } from "@/models/menuItem"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"

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

  if (!item) return null

  const handleIncrease = () => setQuantity((prev) => prev + 1)
  const handleDecrease = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1))

  const handleAddToCart = () => {
    addItem({
      menuItemId: item.id,
      name: item.name,
      price: item.price,
      quantity: quantity,
      imageUrl: item.imageUrl || "",
      category: item.category || "",
      note: note.trim() || ""
    })

    toast.success(`Added ${quantity} × ${item.name}`, {
      action: {
        label: "View Cart",
        onClick: () => openCartDialog?.(),
      },
    });

    setQuantity(1)
    setNote("")
    onClose()
  }

  const totalPrice = item.price * quantity

  return (
    <>
      {open && <div className="fixed inset-0 bg-black/60 z-50 animate-fade-in" onClick={onClose} aria-hidden="true" />}

      <Dialog open={open} onOpenChange={onClose}>
        <VisuallyHidden>
          <DialogTitle></DialogTitle>
        </VisuallyHidden>
        <DialogContent aria-describedby={undefined} className="sm:max-w-[600px] p-0 gap-0 bg-white overflow-hidden max-h-[94vh] animate-scale-in border-none">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 z-10 rounded-full bg-white/90 p-2 hover:bg-white transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="w-full h-60 bg-gray-100 overflow-hidden">
            <img
              src={item.imageUrl || "/placeholder.svg?height=256&width=600"}
              alt={item.name}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="p-4 space-y-4">
            <h2 className="text-xl font-bold">{item.name}</h2>

            {item.description && <p className="text-gray-600">{item.description}</p>}

            <div className="space-y-2">
              <label className="text-base font-semibold block">Note</label>
              <Textarea
                placeholder="Note for menu"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="min-h-[100px] resize-none border-gray-200 focus:border-primary focus:ring-primary"
              />
            </div>

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
              disabled={!item.isAvailable}
              className="bg-white text-primary hover:bg-gray-100 font-semibold px-8 py-2 h-auto cursor-pointer"
            >
              {item.isAvailable ? "Add to Cart" : "Unavailable"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}