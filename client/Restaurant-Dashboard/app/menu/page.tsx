"use client"

import { useState } from "react"
import { Search, Plus, SquareMenu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { NotificationPanel } from "@/components/notification-panel"
import { AddDishModal } from "@/components/modals/add-dish-modal"
import { menuItems } from "@/lib/mock-data"


export default function InventoryPage() {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false)
  const [isAddDishOpen, setIsAddDishOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<"menu" | "ingredients" | "request">("menu")
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | "available" | "not-available">("all")
  const [stockFilter, setStockFilter] = useState<"all" | "low" | "medium" | "high" | "empty">("all")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")

  const categories = ["all", "soup", "noodle", "rice", "dessert", "drink"]

  const filteredItems = menuItems.filter((item) => {
    const matchesSearch = searchQuery === "" || item.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "available" && item.stockStatus !== "out-of-stock") ||
      (statusFilter === "not-available" && item.stockStatus === "out-of-stock")
    const matchesStock =
      stockFilter === "all" ||
      (stockFilter === "low" && item.stockLevel === "low") ||
      (stockFilter === "medium" && item.stockLevel === "medium") ||
      (stockFilter === "high" && item.stockLevel === "high") ||
      (stockFilter === "empty" && item.stockStatus === "out-of-stock")
    const matchesCategory = categoryFilter === "all" || item.category.toLowerCase() === categoryFilter

    return matchesSearch && matchesStatus && matchesStock && matchesCategory
  })

  const statusCounts = {
    all: menuItems.length,
    available: menuItems.filter((i) => i.stockStatus !== "out-of-stock").length,
    "not-available": menuItems.filter((i) => i.stockStatus === "out-of-stock").length,
  }

  const stockCounts = {
    all: menuItems.length,
    low: menuItems.filter((i) => i.stockLevel === "low").length,
    medium: menuItems.filter((i) => i.stockLevel === "medium").length,
    high: menuItems.filter((i) => i.stockLevel === "high").length,
    empty: menuItems.filter((i) => i.stockStatus === "out-of-stock").length,
  }

  const categoryCounts = categories.reduce(
    (acc, cat) => {
      if (cat === "all") {
        acc[cat] = menuItems.length
      } else {
        acc[cat] = menuItems.filter((i) => i.category.toLowerCase() === cat).length
      }
      return acc
    },
    {} as Record<string, number>,
  )

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
                onClick={() => setStatusFilter("all")}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm ${statusFilter === "all" ? "bg-primary text-primary-foreground" : "hover:bg-accent"
                  }`}
              >
                <span>All</span>
                <Badge variant="secondary">{statusCounts.all}</Badge>
              </button>
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

          {/* Stock Level */}
          <div>
            <h4 className="text-sm font-medium mb-2">STOCK LEVEL</h4>
            <div className="space-y-1">
              {(["all", "low", "medium", "high", "empty"] as const).map((level) => (
                <button
                  key={level}
                  onClick={() => setStockFilter(level)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm capitalize ${stockFilter === level ? "bg-primary text-primary-foreground" : "hover:bg-accent"
                    }`}
                >
                  <span>{level}</span>
                  <Badge variant="secondary">{stockCounts[level]}</Badge>
                </button>
              ))}
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
              setStatusFilter("all")
              setStockFilter("all")
              setCategoryFilter("all")
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
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-2 mb-6">
            <button
              onClick={() => setActiveTab("menu")}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${activeTab === "menu" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-accent"
                }`}
            >
              Menu
            </button>
            <button
              onClick={() => setActiveTab("ingredients")}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${activeTab === "ingredients"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-accent"
                }`}
            >
              Ingredients
            </button>
            <button
              onClick={() => setActiveTab("request")}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${activeTab === "request" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-accent"
                }`}
            >
              Request List
            </button>
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
          </div>

          {/* Menu Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="bg-card rounded-lg overflow-hidden border hover:shadow-lg transition-shadow"
              >
                <div className="relative">
                  <img src={item.image || "/placeholder.svg"} alt={item.name} className="w-full h-48 object-cover" />
                  <Badge
                    className={`absolute top-3 left-3 ${item.stockStatus === "out-of-stock"
                      ? "bg-red-500 hover:bg-red-600"
                      : "bg-green-500 hover:bg-green-600"
                      }`}
                  >
                    <div className="h-2 w-2 rounded-full bg-white mr-1" />
                    {item.stockStatus === "out-of-stock" ? "Available" : "Available"}
                  </Badge>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold mb-1">{item.name}</h3>
                  <p className="text-sm text-muted-foreground capitalize mb-3">{item.category}</p>
                  <div className="flex items-center justify-between">
                    <div className="text-sm">
                      <span className="text-muted-foreground">Can be served: </span>
                      <span className="font-semibold">{item.availableServing || 30}</span>
                    </div>
                    <Badge
                      variant="secondary"
                      className={
                        item.stockLevel === "high"
                          ? "bg-green-100 text-green-700"
                          : item.stockLevel === "medium"
                            ? "bg-orange-100 text-orange-700"
                            : "bg-red-100 text-red-700"
                      }
                    >
                      {item.stockLevel === "high" ? "High" : item.stockLevel === "medium" ? "Medium" : "low"}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>

      {/* Modals */}
      <NotificationPanel isOpen={isNotificationOpen} onClose={() => setIsNotificationOpen(false)} />
      <AddDishModal isOpen={isAddDishOpen} onClose={() => setIsAddDishOpen(false)} />
    </div>
  )
}
