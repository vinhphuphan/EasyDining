"use client"

import { useEffect, useMemo, useState } from "react"
import { CreditCard, Clock, CheckCircle, ChefHat } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { StatsCard } from "@/components/cards/stats-card"
import { OrderCard } from "@/components/cards/order-card"
import { EmptyState } from "@/components/empty-state"
import { NotificationPanel } from "@/components/notification-panel"
import { useCreateOrderModal } from "@/context/CreateOrderModalProvider"
import { useRouter } from "next/navigation"
import { useGetOrdersQuery } from "@/store/api/orderApi"
import { useGetTablesQuery } from "@/store/api/tableApi"
import type { OrderDto } from "@/types/order"
import { useGetMenuItemsQuery } from "@/store/api/menuApi"
import { Spinner } from "@/components/ui/spinner"

export default function DashboardPage() {
  const router = useRouter()
  const [isNotificationOpen, setIsNotificationOpen] = useState(false)
  const { openModal } = useCreateOrderModal()
  const { data: orderRes, isLoading: loadingOrders, isError: errorOrders } = useGetOrdersQuery({ page: 1, pageSize: 20 })
  const { data: tableRes } = useGetTablesQuery()
  const { data: menuRes } = useGetMenuItemsQuery()

  const orders: OrderDto[] = orderRes?.data?.items ?? []
  const sorted = [...orders].sort((a, b) =>
    new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime());
  const [selectedOrder, setSelectedOrder] = useState<OrderDto | null>(null)
  const tables = tableRes ?? []
  const menuItems = menuRes ?? []

  const tableNameMap = useMemo(() => {
    const m = new Map<string, string>()
    for (const t of tables as any[]) {
      // hỗ trợ cả trường hợp type cũ hashCode
      const code = t.tableCode
      if (code) m.set(code, t.name)
    }
    return m
  }, [tables])

  useEffect(() => {
    if (!localStorage.getItem("user")) router.replace("/login")
  }, [router])

  // Filter status
  const pendingOrders = sorted.filter(o => o.orderStatus === "Pending")
  const preparingOrders = sorted.filter(o => o.orderStatus === "Preparing")
  const inProgressOrders = [...pendingOrders, ...preparingOrders]
  const servedOrders = sorted.filter(o => o.orderStatus === "Served")
  const cancelledOrders = sorted.filter(o => o.orderStatus === "Cancelled")
  const completedOrders = [...servedOrders, ...cancelledOrders]

  const totalEarning = orders.reduce((sum, o) => {
    if (o.orderStatus == "Cancelled") return sum
    return sum + (o.subtotal || 0)
  }, 0)

  const availableTables = tables.filter((t: any) => t.status === "Available")
  const outOfStockItems = menuItems.filter((m: any) => !m.isAvailable)

  if (loadingOrders) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="flex flex-col items-center h-64">
        <Button disabled size="lg">
          <Spinner />
          Loading...
        </Button>
      </div>
    </div>
  )
  if (errorOrders) return (
    <div className="min-h-[80vh] flex items-center justify-center bg-background">
      <div className="max-w-md w-full px-4 py-8 text-center">
        <h2 className="text-2xl font-bold text-foreground mb-6">
          Something went wrong
        </h2>
        <Button
          onClick={() => {
            window.location.reload()
          }}
        >
          Try again
        </Button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        {/* Main Content */}
        <main className="flex-1 p-6">

          {/* Greeting */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-lg font-semibold mb-1">Welcome 👋</h1>
              <p className="text-muted-foreground hidden md:block">Give your best services for customers, happy working 😊</p>
            </div>
            <div>
              <div className="text-xl font-semibold">{new Date().toLocaleTimeString()}</div>
              <div className="text-sm text-muted-foreground">{new Date().toDateString()}</div>
            </div>
          </div>

          {/* Create Order */}
          <div className="flex items-center justify-end mb-4">
            <Button size="lg" className="h-12 cursor-pointer" onClick={openModal}>
              <span className="text-lg mr-2">+</span>
              Create New Order
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <StatsCard title="Total Earning" value={`$${totalEarning.toLocaleString()}`} icon={CreditCard} />
            <StatsCard title="Pending" value={inProgressOrders.length} icon={Clock} iconColor="text-primary" />
            <StatsCard title="Preparing" value={preparingOrders.length} icon={ChefHat} iconColor="text-orange-600" />
            <StatsCard title="Completed" value={completedOrders.length} icon={CheckCircle} iconColor="text-green-600" />
          </div>

          {/* Orders Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

            {/* Pending */}
            <Card className="p-6 pb-0 gap-4">
              <h2 className="text-lg font-semibold">Pending & Preparing</h2>
              <div className="space-y-4">
                {inProgressOrders.length > 0 ? (
                  inProgressOrders.slice(0, 3).map(order => <OrderCard key={order.id} order={order} tableName={tableNameMap.get(order.tableCode) ?? order.tableCode} />)
                ) : (
                  <EmptyState title="No orders" description="Orders will appear here." />
                )}
              </div>

              <Button onClick={() => router.push("/order")} variant={"outline"} className="border-none hover:bg-transparent py-5 mb-2">See All Orders</Button>
            </Card>

            {/* Completed */}
            <Card className="p-6 pb-0 gap-4">
              <h2 className="text-lg font-semibold">Served & Cancelled</h2>
              <div className="space-y-4">
                {completedOrders.length > 0 ? (
                  completedOrders.slice(0, 3).map(order => <OrderCard key={order.id} order={order} tableName={tableNameMap.get(order.tableCode) ?? order.tableCode} />)
                ) : (
                  <EmptyState title="No completed orders" description="Completed orders will show here." />
                )}
              </div>
              <Button onClick={() => router.push("/order")} variant={"outline"} className="border-none hover:bg-transparent py-5 mb-2">See All Orders</Button>
            </Card>

          </div>
        </main>

        {/* Sidebar */}
        <aside className="hidden xl:block w-80 bg-card pt-4 pr-2 space-y-6">
          {/* Available Tables */}
          <Card className="p-4">
            <h3 className="font-semibold mb-4 flex justify-between">
              Table Available
            </h3>
            <div className="max-h-64 overflow-y-auto space-y-2">
              {availableTables.map((t: any) => (
                <div key={t.id} className="flex items-center justify-between py-2 text-sm">
                  <span className="font-medium">{t.name}</span>
                  <span className="text-muted-foreground">{t.seats} seats</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Out of stock */}
          <Card className="p-4">
            <h3 className="font-semibold mb-4">Out of Stock</h3>
            {outOfStockItems.length > 0 ? outOfStockItems.map((item: any) => (
              <div key={item.id} className="flex items-center gap-3 mb-2">
                <div className="font-medium text-sm">{item.name}</div>
                <span className="text-xs text-muted-foreground">(Restock soon)</span>
              </div>
            )) : (
              <p className="text-sm text-muted-foreground text-center py-4">All items available ✅</p>
            )}
          </Card>
        </aside>
      </div>

      {/* Notification */}
      <NotificationPanel isOpen={isNotificationOpen} onClose={() => setIsNotificationOpen(false)} />
    </div>
  )
}
