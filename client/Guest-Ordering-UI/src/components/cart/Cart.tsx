// Shopping cart overlay with order summary and payment
"use client"
import { useState } from "react"
import { Minus, Plus, X } from "lucide-react"
import { useCart } from "@/contexts/CartContext"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface CartProps {
  open: boolean
  onClose: () => void
}

export const Cart = ({ open, onClose }: CartProps) => {
  const { items, updateQuantity, getTotalPrice } = useCart()
  const [orderNote, setOrderNote] = useState("")
  const [paymentMethod, setPaymentMethod] = useState<"card" | "google-pay" | "cash">("card")
  const [cardNumber, setCardNumber] = useState("")
  const [expiry, setExpiry] = useState("")
  const [cvv, setCvv] = useState("")
  const [email, setEmail] = useState("")

  // Don't render if modal is closed
  if (!open) return null

  const subtotal = getTotalPrice()
  const processingFee = subtotal * 0.03
  const total = subtotal + processingFee

  // Handle payment submission
  const handlePay = () => {
    alert("Payment processed successfully!")
    onClose()
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

            <div>
              <h3 className="text-base font-semibold mb-4">Your Order</h3>
              <div className="space-y-3">
                {items.map((item) => (
                  <div key={item.id} className="flex items-start justify-between py-2">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="w-6 h-6 bg-gray-100 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-sm font-semibold">{item.quantity}</span>
                      </div>

                      {/* Item thumbnail */}
                      <div className="w-12 h-12 rounded-md overflow-hidden bg-gray-100 flex-shrink-0 mt-0.5">
                        <img
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>

                      <div className="flex-1">
                        <p className="font-medium text-sm leading-tight">{item.name}</p>
                        {item.note && <p className="text-xs text-gray-500 mt-1">Note: {item.note}</p>}

                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors cursor-pointer"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors cursor-pointer"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="text-sm font-semibold ml-4">${(item.price * item.quantity).toFixed(2)}</div>
                  </div>
                ))}

                <div className="border-t border-gray-200 pt-3 mt-3 space-y-2">
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

            <div>
              <h3 className="text-base font-semibold mb-2">Select your payment preference</h3>
              <p className="text-sm text-gray-500 mb-4">Payment</p>

              <div className="space-y-3">
                <div className="border border-gray-300 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setPaymentMethod("card")}
                    className={`w-full px-4 py-3 flex items-center justify-between ${paymentMethod === "card" ? "bg-gray-50" : "bg-white"} cursor-pointer`}
                  >
                    <span className="font-medium">Cards</span>
                    <div className="w-4 h-4 rounded-full border-2 border-gray-400 flex items-center justify-center">
                      {paymentMethod === "card" && <div className="w-2 h-2 rounded-full bg-primary" />}
                    </div>
                  </button>

                  {paymentMethod === "card" && (
                    <div className="px-4 pb-4 space-y-3 bg-white">
                      <div>
                        <Label htmlFor="card-number" className="text-sm mb-1 block">
                          Card number
                        </Label>
                        <Input
                          id="card-number"
                          placeholder="1234 5678 9012 3456"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label htmlFor="expiry" className="text-sm mb-1 block">
                            Expiry date
                          </Label>
                          <Input
                            id="expiry"
                            placeholder="MM/YY"
                            value={expiry}
                            onChange={(e) => setExpiry(e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="cvv" className="text-sm mb-1 block">
                            CVC / CVV
                          </Label>
                          <Input id="cvv" placeholder="3 digits" value={cvv} onChange={(e) => setCvv(e.target.value)} />
                        </div>
                      </div>
                      <Button onClick={handlePay} className="w-full bg-[#1a1a1a] hover:bg-[#2a2a2a] text-white cursor-pointer">
                        Pay
                      </Button>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => setPaymentMethod("google-pay")}
                  className={`w-full px-4 py-3 border border-gray-300 rounded-lg flex items-center justify-between ${paymentMethod === "google-pay" ? "bg-gray-50" : "bg-white"} cursor-pointer`}
                >
                  <span className="font-medium">Google Pay</span>
                  <div className="w-4 h-4 rounded-full border-2 border-gray-400 flex items-center justify-center">
                    {paymentMethod === "google-pay" && <div className="w-2 h-2 rounded-full bg-primary" />}
                  </div>
                </button>

                <button
                  onClick={() => setPaymentMethod("cash")}
                  className={`w-full px-4 py-3 border border-gray-300 rounded-lg flex items-center justify-between ${paymentMethod === "cash" ? "bg-gray-50" : "bg-white"} cursor-pointer`}
                >
                  <span className="font-medium text-left">Pay by cash or card before leaving</span>
                  <div className="w-4 h-4 rounded-full border-2 border-gray-400 flex items-center justify-center flex-shrink-0">
                    {paymentMethod === "cash" && <div className="w-2 h-2 rounded-full bg-primary" />}
                  </div>
                </button>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
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

              {paymentMethod !== "card" && (
                <Button onClick={handlePay} className="w-full mt-4 bg-primary hover:bg-primary/90 text-white h-12 cursor-pointer">
                  Confirm Order
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
