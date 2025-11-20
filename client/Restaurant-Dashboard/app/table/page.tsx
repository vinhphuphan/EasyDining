"use client"

import { Calendar, QrCode, Pencil, Trash, RefreshCcw, Plus, CreditCard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  useDeleteTableMutation,
  useGetTablesQuery,
} from "@/store/api/tableApi"
import { useRouter } from "next/navigation"
import { TableDto } from "@/types/table"
import LoadingScreen from "@/components/loading-screen"
import { DataError } from "@/components/data-error"
import { Spinner } from "@/components/ui/spinner"
import { useState } from "react"
import AddTableModal from "@/components/modals/add-table-modal"
import EditTableModal from "@/components/modals/edit-table-modal"
import { toast } from "sonner"
import DeleteConfirmModal from "@/components/modals/delete-confirm-modal"
import { TableDetailModal } from "@/components/modals/table-detail-modal"
import { PaymentModal } from "@/components/modals/payment-modal"

const getApiErrorMessage = (error: unknown) => {
  if (typeof error === "object" && error !== null) {
    const maybeError = error as { data?: { message?: string } }
    if (maybeError.data?.message) return maybeError.data.message
  }
  return "Something went wrong. Please try again."
}

export default function TablePage() {
  const router = useRouter()
  const { data: tables, isLoading, isError, refetch } = useGetTablesQuery()
  const [deleteTable, { isLoading: isDeleting }] = useDeleteTableMutation()
  const isMutating = isDeleting

  // --- modal states ---
  // edit-table-modal
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedTableForEdit, setSelectedTableForEdit] = useState<TableDto | null>(null)

  // delete-table-modal
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [selectedTableForDelete, setSelectedTableForDelete] = useState<TableDto | null>(null)

  // table-detail-modal
  const [selectedTableForDetail, setSelectedTableForDetail] = useState<TableDto | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)

  // payment-modal
  const [selectedTable, setSelectedTable] = useState<TableDto | null>(null)
  const [showTableDetail, setShowTableDetail] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)

  // --- helper ---
  const statusClass = (status: TableDto["status"]) => {
    if (status === "Available") return "border-muted-foreground/20 bg-neutral-100 hover:border-muted-foreground/40"
    if (status === "Occupied") return "border-orange-500 bg-orange-500 text-white"
    return "border-primary bg-primary text-background"
  }

  const toQr = (tableCode: string) => router.push(`/qr/${tableCode}`)

  // --- handlers ---
  const handleAddNew = () => {
    setSelectedTableForEdit(null)
    setIsModalOpen(true)
  }

  const handleEdit = (table: TableDto) => {
    setSelectedTableForEdit(table)
    setIsModalOpen(true)
  }

  const handleDelete = (table: TableDto) => {
    setSelectedTableForDelete(table)
    setIsDeleteOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!selectedTableForDelete) return
    try {
      await deleteTable(selectedTableForDelete.id).unwrap()
      toast.success(`Deleted "${selectedTableForDelete.name}"`)
      setSelectedTableForDelete(null)
    } catch (error) {
      toast.error(getApiErrorMessage(error))
      throw error
    }
  }

  const handleOpenTableDetail = (table: TableDto) => {
    setSelectedTable(table)
    setShowTableDetail(true)
  }

  const handleProceedToCheckout = () => {
    setShowTableDetail(false)
    setShowPaymentModal(true)
  }

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

  {
    !isLoading && tables?.length === 0 && (
      <div className="text-center text-muted-foreground py-20">
        No tables found. Click "Add Table" to create one.
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="px-6 py-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-6 w-6" />
              <h1 className="text-xl font-semibold">Table</h1>
            </div>

            <div className="flex items-center gap-4 ml-8">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full border-2 border-muted-foreground/30 bg-bg-neutral-100" />
                <span className="text-sm text-muted-foreground">Available</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-orange-500" />
                <span className="text-sm text-muted-foreground">Occupied</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button size="lg" variant="outline" onClick={handleAddNew} disabled={isMutating}>
              <Plus className="h-5 w-5 mr-2" />
              Add Table
            </Button>
            <Button size="lg" onClick={() => refetch()} disabled={isLoading || isMutating}>
              <RefreshCcw className="h-5 w-5 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {isError && <DataError onRetry={refetch} />}

        {!isLoading && tables?.length === 0 && (
          <div className="text-center text-muted-foreground py-20">
            No tables found. Click "Add Table" to create one.
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {(tables ?? []).map((t) => (
            <div
              key={t.id}
              className={`group relative aspect-square rounded-2xl border-2 flex flex-col items-center justify-center transition-all ${statusClass(t.status)}`}
            >
              {/* Controls */}
              <div className="absolute top-3 right-3 flex gap-2 opacity-100">
                <button
                  onClick={(e) => { e.stopPropagation(); toQr(t.tableCode) }}
                  className={`p-1 rounded transition-colors
                    ${t.status === "Available"
                      ? "bg-gray-200 hover:bg-gray-300 text-gray-700 transition"
                      : "bg-white/20 hover:bg-white/30 text-white transition"}
                  `}
                  title="QR code"
                >
                  <QrCode className="h-4 w-4" />
                </button>
                <button

                  onClick={(e) => { e.stopPropagation(); handleEdit(t) }}
                  className={`p-1 rounded transition-colors
                  ${t.status === "Available"
                      ? "bg-gray-200 hover:bg-gray-300 text-gray-700 transition"
                      : "bg-white/20 hover:bg-white/30 text-white transition"}`}
                  title="Edit"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  className={`p-1 rounded transition-colors
                  ${t.status === "Available"
                      ? "bg-gray-200 hover:bg-red-600 text-gray-700 hover:text-white transition"
                      : "bg-white/20 hover:bg-red-600 text-white transition"}`}
                  title="Delete (coming soon)"
                >
                  <Trash
                    onClick={(e) => { e.stopPropagation(); handleDelete(t) }}
                    className="h-4 w-4" />
                </button>
              </div>

              <div className="text-2xl font-semibold">{t.name}</div>
              <div className="mt-1 text-sm opacity-80">{t.seats} seats</div>
              <Badge className={`mt-2 cursor-pointer hover:opacity-80 ${t.status == "Available" ? "" : "bg-white/20 text-current hover:bg-white/30"} `}>{t.status}</Badge>

              {/* Checkout button */}
              {t.status === "Occupied" && (
                <Button
                  size="sm"
                  onClick={() => handleOpenTableDetail(t)}
                  className="absolute bottom-10 text-white shadow-md flex items-center gap-1"
                >
                  <CreditCard className="h-4 w-4" />
                  Checkout
                </Button>
              )}

              {/* Table Decorations */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-3 bg-current rounded-full" />
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-16 h-3 bg-current rounded-full" />
              <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-16 bg-current rounded-full" />
              <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-3 h-16 bg-current rounded-full" />
            </div>
          ))}
        </div>
      </main>

      {/* Add Table */}
      <AddTableModal
        isOpen={isModalOpen && !selectedTableForEdit}
        onClose={() => setIsModalOpen(false)}
      />

      {/* Edit Table */}
      <EditTableModal
        isOpen={isModalOpen && !!selectedTableForEdit}
        onClose={() => { setIsModalOpen(false); setSelectedTableForEdit(null) }}
        table={selectedTableForEdit}
      />

      {/* Delete Table */}
      <DeleteConfirmModal
        isOpen={isDeleteOpen}
        onClose={() => { setIsDeleteOpen(false); setSelectedTableForDelete(null) }}
        onConfirm={handleConfirmDelete}
        title="Delete Table"
        description={`Are you sure you want to delete "${selectedTableForDelete?.name}"? This action cannot be undone.`}
      />

      <TableDetailModal
        isOpen={showTableDetail}
        onClose={() => setShowTableDetail(false)}
        table={selectedTable}
        onProceedToCheckout={handleProceedToCheckout}
      />

      {showPaymentModal && selectedTable && (
        <PaymentModal
          table={selectedTable}
          onClose={() => setShowPaymentModal(false)}
          onPaymentComplete={() => setShowPaymentModal(false)}
        />
      )}
    </div>
  )
}
