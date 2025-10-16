import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card } from "@/components/ui/card"
import { ArrowRight, Check } from "lucide-react"
import type { Order } from "@/lib/mock-data"

interface OrderCardProps {
  order: Order,
  showActions?: boolean
}

export function OrderCard({ order, showActions }: OrderCardProps) {
  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "in-progress":
        return "text-orange-600"
      case "ready":
        return "text-green-600"
      case "waiting-payment":
        return "text-blue-600"
      default:
        return "text-muted-foreground"
    }
  }

  const getProgressColor = (status: Order["status"]) => {
    switch (status) {
      case "in-progress":
        return "bg-orange-500"
      case "ready":
        return "bg-green-500"
      case "waiting-payment":
        return "bg-blue-500"
      default:
        return "bg-muted-foreground"
    }
  }

  const getStatusText = (status: Order["status"]) => {
    switch (status) {
      case "in-progress":
        return "In Progress"
      case "ready":
        return "Ready to Serve"
      case "waiting-payment":
        return "Waiting for Payment"
      default:
        return status
    }
  }

  return (
    <Card className="p-4 hover:shadow-md transition-shadow overflow-hidden gap-0">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Order# <span className="font-medium text-foreground">{order.orderNumber}</span> / {order.type}
          </div>
          <div className="text-sm text-muted-foreground">{order.createdAt}</div>
        </div>

        {/* Customer */}
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 bg-primary text-primary-foreground">
            <AvatarFallback>{order.customerName.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <div className="text-xs text-muted-foreground">Customer Name</div>
            <div className="font-medium">{order.customerName}</div>
          </div>
        </div>

        {/* Status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {order.status === "waiting-payment" ? (
              <Check className="h-5 w-5 text-blue-600" />
            ) : order.status === "ready" ? (
              <Check className="h-5 w-5 text-green-600" />
            ) : (
              <div className="h-5 w-5 rounded-full border-2 border-orange-500 flex items-center justify-center">
                <div className="h-2 w-2 rounded-full bg-orange-500" />
              </div>
            )}
            <span className={`text-sm font-medium ${getStatusColor(order.status)}`}>{getStatusText(order.status)}</span>
          </div>
          <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground cursor-pointer">
            {order.items.length} Items
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="mt-4 -mx-4 -mb-4">
        <div className="flex items-center justify-between px-4 pb-2">
          <span className="text-xs font-medium text-muted-foreground">Progress</span>
          <span className="text-xs font-semibold">{order.progress}%</span>
        </div>
        <div className="h-2 bg-muted relative">
          <div
            className={`h-full transition-all duration-300 ${getProgressColor(order.status)}`}
            style={{ width: `${order.progress}%` }}
          />
        </div>
      </div>
    </Card>
  )
}
