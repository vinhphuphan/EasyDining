"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, ShoppingCart, Trash2, Minus, Plus, MoreHorizontal } from "lucide-react"
import { menuItems } from "@/lib/mock-data"
import type { OrderFormData } from "@/components/modals/create-order-modal"
import { AddItemModal } from "@/components/modals/add-item-modal"

interface SelectMenuStepProps {
  formData: OrderFormData
  setFormData: (data: OrderFormData) => void
  onNext: () => void
}

export function SelectMenuStep({ formData, setFormData, onNext }: SelectMenuStepProps) {
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedItem, setSelectedItem] = useState<any>(null)

  const categories = ["All", ...Array.from(new Set(menuItems.map((item) => item.category)))]
  const categoryCounts = categories.reduce(
    (acc, cat) => {
      acc[cat] = cat === "All" ? menuItems.length : menuItems.filter((item) => item.category === cat).length
      return acc
    },
    {} as Record<string, number>,
  )

  const filteredItems = menuItems.filter((item) => {
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory
    const matchesSearch = searchQuery === "" || item.name.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const handleAddToCart = (item: any, quantity: number, addOns: any[], note: string) => {
    const existingItemIndex = formData.items.findIndex((i) => i.id === item.id)

    if (existingItemIndex >= 0) {
      const updatedItems = [...formData.items]
      updatedItems[existingItemIndex] = {
        ...updatedItems[existingItemIndex],
        quantity: updatedItems[existingItemIndex].quantity + quantity,
        addOns,
        note,
      }
      setFormData({ ...formData, items: updatedItems })
    } else {
      setFormData({
        ...formData,
        items: [
          ...formData.items,
          {
            id: item.id,
            name: item.name,
            price: item.price,
            quantity,
            image: item.image,
            addOns,
            note,
          },
        ],
      })
    }
    setSelectedItem(null)
  }

  const handleRemoveItem = (itemId: string) => {
    setFormData({
      ...formData,
      items: formData.items.filter((item) => item.id !== itemId),
    })
  }

  const handleUpdateQuantity = (itemId: string, delta: number) => {
    setFormData({
      ...formData,
      items: formData.items.map((item) =>
        item.id === itemId ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item,
      ),
    })
  }

  const subtotal = formData.items.reduce((sum, item) => {
    const addOnsTotal = item.addOns?.reduce((s, a) => s + a.price, 0) || 0
    return sum + (item.price + addOnsTotal) * item.quantity
  }, 0)
  const tax = subtotal * 0.12
  const total = subtotal + tax

  return (
    <div className="flex h-full">
      {/* Left Side - Menu List */}
      <div className="flex-1 p-6 border-r">
        <div className="flex items-center gap-3 mb-6">
          <ShoppingCart className="h-6 w-6" />
          <h2 className="text-2xl font-bold">Menu List</h2>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search Item Name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedCategory === category
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:text-foreground"
                }`}
            >
              {category} <Badge className="ml-2">{categoryCounts[category]}</Badge>
            </button>
          ))}
        </div>

        {/* Menu Items Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 pb-6">
          {filteredItems.map((item) => (
            <div key={item.id} className="bg-card rounded-xl border overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative aspect-video">
                <img src={item.image || "/placeholder.svg"} alt={item.name} className="w-full h-full object-cover" />
                <div className="absolute top-2 left-2 flex gap-2">
                  {item.stockStatus === "available" && (
                    <Badge className="bg-green-500 text-white">
                      <span className="w-2 h-2 rounded-full bg-white mr-1"></span>
                      Available
                    </Badge>
                  )}
                  {item.stockStatus === "not-available" && (
                    <Badge className="bg-red-500 text-white">
                      <span className="w-2 h-2 rounded-full bg-white mr-1"></span>
                      Not Available
                    </Badge>
                  )}
                </div>
                <button className="absolute top-2 right-2 p-2 bg-white rounded-lg hover:bg-gray-100">
                  <MoreHorizontal className="h-4 w-4" />
                </button>
              </div>
              <div className="p-4">
                <h3 className="font-semibold mb-1 truncate">{item.name}</h3>
                <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{item.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-primary">${item.price.toFixed(2)}</span>
                  <Button size="sm" onClick={() => setSelectedItem(item)} disabled={item.stockStatus !== "available"}>
                    Add to Cart
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Side - Order Details */}
      <div className="w-96 p-6 flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <ShoppingCart className="h-6 w-6" />
            <h2 className="text-2xl font-bold">Order Details</h2>
          </div>
          <button
            onClick={() => setFormData({ ...formData, items: [] })}
            className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Reset Order
          </button>
        </div>

        {formData.items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <ShoppingCart className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="font-medium mb-1">No order found</p>
            <p className="text-sm text-muted-foreground">
              Select menu from menu list on left side and <span className="font-medium">Add to Cart</span>
            </p>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto space-y-4 mb-6">
              {formData.items.map((item) => (
                <div key={item.id} className="flex gap-3 p-3 rounded-lg border">
                  <img
                    src={item.image || "/placeholder.svg"}
                    alt={item.name}
                    className="w-20 h-20 rounded-lg object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-1">
                      <h3 className="font-semibold text-sm truncate">{item.name}</h3>
                      <button onClick={() => handleRemoveItem(item.id)} className="text-red-500 hover:text-red-600">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    {item.note && <p className="text-xs text-muted-foreground mb-1">Note: {item.note}</p>}
                    {item.addOns && item.addOns.length > 0 && (
                      <p className="text-xs text-muted-foreground mb-2">
                        Addition: {item.addOns.map((a) => a.name).join(", ")}
                      </p>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-primary">${item.price.toFixed(2)}</span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleUpdateQuantity(item.id, -1)}
                          className="p-1 rounded border hover:bg-accent"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-8 text-center font-medium">x{item.quantity}</span>
                        <button
                          onClick={() => handleUpdateQuantity(item.id, 1)}
                          className="p-1 rounded border hover:bg-accent"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-3 pt-4 border-t">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Sub Total</span>
                <span className="font-medium">US${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tax 12%</span>
                <span className="font-medium">US${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold pt-2 border-t">
                <span>Total Payment</span>
                <span>US${total.toFixed(2)}</span>
              </div>
            </div>

            <Button size="lg" className="w-full mt-6" onClick={onNext}>
              Continue
            </Button>
          </>
        )}
      </div>

      {/* Add Item Modal */}
      {selectedItem && (
        <AddItemModal item={selectedItem} onClose={() => setSelectedItem(null)} onAdd={handleAddToCart} />
      )}
    </div>
  )
}
