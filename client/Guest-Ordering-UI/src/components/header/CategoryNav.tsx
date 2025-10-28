"use client"
import { useRef, useEffect } from "react"


interface CategoryNavProps {
  activeCategory: string
  onCategoryChange: (category: string) => void
  categories: string[]
}

export const CategoryNav = ({ activeCategory, onCategoryChange, categories }: CategoryNavProps) => {
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
    <nav className="sticky top-20 z-40 bg-background border-b border-border">
      <div ref={scrollRef} className="w-full px-4 overflow-x-auto scrollbar-hide">
        <div className="flex gap-5 py-3 min-w-max">
          {categories.map((category) => (
            <button
              key={category}
              ref={(el) => {
                buttonRefs.current[category] = el
              }}
              onClick={() => onCategoryChange(category)}
              className={`text-medium font-medium whitespace-nowrap transition-colors pb-2 border-b-2 ${activeCategory === category
                ? "text-foreground border-black"
                : "text-muted-foreground border-transparent hover:text-foreground"
                } cursor-pointer`}
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
