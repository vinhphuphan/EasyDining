"use client"

import { useState } from "react"
import { Search, Plus, FileText, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { OrderCard } from "@/components/cards/order-card"
import { NotificationPanel } from "@/components/notification-panel"
import { useCreateOrderModal } from "@/context/CreateOrderModalProvider"
import { OrderDetailModal } from "@/components/modals/order-detail-modal"
import { orders } from "@/lib/mock-data"
import type { Order } from "@/lib/mock-data"

export default function OrderPage() {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false)
  const { openModal } = useCreateOrderModal()
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [activeTab, setActiveTab] = useState<"all" | "in-progress" | "ready" | "waiting-payment">("all")
  const [sortBy, setSortBy] = useState<"latest" | "oldest" | "type">("latest")
  const [showSortDropdown, setShowSortDropdown] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const filteredOrders = orders.filter((order) => {
    const matchesTab = activeTab === "all" || order.status === activeTab
    const matchesSearch =
      searchQuery === "" ||
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesTab && matchesSearch
  })

  const sortedOrders = [...filteredOrders].sort((a, b) => {
    if (sortBy === "latest") {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    } else if (sortBy === "oldest") {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    } else {
      return a.type.localeCompare(b.type)
    }
  })

  const tabCounts = {
    all: orders.length,
    "in-progress": orders.filter((o) => o.status === "in-progress").length,
    ready: orders.filter((o) => o.status === "ready").length,
    "waiting-payment": orders.filter((o) => o.status === "waiting-payment").length,
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="p-6 max-w-[1600px] mx-auto">
        {/* Page Header */}
        <div className="flex items-center gap-2 mb-6">
          <FileText className="h-6 w-6" />
          <h1 className="text-2xl font-semibold">Order</h1>
        </div>

        {/* Search and Create Order */}
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search Order ID or Customer Name"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button className="cursor-pointer" size="lg" onClick={openModal}>
            <Plus className="h-5 w-5 mr-2" />
            Create New Order
          </Button>
        </div>

        {/* Tabs and Sort */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === "all"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
                }`}
            >
              All <Badge className="ml-2">{tabCounts.all}</Badge>
            </button>
            <button
              onClick={() => setActiveTab("in-progress")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === "in-progress"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
                }`}
            >
              In Progress <Badge className="ml-2">{tabCounts["in-progress"]}</Badge>
            </button>
            <button
              onClick={() => setActiveTab("ready")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === "ready"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
                }`}
            >
              Ready to Served <Badge className="ml-2">{tabCounts.ready}</Badge>
            </button>
            <button
              onClick={() => setActiveTab("waiting-payment")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === "waiting-payment"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
                }`}
            >
              Waiting for Payment <Badge className="ml-2">{tabCounts["waiting-payment"]}</Badge>
            </button>
          </div>

          <div className="relative">
            <button
              onClick={() => setShowSortDropdown(!showSortDropdown)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border text-sm hover:bg-accent"
            >
              Sort by: {sortBy === "latest" ? "Latest Order" : sortBy === "oldest" ? "Oldest Order" : "Order Type"}
              <ChevronDown className="h-4 w-4" />
            </button>
            {showSortDropdown && (
              <div className="absolute right-0 mt-1 w-48 bg-popover border rounded-lg shadow-lg z-10">
                <button
                  onClick={() => {
                    setSortBy("latest")
                    setShowSortDropdown(false)
                  }}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-accent first:rounded-t-lg flex items-center justify-between"
                >
                  Latest Order {sortBy === "latest" && <span className="text-primary">✓</span>}
                </button>
                <button
                  onClick={() => {
                    setSortBy("oldest")
                    setShowSortDropdown(false)
                  }}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-accent flex items-center justify-between"
                >
                  Oldest Order {sortBy === "oldest" && <span className="text-primary">✓</span>}
                </button>
                <button
                  onClick={() => {
                    setSortBy("type")
                    setShowSortDropdown(false)
                  }}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-accent last:rounded-b-lg flex items-center justify-between"
                >
                  Order Type {sortBy === "type" && <span className="text-primary">✓</span>}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Orders Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedOrders.map((order) => (
            <Card
              key={order.id}
              className="p-6 cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => setSelectedOrder(order)}
            >
              <OrderCard order={order} showActions />
            </Card>
          ))}
        </div>
      </main>

      {/* Modals */}
      <NotificationPanel isOpen={isNotificationOpen} onClose={() => setIsNotificationOpen(false)} />
      {/* Global modal rendered by provider */}
      {selectedOrder && <OrderDetailModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />}
    </div>
  )
}
