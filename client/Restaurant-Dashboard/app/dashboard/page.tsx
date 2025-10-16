"use client"

import { useState } from "react"
import { CreditCard, Clock, CheckCircle, FileText, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { StatsCard } from "@/components/cards/stats-card"
import { OrderCard } from "@/components/cards/order-card"
import { EmptyState } from "@/components/empty-state"
import { NotificationPanel } from "@/components/notification-panel"
import { orders, tables, menuItems } from "@/lib/mock-data"
import { useCreateOrderModal } from "@/context/CreateOrderModalProvider"

export default function DashboardPage() {
  const [selectedFloor, setSelectedFloor] = useState("First Floor")
  const [isNotificationOpen, setIsNotificationOpen] = useState(false)
  const [showFloorDropdown, setShowFloorDropdown] = useState(false)
  const { openModal } = useCreateOrderModal()

  const currentUser = {
    name: "Richardo",
    role: "Waiter",
    avatar: "/professional-man.jpg",
  }

  const inProgressOrders = orders.filter((o) => o.status === "in-progress")
  const waitingPaymentOrders = orders.filter((o) => o.status === "waiting-payment")
  const readyOrders = orders.filter((o) => o.status === "ready")
  const completedCount = orders.filter((o) => o.status === "completed").length

  const totalEarning = orders.reduce((sum, order) => sum + order.totalAmount, 0)

  const availableTables = tables.filter((t) => t.floor === selectedFloor && t.status === "available")
  const outOfStockItems = menuItems.filter((m) => m.stockStatus === "out-of-stock")

  const floors = Array.from(new Set(tables.map((t) => t.floor)))

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        {/* Main Content */}
        <main className="flex-1 p-6">
          {/* Greeting */}
          <div className="flex items-center justify-between mb-4">
            <div className="">
              <h1 className="text-lg font-semibold mb-1">Good Morning, {currentUser.name}</h1>
              <p className="hidden md:block text-muted-foreground">Give your best services for customers, happy working 😊</p>
            </div>
            <div className="">
              <div className="text-xl font-semibold">09:55:02</div>
              <div className="text-sm text-muted-foreground">Thu, 2 April 2025</div>
            </div>
          </div>

          {/* Time and Create Order Button */}
          <div className="flex items-center justify-end mb-4">
            <Button size="lg" className="h-12 cursor-pointer" onClick={openModal}>
              <span className="text-lg mr-2">+</span>
              Create New Order
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <StatsCard title="Total Earning" value={`$ ${totalEarning.toLocaleString()}`} icon={CreditCard} />
            <StatsCard title="In Progress" value={inProgressOrders.length} icon={Clock} iconColor="text-orange-600" />
            <StatsCard
              title="Ready to Served"
              value={readyOrders.length}
              icon={CheckCircle}
              iconColor="text-green-600"
            />
            <StatsCard title="Completed" value={completedCount} icon={FileText} iconColor="text-blue-600" />
          </div>

          {/* Orders Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* In Progress */}
            <Card className="p-6 pb-0 gap-4">
              <h2 className="text-lg font-semibold">In Progress</h2>
              <div className="space-y-4">
                {inProgressOrders.length > 0 ? (
                  <>
                    {inProgressOrders.map((order) => (
                      <OrderCard key={order.id} order={order} />
                    ))}
                    <button className="w-full p-3 text-sm text-muted-foreground hover:text-foreground flex items-center justify-center gap-2 border-t cursor-pointer">
                      See All Order
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </>
                ) : (
                  <EmptyState
                    title="No order found"
                    description="If Order was created, latest order will be appear here."
                  />
                )}
              </div>
            </Card>

            {/* Waiting for Payments */}
            <Card className="p-6 pb-0 gap-4">
              <h2 className="text-lg font-semibold">Waiting for Payments</h2>
              <div className="space-y-4">
                {waitingPaymentOrders.length > 0 ? (
                  <>
                    {waitingPaymentOrders.map((order) => (
                      <OrderCard key={order.id} order={order} />
                    ))}
                    <button className="w-full p-3 text-sm text-muted-foreground hover:text-foreground flex items-center justify-center gap-2 border-t">
                      See All Order
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </>
                ) : (
                  <EmptyState
                    title="No order found"
                    description="Order with status Waiting for Payment will be appear here."
                  />
                )}
              </div>
            </Card>
          </div>
        </main>

        {/* Right Sidebar */}
        <aside className="hidden xl:block w-80 bg-card pt-4 pr-2 space-y-6">
          {/* Table Available Card */}
          <Card className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Table Available</h3>
              <div className="relative">
                <button
                  onClick={() => setShowFloorDropdown(!showFloorDropdown)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm hover:bg-accent"
                >
                  {selectedFloor}
                  <ChevronDown className="h-4 w-4" />
                </button>
                {showFloorDropdown && (
                  <div className="absolute right-0 mt-1 w-40 bg-popover border rounded-lg shadow-lg z-10">
                    {floors.map((floor) => (
                      <button
                        key={floor}
                        onClick={() => {
                          setSelectedFloor(floor)
                          setShowFloorDropdown(false)
                        }}
                        className="w-full px-3 py-2 text-left text-sm hover:bg-accent first:rounded-t-lg last:rounded-b-lg"
                      >
                        {floor}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              <div className="flex items-center justify-between text-sm text-muted-foreground pb-2 pr-2 border-b">
                <span>Table Number</span>
                <span>Capacity</span>
              </div>
              {availableTables.map((table) => (
                <div key={table.id} className="flex items-center justify-between py-2 pr-2 text-sm">
                  <span className="font-medium">{table.number}</span>
                  <span className="text-muted-foreground">{table.capacity} Person</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Out of Stock Card */}
          <Card className="p-4">
            <h3 className="font-semibold mb-4">Out of Stock</h3>
            <div className="space-y-3">
              {outOfStockItems.length > 0 ? (
                outOfStockItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      className="h-12 w-12 rounded-lg object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm truncate">{item.name}</div>
                      <div className="text-xs text-muted-foreground">Available: {item.availableTime}</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-muted mb-2">
                    <svg
                      className="h-6 w-6 text-muted-foreground"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                      />
                    </svg>
                  </div>
                  <p className="font-medium">All menu is ready</p>
                  <p className="text-xs text-muted-foreground">All menus are still available.</p>
                </div>
              )}
            </div>
          </Card>
        </aside>
      </div>

      {/* Notification Panel */}
      <NotificationPanel isOpen={isNotificationOpen} onClose={() => setIsNotificationOpen(false)} />
    </div>
  )
}
