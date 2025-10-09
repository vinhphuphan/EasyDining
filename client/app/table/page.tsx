"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { NotificationPanel } from "@/components/notification-panel"
import { CreateOrderModal } from "@/components/modals/create-order-modal"
import { OrderDetailModal } from "@/components/modals/order-detail-modal"
import { tables, orders } from "@/lib/mock-data"
import type { Order } from "@/lib/mock-data"

export default function TablePage() {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false)
  const [isCreateOrderOpen, setIsCreateOrderOpen] = useState(false)
  const [selectedFloor, setSelectedFloor] = useState("1st Floor")
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)


  const floors = ["1st Floor", "2nd Floor", "3rd Floor"]

  const filteredTables = tables.filter((table) => {
    const floorMap: Record<string, string> = {
      "1st Floor": "First Floor",
      "2nd Floor": "Second Floor",
      "3rd Floor": "Third Floor",
    }
    return table.floor === floorMap[selectedFloor]
  })

  const handleTableClick = (table: any) => {
    if (table.status === "occupied" && table.orderId) {
      const order = orders.find((o) => o.orderNumber === table.orderId)
      if (order) {
        setSelectedOrder(order)
      }
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="p-6">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
              <h1 className="text-2xl font-semibold">Table</h1>
            </div>

            {/* Status Legend */}
            <div className="flex items-center gap-4 ml-8">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full border-2 border-muted-foreground/30 bg-background" />
                <span className="text-sm text-muted-foreground">Available</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-orange-500" />
                <span className="text-sm text-muted-foreground">Not Available</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-foreground" />
                <span className="text-sm text-muted-foreground">Reserved</span>
              </div>
            </div>

            {/* Floor Tabs */}
            <div className="flex items-center gap-2 ml-8">
              {floors.map((floor) => (
                <button
                  key={floor}
                  onClick={() => setSelectedFloor(floor)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedFloor === floor
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                    }`}
                >
                  {floor}
                </button>
              ))}
            </div>
          </div>

          <Button size="lg" onClick={() => setIsCreateOrderOpen(true)}>
            <Plus className="h-5 w-5 mr-2" />
            Create New Order
          </Button>
        </div>

        {/* Table Grid */}
        <div className="grid grid-cols-5 gap-6">
          {filteredTables.map((table) => {
            const isAvailable = table.status === "available"
            const isOccupied = table.status === "occupied"
            const isReserved = table.status === "reserved"

            return (
              <div
                key={table.id}
                onClick={() => handleTableClick(table)}
                className={`relative aspect-square rounded-2xl border-2 flex flex-col items-center justify-center transition-all ${isAvailable
                  ? "border-muted-foreground/20 bg-background hover:border-muted-foreground/40 cursor-pointer"
                  : isOccupied
                    ? "border-orange-500 bg-orange-500 text-white cursor-pointer hover:shadow-lg"
                    : "border-foreground bg-foreground text-background cursor-pointer hover:shadow-lg"
                  }`}
              >
                {/* Table Number Badge */}
                {(isOccupied || isReserved) && (
                  <div className="absolute top-3 left-3 bg-white text-foreground px-3 py-1 rounded-full text-xs font-medium">
                    {table.number}
                  </div>
                )}

                {/* Available Table */}
                {isAvailable && <div className="text-2xl font-semibold text-foreground">{table.number}</div>}

                {/* Occupied Table */}
                {isOccupied && (
                  <>
                    <div className="absolute top-3 right-3 text-xs font-medium">{table.orderId}</div>
                    <Badge className="bg-white/20 text-white hover:bg-white/30 mb-2">In Progress</Badge>
                    <div className="flex items-center gap-1 text-sm">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      {table.time}
                    </div>
                  </>
                )}

                {/* Reserved Table */}
                {isReserved && (
                  <>
                    <div className="absolute top-3 right-3 text-xs font-medium">{table.orderId}</div>
                    <div className="flex items-center gap-1 text-sm">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      {table.time}
                    </div>
                  </>
                )}

                {/* Table Decorations */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-3 bg-current rounded-full" />
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-16 h-3 bg-current rounded-full" />
                <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-16 bg-current rounded-full" />
                <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-3 h-16 bg-current rounded-full" />
              </div>
            )
          })}
        </div>
      </main>

      {/* Modals */}
      <NotificationPanel isOpen={isNotificationOpen} onClose={() => setIsNotificationOpen(false)} />
      <CreateOrderModal isOpen={isCreateOrderOpen} onClose={() => setIsCreateOrderOpen(false)} />
      {selectedOrder && <OrderDetailModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />}
    </div>
  )
}
