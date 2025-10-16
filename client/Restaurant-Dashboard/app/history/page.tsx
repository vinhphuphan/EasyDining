"use client"

import { useState } from "react"
import { Search, ChevronDown } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { NotificationPanel } from "@/components/notification-panel"
import { orders } from "@/lib/mock-data"

export default function HistoryPage() {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState<"latest" | "oldest">("latest")
  const [showSortDropdown, setShowSortDropdown] = useState(false)


  const completedOrders = orders.filter((order) => order.status === "completed")

  const filteredOrders = completedOrders.filter(
    (order) =>
      searchQuery === "" ||
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const sortedOrders = [...filteredOrders].sort((a, b) => {
    if (sortBy === "latest") {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    } else {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    }
  })

  return (
    <div className="min-h-screen bg-background">
      <main className="p-6 max-w-[1600px] mx-auto">
        {/* Page Header */}
        <div className="flex items-center gap-2 mb-6">
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h1 className="text-2xl font-semibold">History</h1>
        </div>

        {/* Search and Sort */}
        <div className="flex items-center justify-between mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search Order ID or Customer Name"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="relative">
            <button
              onClick={() => setShowSortDropdown(!showSortDropdown)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border text-sm hover:bg-accent"
            >
              Sort by: {sortBy === "latest" ? "Latest Order" : "Oldest Order"}
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
                  className="w-full px-4 py-2 text-left text-sm hover:bg-accent last:rounded-b-lg flex items-center justify-between"
                >
                  Oldest Order {sortBy === "oldest" && <span className="text-primary">✓</span>}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-card rounded-lg border">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b">
                <tr className="text-left">
                  <th className="px-6 py-4 text-sm font-medium text-muted-foreground">Order ID</th>
                  <th className="px-6 py-4 text-sm font-medium text-muted-foreground">Customer</th>
                  <th className="px-6 py-4 text-sm font-medium text-muted-foreground">Type</th>
                  <th className="px-6 py-4 text-sm font-medium text-muted-foreground">Items</th>
                  <th className="px-6 py-4 text-sm font-medium text-muted-foreground">Total</th>
                  <th className="px-6 py-4 text-sm font-medium text-muted-foreground">Date</th>
                  <th className="px-6 py-4 text-sm font-medium text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {sortedOrders.map((order) => (
                  <tr key={order.id} className="border-b last:border-0 hover:bg-accent/50">
                    <td className="px-6 py-4 text-sm font-medium">{order.orderNumber}</td>
                    <td className="px-6 py-4 text-sm">{order.customerName}</td>
                    <td className="px-6 py-4 text-sm capitalize">{order.type}</td>
                    <td className="px-6 py-4 text-sm">{order.items.length} items</td>
                    <td className="px-6 py-4 text-sm font-medium">US$ {order.totalAmount.toFixed(2)}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <Badge className="bg-green-100 text-green-700 hover:bg-green-200">Completed</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Modals */}
      <NotificationPanel isOpen={isNotificationOpen} onClose={() => setIsNotificationOpen(false)} />
    </div>
  )
}
