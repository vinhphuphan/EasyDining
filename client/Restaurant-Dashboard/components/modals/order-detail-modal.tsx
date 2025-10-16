"use client"

import { useState } from "react"
import { X, CreditCard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { PaymentModal } from "@/components/modals/payment-modal"
import type { Order } from "@/lib/mock-data"
import { menuItems } from "@/lib/mock-data"

interface OrderDetailModalProps {
  order: Order
  onClose: () => void
}

export function OrderDetailModal({ order, onClose }: OrderDetailModalProps) {
  const [showPaymentModal, setShowPaymentModal] = useState(false)

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "in-progress":
        return "text-orange-600"
      case "ready":
        return "text-green-600"
      case "waiting-payment":
        return "text-blue-600"
      case "completed":
        return "text-gray-600"
      default:
        return "text-gray-600"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "in-progress":
        return "In Progress"
      case "ready":
        return "Ready to Serve"
      case "waiting-payment":
        return "Waiting for Payment"
      case "completed":
        return "Completed"
      default:
        return status
    }
  }

  const handlePaymentComplete = () => {
    console.log("Payment completed for order:", order.orderNumber)
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-background rounded-2xl w-full max-w-xl max-h-[90vh] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b">
            <h2 className="text-xl font-bold">Detail Order</h2>
            <button onClick={onClose} className="p-2 hover:bg-accent rounded-lg transition-colors cursor-pointer">
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* Order Info */}
            <div className=" flex items-center justify-between mb-4 bg-gray-100 p-2 rounded-lg">
              <div className="text-sm text-muted-foreground mb-1">
                Order# {order.orderNumber} / {order.type}
              </div>
              <div className="text-sm text-muted-foreground">{order.createdAt}</div>
            </div>

            {/* Customer */}
            <div className="flex items-center gap-3 mb-6">
              <Avatar className="h-12 w-12 bg-primary text-primary-foreground">
                <AvatarFallback>{getInitials(order.customerName)}</AvatarFallback>
              </Avatar>
              <div>
                <div className="text-sm text-muted-foreground">Customer Name</div>
                <div className="font-semibold">{order.customerName}</div>
              </div>
            </div>

            {/* Status */}
            <div className="flex items-center gap-3 mb-6 p-4 rounded-lg bg-muted/50">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${getStatusColor(order.status)} bg-current`}></div>
                <span className={`font-semibold ${getStatusColor(order.status)}`}>{getStatusLabel(order.status)}</span>
              </div>
              <span className="text-muted-foreground">•</span>
              <span className="text-sm text-muted-foreground">{order.progress}%</span>
              <span className="text-muted-foreground">•</span>
              <span className="text-sm text-muted-foreground">{order.items.length} Items</span>
            </div>

            {/* Items */}
            <div className="space-y-4 mb-6">
              <h3 className="font-semibold">Order Items</h3>
              {order.items.map((item) => {
                const menuItem = menuItems.find(m => m.name === item.name)
                const image = menuItem?.image || "/placeholder.svg"
                const unitPrice = menuItem?.price ?? item.price
                return (
                  <div key={item.id} className="flex items-center justify-between p-4 rounded-lg border">
                    <div className="flex items-center gap-4 flex-1">
                      <img src={image} alt={item.name} className="w-16 h-16 rounded-md object-cover" />
                      <div>
                        <div className="font-medium mb-1">{item.name}</div>
                        <div className="text-sm text-muted-foreground">Quantity: {item.quantity}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">${(unitPrice * item.quantity).toFixed(2)}</div>
                      <div className="text-sm text-muted-foreground">${unitPrice.toFixed(2)} each</div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Total */}
            <div className="p-4 rounded-lg bg-muted/50">
              <div className="flex items-center justify-between text-xl font-bold">
                <span>Total Payment</span>
                <span className="text-primary">US${order.totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t flex gap-3">
            <Button variant="outline" className="flex-1 bg-transparent" onClick={onClose}>
              + New Order
            </Button>
            <Button
              className="flex-1"
              disabled={order.status !== "waiting-payment"}
              onClick={() => setShowPaymentModal(true)}
            >
              <CreditCard className="h-4 w-4 mr-2" />
              Proceed to Payment
            </Button>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <PaymentModal
          order={order}
          onClose={() => setShowPaymentModal(false)}
          onPaymentComplete={handlePaymentComplete}
        />
      )}
    </>
  )
}
