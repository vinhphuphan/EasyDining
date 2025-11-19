"use client"
import { useMemo, useState } from "react"
import { X } from "lucide-react"
import { useCart } from "@/hooks/useCart"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { EmptyCartState } from "./EmptyCartState"
import { OrderSummary } from "./OrderSummary"
import { PaymentMethodSelector } from "./PaymentMethodSelector"
import { useCreateOrderMutation } from "@/api/ordersApi"
import type { Order } from "@/models/order"
import { Spinner } from "../ui/spinner"
import type { CartItem } from "@/models/cart"

interface CartProps {
  open: boolean
  onClose: () => void
  onOrderSuccess?: (data: {
    amount: number;
    orderId: number;
    date: string;
    receiptEmail?: string
    order: Order
  }) => void,
  tableCode: string
}

function resolveDiscount(code: string, items: CartItem[]): number {
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0)
  switch (code.trim().toUpperCase()) {
    case "SAVE10": return Math.min(10, subtotal)
    case "WELCOME5": return Math.min(subtotal * 0.05, subtotal)
    default: return 0
  }
}

export const Cart = ({ open, onClose, onOrderSuccess, tableCode }: CartProps) => {
  const {
    items,
    updateQuantity,
    clearCart,
  } = useCart()

  const [orderNote, setOrderNote] = useState("")
  const [paymentMethod, setPaymentMethod] = useState<"card" | "google-pay" | "cash">("cash")
  const [email, setEmail] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [buyerName, setBuyerName] = useState('');
  const [createOrder] = useCreateOrderMutation();
  const [discountCode, setDiscountCode] = useState("")
  const discount = useMemo(() => resolveDiscount(discountCode, items), [discountCode, items])

  // Don't render if modal is closed
  if (!open) return null

  // Show empty state
  if (items.length === 0) {
    return (
      <>
        <div className="fixed inset-0 bg-black/60 z-50 animate-fade-in" onClick={onClose} aria-hidden="true" />
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col animate-scale-in pointer-events-auto shadow-2xl">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
              <div className="flex items-center gap-3">
                <div className="bg-primary text-white px-4 py-1.5 rounded-full text-sm font-semibold">Table.1</div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                aria-label="Close cart"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <EmptyCartState onClose={onClose} />
          </div>
        </div>
      </>
    )
  }

  const handleCreateOrder = async () => {
    setIsProcessing(true)

    const orderPayload = {
      tableCode: tableCode,
      buyerName: buyerName || "Guest",
      buyerEmail: email.trim() ?? "",
      orderType: "Dine In" as const,
      items: items.map(i => ({
        menuItemId: i.menuItemId,
        quantity: i.quantity,
        note: i.note ?? ""
      })),
      discount
    }

    try {
      const res = await createOrder(orderPayload).unwrap()

      if (!res.success) {
        toast.error(res.message || "Failed to create order")
        return
      }
      onClose();

      const total = res.data.orderTotal
        ?? items.reduce((sum, i) => sum + i.price * i.quantity, 0)

      onOrderSuccess?.({
        amount: total,
        orderId: res.data.id,
        date: res.data.orderDate,
        receiptEmail: email ?? "",
        order: res.data
      })

      setTimeout(() => {
        clearCart()
      }, 0)

    } catch (err) {
      console.error("Create order error:", err)
      toast.error("Failed to create order")
    } finally {
      setIsProcessing(false)
    }
  }


  return (
    <>
      <div className="fixed inset-0 bg-black/60 z-50 animate-fade-in" onClick={onClose} aria-hidden="true" />

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col animate-scale-in pointer-events-auto shadow-2xl">
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
            <div className="flex items-center gap-3">
              <div className="bg-primary text-white px-4 py-1.5 rounded-full text-sm font-semibold">Table.1</div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
            {/* Order Note */}
            <div>
              <Label htmlFor="order-note" className="text-base font-semibold mb-2 block">
                Order note
              </Label>
              <p className="text-sm text-gray-500 mb-2">Optional</p>
              <Textarea
                id="order-note"
                placeholder="Add any special requests..."
                value={orderNote}
                onChange={(e) => setOrderNote(e.target.value)}
                className="min-h-[80px] resize-none"
              />
            </div>

            {/* Order Summary */}
            <OrderSummary
              items={items}
              onUpdateQuantity={updateQuantity}
              onClose={onClose}
            />

            {/* Payment Method */}
            <PaymentMethodSelector
              paymentMethod={paymentMethod}
              onPaymentMethodChange={setPaymentMethod}
              onPay={handleCreateOrder}
              isLoading={isProcessing}
            />

            {/* Email for Receipt */}
            <div className="pt-2">
              <Label htmlFor="buyer-name" className="text-base font-semibold mb-2 block">
                Your name
              </Label>
              <Input
                id="buyer-name"
                type="text"
                placeholder="Guest"
                value={buyerName}
                onChange={(e) => setBuyerName(e.target.value)}
                className="w-full"
              />
            </div>

            {/* Email for Receipt */}
            <div className="pt-3 border-t border-gray-200">
              <Label htmlFor="receipt-email" className="text-base font-semibold mb-2 block">
                Email for receipt
              </Label>
              <p className="text-sm text-gray-500 mb-3">Optional - We'll send your order confirmation here</p>
              <Input
                id="receipt-email"
                type="email"
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full"
              />
            </div>

            <div className="pt-3 border-t border-gray-200">
              <Label htmlFor="discount-code" className="text-base font-semibold mb-2 block">Discount code</Label>
              <Input id="discount-code" value={discountCode} onChange={(e) => setDiscountCode(e.target.value)} />
              {discount > 0 && <p className="text-sm text-green-600 mt-2">-${discount.toFixed(2)} will be applied.</p>}
            </div>

            {/* Confirm Order Button */}
            <Button
              onClick={handleCreateOrder}
              disabled={isProcessing}
              className="w-full bg-primary hover:bg-primary/90 text-white h-12 cursor-pointer"
            >
              {isProcessing ? <Spinner /> : "Confirm Order"}
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
