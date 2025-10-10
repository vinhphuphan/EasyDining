"use client"

import { useEffect, useState } from "react"
import { X, RefreshCw, Plus, CreditCard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Table, Order } from "@/lib/mock-data"
import { tables, orders, menuItems } from "@/lib/mock-data"

interface TableDetailModalProps {
    isOpen: boolean
    onClose: () => void
    table: Table | null
    onTableChange?: (oldTableId: string, newTableId: string) => void
    onNewOrder?: () => void
    onProceedPayment?: () => void
}

export function TableDetailModal({
    isOpen,
    onClose,
    table,
    onTableChange,
    onNewOrder,
    onProceedPayment
}: TableDetailModalProps) {
    const [show, setShow] = useState(false)
    const [selectedNewTable, setSelectedNewTable] = useState<string>("")
    const [showChangeTable, setShowChangeTable] = useState(false)

    useEffect(() => {
        if (isOpen) {
            const id = requestAnimationFrame(() => setShow(true))
            return () => cancelAnimationFrame(id)
        }
        setShow(false)
    }, [isOpen])

    if (!isOpen || !table) return null

    // Find the current order for this table
    const currentOrder = table.currentOrderId
        ? orders.find(order => order.id === table.currentOrderId)
        : null

    // Get available tables for change table functionality
    const availableTables = tables.filter(t =>
        t.status === "available" && t.id !== table.id
    )

    const handleChangeTable = () => {
        if (selectedNewTable && onTableChange) {
            onTableChange(table.id, selectedNewTable)
            setShowChangeTable(false)
            setSelectedNewTable("")
        }
    }

    const handleNewOrder = () => {
        onNewOrder?.()
        onClose()
    }

    const handleProceedPayment = () => {
        onProceedPayment?.()
        onClose()
    }

    const getItemImage = (itemName: string) => {
        const menuItem = menuItems.find(item => item.name === itemName)
        return menuItem?.image || "/placeholder.svg"
    }

    const getItemUnitPrice = (itemName: string, fallback: number) => {
        const menuItem = menuItems.find(item => item.name === itemName)
        return menuItem?.price ?? fallback
    }

    const formatPrice = (price: number) => {
        return `$${price.toFixed(2)}`
    }

    return (
        <>
            {/* Change Table Modal */}
            <Dialog open={showChangeTable} onOpenChange={setShowChangeTable}>
                <DialogContent className="max-w-sm">
                    <DialogHeader>
                        <DialogTitle>Change Table</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-medium">Select New Table</label>
                            <Select value={selectedNewTable} onValueChange={setSelectedNewTable}>
                                <SelectTrigger className="mt-2">
                                    <SelectValue placeholder="Choose a table" />
                                </SelectTrigger>
                                <SelectContent>
                                    {availableTables.map((table) => (
                                        <SelectItem key={table.id} value={table.id}>
                                            {table.number} - {table.capacity} Person ({table.floor})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex gap-2 justify-end">
                            <Button variant="outline" onClick={() => setShowChangeTable(false)}>
                                Cancel
                            </Button>
                            <Button
                                onClick={handleChangeTable}
                                disabled={!selectedNewTable}
                            >
                                Change Table
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Main Table Detail Modal */}
            <div
                className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-200 ${show ? "bg-black/50 opacity-100" : "bg-black/50 opacity-0"
                    }`}
            >
                <div
                    className={`bg-background rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden transform transition-all duration-250 ease-out ${show ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
                        }`}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-6">
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
                        {currentOrder ? (
                            <>
                                {/* Order Header */}
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="text-lg font-medium">
                                            Order# {currentOrder.orderNumber} / {currentOrder.type}
                                        </div>
                                        <div className="text-sm text-muted-foreground">
                                            {currentOrder.createdAt}
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                                                {table.number}
                                            </Badge>
                                            <span className="text-sm">Customer Name {currentOrder.customerName}</span>
                                        </div>
                                        <Button
                                            size="sm"
                                            onClick={() => setShowChangeTable(true)}
                                            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
                                        >
                                            <RefreshCw className="h-4 w-4" />
                                            Change Table
                                        </Button>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-orange-500 rounded-full transition-all duration-300"
                                                    style={{ width: `${currentOrder.progress}%` }}
                                                />
                                            </div>
                                            <span className="text-sm font-medium">{currentOrder.progress}% In Progress •</span>
                                            <span className="text-sm">{currentOrder.items.length} Items →</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Order Items */}
                                <div className="space-y-3">
                                    <h3 className="text-base font-semibold">Order Items</h3>
                                    <div className="space-y-3">
                                        {currentOrder.items.map((item) => {
                                            const unitPrice = getItemUnitPrice(item.name, item.price)
                                            return (
                                                <Card key={item.id} className="p-4 bg-yellow-50 border-yellow-200 rounded-md">
                                                    <div className="flex gap-4">
                                                        <img
                                                            src={getItemImage(item.name)}
                                                            alt={item.name}
                                                            className="w-16 h-16 rounded-md object-cover"
                                                        />
                                                        <div className="flex-1 space-y-2">
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-sm font-medium text-orange-600">In Progress •</span>
                                                            </div>
                                                            <h4 className="font-medium">{item.name}</h4>
                                                            {item.addOns && item.addOns.length > 0 && (
                                                                <div className="text-sm text-muted-foreground">
                                                                    Addition: {item.addOns.map(addon => addon.name).join(", ")}
                                                                </div>
                                                            )}
                                                            {item.note && (
                                                                <div className="text-sm text-muted-foreground">
                                                                    Note: {item.note}
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="text-right">
                                                            <div className="font-medium">{formatPrice(unitPrice)}</div>
                                                            <div className="text-sm text-muted-foreground">x{item.quantity}</div>
                                                        </div>
                                                    </div>
                                                </Card>
                                            )
                                        })}
                                    </div>
                                </div>

                                {/* Total Payment */}
                                <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                                    <span className="text-lg font-medium">Total Payment</span>
                                    <span className="text-lg font-bold">US${currentOrder.totalAmount.toFixed(2)}</span>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-4">
                                    <Button
                                        variant="outline"
                                        className="flex-1 flex items-center gap-2"
                                        onClick={handleNewOrder}
                                    >
                                        <Plus className="h-4 w-4" />
                                        New Order
                                    </Button>
                                    <Button
                                        className="flex-1 flex items-center gap-2"
                                        onClick={handleProceedPayment}
                                    >
                                        <CreditCard className="h-4 w-4" />
                                        Proceed to Payment
                                    </Button>
                                </div>
                            </>
                        ) : (
                            <div className="text-center py-12">
                                <div className="text-lg font-medium mb-2">No Order Found</div>
                                <div className="text-sm text-muted-foreground mb-6">
                                    This table doesn't have an active order.
                                </div>
                                <Button
                                    className="flex items-center gap-2"
                                    onClick={handleNewOrder}
                                >
                                    <Plus className="h-4 w-4" />
                                    Create New Order
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}
