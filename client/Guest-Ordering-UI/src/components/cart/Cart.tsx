"use client"
import { useState } from "react"
import { X } from "lucide-react"
import { useCart } from "@/hooks/useCart"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Spinner } from "../ui/spinner"
import { toast } from "sonner"
import { EmptyCartState } from "./EmptyCartState"
import { OrderSummary } from "./OrderSummary"
import { PaymentMethodSelector } from "./PaymentMethodSelector"

interface CartProps {
  open: boolean
  onClose: () => void
}

export const Cart = ({ open, onClose }: CartProps) => {
  const {
    items,
    updateQuantity,
    clearCart,
  } = useCart()

  const [orderNote, setOrderNote] = useState("")
  const [paymentMethod, setPaymentMethod] = useState<"card" | "google-pay" | "cash">("card")
  const [email, setEmail] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)

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

  // Handle payment submission
  const handlePay = async () => {
    setIsProcessing(true)
    try {
      // TODO: Add actual payment processing logic here
      // await processPayment({ paymentMethod, orderNote, email })

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Clear cart after successful payment
      clearCart()

      toast.success("Payment processed successfully!")
      onClose()
    } catch (error) {
      toast.error("Payment failed. Please try again.")
      console.log("Error when processing payment : ", error);
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
              onPay={handlePay}
              isLoading={isProcessing}
            />

            {/* Email for Receipt */}
            <div className="pt-6 border-t border-gray-200">
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

            {/* Confirm Order Button */}
            <Button
              onClick={handlePay}
              disabled={isProcessing}
              className="w-full mt-4 bg-primary hover:bg-primary/90 text-white h-12 cursor-pointer"
            >
              {isProcessing ? "Processing..." : "Confirm Order"}
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}