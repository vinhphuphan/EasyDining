"use client"

// ============================================
// MENU ITEM CARD
// ============================================
// Individual menu item display in the list

import { Card } from "@/components/ui/card"
import type { MenuItem } from "@/data/menuData"

interface MenuItemCardProps {
  item: MenuItem
  onClick: () => void
}

export const MenuItemCard = ({ item, onClick }: MenuItemCardProps) => {
  return (
    <Card
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => e.key === "Enter" && onClick()}
      className="flex flex-row items-center justify-between p-4 pl-0 cursor-pointer transition-colors border-none shadow-none hover:bg-accent/50"
    >
      {/* Item details */}
      <div className="flex-1">
        <h3 className="font-semibold text-lg mb-1">
          {item.name} {item.nameKo && <span className="text-muted-foreground text-sm font-normal">{item.nameKo}</span>}
        </h3>
        {item.description && <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{item.description}</p>}
        <p className="text-medium  font-semibold text-black">${item.price ? item.price.toFixed(2) : "--"}</p>
      </div>

      {/* Item image */}
      <div className="w-20 aspect-square bg-muted rounded-lg flex-shrink-0 ml-4 overflow-hidden">
        <img
          src={item.image || "/placeholder.svg"}
          alt={item.name}
          loading="lazy"
          className="w-full h-full object-cover"
        />
      </div>
    </Card>
  )
}
