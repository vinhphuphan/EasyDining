"use client"

// ============================================
// CATEGORY NAVIGATION
// ============================================
// Horizontal scrollable category tabs with auto-scroll on click

import { useRef, useEffect } from "react"
import { menuCategories } from "@/data/menuData"

interface CategoryNavProps {
  activeCategory: string
  onCategoryChange: (category: string) => void
}

export const CategoryNav = ({ activeCategory, onCategoryChange }: CategoryNavProps) => {
  const scrollRef = useRef<HTMLDivElement>(null)
  const buttonRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({})

  /**
   * Auto-scroll the active category button into view
   */
  useEffect(() => {
    const activeButton = buttonRefs.current[activeCategory]
    if (activeButton && scrollRef.current) {
      const container = scrollRef.current
      const button = activeButton

      // Calculate scroll position to center the active button
      const containerWidth = container.offsetWidth
      const buttonLeft = button.offsetLeft
      const buttonWidth = button.offsetWidth
      const scrollLeft = buttonLeft - containerWidth / 2 + buttonWidth / 2

      container.scrollTo({ left: scrollLeft, behavior: "smooth" })
    }
  }, [activeCategory])

  return (
    <nav className="sticky top-[200px] z-40 bg-background border-b border-border">
      <div ref={scrollRef} className="container mx-auto px-4 overflow-x-auto scrollbar-hide">
        <div className="flex gap-6 py-4 min-w-max">
          {menuCategories.map((category) => (
            <button
              key={category}
              ref={(el) => (buttonRefs.current[category] = el)}
              onClick={() => onCategoryChange(category)}
              className={`text-sm font-medium whitespace-nowrap transition-colors pb-2 border-b-2 ${
                activeCategory === category
                  ? "text-foreground border-orange-500"
                  : "text-muted-foreground border-transparent hover:text-foreground"
              }`}
              aria-current={activeCategory === category ? "page" : undefined}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
    </nav>
  )
}
