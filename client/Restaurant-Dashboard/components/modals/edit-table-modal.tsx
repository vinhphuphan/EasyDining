"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { useUpdateTableMutation } from "@/store/api/tableApi"
import type { TableDto } from "@/types/table"

interface Props {
  isOpen: boolean
  onClose: () => void
  table: TableDto | null
}

export default function EditTableModal({ isOpen, onClose, table }: Props) {
  const [updateTable, { isLoading }] = useUpdateTableMutation()
  const [show, setShow] = useState(false)
  const [name, setName] = useState("")
  const [seats, setSeats] = useState(2)
  const [status, setStatus] = useState<"Available" | "Occupied">("Available")

  useEffect(() => setShow(isOpen), [isOpen])

  useEffect(() => {
    if (table) {
      setName(table.name)
      setSeats(table.seats)
      setStatus(table.status)
    }
  }, [table])

  const handleSave = async () => {
    if (!table) return
    if (!name.trim()) {
      toast.error("Table name is required")
      return
    }

    try {
      await updateTable({
        ...table,
        name: name.trim(),
        seats,
        status,
      }).unwrap()
      toast.success(`Table "${name}" updated successfully`)
      onClose()
    } catch (error) {
      console.log(error)
      toast.error("Failed to update table")
    }
  }

  return (
    <Dialog open={show} onOpenChange={(open) => { if (!open) onClose() }}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Table</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Table Name</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} className="mt-2" />
          </div>

          <div>
            <label className="text-sm font-medium">Seats</label>
            <Input
              type="number"
              value={seats}
              onChange={(e) => setSeats(Number(e.target.value) || 1)}
              className="mt-2"
              min={1}
            />
          </div>

          <div>
            <label className="text-sm font-medium">Status</label>
            <Select value={status} onValueChange={(v) => setStatus(v as "Available" | "Occupied")}>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Available">Available</SelectItem>
                <SelectItem value="Occupied">Occupied</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button onClick={handleSave} disabled={isLoading || !name.trim()}>
              {isLoading ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
