// Individual menu item display in the list
"use client"
import { Card } from "@/components/ui/card"
import type { MenuItem } from "@/data/menuData"
import { Flame } from "lucide-react"

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
        <div className="flex items-center gap-2 mb-1">
          <h3 className="font-semibold text-lg">
            {item.name} {item.nameKo && <span className="text-muted-foreground text-sm font-normal">{item.nameKo}</span>}
          </h3>
          {/* Badges */}
          {item.isBest && (
            <span className="inline-flex items-center justify-center px-1.5 h-5 rounded bg-primary text-white text-[10px] leading-none">
              BEST
            </span>
          )}
          {item.isVeg && (
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-green-600 text-white text-[8px] leading-none">
              VEG
            </span>
          )}
          {item.isSpicy && (
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-red-600">
              <Flame className="w-3 h-3 text-white" />
            </span>
          )}
        </div>
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
