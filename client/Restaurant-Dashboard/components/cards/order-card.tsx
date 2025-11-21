"use client"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card } from "@/components/ui/card"
import { OrderDto } from "@/types/order"
import { ArrowRight, Check, X } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useUpdateOrderStatusMutation } from "@/store/api/orderApi"
import type { OrderStatus } from "@/types/order"
import { toast } from "sonner"
import { formatOrderDateTime } from "@/lib/utils"
import { useRouter } from "next/navigation"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip"

interface OrderCardProps {
  order: OrderDto,
  showActions?: boolean,
  tableName?: string
}

export function OrderCard({ order, showActions, tableName }: OrderCardProps) {
  const [updateStatus, { isLoading: updating }] = useUpdateOrderStatusMutation()
  const router = useRouter();
  const initials = (order.buyerName || "G").substring(0, 2).toUpperCase()
  const { label: localTime } = formatOrderDateTime(order.orderDate, { timeStyle: "short" })
  const shortNote = order.buyerNote
    ? order.buyerNote.length > 0
      ? order.buyerNote.slice(0, 22) + "..."
      : order.buyerNote
    : null
  const handleChange = async (next: OrderStatus) => {
    if (next === order.orderStatus) return;
    try {
      await updateStatus({ orderId: order.id, status: next }).unwrap();
      toast.success(`Update the order ${order.id} status to ${order.orderStatus}`);
    }
    catch {
      toast.error("Fail to update order status");
    }
  }

  return (
    <Card className="px-0 pb-0 hover:shadow-md transition-shadow overflow-hidden gap-0 w-full">
      <div className="w-full space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between px-4">
          <div className="text-sm text-muted-foreground">
            Table: <span className="font-medium text-foreground">{tableName ?? order.tableCode}</span>
          </div>
          <div className="text-xs text-muted-foreground">
            {localTime}
          </div>
        </div>

        {/* Customer */}
        <div className="w-full flex items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 bg-primary text-primary-foreground">
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div>
              <div className="text-xs text-muted-foreground">Customer</div>
              <div className="font-medium">{order.buyerName || "Guest"}</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div onClick={(e) => e.stopPropagation()}>
              <Select value={order.orderStatus} onValueChange={(v) => handleChange(v as OrderStatus)} disabled={updating} >
                <SelectTrigger className="h-8 w-[140px]">
                  <SelectValue placeholder="Change status" />
                </SelectTrigger>
                <SelectContent> {["Pending", "Preparing", "Served", "Cancelled", "Paid"].map((s) =>
                  (<SelectItem key={s} value={s}> {s} </SelectItem>))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>



        {/* STATUS + Buyer note */}
        <div className="flex items-center justify-between mb-4 px-4">

          {order.buyerNote ? (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span
                    className="text-xs text-muted-foreground italic max-w-[150px] truncate cursor-help"
                  >
                    {shortNote}
                  </span>
                </TooltipTrigger>
                <TooltipContent side="top" align="start" className="max-w-xs break-words">
                  <p className="text-sm">{order.buyerNote}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            <span className="text-xs text-muted-foreground opacity-50 italic">
              — no note —
            </span>
          )}

          <button
            onClick={() => router.push(`/order`)}
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground cursor-pointer"
          >
            {order.items.length} Items
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>


        <div>

          <div className="h-2 bg-muted relative overflow-hidden rounded-md">
            <div
              className={`h-full w-full transition-all duration-500 rounded-md
      ${order.orderStatus === "Pending"
                  ? "bg-primary"
                  : order.orderStatus === "Preparing"
                    ? "bg-orange-500"
                    : order.orderStatus === "Served"
                      ? "bg-green-600"
                      : order.orderStatus === "Cancelled"
                        ? "bg-red-600"
                        : order.orderStatus === "Paid"
                          ? "bg-emerald-500"
                          : "bg-muted"
                }`}
            />
          </div>
        </div>
      </div>
    </Card>
  )
}
