"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Users, User, Table } from "lucide-react"
import type { OrderFormData } from "@/components/modals/create-order-modal"
import { toast } from "sonner"
import { useCreateOrderMutation } from "@/store/api/orderApi"
import { SuccessOrderToast } from "./success-order-toast"
import { OrderDto } from "@/types/order"
import { useSuccessOrderToast } from "@/context/SuccessOrderToastProvider"

interface OrderSummaryStepProps {
  formData: OrderFormData
  onClose: () => void
  onCreated: () => void
}

export function OrderSummaryStep({ formData, onClose, onCreated }: OrderSummaryStepProps) {
  const [showSuccess, setShowSuccess] = useState(false)
  const [recentOrder, setRecentOrder] = useState<OrderDto | null>(null)
  const subtotal = formData.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const tax = subtotal * 0.1
  const total = subtotal + tax
  const [createOrder, { isLoading }] = useCreateOrderMutation()
  const { showToast } = useSuccessOrderToast()
  const handleCreateOrder = async () => {
    try {
      if (!formData.items.length) {
        toast.error("Please add at least one item")
        return
      }

      const tableCode = formData.tableCode
      if (formData.orderType !== "Take Away" && !tableCode) {
        toast.error("Please select a valid table")
        return
      }

      const payload = {
        tableCode: formData.orderType === "Take Away" ? undefined : formData.tableCode,
        orderType: formData.orderType,
        numberOfPeople: formData.numberOfPeople,
        buyerName: formData.customerName || "Guest",
        buyerEmail: undefined,
        items: formData.items.map(i => ({
          menuItemId: Number(i.menuItemId),
          quantity: i.quantity,
          note: i.note,
        })),
      }

      const res = await createOrder(payload).unwrap()

      const created = res?.data
      if (!res?.success || !created) {
        throw new Error(res?.message || "Create order failed")
      }
      const meta = {
        amount: Number(created.orderTotal ?? subtotal + tax),
        orderId: created.id,
        date: String(created.orderDate ?? new Date().toISOString()),
        receiptEmail: created.buyerEmail ?? "",
      }
      showToast(meta)
      try { onCreated() } catch { }
      onClose();
    } catch (err: any) {
      const message = err?.message || "Failed to create order"
      toast.error(message)
    }
  }

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-lg font-semibold mb-5 flex items-center gap-3">
          <User className="h-5 w-5" />
          Customer Information
        </h2>

        <div className="grid grid-cols-2 gap-8">
          {/* Left Side - Order Items */}
          <div className="space-y-4">
            {formData.items.map((item) => {
              const itemTotal = item.price * item.quantity

              return (
                <div key={item.menuItemId} className="flex gap-4 p-4 rounded-xl border">
                  <img
                    src={item.imageUrl || "/placeholder.svg"}
                    alt={item.name}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">{item.name}</h3>
                    {item.note && <p className="text-sm text-muted-foreground mb-1">Note: {item.note}</p>}
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
              <div className="text-lg font-bold">{formData.tableCode || "Take Away"}</div>
            </div>

            <div className="p-4 rounded-xl border">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <Users className="h-4 w-4" />
                People
              </div>
              <div className="text-xl font-bold">{formData.numberOfPeople}</div>
            </div>

            <div className="p-4 rounded-xl border">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <User className="h-4 w-4" />
                Customer Name
              </div>
              <div className="text-xl font-bold">{formData.customerName?.trim() || "Guest"}</div>
            </div>
          </div>
        </div>

        {/* Total Section */}
        <div className="mt-8 p-6 rounded-xl border bg-muted/50">
          <div className="space-y-3">
            <div className="flex justify-between text-base">
              <span className="text-muted-foreground">Sub Total</span>
              <span className="font-medium">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-base">
              <span className="text-muted-foreground">Tax 10%</span>
              <span className="font-medium">${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold pt-3 border-t">
              <span>Total Payment</span>
              <span className="text-primary">${total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Create Order Button */}
        <Button size="lg" className="w-full mt-8 h-14 text-lg" onClick={handleCreateOrder} disabled={isLoading}>
          Create Order and Sent to Kitchen
        </Button>
      </div>

      <SuccessOrderToast
        open={showSuccess}
        onClose={() => setShowSuccess(false)}
        amount={recentOrder?.orderTotal ?? total}
        orderId={recentOrder?.id ?? "-"}
        date={recentOrder?.orderDate ?? new Date()}
        receiptEmail={recentOrder?.buyerEmail}
      />
    </div>
  )
}
