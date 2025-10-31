"use client"

import { Calendar, QrCode, Pencil, Trash, Plus, Printer } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useGetTablesQuery, type TableDto } from "@/store/api/tablesApi"
import { useRouter } from "next/navigation"

export default function TablePage() {
  const router = useRouter()
  const { data: tables, isLoading, isError, refetch } = useGetTablesQuery()

  const statusClass = (status: TableDto["status"]) => {
    if (status === "Available") return "border-muted-foreground/20 bg-neutral-100 hover:border-muted-foreground/40"
    if (status === "Occupied") return "border-orange-500 bg-orange-500 text-white"
    return "border-primary bg-primary text-background" // Reserved
  }

  const toQr = (hashCode: string) => router.push(`/qr/${hashCode}`)

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
                <div className="h-3 w-3 rounded-full border-2 border-muted-foreground/30 bg-background" />
                <span className="text-sm text-muted-foreground">Available</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-orange-500" />
                <span className="text-sm text-muted-foreground">Occupied</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-primary" />
                <span className="text-sm text-muted-foreground">Reserved</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button size="lg" onClick={() => refetch()} disabled={isLoading}>
              <Plus className="h-5 w-5 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {isLoading && <div>Loading tables...</div>}
        {isError && <div>Failed to load tables.</div>}

        <div className="grid grid-cols-5 gap-6">
          {(tables ?? []).map((t) => (
            <div
              key={t.id}
              className={`group relative aspect-square rounded-2xl border-2 flex flex-col items-center justify-center transition-all ${statusClass(t.status)}`}
            >
              {/* Controls */}
              <div className="absolute top-3 right-3 flex gap-2 opacity-100">
                <button
                  onClick={(e) => { e.stopPropagation(); toQr(t.hashCode) }}
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
                  className={`p-1 rounded transition-colors
                  ${t.status === "Available"
                      ? "bg-gray-200 hover:bg-gray-300 text-gray-700 transition"
                      : "bg-white/20 hover:bg-white/30 text-white transition"}`}
                  title="Edit (coming soon)"
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
                  <Trash className="h-4 w-4" />
                </button>
              </div>

              <div className="text-2xl font-semibold">{t.name}</div>
              <div className="mt-1 text-sm opacity-80">{t.seats} seats</div>
              {t.status !== "Available" && (
                <Badge className="mt-2 bg-white/20 text-current hover:bg-white/30">{t.status}</Badge>
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
    </div>
  )
}
