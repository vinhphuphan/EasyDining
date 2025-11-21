"use client"

import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { OrderDto } from "@/types/order"
import { useGetTablesQuery } from "@/store/api/tableApi"
import { TooltipProvider } from "../ui/tooltip"

interface OrderDetailModalProps {
  order: OrderDto
  onClose: () => void
}

export function OrderDetailModal({ order, onClose }: OrderDetailModalProps) {
  const { data: tables, isLoading: tablesLoading } = useGetTablesQuery()
  const tableArray = tables ?? []
  const matchedTable = tableArray.find(t => t.tableCode === order.tableCode)
  const tableName = matchedTable?.name ?? `#${order.tableCode}`

  const initials = (order.buyerName || "G")
    .split(" ")
    .map(n => n[0])
    .join("")
    .toUpperCase()

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending": return "text-yellow-600"
      case "Preparing": return "text-orange-600"
      case "Served": return "text-green-600"
      case "Cancelled": return "text-red-600"
      default: return "text-gray-600"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "Pending": return "Pending"
      case "Preparing": return "Preparing"
      case "Served": return "Served"
      case "Cancelled": return "Cancelled"
      default: return status
    }
  }

  const shortNote = order.buyerNote && order.buyerNote.length > 80
    ? order.buyerNote.slice(0, 80) + "..."
    : order.buyerNote;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-background rounded-2xl w-full max-w-xl max-h-[90vh] overflow-hidden flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-xl font-semibold">Order Detail</h2>
          <button onClick={onClose} className="p-2 hover:bg-accent rounded-lg">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">

          {/* Order Info */}
          <div className="flex justify-between mb-4 bg-muted/40 p-2 rounded">
            <div className="text-sm text-muted-foreground">
              Table: <b>{tableName}</b>
            </div>
            <div className="text-sm text-muted-foreground">
              {new Date(order.orderDate).toLocaleString()}
            </div>
          </div>

          {/* Customer */}
          <div className="flex items-center gap-3 mb-6">
            <Avatar className="h-12 w-12 bg-primary text-primary-foreground">
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div>
              <div className="text-sm text-muted-foreground">Customer</div>
              <div className="font-semibold">{order.buyerName || "Guest"}</div>
            </div>
          </div>

          {/* Buyer Note */}
          {order.buyerNote && order.buyerNote.trim().length > 0 && (
            <div className="mb-6 p-4 border rounded-lg bg-muted/30">
              <h3 className="font-semibold text-sm mb-2">Customer Note</h3>
              <p className="text-sm text-muted-foreground cursor-pointer line-clamp-3 leading-relaxed">
                {order.buyerNote}
              </p>
            </div>
          )}

          {/* Status */}
          <div className="flex items-center gap-3 mb-6 p-4 rounded-lg bg-muted/50">
            <div className={`font-semibold ${getStatusColor(order.orderStatus)}`}>
              {getStatusLabel(order.orderStatus)}
            </div>
            <span className="text-muted-foreground">•</span>
            <span className="text-sm text-muted-foreground">{order.items.length} items</span>
          </div>

          {/* Items */}
          <div className="space-y-4 mb-6">
            <h3 className="font-semibold">Order Items</h3>

            {order.items.map((item, idx) => (
              <div key={`${item.id}-${item.name}-${idx}`} className="flex items-center justify-between p-4 rounded-lg border">
                <div className="flex items-center gap-4 flex-1">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-16 h-16 rounded-md object-cover"
                  />
                  <div>
                    <div className="font-medium mb-1">{item.name}</div>
                    <div className="text-sm text-muted-foreground">
                      Quantity: {item.quantity}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-semibold">
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    ${item.price.toFixed(2)} each
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Total */}
          <div className="p-4 rounded-lg bg-muted/50">
            <div className="flex items-center justify-between text-xl font-bold">
              <span>Total</span>
              <span className="text-primary">
                ${order.subtotal.toFixed(2)}
              </span>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-6 border-t flex gap-3">
          <Button variant="outline" className="flex-1 bg-transparent" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  )
}
