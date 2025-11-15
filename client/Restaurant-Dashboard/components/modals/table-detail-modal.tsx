"use client"

import { useEffect, useState } from "react"
import { X, CreditCard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Spinner } from "@/components/ui/spinner"

import { TableDto } from "@/types/table"
import { useGetTableByIdQuery } from "@/store/api/tableApi"

interface TableDetailModalProps {
    isOpen: boolean
    onClose: () => void
    table: TableDto | null
    onProceedToCheckout: () => void
}

export function TableDetailModal({ isOpen, onClose, table, onProceedToCheckout }: TableDetailModalProps) {
    const [show, setShow] = useState(false)
    const { data, isLoading, isError } = useGetTableByIdQuery(table?.id!, { skip: !isOpen || !table, })

    useEffect(() => {
        if (isOpen) {
            const id = requestAnimationFrame(() => setShow(true))
            return () => cancelAnimationFrame(id)
        }
        setShow(false)
    }, [isOpen])

    if (!isOpen || !table) return null

    const formatPrice = (price: number) => `$${price.toFixed(2)}`
    const formatDate = (dateString: string) =>
        new Date(dateString).toLocaleString()

    const activeOrders = data?.orders?.filter(
        (o) => o.orderStatus !== "Paid" && o.orderStatus !== "Cancelled"
    ) ?? []

    return (
        <div
            className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-200 ${show ? "bg-black/50 opacity-100" : "bg-black/50 opacity-0"
                }`}
        >
            <div
                className={`bg-background rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden transform transition-all duration-250 ease-out ${show ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
                    }`}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b">
                    <h2 className="text-xl font-semibold">Table Detail</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-accent rounded-lg transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4 max-h-[calc(90vh-120px)] overflow-y-auto">

                    {isLoading &&
                        (<div className="flex justify-center py-10">
                            <Spinner /> <span className="ml-2">Loading...</span>
                        </div>)
                    }

                    {isError &&
                        (
                            <div className="text-center text-red-500 py-10">
                                Failed to load table details.
                            </div>)
                    }

                    {data && (
                        <>
                            {/* Table Info */}
                            <div className="space-y-2 mb-2">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-medium">
                                        {data.name}
                                    </h3>
                                    <Badge
                                        className={data.status === "Available" ? "" : "bg-orange-600"}
                                        variant={
                                            data.status === "Available" ? "secondary" : "destructive"
                                        }
                                    >
                                        {data.status}
                                    </Badge>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    Seats: {data.seats}
                                </p>
                            </div>

                            {/* Orders */}
                            {activeOrders && activeOrders.length > 0 ? (
                                <div className="space-y-4">
                                    <h3 className="font-semibold text-base">Active Orders</h3>

                                    {activeOrders.map((order) => (
                                        <Card
                                            key={order.id}
                                            className="p-4 bg-gray-50 border border-gray-200 rounded-md"
                                        >
                                            <div className="flex justify-between items-center mb-2">
                                                <div>
                                                    <h4 className="font-semibold">
                                                        Order #{order.id} •{" "}
                                                        <span
                                                            className={`${order.orderStatus === "Preparing"
                                                                ? "text-orange-500"
                                                                : order.orderStatus === "Served"
                                                                    ? "text-green-600"
                                                                    : order.orderStatus === "Paid"
                                                                        ? "text-blue-600"
                                                                        : "text-gray-600"
                                                                }`}
                                                        >
                                                            {order.orderStatus}
                                                        </span>
                                                    </h4>
                                                    <p className="text-sm text-muted-foreground">
                                                        {order.items.length} item(s) •{" "}
                                                        {formatDate(order.orderDate)}
                                                    </p>
                                                </div>
                                                <div className="text-right font-bold text-lg">
                                                    {formatPrice(order.orderTotal)}
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                {order.items.map((item) => (
                                                    <div
                                                        key={item.id}
                                                        className="flex justify-between text-sm border-b pb-1 last:border-none"
                                                    >
                                                        <div className="text-muted-foreground">
                                                            {item.name}{" "}
                                                            <span className="text-xs opacity-70">
                                                                ×{item.quantity}
                                                            </span>
                                                        </div>
                                                        <div className="font-medium">
                                                            {formatPrice(item.price * item.quantity)}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </Card>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <div className="text-lg font-medium mb-2">No Active Orders</div>
                                    <div className="text-sm text-muted-foreground">
                                        This table has no unpaid orders.
                                    </div>
                                </div>
                            )}

                            {/* Total + Checkout */}
                            {activeOrders && activeOrders.length > 0 && (
                                <div className="mt-6 space-y-4">
                                    <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                                        <span className="text-lg font-medium">Total Amount</span>
                                        <span className="text-lg font-bold">
                                            {formatPrice(
                                                activeOrders.reduce(
                                                    (sum, o) => sum + o.orderTotal,
                                                    0
                                                )
                                            )}
                                        </span>
                                    </div>

                                    <Button
                                        size="lg"
                                        className="w-full flex items-center gap-2 "
                                        onClick={onProceedToCheckout}
                                        disabled={!activeOrders || activeOrders.length === 0}
                                    >
                                        <CreditCard className="h-5 w-5" />
                                        Proceed to Checkout
                                    </Button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}
