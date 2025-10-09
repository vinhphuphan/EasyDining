"use client"

import { Button } from "@/components/ui/button"
import { Users, Baby, User, Table } from "lucide-react"
import type { OrderFormData } from "@/components/modals/create-order-modal"
import { toast } from "sonner"

interface OrderSummaryStepProps {
  formData: OrderFormData
  onClose: () => void
}

export function OrderSummaryStep({ formData, onClose }: OrderSummaryStepProps) {
  const subtotal = formData.items.reduce((sum, item) => {
    const addOnsTotal = item.addOns?.reduce((s, a) => s + a.price, 0) || 0
    return sum + (item.price + addOnsTotal) * item.quantity
  }, 0)
  const tax = subtotal * 0.12
  const total = subtotal + tax

  const handleCreateOrder = () => {
    console.log("Creating order:", formData)
    // Here you would typically send the order to your backend
    onClose()
  }

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
          <User className="h-8 w-8" />
          Customer Information
        </h2>

        <div className="grid grid-cols-2 gap-8">
          {/* Left Side - Order Items */}
          <div className="space-y-4">
            {formData.items.map((item) => {
              const addOnsTotal = item.addOns?.reduce((s, a) => s + a.price, 0) || 0
              const itemTotal = (item.price + addOnsTotal) * item.quantity

              return (
                <div key={item.id} className="flex gap-4 p-4 rounded-xl border">
                  <img
                    src={item.image || "/placeholder.svg"}
                    alt={item.name}
                    className="w-24 h-24 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">{item.name}</h3>
                    {item.note && <p className="text-sm text-muted-foreground mb-1">Note: {item.note}</p>}
                    {item.addOns && item.addOns.length > 0 && (
                      <p className="text-sm text-muted-foreground mb-2">
                        Addition: {item.addOns.map((a) => a.name).join(", ")}
                      </p>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-primary">${itemTotal.toFixed(2)}</span>
                      <span className="text-sm text-muted-foreground">x{item.quantity}</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Right Side - Customer Info */}
          <div className="space-y-6">
            <div className="p-4 rounded-xl border">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <Table className="h-4 w-4" />
                Table Number
              </div>
              <div className="text-2xl font-bold">{formData.tableNumber || "Take Away"}</div>
            </div>

            <div className="p-4 rounded-xl border">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <Users className="h-4 w-4" />
                People
              </div>
              <div className="text-2xl font-bold">{formData.numberOfPeople}</div>
            </div>

            <div className="p-4 rounded-xl border">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <User className="h-4 w-4" />
                Customer Name
              </div>
              <div className="text-2xl font-bold">{formData.customerName}</div>
            </div>

            <div className="p-4 rounded-xl border">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <Baby className="h-4 w-4" />
                Baby Chair
              </div>
              <div className="text-2xl font-bold">{formData.babyChair ? "Yes" : "No"}</div>
            </div>
          </div>
        </div>

        {/* Total Section */}
        <div className="mt-8 p-6 rounded-xl border bg-muted/50">
          <div className="space-y-3">
            <div className="flex justify-between text-base">
              <span className="text-muted-foreground">Sub Total</span>
              <span className="font-medium">US${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-base">
              <span className="text-muted-foreground">Tax 12%</span>
              <span className="font-medium">US${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-2xl font-bold pt-3 border-t">
              <span>Total Payment</span>
              <span className="text-primary">US${total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Create Order Button */}
        <Button size="lg" className="w-full mt-8 h-14 text-lg" onClick={handleCreateOrder}>
          Create Order and Sent to Kitchen
        </Button>
      </div>
    </div>
  )
}
