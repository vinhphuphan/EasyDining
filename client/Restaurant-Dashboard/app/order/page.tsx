"use client"

import { useMemo, useState } from "react"
import { Search, Plus, FileText, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { OrderCard } from "@/components/cards/order-card"
import { NotificationPanel } from "@/components/notification-panel"
import { useCreateOrderModal } from "@/context/CreateOrderModalProvider"
import { OrderDetailModal } from "@/components/modals/order-detail-modal"
import type { OrderDto } from "@/types/order"
import { useGetOrdersQuery } from "@/store/api/orderApi"
import { Spinner } from "@/components/ui/spinner"
import { useGetTablesQuery } from "@/store/api/tableApi"

export default function OrderPage() {
  const { data, isLoading } = useGetOrdersQuery({ page: 1, pageSize: 20 })
  const { data: tables } = useGetTablesQuery()
  const orders: OrderDto[] = data?.data?.items ?? []
  const tableArray = tables ?? []

  const [isNotificationOpen, setIsNotificationOpen] = useState(false)
  const { openModal } = useCreateOrderModal()
  const [selectedOrder, setSelectedOrder] = useState<OrderDto | null>(null)
  const [activeTab, setActiveTab] = useState<"all" | "pending" | "preparing" | "served" | "cancelled">("all")
  const [sortBy, setSortBy] = useState<"latest" | "oldest" | "status">("latest")
  const [showSortDropdown, setShowSortDropdown] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  // Filter
  const filteredOrders = orders.filter(order => {
    const matchesTab =
      activeTab === "all" || order.orderStatus.toLowerCase() === activeTab

    const matchesSearch =
      searchQuery === "" ||
      order.tableCode?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.buyerName?.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesTab && matchesSearch
  })

  // Sort
  const sortedOrders = [...filteredOrders].sort((a, b) => {
    if (sortBy === "latest") {
      return new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()
    } else if (sortBy === "oldest") {
      return new Date(a.orderDate).getTime() - new Date(b.orderDate).getTime()
    } else {
      return a.orderStatus.localeCompare(b.orderStatus)
    }
  })

  // Tab counts
  const tabCounts = {
    all: orders.length,
    pending: orders.filter(o => o.orderStatus === "Pending").length,
    preparing: orders.filter(o => o.orderStatus === "Preparing").length,
    served: orders.filter(o => o.orderStatus === "Served").length,
    paid: orders.filter(o => o.orderStatus === "Paid").length,
    cancelled: orders.filter(o => o.orderStatus === "Cancelled").length,
  }

  const tableNameMap = useMemo(() => {
    const m = new Map<string, string>()
    tableArray.forEach((t) => {
      const code = t.tableCode
      if (code) m.set(code, t.name)
    })
    return m
  }, [tables])

  if (isLoading) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="flex flex-col items-center h-64">
        <Button disabled size="lg">
          <Spinner />
          Loading...
        </Button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-background">
      <main className="p-6 max-w-[1600px] mx-auto">

        {/* Header */}
        <div className="flex items-center gap-2 mb-6">
          <FileText className="h-6 w-6" />
          <h1 className="text-2xl font-semibold">Order</h1>
        </div>

        {/* Search + Create order */}
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
            {["all", "pending", "preparing", "served", "paid", "cancelled"].map((t) => (
              <button
                key={t}
                onClick={() => setActiveTab(t as any)}
                className={`group px-4 py-2 rounded-lg text-sm font-medium flex items-center transition-colors ${activeTab === t
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
                  }`}
              >
                {t[0].toUpperCase() + t.slice(1)}
                <Badge className={`ml-2 transition-colors 
                ${activeTab === t
                    ? "bg-primary-foreground text-primary font-semibold"
                    : "bg-muted text-muted-foreground group-hover:bg-accent"
                  }`}>{tabCounts[t as keyof typeof tabCounts]}</Badge>
              </button>
            ))}
          </div>

          {/* Sort Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowSortDropdown(!showSortDropdown)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border text-sm hover:bg-accent"
            >
              Sort by: {sortBy === "latest" ? "Latest" : sortBy === "oldest" ? "Oldest" : "Status"}
              <ChevronDown className="h-4 w-4" />
            </button>
            {showSortDropdown && (
              <div className="absolute right-0 mt-1 w-48 bg-popover border rounded-lg shadow-lg z-10">
                {[
                  { key: "latest", label: "Latest Order" },
                  { key: "oldest", label: "Oldest Order" },
                  { key: "status", label: "Order Status" },
                ].map(s => (
                  <button
                    key={s.key}
                    onClick={() => { setSortBy(s.key as any); setShowSortDropdown(false) }}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-accent flex justify-between"
                  >
                    {s.label} {sortBy === s.key && <span>✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Orders Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {sortedOrders.map(order => (
            <div
              key={order.id}
              className="cursor-pointer"
              onClick={() => setSelectedOrder(order)}
            >
              <OrderCard order={order} showActions tableName={tableNameMap?.get(order.tableCode) ?? order.tableCode} />
            </div>
          ))}
        </div>
      </main>

      {/* Modals */}
      <NotificationPanel isOpen={isNotificationOpen} onClose={() => setIsNotificationOpen(false)} />
      {selectedOrder && (
        <OrderDetailModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />
      )}
    </div>
  )
}
