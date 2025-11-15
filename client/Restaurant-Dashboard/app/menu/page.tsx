"use client"

import { useState } from "react"
import { Search, Plus, SquareMenu, Loader2, AlertCircle, Pencil, Trash, RefreshCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { NotificationPanel } from "@/components/notification-panel"
import { AddDishModal } from "@/components/modals/add-dish-modal"
import DeleteConfirmModal from "@/components/modals/delete-confirm-modal"
import { useMenu, useCategories } from "@/hooks/useMenu"
import { useUpdateMenuItemMutation, useDeleteMenuItemMutation } from "@/store/api/menuApi"
import type { MenuItem } from "@/types/menuItem"
import { Spinner } from "@/components/ui/spinner"
import { EditDishModal } from "@/components/modals/edit-dish-modal"
import { toast } from "sonner"

export default function InventoryPage() {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false)
  const [isAddDishOpen, setIsAddDishOpen] = useState(false)
  const [isEditDishOpen, setIsEditDishOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<"available" | "not-available">("available")
  const [categoryFilter, setCategoryFilter] = useState<string>("")
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [deleteMenuItemId, setDeleteMenuItemId] = useState<number | null>(null)
  const [editMenuItem, setEditMenuItem] = useState<MenuItem | null>(null)

  // Sử dụng custom hooks từ useMenu.ts
  const { menuItems, isLoading: menuLoading, error: menuError, refetch } = useMenu()
  const { categories: apiCategories, isLoading: categoriesLoading, error: categoriesError } = useCategories()

  // API mutations
  const [updateMenuItem, { isLoading: isUpdating }] = useUpdateMenuItemMutation()
  const [deleteMenuItem, { isLoading: isDeleting }] = useDeleteMenuItemMutation()

  // Sử dụng categories từ API (không thêm "all")
  const categories = apiCategories

  // Filter menu items based on search and filters
  const filteredItems = menuItems.filter((item: MenuItem) => {
    const matchesSearch = searchQuery === "" || item.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "available" ? item.isAvailable : !item.isAvailable
    const matchesCategory = categoryFilter === "" || (item.category && item.category.toLowerCase() === categoryFilter.toLowerCase())

    return matchesSearch && matchesStatus && matchesCategory
  })

  // Calculate counts for status filter
  const statusCounts = {
    available: menuItems.filter((item: MenuItem) => item.isAvailable).length,
    "not-available": menuItems.filter((item: MenuItem) => !item.isAvailable).length,
  }

  // Calculate counts for category filter
  const categoryCounts = categories.reduce(
    (acc, cat) => {
      acc[cat] = menuItems.filter((item: MenuItem) =>
        item.category && item.category.toLowerCase() === cat.toLowerCase()
      ).length
      return acc
    },
    {} as Record<string, number>,
  )

  // Handle edit menu item
  const handleEditMenuItem = (item: MenuItem) => {
    setEditMenuItem(item)
    setIsEditDishOpen(true)
  }

  // Handle delete request
  const handleDeleteRequest = (id: number) => {
    setDeleteMenuItemId(id)
    setIsDeleteOpen(true)
  }

  // Handle confirm delete
  const handleConfirmDelete = async () => {
    if (!deleteMenuItemId) return

    try {
      await deleteMenuItem(deleteMenuItemId).unwrap()
      toast.success(`Deleted item #${deleteMenuItemId} successfully`);
      // Refetch data after successful delete
      refetch()
    } catch (error) {
      console.error('Failed to delete menu item:', error)
      // You can add toast notification here
    } finally {
      setDeleteMenuItemId(null)
      setIsDeleteOpen(false)
    }
  }

  // Handle toggle availability (quick edit)
  const handleToggleAvailability = async (item: MenuItem) => {
    try {
      await updateMenuItem({
        id: item.id,
        updates: { isAvailable: !item.isAvailable }
      }).unwrap()
      // Refetch data after successful update
      refetch()
    } catch (error) {
      console.error('Failed to update menu item:', error)
      // You can add toast notification here
    }
  }

  // Loading state
  if (menuLoading || categoriesLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center h-64">
          <Button disabled size="lg">
            <Spinner />
            Loading...
          </Button>
        </div>
      </div>
    )
  }

  // Error state
  if (menuError || categoriesError) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-center">
          <AlertCircle className="h-8 w-8 text-red-500" />
          <div>
            <h2 className="text-lg font-semibold text-red-600">Error Loading Menu</h2>
            <p className="text-muted-foreground">
              {menuError ? `Menu Error: ${menuError.toString()}` : ""}
              {categoriesError ? `Categories Error: ${categoriesError.toString()}` : ""}
            </p>
          </div>
          <Button onClick={() => refetch()} variant="outline">
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        {/* Sidebar Filters */}
        <aside className="w-64 border-r bg-card p-6 space-y-6">
          <div>
            <h3 className="font-semibold mb-3">Filter</h3>
          </div>

          {/* Dishes Status */}
          <div>
            <h4 className="text-sm font-medium mb-2">DISHES STATUS</h4>
            <div className="space-y-1">
              <button
                onClick={() => setStatusFilter("available")}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm ${statusFilter === "available" ? "bg-primary text-primary-foreground" : "hover:bg-accent"
                  }`}
              >
                <span>Available</span>
                <Badge variant="secondary">{statusCounts.available}</Badge>
              </button>
              <button
                onClick={() => setStatusFilter("not-available")}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm ${statusFilter === "not-available" ? "bg-primary text-primary-foreground" : "hover:bg-accent"
                  }`}
              >
                <span>Not Available</span>
                <Badge variant="secondary">{statusCounts["not-available"]}</Badge>
              </button>
            </div>
          </div>

          {/* Category */}
          <div>
            <h4 className="text-sm font-medium mb-2">CATEGORY</h4>
            <div className="space-y-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm capitalize ${categoryFilter === cat ? "bg-primary text-primary-foreground" : "hover:bg-accent"
                    }`}
                >
                  <span>{cat}</span>
                  <Badge variant="secondary">{categoryCounts[cat]}</Badge>
                </button>
              ))}
            </div>
          </div>

          <Button
            variant="outline"
            className="w-full bg-transparent"
            onClick={() => {
              setStatusFilter("available")
              setCategoryFilter("")
              setSearchQuery("")
            }}
          >
            <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Reset Filter
          </Button>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {/* Page Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <SquareMenu className="h-6 w-6" />
              <h1 className="text-2xl font-semibold">Menu</h1>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-green-600">
                {menuItems.length} Items
              </Badge>
              <Button
                size="sm"
                onClick={() => refetch()}
                disabled={menuLoading}
              >
                {menuLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <div className="flex items-center justify-center">
                    <RefreshCcw className="h-5 w-5 mr-2" />
                    Refresh
                  </div>
                )}
              </Button>
            </div>
          </div>

          {/* Search and Add */}
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search Dish Name Here"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button size="lg" onClick={() => setIsAddDishOpen(true)}>
              <Plus className="h-5 w-5 mr-2" />
              Add New Dish
            </Button>
          </div>

          {/* Menu List Header */}
          <div className="mb-4">
            <h2 className="text-lg font-semibold">Menu List</h2>
            <p className="text-sm text-muted-foreground">
              Showing {filteredItems.length} of {menuItems.length} items
            </p>
          </div>

          {/* Menu Grid */}
          {filteredItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <SquareMenu className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No menu items found</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery || statusFilter !== "available" || categoryFilter !== ""
                  ? "Try adjusting your filters or search terms."
                  : "No menu items available. Add some dishes to get started."}
              </p>
              {(!searchQuery && statusFilter === "available" && categoryFilter === "") && (
                <Button onClick={() => setIsAddDishOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Dish
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item: MenuItem) => (
                <div
                  key={item.id}
                  className="group bg-card rounded-lg overflow-hidden border hover:shadow-lg transition-shadow cursor-pointer"
                >
                  <div className="relative">
                    <img
                      src={item.imageUrl || "/placeholder.svg"}
                      alt={item.name}
                      className="w-full h-48 object-cover"
                    />

                    {/* Edit / Delete controls - tương tự table page */}
                    <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditMenuItem(item)
                        }}
                        className="p-1 rounded bg-white hover:opacity-80 transition cursor-pointer"
                        disabled={isUpdating}
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteRequest(item.id)
                        }}
                        className="p-1 rounded bg-red-600 hover:bg-red-700 text-white cursor-pointer"
                        disabled={isDeleting}
                      >
                        <Trash className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Availability Badge */}
                    <Badge
                      className={`absolute top-3 left-3 cursor-pointer ${item.isAvailable
                        ? "bg-green-500 hover:bg-green-600"
                        : "bg-red-500 hover:bg-red-600"
                        }`}
                      onClick={(e) => {
                        e.stopPropagation()
                        handleToggleAvailability(item)
                      }}
                    >
                      <div className="h-2 w-2 rounded-full bg-white mr-1" />
                      {item.isAvailable ? "Available" : "Not Available"}
                    </Badge>

                    {/* Special badges */}
                    <div className="absolute bottom-3 left-3 flex flex-col gap-1">
                      {item.isBest && (
                        <Badge variant="secondary" className="bg-yellow-100 text-yellow-700 text-xs">
                          Best
                        </Badge>
                      )}
                      {item.isVeg && (
                        <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">
                          Veg
                        </Badge>
                      )}
                      {item.isSpicy && (
                        <Badge variant="secondary" className="bg-red-100 text-red-700 text-xs">
                          Spicy
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold mb-1">{item.name}</h3>
                    <p className="text-sm text-muted-foreground capitalize mb-2">
                      {item.category || "Uncategorized"}
                    </p>
                    {item.description && (
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {item.description}
                      </p>
                    )}
                    <div className="flex items-center justify-between">
                      <div className="text-lg font-semibold text-green-600">
                        ${item.price}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        ID: {item.id}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Modals */}
      <NotificationPanel isOpen={isNotificationOpen} onClose={() => setIsNotificationOpen(false)} />
      <AddDishModal
        isOpen={isAddDishOpen}
        onClose={() => {
          setIsAddDishOpen(false)
          setEditMenuItem(null)
        }}

      />

      <EditDishModal
        isOpen={isEditDishOpen}
        dishId={editMenuItem?.id ?? null}
        onClose={() => {
          setIsEditDishOpen(false)
          setEditMenuItem(null)
        }}
        onUpdated={() => refetch()}
      />

      <DeleteConfirmModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Menu Item"
        description="Are you sure you want to delete this menu item? This action cannot be undone."

      />
    </div>
  )
}