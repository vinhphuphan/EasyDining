"use client"

// ============================================
// HEADER COMPONENT
// ============================================
// Top navigation bar with logo, hours, and cart button

import { Cloud, ShoppingCart, Utensils } from "lucide-react"
import { useCart } from "@/contexts/CartContext"
import { Badge } from "@/components/ui/badge"
import { useNavigate } from "react-router-dom"

interface HeaderProps {
  onCartClick?: () => void
}

export const Header = ({ onCartClick }: HeaderProps) => {
  const { getTotalItems } = useCart()
  const navigate = useNavigate()
  const totalItems = getTotalItems()

  return (
    <header className="sticky top-0 z-50 bg-black text-white border-b border-gray-800">
      <div className="container mx-auto px-4 py-4">
        {/* Top row: Logo centered, cart on right */}
        <div className="grid grid-cols-3 items-center">
          {/* Empty left column for centering */}
          <div />

          {/* Center: Logo and restaurant info */}
          <div className="flex flex-col items-center cursor-pointer" onClick={() => navigate("/")}>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center">
                <Cloud className="h-5 w-5 text-primary" />
              </div>
              <h1 className="text-xl font-bold">EASYDINING</h1>
            </div>
            <p className="text-xs text-gray-400">Restaurant</p>
          </div>

          {/* Right: Cart button */}
          <div className="flex justify-end">
            <button
              onClick={() => onCartClick?.()}
              className="relative p-3 hover:bg-gray-800 rounded-lg transition-colors cursor-pointer"
              aria-label="Shopping cart"
            >
              <ShoppingCart className="w-6 h-6" />
              {totalItems > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-primary text-white border-0">
                  {totalItems}
                </Badge>
              )}
            </button>
          </div>
        </div>

        {/* Operating hours */}
        <div className="mt-3 flex items-center justify-center gap-2 text-sm">
          <span className="text-primary font-semibold">Open later</span>
          <span className="text-gray-400">| AM 11:00~PM 10:00</span>
        </div>

        {/* Table badge */}
        <div className="mt-3 flex justify-center">
          <Badge className="bg-primary text-white border-0 px-4 py-1">Table. 1</Badge>
        </div>

        {/* Announcement banner */}
        <div className="mt-4 p-3 bg-gray-800 rounded-lg text-sm text-gray-300">
          <p className="text-center">
            🎉 Self-serve Side bar OPEN 🎉 Kimchi, Kelp noodle, Soy bean paste sauce(Ssamjang), Fresh chili & garlic,
            and Fresh Korean lettuce are available for free refills at the bar on the right.
          </p>
        </div>
      </div>
    </header>
  )
}
