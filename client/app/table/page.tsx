"use client"

import { useState } from "react"
import { Calendar, Pencil, Plus, Trash } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { NotificationPanel } from "@/components/notification-panel"
import { CreateOrderModal } from "@/components/modals/create-order-modal"
import { OrderDetailModal } from "@/components/modals/order-detail-modal"
import { TableDetailModal } from "@/components/modals/table-detail-modal"
import AddEditTableModal from "@/components/modals/add-edit-table-modal"
import DeleteConfirmModal from "@/components/modals/delete-confirm-modal"
import { tables as mockTables, orders } from "@/lib/mock-data"
import type { Order, Table } from "@/lib/mock-data"

export default function TablePage() {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false)
  const [isCreateOrderOpen, setIsCreateOrderOpen] = useState(false)
  const [selectedFloor, setSelectedFloor] = useState("1st Floor")
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [selectedTable, setSelectedTable] = useState<Table | null>(null)
  const [isTableDetailOpen, setIsTableDetailOpen] = useState(false)
  const [localTables, setLocalTables] = useState<Table[]>(mockTables)
  const [isAddEditOpen, setIsAddEditOpen] = useState(false)
  const [editTable, setEditTable] = useState<Table | null>(null)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [deleteTableId, setDeleteTableId] = useState<string | null>(null)


  const floors = ["1st Floor", "2nd Floor", "3rd Floor"]

  const handleTableClick = (table: Table) => {
    setSelectedTable(table)
    setIsTableDetailOpen(true)
  }

  const openAddTable = () => {
    setEditTable(null)
    setIsAddEditOpen(true)
  }

  const openEditTable = (table: Table) => {
    setEditTable(table)
    setIsAddEditOpen(true)
  }

  const handleSaveTable = (table: Table) => {
    setLocalTables(prev => {
      const exists = prev.find(t => t.id === table.id)
      if (exists) {
        return prev.map(t => t.id === table.id ? { ...t, ...table } : t)
      }
      return [table, ...prev]
    })
  }

  const handleDeleteRequest = (id: string) => {
    setDeleteTableId(id)
    setIsDeleteOpen(true)
  }

  const handleConfirmDelete = () => {
    if (!deleteTableId) return
    setLocalTables(prev => prev.filter(t => t.id !== deleteTableId))
    if (selectedTable?.id === deleteTableId) {
      setSelectedTable(null)
      setIsTableDetailOpen(false)
    }
    setDeleteTableId(null)
  }

  const handleTableChange = (oldTableId: string, newTableId: string) => {
    setLocalTables(prev => {
      const copy = prev.map(t => ({ ...t }))
      const oldTable = copy.find(t => t.id === oldTableId)
      const newTable = copy.find(t => t.id === newTableId)

      if (oldTable && newTable && oldTable.currentOrderId) {
        newTable.status = "occupied"
        newTable.currentOrderId = oldTable.currentOrderId

        oldTable.status = "available"
        oldTable.currentOrderId = undefined

        // Update selected table to the new table
        setSelectedTable(newTable)

        // Update the order's table number
        const order = orders.find(o => o.id === oldTable.currentOrderId)
        if (order) {
          order.tableNumber = newTable.number
        }
      }

      return copy
    })
  }

  const handleNewOrderFromTable = () => {
    setIsTableDetailOpen(false)
    setIsCreateOrderOpen(true)
  }

  const handleProceedPayment = () => {
    // Handle payment logic here
    console.log("Proceed to payment for table:", selectedTable?.number)
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="p-6">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-6 w-6" />
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

          <div className="flex items-center gap-3">
            <Button size="lg" onClick={openAddTable}>
              <Plus className="h-5 w-5 mr-2" />
              Add Table
            </Button>
            <Button size="lg" onClick={() => setIsCreateOrderOpen(true)}>
              <Plus className="h-5 w-5 mr-2" />
              Create New Order
            </Button>
          </div>
        </div>

        {/* Table Grid */}
        <div className="grid grid-cols-5 gap-6">
          {localTables.filter((table) => {
            const floorMap: Record<string, string> = {
              "1st Floor": "First Floor",
              "2nd Floor": "Second Floor",
              "3rd Floor": "Third Floor",
            }
            return table.floor === floorMap[selectedFloor]
          }).map((table) => {
            const isAvailable = table.status === "available"
            const isOccupied = table.status === "occupied"
            const isReserved = table.status === "reserved"

            return (
              <div
                key={table.id}
                onClick={() => handleTableClick(table)}
                className={`group relative aspect-square rounded-2xl border-2 flex flex-col items-center justify-center transition-all ${isAvailable
                  ? "border-muted-foreground/20 bg-background hover:border-muted-foreground/40 cursor-pointer"
                  : isOccupied
                    ? "border-orange-500 bg-orange-500 text-white cursor-pointer hover:shadow-lg"
                    : "border-foreground bg-foreground text-background cursor-pointer hover:shadow-lg"
                  }`}
              >
                {/* Edit / Delete controls */}
                <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100">
                  <button onClick={(e) => { e.stopPropagation(); openEditTable(table) }} className="p-1 rounded bg-white/20 hover:bg-white/30 cursor-pointer">
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); handleDeleteRequest(table.id) }} className="p-1 rounded bg-red-600 hover:bg-red-700 text-white cursor-pointer">
                    <Trash className="h-4 w-4" />
                  </button>
                </div>
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
                    <Badge className="bg-white/20 text-white hover:bg-white/30 mb-1">In Progress</Badge>
                    <div className="text-xs font-medium mb-1">{table.orderId}</div>
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
      <TableDetailModal
        isOpen={isTableDetailOpen}
        onClose={() => setIsTableDetailOpen(false)}
        table={selectedTable}
        onTableChange={handleTableChange}
        onNewOrder={handleNewOrderFromTable}
        onProceedPayment={handleProceedPayment}
      />
      <AddEditTableModal
        isOpen={isAddEditOpen}
        onClose={() => setIsAddEditOpen(false)}
        onSave={handleSaveTable}
        initial={editTable}
      />
      <DeleteConfirmModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Table"
        description="Are you sure you want to delete this table? This action cannot be undone."
      />
    </div>
  )
}
